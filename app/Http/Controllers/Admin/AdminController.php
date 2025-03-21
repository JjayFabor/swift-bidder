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

        return Inertia::render('Admin/AdminDashboard',[
            'auctions' => [
                'dataAuctions' => $auctions->items(),
                'links' => $auctions->toArray()['links'],
            ],
            'totalActiveAuctions' => Auction::totalActiveAuctions(),
            'totalAuctions' => Auction::totalAuctions(),
            'totalBidders' => User::totalBidders(),
        ]);
    }
}
