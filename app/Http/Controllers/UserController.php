<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Auction;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\AuctionService;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected $userService;
    protected $auctionService;

    public function __construct(UserService $userService, AuctionService $auctionService)
    {
        $this->userService = $userService;
        $this->auctionService = $auctionService;
    }

    public function index()
    {
        if (! Auth::check()) {
            return Inertia::location(route('login'));
        }

        $user = Auth::user();

        if (! $user->email_verified_at) {
            return Inertia::location(route('verify.account'));
        }

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

        return Inertia::render('User/UserDashboard', [
            'activeAuctions' => $activeAuctions,
            'pendingAuctions' => $pendingAuctions,
        ]);
    }
}
