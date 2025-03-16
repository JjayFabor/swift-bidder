<?php

namespace App\Services;

use App\Mail\SendTokenMail;
use App\Models\User;
use App\Models\VerifyToken;
use Illuminate\Support\Facades\Mail;

class UserService
{
    public function verifyToken($token)
    {
        $verifyToken = VerifyToken::where('token', $token)->first();

        if (! $verifyToken || $verifyToken->token != $token) {
            return ['error' => 'Invalid or expired token. Please try again.'];
        }

        return $verifyToken;
    }

    public function activateUser($user)
    {
        $user->email_verified_at = now();
        $user->save();
    }

    public function recentOtp($userId)
    {
        $lastOtp = VerifyToken::where('user_id', $userId)->latest()->first();

        return $lastOtp && $lastOtp->created_at->diffInSeconds(now()) < 180; // 3 mins cooldown
    }

    public function sendVerificationToken(User $user)
    {
        VerifyToken::where('user_id', $user->id)->delete();

        $validToken = rand(100000, 999999);
        VerifyToken::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'token' => $validToken,
            'created_at' => now(),
        ]);

        Mail::to($user->email)->queue(new SendTokenMail($user->email, $validToken, $user->name));
    }
}
