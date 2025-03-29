<?php

namespace App\Models;

use App\Models\AuctionImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Auction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'starting_price',
        'current_price',
        'start_time',
        'end_time',
        'status',
        'video_path',
    ];

    protected $table = 'auctions';

    /**
     * Get the bids of each auction
     */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Get the users who bids on each auction
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     *  Get the images for each auction
     */
    public function images(): HasMany
    {
        return $this->hasMany(AuctionImage::class);
    }

    /**
     *  Check if the auction is active
     */
    public function isAuctionActive(): bool
    {
        return in_array($this->status, ['active', 'pending', 'cancelled']);
    }

    /**
     *  Check if the auction is expired or ends
     */
    public function isAuctionExpired(): bool
    {
        return now() > $this->end_time;
    }

    public static function auctionCounts(): array
    {
        return self::selectRaw("
            COUNT(*) as total_auctions,
            SUM(status = 'active') as total_active_auctions,
            SUM(status = 'pending') as total_pending_auctions,
            SUM(status = 'closed') as total_closed_auctions
        ")
        ->first()
        ->toArray();
    }
}
