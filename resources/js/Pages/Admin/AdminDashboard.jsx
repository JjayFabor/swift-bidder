import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { useState } from 'react';
import { Home, Users, Trophy, Hourglass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddAuctionModal from '../../components/admin/dashboard/AddAuctionModal';
import StatCard from '@/components/StatCard';
import AuctionTable from '@/components/admin/dashboard/AuctionTable';

export default function AdminDashboard({ auctions = { dataAuctions: [], links: [] } }) {
    const { dataAuctions, links } = auctions;
    const { totalActiveAuctions, totalAuctions, onlineBidders, totalBidders } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClose  = () => setIsModalOpen(false);
    const handleOpen = () => setIsModalOpen(true);

    return (
        <div className="px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="bg-card text-card-foreground border shadow-sm rounded-lg p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
                    <StatCard
                        icon={Home}
                        tone="blue"
                        title="Active Auctions"
                        value={`${totalActiveAuctions ?? 0} / ${totalAuctions ?? 0}`}
                    />
                    <StatCard
                        icon={Users}
                        tone="purple"
                        title="Online Users"
                        value={`${onlineBidders ?? 0} / ${totalBidders ?? 0}`}
                    />
                    <StatCard
                        icon={Trophy}
                        tone="green"
                        title="Won Auctions"
                        value="0"
                    />
                    <StatCard
                        icon={Hourglass}
                        tone="amber"
                        title="Ending Soon"
                        value="0"
                    />
                </div>
            </div>
            <div className="bg-card text-card-foreground border shadow-sm rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Auctions List</h2>
                    <Button
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white dark:text-blue-400 dark:hover:bg-blue-700"
                        onClick={handleOpen}
                    >
                        Add New Auction
                    </Button>
                </div>
                <AddAuctionModal
                    title="Add New Auction"
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    auctions={dataAuctions}
                />
                <AuctionTable dataAuctions={dataAuctions} links={links} />
            </div>
        </div>
    );
}

AdminDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
