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

        $auctions = Auction::with(['images'])
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
            'auctions' => $auctions,
        ]);
    }

    public function verifyAccount()
    {
        return Inertia::render('Auth/OTPVerification');
    }

    public function emailActivation(Request $request)
    {
        $getToken = $this->userService->verifyToken($request->token);

        if (! $getToken) {
            return redirect()->route('verify.account')->with('error', 'Invalid or expired token. Please try again.');
        }

        if (! isset($getToken->user_id)) {
            return redirect()->route('verify.account')
                ->with('error', 'Invalid token. Please enter the correct one.');
        }

        $user = User::find($getToken->user_id);
        if (! $user) {
            return redirect()->route('verify.account')->with('error', 'Invalid or expired token. Please try again.');
        }

        $this->userService->activateUser($user);
        $getToken->delete();

        return redirect()->route('user.dashboard')->with('success', 'Your email has been verified successfully.');
    }

    public function resendOtp()
    {
        /**
         * @var User|null $user
         */
        $user = Auth::user();

        if (! $user) {
            return back()->withErrors(['error' => 'User not found.']);
        }

        if ($user->email_verified_at) {
            return back()->with(['success' => 'Your email is already verified.']);
        }

        if ($this->userService->recentOtp($user->id)) {
            return back()->withErrors(['error' => 'Please wait for 3 minutes before requesting another OTP.']);
        }

        $this->userService->sendVerificationToken($user);

        return back()->with(['success' => 'A new OTP has been sent to your email.']);
    }
}
