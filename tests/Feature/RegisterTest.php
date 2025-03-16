<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

beforeEach(function () {
    Session::flush();
});

uses(RefreshDatabase::class);

it('allows a user to register', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test User Bidder',
        'email' => 'test@bidder.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertAuthenticatedAs($user = User::whereEmail('test@bidder.com')->first());
    $response->assertRedirect(route('verify.account'));
});

it('fails to register if email already exists', function () {
    User::factory()->create([
        'email' => 'test@bidder.com',
    ]);

    $response = $this->post(route('register'), [
        'name' => 'Test User Bidder',
        'email' => 'test@bidder.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors(['email']);
});

it('fails to register with invalid data', function () {
    $response = $this->post(route('register'), []);

    $response->assertSessionHasErrors(['name', 'email', 'password']);
    $this->assertGuest();
});

it('fails to register if password is not confirmed', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test User Bidder',
        'email' => 'test@bidder.com',
        'password' => 'password123',
        'password_confirmation' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors(['password']);
});
