<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuctionImage extends Model
{
    protected $fillable = [
        'auction_id',
        'image_path',
    ];

    protected $table = 'auction_images';

    /**
     * Get the auction that owns the image
     */
    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
