<?php

namespace Database\Seeders;

use App\Models\Auction;
use Illuminate\Database\Seeder;

class AuctionSeeder extends Seeder
{
    /**
     * Seed a realistic spread of auctions for the demo.
     *
     * Each status is deliberately consistent with its own start/end times. This is
     * not cosmetic: RefreshAuctionStatuses recalculates status from the clock on
     * every request, so an auction seeded as "active" with an end_time in the past
     * would silently flip to "closed" the moment someone loads a page.
     *
     * Keyed on title so re-running tops the set back up rather than duplicating it.
     */
    public function run(): void
    {
        $now = now();

        $auctions = [
            [
                'title' => 'Vintage Rolex Submariner',
                'description' => 'A 1970s Submariner in excellent condition, complete with original box and papers.',
                'starting_price' => 12500.00,
                'current_price' => 14750.00,
                'start_time' => $now->copy()->subDays(2),
                'end_time' => $now->copy()->addDays(3),
                'status' => 'active',
            ],
            [
                'title' => 'Signed Championship Jersey',
                'description' => 'Game-worn jersey signed by the full championship roster, with certificate of authenticity.',
                'starting_price' => 850.00,
                'current_price' => 1320.00,
                'start_time' => $now->copy()->subHours(6),
                'end_time' => $now->copy()->addDays(1),
                'status' => 'active',
            ],
            [
                'title' => 'Limited Edition Sneakers',
                'description' => 'Deadstock collaboration release, size 10, never worn. One of 500 pairs worldwide.',
                'starting_price' => 400.00,
                'current_price' => 400.00,
                'start_time' => $now->copy()->addDays(1),
                'end_time' => $now->copy()->addDays(6),
                'status' => 'pending',
            ],
            [
                'title' => 'Original Oil Painting',
                'description' => 'Signed landscape on canvas, framed, from a private collection in Iloilo.',
                'starting_price' => 2200.00,
                'current_price' => 2200.00,
                'start_time' => $now->copy()->addDays(3),
                'end_time' => $now->copy()->addDays(10),
                'status' => 'pending',
            ],
            [
                'title' => 'Antique Wooden Cabinet',
                'description' => 'Hand-carved narra cabinet, early 1900s, restored and structurally sound.',
                'starting_price' => 1800.00,
                'current_price' => 3100.00,
                'start_time' => $now->copy()->subDays(14),
                'end_time' => $now->copy()->subDays(2),
                'status' => 'closed',
            ],
        ];

        foreach ($auctions as $auction) {
            Auction::updateOrCreate(
                ['title' => $auction['title']],
                $auction
            );
        }
    }
}
