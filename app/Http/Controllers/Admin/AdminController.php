<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Auction;
use App\Services\AuctionService;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    protected $auctionService;

    public function __construct (AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }

    public function index()
    {
        $auctions = $this->auctionService->getAllAuctions();
        $counts = Auction::auctionCounts();

        return Inertia::render('Admin/AdminDashboard',[
            'auctions' => [
                'dataAuctions' => $auctions->items(),
                'links' => $auctions->toArray()['links'],
            ],
            'totalActiveAuctions' => $counts['total_active_auctions'],
            'totalAuctions' => $counts['total_auctions'],
            'totalBidders' => User::totalBidders(),
        ]);
    }

    public function auctionPage()
    {
        $activeAuctions = Auction::with(['images'])
            ->where('status', 'active')
            ->get()
            ->map(function ($auction) {
                if ($auction->images->count() === 1) {
                    $auction->selected_image = $auction->images->first()->image_path;
                } elseif ($auction->images->count() > 1) {
                    $auction->selected_image = $auction->images->random()->image_path;
                } else {
                    $auction->selected_image = null;
                }

                return $auction;
            });

        $pendingAuctions = Auction::with(['images'])
            ->where('status', 'pending')
            ->get()
            ->map(function ($auction) {
                if ($auction->images->count() === 1) {
                    $auction->selected_image = $auction->images->first()->image_path;
                } elseif ($auction->images->count() > 1) {
                    $auction->selected_image = $auction->images->random()->image_path;
                } else {
                    $auction->selected_image = null;
                }

                return $auction;
            });

        return Inertia::render('User/AuctionPage', [
            'activeAuctions' => $activeAuctions,
            'pendingAuctions' => $pendingAuctions,
        ]);
    }
}
