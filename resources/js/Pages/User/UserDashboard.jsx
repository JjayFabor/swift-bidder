import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import { route } from "ziggy-js";
import { ChevronLeft, ChevronRight, Sparkles, Tag } from "lucide-react";
import AppLayout from "@/components/Layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UserDashboard({ auctions }) {
    const scrollContainerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setMaxScroll(container.scrollWidth - container.clientWidth);

            const handleScroll = () => {
                setScrollPosition(container.scrollLeft);
            };

            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [auctions]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
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

    const handleAuctionClick = (id) => {
        window.location.href = route("auction.show", { id });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">User Dashboard</h1>
            </div>

            {/* Featured Auctions Carousel */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                        Featured Auctions
                    </h2>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => scroll("left")}
                            disabled={scrollPosition <= 0}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => scroll("right")}
                            disabled={scrollPosition >= maxScroll}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 pt-1 px-1"
                    >
                        {auctions.map((auction) => (
                            <div
                                key={auction.id}
                                className="flex-shrink-0 w-72 bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700 shadow-lg transition-transform hover:shadow-2xl hover:scale-[1.02] cursor-pointer group"
                                onClick={() => handleAuctionClick(auction.id)}
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={
                                            auction.images?.length > 0
                                                ? `/storage/${auction.images[0].image_path}`
                                                : "/default-image.jpg"
                                        }
                                        alt={auction.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {auction.status && (
                                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                                            {auction.status}
                                        </Badge>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 to-transparent p-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-medium">
                                                {formatCurrency(
                                                    auction.current_price
                                                )}
                                            </span>
                                            <span className="text-cyan-400 text-sm flex items-center bg-black/50 px-2 py-1 rounded">
                                                {auction.end_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-white line-clamp-2 mb-1">
                                        {auction.title}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                                        >
                                            View Details
                                        </Button>
                                        <Tag className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rest of dashboard content here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Your dashboard cards and widgets will go here */}
            </div>
        </div>
    );
}

const styles = `
.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
    display: none;             /* Chrome, Safari and Opera */
}
`;

UserDashboard.layout = (page) => (
    <>
        <style>{styles}</style>
        <AppLayout>{page}</AppLayout>
    </>
);
