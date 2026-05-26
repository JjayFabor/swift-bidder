<?php

namespace App\Services;

use App\Models\Auction;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AuctionService
{
    public const COUNTS_CACHE_KEY = 'auction_counts';

    public function getAllAuctions()
    {
        return Auction::paginate(5);
    }

    public function getAuctionById($id)
    {
        return Auction::findOrFail($id);
    }

    public function getAuctionCounts(): array
    {
        return Cache::remember(self::COUNTS_CACHE_KEY, now()->addMinutes(5), function () {
            return Auction::selectRaw("
                COUNT(*) as total_auctions,
                SUM(status = 'active') as total_active_auctions,
                SUM(status = 'pending') as total_pending_auctions,
                SUM(status = 'closed') as total_closed_auctions
            ")
                ->first()
                ->toArray();
        });
    }

    public function flushCounts(): void
    {
        Cache::forget(self::COUNTS_CACHE_KEY);
    }

    public function createAuction(array $data)
    {
        return DB::transaction(function () use ($data) {
            $data['current_price'] = $data['starting_price'];

            $images = $data['images'] ?? [];
            unset($data['images']);

            $auction = Auction::create($data);

            foreach ($images as $image) {
                $path = $image->store('images', 'public');
                $auction->images()->create(['image_path' => $path]);
            }

            $this->flushCounts();

            return $auction;
        });
    }
}
