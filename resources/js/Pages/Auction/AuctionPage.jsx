import { useEffect, useState, useRef } from "react";
import { Gavel, Hourglass } from "lucide-react";
import AppLayout from '@/components/layouts/AppLayout';
import AuctionCarousel from "@/components/user/dashboard/AuctionCarousel";

export default function AuctionPage({
    activeAuctions = [],
    pendingAuctions = [],
}) {
    const activeAuctionsRef = useRef(null);
    const pendingAuctionsRef = useRef(null);

    const [activeScrollPosition, setActiveScrollPosition] = useState(0);
    const [pendingScrollPosition, setPendingScrollPosition] = useState(0);
    const [activeMaxScroll, setActiveMaxScroll] = useState(0);
    const [pendingMaxScroll, setPendingMaxScroll] = useState(0);

    // Set up scroll tracking for active auctions
    useEffect(() => {
        if (activeAuctionsRef.current) {
            const container = activeAuctionsRef.current;
            setActiveMaxScroll(container.scrollWidth - container.clientWidth);

            const handleScroll = () => {
                setActiveScrollPosition(container.scrollLeft);
            };

            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [activeAuctions]);

    // Set up scroll tracking for pending auctions
    useEffect(() => {
        if (pendingAuctionsRef.current) {
            const container = pendingAuctionsRef.current;
            setPendingMaxScroll(container.scrollWidth - container.clientWidth);

            const handleScroll = () => {
                setPendingScrollPosition(container.scrollLeft);
            };

            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [pendingAuctions]);

    return (
        <>
            {/* Active Auctions Carousel */}
            <AuctionCarousel
                title="Active Auctions"
                icon={Gavel}
                auctions={activeAuctions}
                scrollRef={activeAuctionsRef}
                scrollPosition={activeScrollPosition}
                maxScroll={activeMaxScroll}
                iconColor="text-blue-400"
                emptyMessage="No active auctions available at this time"
            />

            {/* Pending Auctions Carousel */}
            <AuctionCarousel
                title="Pending Auctions"
                icon={Hourglass}
                auctions={pendingAuctions}
                scrollRef={pendingAuctionsRef}
                scrollPosition={pendingScrollPosition}
                maxScroll={pendingMaxScroll}
                iconColor="text-purple-400"
                emptyMessage="No pending auctions available at this time"
            />

            {/* Recommendations Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Recommended For You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for recommended items */}
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 text-center">
                        <p className="text-gray-400">
                            Personalized recommendations coming soon
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

AuctionPage.layout = (page) => <AppLayout>{page}</AppLayout>;
