<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

beforeEach(function () {
    Session::flush();
});

uses(RefreshDatabase::class);

it('allows a user to log in', function () {
    $user = User::factory()->create([
        'name' => 'Test User Bidder',
        'email' => 'test@bidder.com',
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'test@bidder.com',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('user.dashboard'));
    $this->assertAuthenticatedAs($user);
});

it('allows an admin to log in and redirect to admin dashboard', function () {
    $admin = User::factory()->create([
        'name' => 'Test Admin',
        'email' => 'test@admin.com',
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
        'role' => 'admin',
    ]);

    $response = $this->post(route('login'), [
        'email' => 'test@admin.com',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticatedAs($admin);
});

it('fails to log in with invalid credentials', function () {
    $user = User::factory()->create([
        'name' => 'Test User Bidder',
        'email' => 'test@bidder.com',
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'test@bidder.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('message');
    $this->assertGuest();
});

it('requires email and password', function () {
    $response = $this->post(route('login'), []);

    $response->assertSessionHasErrors(['email', 'password']);
});
