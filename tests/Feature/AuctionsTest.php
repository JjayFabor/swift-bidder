<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

beforeEach(function () {
    Session::flush();
});

uses(RefreshDatabase::class);

it('allows an admin to create an auction', function () {
    $admin = User::factory()->create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.auction.store'), [
            'title' => 'Test Auction',
            'description' => 'Test Auction Description',
            'start_time' => now()->addDays(1),
            'end_time' => now()->addDays(2),
            'starting_price' => 100,
            'status' => 'active',
        ]);

    $response->assertRedirect(route('admin.dashboard'));

    $this->assertDatabaseHas('auctions', [
        'title' => 'Test Auction',
        'description' => 'Test Auction Description',
        'starting_price' => 100,
        'status' => 'active',
    ]);
});
