<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $user = Auth::user();

        if (! $user->email_verified_at) {
            return Inertia::location(route('verify.account'));
        }

        return Inertia::render('User/UserDashboard');
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
