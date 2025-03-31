<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use Illuminate\Http\Request;
use App\Services\AuctionService;
use App\Http\Requests\StoreBidRequest;

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

        if (!$auction) {
            return back()->withErrors(['errors' => 'Auction not found']);
        }

        $current_price = $auction->current_price;

        if ($request->bid_amount <= $current_price) {
            return back()->withErrors(['errors' => 'Bid amount must be greater than the current price']);
        }

        $bid = Bid::create($request->validated());

        $auction->update(['current_price' => $bid->bid_amount]);

        return redirect()->back()->with('success', 'Bid placed successfully');

    }
}
