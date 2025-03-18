import { useEffect, useState, useRef } from "react";
import {
    Gavel,
    Hourglass,
    Trophy,
    CircleX,
} from "lucide-react";
import AppLayout from "@/components/Layouts/AppLayout";
import { Button } from "@/components/ui/button";
import AuctionCarousel from "@/components/user/dashboard/AuctionCarousel";
import StatCard from "@/components/StatCard";

export default function UserDashboard({ activeAuctions = [], pendingAuctions = [] }) {
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
        <div className="p-6 hide-scrollbar">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Welcome Back!</h1>
                    <p className="text-gray-400">Find your next bid or track active auctions</p>
                </div>
                <Button
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                    Browse All Auctions
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <StatCard
                    icon={Gavel}
                    iconColor="text-blue-400"
                    iconBgColor="bg-blue-500/20"
                    title="Active Bids"
                    value={0}
                    bgColor="from-blue-900/40 to-blue-800/20"
                    borderColor="border-blue-800/50"
                />
                <StatCard
                    icon={Hourglass}
                    iconColor="text-purple-400"
                    iconBgColor="bg-purple-500/20"
                    title="Pending Auctions"
                    value={pendingAuctions.length}
                    bgColor="from-purple-900/40 to-purple-800/20"
                    borderColor="border-purple-800/50"
                />
                <StatCard
                    icon={Trophy}
                    iconColor="text-green-400"
                    iconBgColor="bg-green-500/20"
                    title="Won Auctions"
                    value={0}
                    bgColor="from-green-900/40 to-green-800/20"
                    borderColor="border-green-800/50"
                />
                <StatCard
                    icon={CircleX}
                    iconColor="text-amber-400"
                    iconBgColor="bg-amber-500/20"
                    title="Closed Auctions"
                    value={0}
                    bgColor="from-amber-900/40 to-amber-800/20"
                    borderColor="border-amber-800/50"
                />
            </div>

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
                <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for recommended items */}
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 text-center">
                        <p className="text-gray-400">Personalized recommendations coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


UserDashboard.layout = (page) => (
    <>
        <AppLayout>{page}</AppLayout>
    </>
);
