import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useForm } from "@inertiajs/react";
import { CheckCircle, CircleX } from "lucide-react";
import { route } from "ziggy-js";

export default function BidModal({ isOpen, onClose, auction, setAuction, user }) {
    const bidInputRef = useRef(null);
    const [bidError, setBidError] = useState("");

    const { data, setData, post, processing, reset } = useForm({
        auction_id: auction.id,
        user_id: user.id,
        bid_amount: "",
    });

    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleBidSubmit = (e) => {
        e.preventDefault();

        post(route("auction.bid", { id: auction.id }), {
            preserveScroll: true,
            onSuccess: (page) => {
                reset();
                onClose();

                if (setAuction) {
                    setAuction(page.props.auction);
                }

                toast.success("Bid placed successfully!", {
                    description: `You bid $${data.bid_amount} on ${auction.title}`,
                    icon: <CheckCircle className="text-green-500 w-6 h-6 p-2" />,
                });
            },
            onError: (errors) => {
                setBidError(errors.bid_amount || "Failed to place bid");
                toast.error("Bid failed!", {
                    description: "Please check the bid amount and try again.",
                    icon: <CircleX className="text-red-500 w-6 h-6 p-2" />,
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 border border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Place Your Bid
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-sm">Current Price</p>
                            <p className="text-lg font-bold text-blue-400">
                                ${formatCurrency(auction.current_price)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Minimum Bid</p>
                            <p className="text-lg font-bold text-green-400">
                                ${formatCurrency(parseFloat(auction.current_price) + 1)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="bidAmount" className="text-white">Your Bid Amount ($)</Label>
                        <Input
                            id="bidAmount"
                            ref={bidInputRef}
                            type="number"
                            step="0.01"
                            min={parseFloat(auction.current_price) + 1}
                            value={data.bid_amount}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("bid_amount", value === "" ? "" : parseFloat(value));
                                setBidError("");
                            }}
                            className="bg-gray-700 border-gray-600 text-white mt-1"
                            placeholder="Enter bid amount"
                            autoFocus
                        />
                        {bidError && <p className="text-red-400 text-sm mt-1">{bidError}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBidSubmit}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                        disabled={processing}
                    >
                        {processing ? "Submitting..." : "Submit Bid"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
