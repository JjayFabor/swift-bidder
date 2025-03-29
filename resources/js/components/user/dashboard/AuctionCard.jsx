import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { toast } from 'sonner';
import moment from "moment";

export default function AuctionCard({ auction, onClick }) {
    // Show Auction
    const showAuction = (auctionId) => {
        router.get(route("auction.show", auctionId));
    };

    // Format end time to display time remaining
    const formatTimeRemaining = (endTimeStr) => {
        try {
            const endTime = moment(endTimeStr);
            const now = moment();

            if (now > endTime) return "Ended";

            const duration = moment.duration(endTime.diff(now));
            const days = Math.floor(duration.asDays());

            if (days > 0) {
                return `${days}d ${duration.hours()}h`;
            } else if (duration.hours() > 0) {
                return `${duration.hours()}h ${duration.minutes()}m`;
            } else {
                return `${duration.minutes()}m ${duration.seconds()}s`;
            }
        } catch (error) {
            return "Unknown";
        }
    };

    const timeRemaining = formatTimeRemaining(auction.end_time);

    // Get badge color based on status
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "bg-gradient-to-r from-green-600 to-green-500";
            case "pending":
                return "bg-gradient-to-r from-amber-600 to-amber-500";
            case "closed":
                return "bg-gradient-to-r from-blue-600 to-blue-500";
            default:
                return "bg-gradient-to-r from-purple-600 to-purple-500";
        }
    };

    // Format currency with commas and dollar sign
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <Card
            key={auction.id}
            className="flex-shrink-0 w-72 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group"
        >
            <div className="relative h-44 overflow-hidden">
                <img
                    src={
                        auction.images?.length > 0
                            ? `/storage/${auction.images[0].image_path}`
                            : "/default-image.jpg"
                    }
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {auction.status && (
                    <Badge
                        className={`absolute top-3 right-3 ${getStatusColor(
                            auction.status
                        )} text-white`}
                    >
                        {auction.status}
                    </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white font-medium">
                            {formatCurrency(auction.current_price)}
                        </span>
                        <span className="text-cyan-300 text-xs flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            {timeRemaining}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-medium text-white line-clamp-2">
                    {auction.title}
                </h3>
                <div className="flex justify-between items-center mt-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 p-1 px-2 rounded text-xs font-medium"
                        onClick={() => showAuction(auction.id)}
                    >
                        View Details
                    </Button>
                    <span className="text-xs text-gray-400">
                        {auction.bids_count || 0} bids
                    </span>
                </div>
            </div>
        </Card>
    );
}
