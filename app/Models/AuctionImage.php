<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AuctionImage extends Model
{
    protected $fillable = [
        'auction_id',
        'image_path',
    ];

    protected $table = 'auction_images';

    /**
     * Expose a ready-to-use public URL so the frontend never builds storage paths
     * itself. Resolves against the configured default disk, which is the local
     * `public` disk in development and object storage (R2/S3) in production.
     */
    protected $appends = ['url'];

    public function getUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    /**
     * Get the auction that owns the image
     */
    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
