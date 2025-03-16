<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Auction;
use Illuminate\Console\Command;

class UpdateAuctionStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-auction-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update auction status based on the Start Time and End Time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        // Activate auctions where start time has passed and status is not active
        Auction::where('status', 'pending')
            ->where('start_time', '<=', $now)
            ->update(['status' => 'active']);

        // Expire auctions where end time has passed and status is active
        Auction::where('status', 'active')
            ->where('end_time', '<=', $now)
            ->update(['status' => 'closed']);

        $this->info('Auction status updated successfully.');
    }
}
