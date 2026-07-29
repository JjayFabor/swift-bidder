<?php

namespace App\Console\Commands;

use App\Models\Auction;
use App\Models\AuctionImage;
use App\Models\Bid;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DemoReset extends Command
{
    protected $signature = 'demo:reset
                            {--force : Run even when demo mode is disabled}
                            {--keep-files : Leave uploaded images in object storage}';

    protected $description = 'Wipe auctions and bids, then reseed a clean set of demo data';

    public function handle(): int
    {
        // Guard rail: this is destructive, so refuse to run against a non-demo
        // deployment unless the operator explicitly overrides.
        if (! config('demo.enabled') && ! $this->option('force')) {
            $this->error('Demo mode is disabled. Re-run with --force if you really mean it.');

            return self::FAILURE;
        }

        if ($this->getOutput()->isVerbose()) {
            $this->info('Resetting demo data...');
        }

        if (! $this->option('keep-files')) {
            $this->deleteUploadedFiles();
        }

        DB::transaction(function () {
            // Deleted oldest-dependency-first. The auctions table uses soft deletes,
            // so a plain delete() would leave rows behind and the unique-by-title
            // reseed would then collide with invisible records.
            Bid::query()->delete();
            AuctionImage::query()->delete();
            Auction::withTrashed()->forceDelete();
        });

        $this->call('db:seed', ['--class' => DatabaseSeeder::class, '--force' => true]);

        // The dashboard counts are cached for five minutes; drop that so the reset
        // is visible immediately rather than after the TTL expires.
        Cache::forget('auction_counts');

        $this->info('Demo data reset: '.Auction::count().' auctions, '.Bid::count().' bids.');
        $this->line('Accounts: '.collect(config('demo.accounts'))->pluck('email')->implode(', '));

        return self::SUCCESS;
    }

    /**
     * Remove uploaded media so a reset does not orphan files in object storage,
     * where they would otherwise accumulate cost forever.
     */
    private function deleteUploadedFiles(): void
    {
        $paths = AuctionImage::query()->pluck('image_path')
            ->filter()
            ->all();

        if ($paths === []) {
            return;
        }

        try {
            Storage::delete($paths);
        } catch (\Throwable $e) {
            // Losing track of a few files must not abort the reset.
            $this->warn('Could not delete some uploaded files: '.$e->getMessage());
        }
    }
}
