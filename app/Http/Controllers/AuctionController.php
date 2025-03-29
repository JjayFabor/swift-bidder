<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AuctionImage;
use Illuminate\Http\Request;
use App\Rules\ValidAuctionTimes;
use App\Services\AuctionService;
use App\Http\Requests\StoreAuctionRequest;
use Illuminate\Validation\ValidationException;

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

        // Prepend full storage URL to images
        $auction_images->transform(function ($image) {
            $image->image_path = asset('storage/' . $image->image_path);
            return $image;
        });

        // Prepend full storage URL to video
        if ($auction->video_path) {
            $auction->video_path = asset('storage/' . $auction->video_path);
        }

        return Inertia::render('Admin/Auctions/ShowAuction', [
            'auction' => $auction,
            'images' => $auction_images,
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

        if(!$auction) {
            return back()->withErrors(['errors' => 'Auction not found']);
        }

        $auction->delete();
        return to_route('admin.dashboard');
    }
}
