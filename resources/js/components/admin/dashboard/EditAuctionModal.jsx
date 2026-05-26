import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { DateTimePicker } from "@/components/forms/DateTimePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle, CircleX } from "lucide-react";
import { useEffect } from "react";

export default function EditAuctionModal({ isOpen, onClose, auction }) {
    const { data, setData, put, processing, reset, errors, setDefaults } = useForm({
        title: auction?.title ?? "",
        description: auction?.description ?? "",
        starting_price: auction?.starting_price ?? "",
        start_time: auction?.start_time ?? "",
        end_time: auction?.end_time ?? "",
        status: auction?.status ?? "pending",
    });

    useEffect(() => {
        if (!auction) return;
        setDefaults({
            title: auction.title ?? "",
            description: auction.description ?? "",
            starting_price: auction.starting_price ?? "",
            start_time: auction.start_time ?? "",
            end_time: auction.end_time ?? "",
            status: auction.status ?? "pending",
        });
        reset();
    }, [auction?.id]);

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.auction.update", auction.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success("Auction updated", {
                    description: `${data.title} has been updated.`,
                    icon: <CheckCircle className="text-green-500 w-6 h-6 p-2" />,
                });
            },
            onError: () => {
                toast.error("Failed to update auction", {
                    description: "Auctions with bids cannot be edited. Check the form for details.",
                    icon: <CircleX className="text-red-500 w-6 h-6 p-2" />,
                });
            },
        });
    };

    if (!auction) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent description="Update auction details below" className="max-w-3xl w-full">
                <DialogHeader>
                    <DialogTitle>Edit Auction</DialogTitle>
                </DialogHeader>

                <Form onSubmit={submit}>
                    <FormItem>
                        <label htmlFor="title" className="block text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </FormItem>

                    <FormItem>
                        <label htmlFor="description" className="block text-sm font-medium">Description</label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </FormItem>

                    <FormItem>
                        <label htmlFor="starting_price" className="block text-sm font-medium">Starting Price</label>
                        <Input
                            id="starting_price"
                            name="starting_price"
                            type="number"
                            value={data.starting_price}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || parseFloat(value) >= 0) {
                                    setData("starting_price", value);
                                }
                            }}
                        />
                        {errors.starting_price && <p className="text-red-500 text-sm mt-1">{errors.starting_price}</p>}
                    </FormItem>

                    <div className="flex gap-4">
                        <FormItem className="w-1/2">
                            <label htmlFor="start_time" className="block text-sm font-medium">Start Time</label>
                            <DateTimePicker
                                value={data.start_time}
                                onChange={(value) => {
                                    setData("start_time", value);
                                    document.activeElement?.blur();
                                }}
                            />
                            {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                        </FormItem>

                        <FormItem className="w-1/2">
                            <label htmlFor="end_time" className="block text-sm font-medium">End Time</label>
                            <DateTimePicker
                                value={data.end_time}
                                onChange={(value) => {
                                    setData("end_time", value);
                                    document.activeElement?.blur();
                                }}
                            />
                            {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                        </FormItem>
                    </div>

                    <FormItem>
                        <label htmlFor="status" className="block text-sm font-medium">Status</label>
                        <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={data.status || "Select status"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </FormItem>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-900"
                            onClick={submit}
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
