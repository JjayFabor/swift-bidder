# PLAN — Deploy Swift Bidder to Render (free tier)

## Goal

Get the Laravel 12 + Inertia/React auction app running publicly on Render, on the
free tier, with a managed database and durable file uploads.

Target: a working portfolio demo where register → OTP → login → create auction
(with images) → bid → auction transitions all work end to end.

---

## Constraints (verified against Render docs, July 2026)

- **No managed MySQL.** Render offers Postgres and Key Value (Redis-compatible) only.
- **No native PHP runtime.** Laravel must be deployed as a Docker image.
- **Free web service** spins down after 15 min idle (~50s cold start); 750 instance-hours/month.
- **Free Postgres is deleted 30 days after creation** (+14-day grace to upgrade); 1 GB cap.
- **No background workers or cron jobs on the free tier.**
- **Filesystem is ephemeral** — anything written to disk is lost on every deploy/restart.

---

## Decisions

### D1 — Migrate MySQL → Postgres

**Why:** Render has no managed MySQL. The MySQL-specific surface in this codebase is
tiny (exactly one raw query), so porting is cheaper than the alternative.
**Rejected:** external managed MySQL (PlanetScale/Aiven/Railway) — adds a second
vendor and bill, and puts a network hop between the app and its database on every request.

### D2 — Cloudflare R2 for uploads

**Why:** Render's filesystem is ephemeral, so `storage/app/public` loses every auction
image on each deploy. (Video upload was removed upstream in `13de467`, so images are the
only uploaded media.) `config/filesystems.php` already has an `s3` disk with
`AWS_ENDPOINT`/`AWS_URL` support, so R2 needs env vars + one composer package, no config change.
R2 has a free tier and zero egress fees.
**Rejected:** Render persistent disk — paid-only, blocks zero-downtime deploys, blocks
scaling past one instance, single point of failure.

### D3 — `QUEUE_CONNECTION=sync`, and mail cannot use SMTP at all

**Why:** `SendTokenMail implements ShouldQueue`, so with the `database` queue driver and
no worker, OTP emails queue forever. Free tier has no background workers, so `sync`
sends inline instead.

**Correction (found later, and it matters more):** `sync` fixes the *queue* but not the
*transport*. Render's free tier states: *"Free web services can't send outbound network
traffic on ports 25, 465, or 587, commonly used for SMTP."* The app is configured for
Gmail SMTP on 587, so **no email can leave a free instance at all** — meaning nobody can
complete registration, because `EnsureEmailIsVerified` blocks unverified users forever.

Consequence: `MAIL_MAILER=log` in production (messages land in the service logs rather
than pretending to send), and the demo accounts are seeded **pre-verified** so they never
need email. See D6.

**Rejected:** paid background worker (~$7/mo) — out of scope for free tier.
**Deferred:** an HTTPS-based mail provider (Resend/Postmark/Mailgun) would restore real
registration, since port 443 is not blocked. Worth doing if self-signup ever matters.

### D4 — Auction status is derived, not scheduled — *superseded upstream*

**Original plan:** run the idempotent `app:update-auction-status` command from request
middleware, throttled to once a minute, because the free tier has no cron.

**Superseded:** upstream commit `1cf7c9a` solved this better before this work merged. It
deleted the command and the schedule outright and added an `effective_status` accessor on
`Auction` that computes state from `start_time`/`end_time` on read, plus
`accepting()`/`upcoming()`/`finished()` query scopes. That needs no cron *and* no writes,
where the middleware still issued `UPDATE`s. The middleware and command were therefore
dropped rather than merged.

**Consequence:** nothing to configure on the host for status transitions — they are correct
by construction. Demo seed data still uses timestamps consistent with its statuses (D7).

### D5 — Fresh database, seed once

**Why:** local data is only 2 test users + 1 test auction. Nothing to preserve.
Note: the free DB dies every 30 days, so seeding must be repeatable — see Step 4.

### D6 — Pre-verified demo accounts instead of self-signup

**Why:** SMTP is blocked (D3), so nobody can complete OTP verification on a free instance.
Seeded accounts carry `email_verified_at`, so they bypass verification entirely. Four
bidders exist rather than one so multiple testers can bid against each other instead of
fighting over a single session. `config/demo.php` is the single source of truth — the
seeder creates exactly those accounts and the login screen lists exactly those accounts.
**Rejected:** one shared bidder — concurrent testers would collide.
**Rejected:** leaving credentials only in the README — a reviewer handed a bare URL has no
way in. `APP_DEMO=true` surfaces them on the login screen with click-to-fill.

### D7 — Demo auction statuses must agree with their timestamps

**Why:** `effective_status` is computed from `start_time`/`end_time` on every read, so the
stored `status` column is not what the UI displays. The old `AuctionFactory` picked `status`
at random, independent of those timestamps, so seeded rows rendered with a status unrelated
to the one seeded. `AuctionSeeder` now defines explicit auctions whose timestamps agree with
their status, giving a stable 2 active / 2 pending / 1 closed spread.

---

## Steps

> These record the plan as originally written. Steps 2 and 12 were later
> superseded by upstream work — see **Status** at the end of this document for what
> was actually applied versus dropped.

### Phase 0 — Security prep

1. Delete `.env.bak-claude` (contains real Pusher secret + Gmail app password) and widen
   `.gitignore` from `.env` to `.env*` so backups can't be committed. *(Never committed —
   verified gitignored — so no credential rotation needed.)*

### Phase 1 — Postgres compatibility

2. Fix `app/Services/AuctionService.php:25-30`. `SUM(status = 'active')` is **fatal on
   Postgres**: MySQL coerces the comparison to 1/0, Postgres returns boolean and
   `SUM(boolean)` is a type error. Replace with `COUNT(*) FILTER (WHERE ...)` or the
   portable `SUM(CASE WHEN ... THEN 1 ELSE 0 END)`.
3. Confirm `enum('status', ...)` in the auctions migration maps to a Postgres CHECK
   constraint (it does) — no change needed, but note that adding statuses later needs a migration.
4. Make `DatabaseSeeder` idempotent (`updateOrCreate` keyed on email). Currently
   `User::factory()->create(['email' => ...])` throws a unique violation on re-run, which
   matters because the free DB must be recreated monthly.
5. **Verify locally against real Postgres** (throwaway container) — `migrate --seed`, then
   exercise the admin dashboard (hits the fixed raw query) and auction pages. Do not assume.

### Phase 2 — R2 storage

6. `composer require league/flysystem-aws-s3-v3`.
7. Create the R2 bucket, enable public access, collect endpoint + access keys.
8. Set `FILESYSTEM_DISK=s3` plus `AWS_*` env vars (`AWS_ENDPOINT`, `AWS_URL`,
   `AWS_USE_PATH_STYLE_ENDPOINT=false`). No `config/filesystems.php` change required.
9. Replace the two hardcoded storage URL sites:

   - `app/Http/Controllers/AuctionController.php:69,76` — `asset('storage/'.$path)` → `Storage::url($path)`
   - `resources/js/components/user/dashboard/AuctionCard.jsx:73` — hardcoded
     `` `/storage/${image_path}` `` → use a URL supplied by the backend
   Cleanest: add a `url` accessor on `AuctionImage` and expose it, so no frontend path-building.
10. `storage:link` is no longer needed once uploads live in R2.

### Phase 3 — Free-tier adaptations

11. Set `QUEUE_CONNECTION=sync` (D3).
12. Replace the `withSchedule` cron with throttled lazy execution (D4) — run the status
    update at most once per ~60s via a cache lock, in middleware.
13. Add `$middleware->trustProxies(at: '*');` in `bootstrap/app.php`. Render terminates TLS
    upstream; without this Laravel emits `http://` asset and Ziggy URLs and browsers block them
    as mixed content.
14. Set `APP_URL` to the public `https://…onrender.com` URL so Ziggy and assets resolve.

### Phase 4 — Containerize

15. Write a multi-stage `Dockerfile`:

    - stage 1 `node:22` → `npm ci && npm run build`
    - stage 2 PHP 8.3 + nginx + php-fpm → `composer install --no-dev --optimize-autoloader`,
      copy built assets from stage 1

    - required extensions: `pdo_pgsql`, `mbstring`, `gd`, `zip`, `bcmath`, `exif`
16. Add `.dockerignore` (exclude `node_modules`, `vendor`, `.env*`, `vscode.deb`, `AppScreenshots`).
17. Start script: `php artisan migrate --force`, then `config:cache route:cache view:cache`.
    Do **not** run `--seed` on every deploy (see Step 4).
18. Health check path → `/up` (already registered in `bootstrap/app.php`).

### Phase 5 — Render setup

19. Create free Postgres instance; note its internal connection URL.
20. Create Web Service → runtime **Docker**, connect the GitHub repo.
21. Set env vars: `APP_KEY` (`php artisan key:generate --show`), `APP_ENV=production`,
    `APP_DEBUG=false`, `DB_CONNECTION=pgsql`, `DB_URL` (Laravel 12's `config/database.php`
    already reads `DB_URL`), `SESSION_DRIVER=database`, `CACHE_STORE=database`,
    `QUEUE_CONNECTION=sync`, all `AWS_*`, `PUSHER_*` + `VITE_PUSHER_*`, `MAIL_*`.
    ⚠️ `VITE_*` vars are baked in at build time — they must be present for the Docker build,
    not just at runtime.
22. Optionally commit a `render.yaml` blueprint so the whole stack is reproducible.
23. First deploy → run the seeder once via Render shell.

### Phase 6 — Verify live

24. Smoke test against the deployed URL, not locally: register → OTP email arrives → login →
    admin creates auction with image upload (confirm the image loads from R2) → bidder places
    bid → auction transitions pending→active. Confirm light/dark theming still renders
    (assets built in Docker, not dev server).

---

## Known caveats accepted (free tier)

- **Database is deleted 30 days after creation.** Recreate + re-run migrate/seed monthly,
  or upgrade to Basic (~$7/mo) for permanence. Step 4 makes this a one-command recovery.

- **~50s cold start** after 15 minutes of inactivity.
- **OTP email is sent inline**, so registration requests will feel slow (Gmail SMTP round trip).
- Auction status is refreshed on request rather than every minute — invisible to users,
  since nothing observes it while the app is idle.

---

## Status

**Rebased onto upstream `origin/main` (2a55e2a).** The remote history was rewritten and had
moved ahead by six feature commits — real-time bid broadcasting, bid history and current
winner, bid lifecycle rules, an admin edit flow, the derived-status refactor, and removal of
the video feature. This deployment work was re-applied on top of that rather than merged, so
none of those commits were disturbed.

**Dropped as obsolete** (upstream already solves them, better):

- `RefreshAuctionStatuses` middleware, `AuctionService::refreshStatuses()` and the
  `app:update-auction-status` command — replaced by the `effective_status` accessor.
- The `SUM(status = '...')` Postgres fix — upstream rewrote those counts as query scopes,
  so the fatal boolean-arithmetic is already gone.
- The `video_url` accessor and video upload handling — feature removed upstream.
- `BROADCAST_CONNECTION=null` in the blueprint — broadcasting is live now, so Pusher
  credentials are required again.

**Applied and verified**

- UI light/dark theming across the app, including the new Recent Bids section.
- Docker image (multi-stage, 243 MB, PHP 8.3), `render.yaml`, entrypoint, `.dockerignore`.
- Cloudflare R2 wiring via the `url` accessor on `AuctionImage`; uploads follow
  `FILESYSTEM_DISK` rather than the hardcoded `public` disk.
- Demo mode: `config/demo.php`, idempotent seeders, `demo:reset`, login credential panel.
- Bug fixes: pagination `Inertia.visit` crash, the `admin.auctions` route that returned 500,
  the missing `default-image` placeholder, the Vite CSS input that broke production builds,
  `trustProxies`, and the `echo.js` blank-page failure when Pusher keys are absent.

**Verified live, on the merged tree**

- Fresh Postgres 17 in the container: all migrations applied (including
  `drop_video_path_from_auctions`), 5 accounts and 5 auctions seeded, `video_path` confirmed
  gone from the schema.
- Demo login click-to-fill authenticates; admin routes to `/admin`, bidder to `/`.
- Contrast sweep across all five pages: 0 low-contrast nodes in both light and dark.
- All 23 route actions resolve; `route:cache` succeeds.

**Remaining — needs your accounts**

1. Cloudflare R2 bucket + credentials. The R2 upload path is the one thing not verified end
   to end; the local `public` disk was used to prove the code path.
2. Push, create the Render Blueprint, fill the `sync: false` values — now including the
   Pusher credentials, since real-time is live.
3. First deploy with `RUN_SEEDERS=true`, then set it back to `false`.
4. Set `APP_URL` to the real URL (and again when the custom domain verifies), then redeploy.

**Recommended before going public**

- `composer update` — advisories affect production packages (guzzle, laravel/framework,
  symfony). All available updates sit inside the existing semver constraints.
- `react-day-picker@8` conflicts with `date-fns@4`; the Docker build uses `--legacy-peer-deps`
  to reproduce the committed lock file. Upgrading to v9 is the real fix but changes the API
  used by `components/ui/calendar.jsx`.
