<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    protected $table = 'auctions';

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(AuctionImage::class);
    }

    public function isAcceptingBids(): bool
    {
        if ($this->status === 'cancelled') {
            return false;
        }

        $now = now();

        return $now->greaterThanOrEqualTo($this->start_time)
            && $now->lessThanOrEqualTo($this->end_time);
    }
}
