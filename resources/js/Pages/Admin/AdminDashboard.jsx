import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/components/Layouts/AppLayout';
import { useEffect, useState } from 'react';
import { Home, Users, Trophy, Hourglass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddAuctionModal from '../../components/admin/dashboard/AddAuctionModal';
import StatCard from '@/components/admin/dashboard/StatCard';
import AuctionTable from '@/components/admin/dashboard/AuctionTable';

export default function AdminDashboard({ auctions = { dataAuctions: [], links: [] } }) {
    const { dataAuctions, links } = auctions;
    const { totalActiveAuctions, totalAuctions, onlineBidders, totalBidders } = usePage().props;
    const [currentDateTime, setCurrentDateTime] = useState({
        date: new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentDateTime({
                date: now.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }),
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClose  = () => setIsModalOpen(false);
    const handleOpen = () => setIsModalOpen(true);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 shadow-lg rounded-lg p-6 text-white h-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <div className="text-right">
                        <div className="text-lg font-semibold">{currentDateTime.date}</div>
                        <div className="text-lg font-semibold">{currentDateTime.time}</div>
                    </div>

                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
                    <StatCard
                        icon={Home}
                        title="Active Auctions"
                        value={`${totalActiveAuctions ?? 0} / ${totalAuctions ?? 0}`}
                        bgColor="bg-blue-500"
                    />
                    <StatCard
                        icon={Users}
                        title="Online Users"
                        value={`${onlineBidders ?? 0} / ${totalBidders ?? 0}`}
                        bgColor="bg-green-500"
                    />
                    <StatCard
                        icon={Trophy}
                        title="Won Auctions"
                        value="0"
                        bgColor="bg-teal-500"
                    />
                    <StatCard
                        icon={Hourglass}
                        title="Ending Soon"
                        value="0"
                        bgColor="bg-yellow-500"
                    />
                </div>
            </div>
            <div className="bg-gray-900 shadow-lg rounded-lg p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Auctions List</h2>
                    <Button
                        variant="outline"
                        className="border-blue-500 text-blue-400 hover:bg-blue-800 hover:text-white"
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
