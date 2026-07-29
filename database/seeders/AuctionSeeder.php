<?php

namespace Database\Seeders;

use App\Models\Auction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuctionSeeder extends Seeder
{
    /**
     * Seed a realistic spread of auctions, each with several photographs.
     *
     * Two things here are deliberate rather than cosmetic:
     *
     * 1. Every status agrees with its own start/end times. `Auction::effective_status`
     *    is derived from the clock on read, so a lot seeded "active" with an end_time
     *    in the past would display as "closed" and the seeded spread would collapse.
     *
     * 2. Images are copied onto the configured filesystem disk rather than referenced
     *    from the repo, so they land wherever real uploads go — the local `public`
     *    disk in development, object storage in production.
     *
     * Lots are keyed on title, so re-running tops the set back up instead of
     * duplicating it. Source photographs live in database/seeders/assets/auctions
     * and come from the Met Museum Open Access collection (public domain) — see
     * CREDITS.txt in that directory.
     */
    public function run(): void
    {
        $now = now();

        $lots = [
            [
                'assets' => 'astronomical-watch',
                'title' => 'Gilt Clock Watch with Astronomical Dial',
                'description' => 'Early 17th-century gilt-brass clock watch with pierced case, astronomical dial and integral sundial. Movement overhauled; running at time of cataloguing.',
                'starting_price' => 12500.00,
                'current_price' => 14750.00,
                'start_time' => $now->copy()->subDays(2),
                'end_time' => $now->copy()->addDays(3),
                'status' => 'active',
            ],
            [
                'assets' => 'italian-viola',
                'title' => 'Italian Viola, circa 1660',
                'description' => 'Two-piece back of quartered maple, medium curl. Varnish original over most of the body. Accompanied by a certificate of authenticity and a fitted case.',
                'starting_price' => 8500.00,
                'current_price' => 11200.00,
                'start_time' => $now->copy()->subHours(6),
                'end_time' => $now->copy()->addDays(1),
                'status' => 'active',
            ],
            [
                'assets' => 'coin-cabinet',
                'title' => 'Empire Mahogany Coin Cabinet',
                'description' => 'Mahogany collector\'s cabinet with mother-of-pearl inlay and twelve graduated drawers, retaining original brass fittings and lock. Restored, structurally sound.',
                'starting_price' => 6400.00,
                'current_price' => 6400.00,
                'start_time' => $now->copy()->addDays(1),
                'end_time' => $now->copy()->addDays(6),
                'status' => 'pending',
            ],
            [
                'assets' => 'mythological-vessel',
                'title' => 'Painted Vessel with Mythological Scene',
                'description' => 'Ceramic cylinder vessel with polychrome slip decoration depicting a court scene, with glyphic band at the rim. Minor stabilised rim losses.',
                'starting_price' => 15000.00,
                'current_price' => 15000.00,
                'start_time' => $now->copy()->addDays(3),
                'end_time' => $now->copy()->addDays(10),
                'status' => 'pending',
            ],
            [
                'assets' => 'flemish-triptych',
                'title' => 'Flemish Triptych, The Penitence of Saint Jerome',
                'description' => 'Oil on oak panel, hinged triptych with painted exterior wings. Cradled and conserved; craquelure consistent with age. Provenance available on request.',
                'starting_price' => 48000.00,
                'current_price' => 62500.00,
                'start_time' => $now->copy()->subDays(14),
                'end_time' => $now->copy()->subDays(2),
                'status' => 'closed',
            ],
        ];

        foreach ($lots as $lot) {
            $assets = $lot['assets'];
            unset($lot['assets']);

            $auction = Auction::updateOrCreate(['title' => $lot['title']], $lot);

            $this->attachImages($auction, $assets);
        }
    }

    /**
     * Copy the lot's photographs onto the configured disk and record them.
     *
     * Skips the upload entirely when the lot already carries the expected number of
     * images, so re-running the seeder on an existing deployment doesn't delete and
     * re-upload every object — that would cost a full round of writes against object
     * storage on every deploy for no gain.
     */
    private function attachImages(Auction $auction, string $assetDir): void
    {
        $source = database_path("seeders/assets/auctions/{$assetDir}");

        if (! is_dir($source)) {
            $this->command?->warn("No seed images found for {$assetDir}");

            return;
        }

        $files = glob("{$source}/*.jpg");
        sort($files);

        if ($files === []) {
            return;
        }

        if ($auction->images()->count() === count($files)) {
            return;
        }

        // Counts differ, so rebuild the set rather than trying to reconcile it.
        foreach ($auction->images as $existing) {
            Storage::delete($existing->image_path);
            $existing->delete();
        }

        foreach ($files as $file) {
            $path = 'images/'.Str::random(40).'.jpg';
            Storage::put($path, file_get_contents($file));
            $auction->images()->create(['image_path' => $path]);
        }
    }
}
