<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
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

    protected $appends = ['effective_status'];

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
        return $this->effective_status === 'active';
    }

    protected function effectiveStatus(): Attribute
    {
        return Attribute::get(function () {
            if ($this->status === 'cancelled') {
                return 'cancelled';
            }

            $now = now();

            if ($this->start_time && $now->lessThan($this->start_time)) {
                return 'pending';
            }

            if ($this->end_time && $now->greaterThan($this->end_time)) {
                return 'closed';
            }

            return 'active';
        });
    }

    public function scopeAccepting(Builder $query): Builder
    {
        return $query
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now());
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '>', now());
    }

    public function scopeFinished(Builder $query): Builder
    {
        return $query
            ->where('status', '!=', 'cancelled')
            ->where('end_time', '<', now());
    }

    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', 'cancelled');
    }
}
