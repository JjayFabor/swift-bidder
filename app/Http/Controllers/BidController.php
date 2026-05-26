<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBidRequest;
use App\Models\Bid;
use App\Services\AuctionService;
use Illuminate\Support\Facades\Auth;

class BidController extends Controller
{
    protected $auctionService;

    public function __construct(AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }

    public function store(StoreBidRequest $request)
    {
        $auction = $this->auctionService->getAuctionById($request->auction_id);

        if ($request->bid_amount <= $auction->current_price) {
            return back()->withErrors(['bid_amount' => 'Bid amount must be greater than the current price']);
        }

        $bid = Bid::create([
            'auction_id' => $auction->id,
            'user_id' => Auth::id(),
            'bid_amount' => $request->bid_amount,
        ]);

        $auction->update(['current_price' => $bid->bid_amount]);

        return redirect()->back()->with('success', 'Bid placed successfully');
    }
}
