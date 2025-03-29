import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Clock,
    DollarSign,
    Tag,
    CalendarDays,
    Film,
    Info,
    Award,
    AlertCircle,
    Image as ImageIcon,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    Download,
} from "lucide-react";
import moment from "moment";
import AppLayout from "@/components/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BidModal from "@/components/user/modal/BidModal";

export default function ShowAuction() {
    const { auction, images, user } = usePage().props;
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [ isBidModalOpen, setIsBidModalOpen ] = useState(false);

    // Calculate time remaining if auction is active
    const calculateTimeRemaining = () => {
        if (auction.status !== "active") return null;

        const endTime = moment(auction.end_time);
        const now = moment();
        if (now > endTime) return "Ended";

        const duration = moment.duration(endTime.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();

        return `${days}d ${hours}h ${minutes}m remaining`;
    };

    const timeRemaining = calculateTimeRemaining();

    // Format currency with commas
    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Status badge styling
    const getStatusStyles = (status) => {
        switch (status) {
            case "active":
                return "bg-gradient-to-r from-green-600 to-green-500 text-white";
            case "pending":
                return "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white";
            case "completed":
                return "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
            default:
                return "bg-gradient-to-r from-red-600 to-red-500 text-white";
        }
    };

    // Image gallery navigation
    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setZoomLevel(1);
    };

    const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setZoomLevel(1);
    };

    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setImageModalOpen(true);
        setZoomLevel(1);
    };

    return (
        <div className="max-w-8xl mx-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 hover:bg-gray-800 text-gray-300"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Auctions
                </Button>

                <Badge
                    className={`px-4 py-1.5 ${getStatusStyles(
                        auction.status
                    )} uppercase tracking-wider text-xs font-semibold`}
                >
                    {auction.status}
                </Badge>
            </div>

            {/* Main Content Card */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl overflow-hidden">
                {/* Hero Section */}
                <div className="relative bg-gray-700/40 p-8 border-b border-gray-700">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        {auction.title}
                    </h1>
                    <div className="flex items-center space-x-2 mb-4">
                        {timeRemaining && (
                            <div className="flex items-center text-cyan-400 font-medium">
                                <Clock className="h-4 w-4 mr-1" />
                                {timeRemaining}
                            </div>
                        )}
                    </div>

                    {/* Bid Button (Only for Bidders) */}
                    {user?.role === "bidder" && (
                        <div className="mb-4">
                            <Button
                                onClick={() => setIsBidModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
                            >
                                Place a Bid
                            </Button>
                        </div>
                    )}

                    <BidModal
                        isOpen={isBidModalOpen}
                        onClose={() => setIsBidModalOpen(false)}
                        auction={auction}
                    />

                    <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                        <ImageIcon className="h-5 w-5 mr-2 text-blue-400" />
                        Auction Images
                    </h3>

                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-700 shadow-md"
                                    onClick={() => openImageModal(index)}
                                >
                                    <img
                                        src={img.image_path}
                                        alt={`Auction Image ${index + 1}`}
                                        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <AlertCircle className="h-6 w-6 text-yellow-400" />
                            <p className="text-gray-300">
                                No images available for this auction.
                            </p>
                        </div>
                    )}

                    <p className="text-gray-200 text-lg leading-relaxed mt-4">
                        {auction.description}
                    </p>
                </div>

                <CardContent className="p-0">
                    {/* Key Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6">
                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col">
                            <span className="text-gray-400 text-sm flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                                Starting Price
                            </span>
                            <p className="text-xl font-bold text-green-400 mt-1">
                                ${formatCurrency(auction.starting_price)}
                            </p>
                        </div>

                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col">
                            <span className="text-gray-400 text-sm flex items-center">
                                <Award className="h-4 w-4 mr-1 text-gray-500" />
                                Current Price
                            </span>
                            <p className="text-xl font-bold text-blue-400 mt-1">
                                ${formatCurrency(auction.current_price)}
                            </p>
                        </div>

                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col">
                            <span className="text-gray-400 text-sm flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
                                Start Time
                            </span>
                            <p className="text-sm font-medium text-white mt-1">
                                {moment(auction.start_time).format(
                                    "MMM D, YYYY h:mm A"
                                )}
                            </p>
                        </div>

                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col">
                            <span className="text-gray-400 text-sm flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
                                End Time
                            </span>
                            <p className="text-sm font-medium text-white mt-1">
                                {moment(auction.end_time).format(
                                    "MMM D, YYYY h:mm A"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Video Preview */}
                    <div className="px-6 pb-6">
                        <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                            <Film className="h-5 w-5 mr-2 text-blue-400" />
                            Auction Video
                        </h3>
                        {auction.video_path ? (
                            <div className="rounded-lg overflow-hidden border border-gray-700 shadow-md">
                                <video controls className="w-full max-w-full">
                                    <source
                                        src={auction.video_path}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg border border-gray-700">
                                <AlertCircle className="h-6 w-6 text-yellow-400" />
                                <p className="text-gray-300">
                                    No video available for this auction.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Image Modal/Lightbox */}
            {imageModalOpen && images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => setImageModalOpen(false)}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                            title="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="relative w-full max-w-5xl max-h-[80vh] flex items-center justify-center">
                        {/* Navigation buttons */}
                        <button
                            onClick={showPrevImage}
                            className="absolute left-2 p-2 rounded-full bg-gray-800/60 hover:bg-gray-700 text-white z-10"
                            title="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            <img
                                src={images[currentImageIndex].image_path}
                                alt={`Auction Image ${currentImageIndex + 1}`}
                                className="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                    cursor: zoomLevel > 1 ? "move" : "default",
                                }}
                            />
                        </div>

                        <button
                            onClick={showNextImage}
                            className="absolute right-2 p-2 rounded-full bg-gray-800/60 hover:bg-gray-700 text-white z-10"
                            title="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Thumbnail navigation */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <div className="bg-gray-800/70 rounded-lg p-2 flex space-x-2 overflow-x-auto max-w-[90vw]">
                            {images.map((img, index) => (
                                <div
                                    key={`thumb-${img.id}`}
                                    className={`w-16 h-16 flex-shrink-0 cursor-pointer rounded border-2 ${
                                        index === currentImageIndex
                                            ? "border-blue-400"
                                            : "border-transparent hover:border-gray-400"
                                    }`}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setZoomLevel(1);
                                    }}
                                >
                                    <img
                                        src={img.image_path}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image counter */}
                    <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                        <div className="bg-gray-800/70 rounded-full px-3 py-1 text-sm text-white">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

ShowAuction.layout = (page) => <AppLayout>{page}</AppLayout>;
