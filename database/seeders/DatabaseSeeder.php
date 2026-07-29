<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Idempotent on purpose: the hosted database gets recreated periodically, so this
     * has to be safe to re-run without tripping the unique constraint on users.email.
     * `forceFill` is used because `role` and `email_verified_at` are deliberately not
     * mass-assignable on the User model.
     *
     * Accounts are pre-verified so they skip the OTP step entirely — which matters
     * because the free hosting tier blocks outbound SMTP, making email delivery
     * impossible there.
     */
    public function run(): void
    {
        foreach (config('demo.accounts') as $account) {
            User::firstOrNew(['email' => $account['email']])
                ->forceFill([
                    'name' => $account['name'],
                    'password' => bcrypt($account['password']),
                    'role' => $account['role'],
                    'email_verified_at' => now(),
                ])
                ->save();
        }

        $this->call(AuctionSeeder::class);
    }
}
