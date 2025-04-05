<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\User;
use App\Services\AuctionService;
use App\Services\UserService;
use Inertia\Inertia;

class AdminController extends Controller
{
    protected $auctionService;

    protected $userService;

    public function __construct(AuctionService $auctionService, UserService $userService)
    {
        $this->auctionService = $auctionService;
        $this->userService = $userService;
    }

    public function index()
    {
        $auctions = $this->auctionService->getAllAuctions();
        $auctionCounts = $this->auctionService->getAuctionCounts();

        return Inertia::render('Admin/AdminDashboard', [
            'auctions' => [
                'dataAuctions' => $auctions->items(),
                'links' => $auctions->toArray()['links'],
            ],
            'totalActiveAuctions' => $auctionCounts['total_active_auctions'],
            'totalAuctions' => $auctionCounts['total_auctions'],
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

        return Inertia::render('Auction/AuctionPage', [
            'activeAuctions' => $activeAuctions,
            'pendingAuctions' => $pendingAuctions,
        ]);
    }
}
