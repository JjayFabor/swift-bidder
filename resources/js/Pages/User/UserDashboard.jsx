import { useEffect, useState, useRef } from "react";
import {
    Gavel,
    Hourglass,
    Trophy,
    CircleX,
} from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import AuctionPage from "../Auction/AuctionPage.jsx";

export default function UserDashboard({ activeAuctions = [], pendingAuctions = [] }) {

    return (
        <div className="p-6 hide-scrollbar">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Welcome Back!</h1>
                    <p className="text-muted-foreground">Find your next bid or track active auctions</p>
                </div>
                <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white dark:text-blue-400 dark:hover:bg-blue-700"
                >
                    Browse All Auctions
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <StatCard
                    icon={Gavel}
                    tone="blue"
                    title="Active Bids"
                    value={0}
                />
                <StatCard
                    icon={Hourglass}
                    tone="purple"
                    title="Pending Auctions"
                    value={pendingAuctions.length}
                />
                <StatCard
                    icon={Trophy}
                    tone="green"
                    title="Won Auctions"
                    value={0}
                />
                <StatCard
                    icon={CircleX}
                    tone="amber"
                    title="Closed Auctions"
                    value={0}
                />
            </div>

            {/* AuctionPage Section */}
            <AuctionPage activeAuctions={activeAuctions} pendingAuctions={pendingAuctions} />
        </div>
    );
}


UserDashboard.layout = (page) => (
    <>
        <AppLayout>{page}</AppLayout>
    </>
);
