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
import AuctionPage from "./AuctionPage.jsx";

export default function UserDashboard({ activeAuctions = [], pendingAuctions = [] }) {

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
