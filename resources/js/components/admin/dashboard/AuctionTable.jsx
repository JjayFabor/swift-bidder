import { usePage, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import moment from "moment";
import { toast } from 'sonner';
import { ExternalLink, Trash, Pencil } from "lucide-react";
import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import DeleteAuctionDialog from "@/components/admin/dashboard/DeleteAuctionDialog";
import PaginationControls from "@/components/admin/dashboard/PaginationControls";

export default function AuctionTable ({ dataAuctions, onDelete, links }) {

    const [deleteAuctionId, setDeleteAuctionId] = useState(null);

    // Show Auction
    const showAuction = (auctionId) => {
        router.get(route('admin.auction.show', auctionId), {
            onSuccess: () => {
                toast.success("Auction details retrieved successfully");
            },
            onError: (errors) => {
                toast.error("Error fetching auction details");
            }
        });
    }

    // Delete Auction
    const handleDelete = () => {
        if (!deleteAuctionId) return;

        router.delete(route('admin.auction.delete', deleteAuctionId), {
            onSuccess: () => {
                toast.success("Auction deleted successfully");
            },
            onError: (errors) => {
                toast.error("Error deleting auction");
            }
        });

        setDeleteAuctionId(null);
    };


    const truncateText = (text, maxLength=20) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
            <Table className="w-full">
                <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800/50">
                        <TableHead className="text-gray-300 font-medium">
                            Title
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium">
                            Description
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-right">
                            Starting Price
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-right">
                            Current Price
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium">
                            Start Date
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium">
                            End Date
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium">
                            Status
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-center">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataAuctions.map((auction) => (
                        <TableRow
                            key={auction.id}
                            className="border-b border-gray-700 hover:bg-gray-800/50"
                        >
                            <TableCell className="font-medium">
                                {auction.title}
                            </TableCell>
                            <TableCell className="max-w-xs">
                                <span title={auction.description}>
                                    {truncateText(auction.description)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                $
                                {parseFloat(
                                    auction.starting_price
                                ).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </TableCell>
                            <TableCell className="text-right">
                                $
                                {parseFloat(
                                    auction.current_price
                                ).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </TableCell>
                            <TableCell>
                                {moment(auction.start_time).format(
                                    "MMM D, YYYY h:mm A"
                                )}
                            </TableCell>
                            <TableCell>
                                {moment(auction.end_time).format(
                                    "MMM D, YYYY h:mm A"
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        auction.status === "active"
                                            ? "bg-green-900 text-green-300"
                                            : auction.status === "pending"
                                            ? "bg-yellow-900 text-yellow-300"
                                            : auction.status === "completed"
                                            ? "bg-blue-900 text-blue-300"
                                            : "bg-red-900 text-red-300"
                                    }`}
                                >
                                    {auction.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    onClick={() => showAuction(auction.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="group hover:bg-blue-900 hover:text-blue-300"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1 text-blue-500 group-hover:text-white transition-colors" />
                                    View
                                </Button>
                                <Button
                                    onClick={() => showAuction(auction.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="group hover:bg-blue-900 hover:text-blue-300"
                                >
                                    <Pencil className="h-4 w-4 mr-1 text-blue-500 group-hover:text-white transition-colors" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() =>
                                        setDeleteAuctionId(auction.id)
                                    }
                                    size="sm"
                                    variant="ghost"
                                    className="group hover:bg-red-900 hover:text-white-300"
                                >
                                    <Trash className="h-4 w-4 mr-1 text-red-500 group-hover:text-white transition-colors" />
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {deleteAuctionId && (
                        <DeleteAuctionDialog
                            isOpen={!!deleteAuctionId}
                            onClose={() => setDeleteAuctionId(null)}
                            onConfirm={handleDelete}
                            title={dataAuctions.find(auction => auction.id === deleteAuctionId)?.title}
                        />
                    )}
                </TableBody>
            </Table>
            <PaginationControls links={links}/>
        </div>
    );
};
