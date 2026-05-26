<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuctionRequest;
use App\Models\AuctionImage;
use App\Services\AuctionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuctionController extends Controller
{
    protected $auctionService;

    public function __construct(AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAuctionRequest $request)
    {
        try {
            $auctions = $this->auctionService->createAuction($request->validated());

            return to_route('admin.dashboard');
        } catch (\Throwable $e) {
            \Log::error('Auction creation failed: '.$e->getMessage());

            if ($e instanceof ValidationException) {
                throw $e;
            }

            return back()->withErrors(['errors' => 'An unexpected error occurred.'])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $auction = $this->auctionService->getAuctionById($id);
        $auction_images = AuctionImage::where('auction_id', $id)->get();

        $auction_images->transform(function ($image) {
            $image->image_path = asset('storage/'.$image->image_path);

            return $image;
        });

        $recentBids = $auction->bids()
            ->with('user:id,name')
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn ($bid) => [
                'id' => $bid->id,
                'bid_amount' => $bid->bid_amount,
                'bidder_id' => $bid->user_id,
                'bidder_name' => $bid->user?->name ?? 'Bidder',
                'created_at' => $bid->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Auction/ShowAuction', [
            'auction' => $auction,
            'images' => $auction_images,
            'recentBids' => $recentBids,
            'user' => Auth::user(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $auction = $this->auctionService->getAuctionById($id);
        $auction->delete();
        $this->auctionService->flushCounts();

        return to_route('admin.dashboard');
    }
}
