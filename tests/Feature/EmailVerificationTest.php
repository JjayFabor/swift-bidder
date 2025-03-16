<?php

use App\Models\User;
use App\Models\VerifyToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    Auth::login($this->user);
});

it('redirects unverified user to verify account page', function () {
    $response = $this->get(route('user.dashboard'));

    $response->assertRedirect(route('verify.account'));
});

it('allows verified user to access dashboard', function () {
    $this->user->update([
        'email_verified_at' => now(),
    ]);

    $response = $this->get(route('user.dashboard'));

    $response->assertStatus(200);
});

it('verifies a user email successfully', function () {
    $token = VerifyToken::create([
        'user_id' => $this->user->id,
        'email' => $this->user->email,
        'token' => '123456',
    ]);

    $response = $this->post(route('otp.verify'), [
        'token' => $token->token,
    ]);

    $response->assertRedirect(route('user.dashboard'));
    $this->assertNotNull($this->user->fresh()->email_verified_at);
});

it('fails to verify with an invalid token', function () {
    $response = $this->post(route('otp.verify'), [
        'token' => '123457',
    ]);

    $response->assertRedirect(route('verify.account'));
    $response->assertSessionHas('error', 'Invalid token. Please enter the correct one.');
});

it('resends OTP successfully', function () {
    $response = $this->post(route('resend.otp'));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'A new OTP has been sent to your email.');
});

it('prevents OTP resend within cooldown period', function () {
    VerifyToken::create([
        'user_id' => $this->user->id,
        'email' => $this->user->email,
        'token' => '123456',
        'created_at' => now(),
    ]);

    $response = $this->post(route('resend.otp'));

    $response->assertRedirect();
    $response->assertSessionHasErrors(['error' => 'Please wait for 3 minutes before requesting another OTP.']);
});
