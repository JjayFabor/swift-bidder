import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { DateTimePicker } from "@/components/forms/DateTimePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { CheckCircle, CircleX } from "lucide-react";

export default function AddAuctionModal ({ title, isOpen, onClose, auctions}) {

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        starting_price: '',
        start_time: '',
        end_time: '',
        status: '',
        video_path: null,
        images: [],
    })

    function submit(e) {
        e.preventDefault()

        const formData = new FormData();

        // Append text fields
        Object.keys(data).forEach((key) => {
            if (key !== 'images' && key !== 'video_path') {
                formData.append(key, data[key]);
            }
        });

        // Append multiple images
        if (data.images.length > 0) {
            data.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
        }

        // Append video
        if (data.video_path) {
            formData.append('video_path', data.video_path);
        }

        post(route('admin.auction.store'), {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success("Auction Created Successfully!", {
                    description: "Your auction has been added.",
                    icon: <CheckCircle className="text-green-500 w-6 h-6 p-2" />,
                });
            },
            onError: (errors) => {
                console.log("Inertia Validation Errors:", errors);

                if (errors) {
                    Object.entries(errors).forEach(([field, message]) => {
                        console.log(`Field: ${field}, Message: ${message}`);
                    });
                }

                toast.error("Failed to create auction!", {
                    description: "Please check the form fields for errors.",
                    icon: <CircleX className="text-red-500 w-6 h-6 p-2" />,
                });
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent description="Enter auction details below" className="max-w-3xl w-full">
            <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <div id="modal-description" className="p-4">
            <p>Enter auction details here...</p>
            </div>
            <Form onSubmit={submit}>
                <FormItem>
                    <label htmlFor="title" className="block text-sm font-medium">
                        Title
                    </label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter auction title"
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </FormItem>
                <FormItem>
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description
                    </label>
                    <Textarea
                        id="description"
                        name="description"
                        type="text"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Enter auction description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </FormItem>
                <FormItem>
                    <label htmlFor="images" className="block text-sm font-medium">
                        Images
                    </label>
                    <div className="relative flex flex-col gap-4">
                        <Input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            className="file:mr-4 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-800 file:text-white file:hover:bg-gray-700"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setData('images', files);
                            }}
                        />
                    </div>
                    {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                </FormItem>
                <FormItem>
                    <label htmlFor="video_path" className="block text-sm font-medium">
                        Video
                    </label>
                    <div className="relative flex flex-col gap-4">
                        <Input
                            id="video_path"
                            name="video_path"
                            type="file"
                            accept="video/mp4,video/x-m4v,video/*"
                            className="file:mr-4 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-800 file:text-white file:hover:bg-gray-700"
                            onChange={(e) => setData('video_path', e.target.files[0])}
                        />
                    </div>
                    {errors.video_path && <p className="text-red-500 text-sm mt-1">{errors.video_path}</p>}
                </FormItem>
                <FormItem>
                    <label htmlFor="starting_price" className="block text-sm font-medium">
                        Starting Price
                    </label>
                    <Input
                        id="starting_price"
                        name="starting_price"
                        type="number"
                        value={data.starting_price}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' ||  parseFloat(value) >= 0){
                                setData('starting_price', value)
                            }
                        }}
                        placeholder="Enter auction starting price"
                    />
                    {errors.starting_price && <p className="text-red-500 text-sm mt-1">{errors.starting_price}</p>}
                </FormItem>
                <div className="flex gap-4">
                    <FormItem className="w-1/2">
                        <label htmlFor="start_time" className="block text-sm font-medium">
                            Start Time
                        </label>
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
                        <label htmlFor="end_time" className="block text-sm font-medium">
                            End Time
                        </label>
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
                    <label htmlFor="status" className="block text-sm font-medium">
                        Status
                    </label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData("status", value)}
                    >
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
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-600 text-white hover:bg-blue-900"
                        onClick={submit}
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save Auction'}
                    </Button>
            </DialogFooter>
            </Form>
        </DialogContent>
        </Dialog>
    );
};
