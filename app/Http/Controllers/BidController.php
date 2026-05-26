<?php

namespace App\Http\Controllers;

use App\Events\BidPlaced;
use App\Http\Requests\StoreBidRequest;
use App\Models\Auction;
use App\Models\Bid;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BidController extends Controller
{
    public function store(StoreBidRequest $request)
    {
        $userId = Auth::id();

        $bid = DB::transaction(function () use ($request, $userId) {
            $auction = Auction::lockForUpdate()->findOrFail($request->auction_id);

            if (! $auction->isAcceptingBids()) {
                throw ValidationException::withMessages([
                    'bid_amount' => 'This auction is not accepting bids right now.',
                ]);
            }

            if ($request->bid_amount <= $auction->current_price) {
                throw ValidationException::withMessages([
                    'bid_amount' => 'Bid amount must be greater than the current price.',
                ]);
            }

            $highestBid = $auction->bids()->latest('id')->first();
            if ($highestBid && (int) $highestBid->user_id === (int) $userId) {
                throw ValidationException::withMessages([
                    'bid_amount' => 'You are already the highest bidder.',
                ]);
            }

            $bid = Bid::create([
                'auction_id' => $auction->id,
                'user_id' => $userId,
                'bid_amount' => $request->bid_amount,
            ]);

            $auction->update(['current_price' => $bid->bid_amount]);

            return $bid;
        });

        broadcast(new BidPlaced($bid))->toOthers();

        return redirect()->back()->with('success', 'Bid placed successfully');
    }
}
