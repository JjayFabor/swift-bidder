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

export default function BidModal({ isOpen, onClose, auction }) {
    const [bidAmount, setBidAmount] = useState("");
    const [bidError, setBidError] = useState("");
    const bidInputRef = useRef(null);

    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleBidSubmit = () => {
        const amount = parseFloat(bidAmount);

        if (!amount || isNaN(amount)) {
            setBidError("Please enter a valid amount");
            return;
        }

        if (amount <= parseFloat(auction.current_price)) {
            setBidError("Bid must be higher than current price");
            return;
        }

        console.log(`Submitting bid of $${amount}`);

        setBidError("");
        setBidAmount("");
        onClose(); // Close the modal after submitting
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
                            value={bidAmount}
                            onChange={(e) => {
                                setBidAmount(e.target.value);
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
                    <Button onClick={handleBidSubmit} className="bg-blue-600 hover:bg-blue-500 text-white">
                        Submit Bid
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
