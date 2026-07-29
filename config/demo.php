<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Demo Mode
    |--------------------------------------------------------------------------
    |
    | When enabled, the login screen advertises the seeded demo accounts so a
    | reviewer handed nothing but a URL can get in. Keep this off for any real
    | deployment — it publishes working credentials by design.
    |
    | Read through config (not env()) so it survives `php artisan config:cache`,
    | which the container runs on every boot.
    |
    */

    'enabled' => (bool) env('APP_DEMO', false),

    /*
    |--------------------------------------------------------------------------
    | Demo Accounts
    |--------------------------------------------------------------------------
    |
    | The single source of truth for demo users: the seeder creates exactly these,
    | and the login screen lists exactly these. Multiple bidders exist so several
    | testers can bid against each other instead of sharing one session.
    |
    | example.com is reserved for documentation/testing by RFC 2606, so these
    | addresses can never collide with a real inbox.
    |
    */

    'accounts' => [
        [
            'name' => 'Demo Admin',
            'email' => 'admin@example.com',
            'password' => 'admin1234',
            'role' => 'admin',
            'label' => 'Admin',
            'description' => 'Create, edit and delete auctions',
        ],
        [
            'name' => 'Demo Bidder One',
            'email' => 'bidder1@example.com',
            'password' => 'bidder1234',
            'role' => 'bidder',
            'label' => 'Bidder 1',
            'description' => 'Browse auctions and place bids',
        ],
        [
            'name' => 'Demo Bidder Two',
            'email' => 'bidder2@example.com',
            'password' => 'bidder1234',
            'role' => 'bidder',
            'label' => 'Bidder 2',
            'description' => 'Browse auctions and place bids',
        ],
        [
            'name' => 'Demo Bidder Three',
            'email' => 'bidder3@example.com',
            'password' => 'bidder1234',
            'role' => 'bidder',
            'label' => 'Bidder 3',
            'description' => 'Browse auctions and place bids',
        ],
        [
            'name' => 'Demo Bidder Four',
            'email' => 'bidder4@example.com',
            'password' => 'bidder1234',
            'role' => 'bidder',
            'label' => 'Bidder 4',
            'description' => 'Browse auctions and place bids',
        ],
    ],

];
