<?php

namespace App\Services;

use App\Models\Auction;
use Illuminate\Support\Facades\Cache;

class AuctionService
{
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
        return Cache::remember('auction_counts', now()->addMinutes(5), function () {
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

    public function createAuction(array $data)
    {
        \DB::beginTransaction();

        try {
            // Handle video upload
            if (! empty($data['video_path']) && $data['video_path'] instanceof \Illuminate\Http\UploadedFile) {
                $data['video_path'] = $data['video_path']->store('videos', 'public');
            }

            // Set current price same as starting price
            $data['current_price'] = $data['starting_price'];

            // Create Auction
            $auction = Auction::create($data);

            // Handle multiple image uploads
            if (! empty($data['images']) && is_array($data['images'])) {
                foreach ($data['images'] as $image) {
                    $path = $image->store('images', 'public');
                    $auction->images()->create(['image_path' => $path]);
                }
            }

            if (! $auction) {
                throw new \Exception('Failed to create auction');
            }

            \DB::commit();

            // Optional: Broadcast event
            // broadcast(new AuctionCreated($auction));

            return $auction;
        } catch (\Throwable $e) {
            \DB::rollBack();
            \Log::error('Auction creation failed: '.$e->getMessage());
            throw $e;
        }
    }

    public function updateAuction(Request $request, $id)
    {
        /**
         * @var Auction|null $auction
         */
        $auction = Auction::findOrFail($id);

        if (! $auction->isAuctionActive()) {
            return null;
        }

        $auction->update([
            'title' => $request->title,
            'description' => $request->description,
            'starting_price' => $request->starting_price,
            'current_price' => $request->starting_price,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => $request->status,
        ]);

        // broadcast(new AuctionUpdated($auction));

        return $auction;
    }

    // public function archiveAuction($id)
    // {
    //     /**
    //      * @var Auction|null $auction
    //      */
    //     $auction = Auction::findOrFail($id);

    //     $archive = Archive::create([
    //         'auction_id' => $auction->id,
    //         'title' => $auction->title,
    //         'description' => $auction->description,
    //         'starting_price' => $auction->starting_price,
    //         'final_price' => $auction->current_price,
    //         'start_time' => $auction->start_time,
    //         'end_time' => $auction->end_time,
    //         'status' => $auction->status,
    //         'image_path' => $auction->image_path,
    //         'reason' => 'deleted',
    //         'created_at' => now(),
    //         'updated_at' => now(),
    //     ]);

    //     $auction->delete();
    //     broadcast(new AuctionDeleted($auction));

    //     return $archive;
    // }
}
