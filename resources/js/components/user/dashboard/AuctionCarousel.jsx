import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import AuctionCard from "@/components/user/dashboard/AuctionCard";

export default function AuctionCarousel ({
        title,
        icon: Icon,
        auctions,
        scrollRef,
        scrollPosition,
        maxScroll,
        iconColor = "text-yellow-400",
        emptyMessage = "No auctions available"
    }) {

        // Scroll carousel in specified direction
        const scroll = (direction, carouselRef, setScrollPosition, maxScroll) => {
            if (carouselRef.current) {
                const container = carouselRef.current;
                const scrollAmount = container.clientWidth * 0.8;
                const targetScroll =
                    direction === "left"
                        ? Math.max(0, container.scrollLeft - scrollAmount)
                        : Math.min(maxScroll, container.scrollLeft + scrollAmount);

                container.scrollTo({
                    left: targetScroll,
                    behavior: "smooth",
                });
            }
        };

        // Navigate to auction details page
        const handleAuctionClick = (id) => {
            window.location.href = route("auction.show", { id });
        };

        return (
            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold flex items-center">
                        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
                        {title}
                    </h2>
                    {auctions.length > 0 && (
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                                onClick={() => scroll("left", scrollRef, null, maxScroll)}
                                disabled={scrollPosition <= 0}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                                onClick={() => scroll("right", scrollRef, null, maxScroll)}
                                disabled={scrollPosition >= maxScroll}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="relative">
                    {auctions.length > 0 ? (    
                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 pt-2 px-1"
                        >
                            {auctions.map((auction) => (
                                <AuctionCard
                                    key={auction.id}
                                    auction={auction}
                                    onClick={handleAuctionClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-gray-800 rounded-lg p-8 border border-gray-700">
                            <div className="flex items-center gap-3 text-gray-400">
                                <AlertCircle className="w-5 h-5" />
                                <p>{emptyMessage}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
