<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Services\AuctionService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

        $attachSelectedImage = function ($auction) {
            $auction->selected_image = $auction->images->isEmpty()
                ? null
                : $auction->images->random()->image_path;

            return $auction;
        };

        $activeAuctions = Auction::with('images')->accepting()->get()->map($attachSelectedImage);
        $pendingAuctions = Auction::with('images')->upcoming()->get()->map($attachSelectedImage);

        return Inertia::render('User/UserDashboard', [
            'activeAuctions' => $activeAuctions,
            'pendingAuctions' => $pendingAuctions,
        ]);
    }
}
