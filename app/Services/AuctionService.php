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
            return [
                'total_auctions' => Auction::count(),
                'total_active_auctions' => Auction::accepting()->count(),
                'total_pending_auctions' => Auction::upcoming()->count(),
                'total_closed_auctions' => Auction::finished()->count(),
            ];
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

    public function updateAuction(array $data, $id): Auction
    {
        return DB::transaction(function () use ($data, $id) {
            $auction = Auction::lockForUpdate()->findOrFail($id);

            if ($auction->bids()->exists()) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'starting_price' => 'Cannot edit an auction that already has bids.',
                ]);
            }

            $data['current_price'] = $data['starting_price'];
            $auction->update($data);

            $this->flushCounts();

            return $auction->fresh();
        });
    }
}
