<?php

namespace App\Events;

use App\Models\Bid;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidPlaced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $auctionId;

    public int $bidId;

    public string $bidAmount;

    public string $currentPrice;

    public int $bidderId;

    public string $bidderName;

    public string $createdAt;

    public function __construct(Bid $bid)
    {
        $bid->loadMissing('user', 'auction');

        $this->auctionId = (int) $bid->auction_id;
        $this->bidId = (int) $bid->id;
        $this->bidAmount = (string) $bid->bid_amount;
        $this->currentPrice = (string) $bid->auction->current_price;
        $this->bidderId = (int) $bid->user_id;
        $this->bidderName = $bid->user?->name ?? 'Bidder';
        $this->createdAt = $bid->created_at->toIso8601String();
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('auction.'.$this->auctionId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'BidPlaced';
    }
}
