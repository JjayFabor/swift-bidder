import { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

export default function OTPVerification({ errorMessage }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ token: "" });
    const [countdown, setCountdown] = useState(180); // 3 minutes
    const [resendDisabled, setResendDisabled] = useState(true);

    useEffect(() => {
        if (flash.error) {
            toast.error("Error", {
                description: flash.error,
                style: {
                    backgroundColor: "#FEE2E2",
                    color: "#B91C1C",
                    border: "1px solid #F87171",
                },
                icon: <AlertCircle className="h-5 w-5 text-red-600" />,
            });
        }
        if (flash.success) {
            toast.success("Success", {
                description: flash.success,
                style: {
                    backgroundColor: "#ECFDF5",
                    color: "#065F46",
                    border: "1px solid #34D399",
                },
            });
        }
    }, [flash.error, flash.success]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("otp.verify"));
    };

    const handleResend = (e) => {
        e.preventDefault();
        setResendDisabled(true);
        setCountdown(180);
        post(route("resend.otp"));
    };

    return (
        // Outer container with flexbox to center the card
        <div className="min-h-screen flex items-center justify-center p-4">
            <Toaster position="top-center" />

            {/* Card container */}
            <div className="w-full max-w-md bg-[#273747] p-6 rounded-lg shadow-lg text-white">
                <h2 className="text-2xl font-bold text-center">
                    OTP Verification
                </h2>
                <p className="text-gray-400 text-center text-sm">
                    Enter the OTP sent to your email address.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label
                            htmlFor="token"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Enter 6-digit OTP
                        </label>
                        <div className="flex justify-center mt-2">
                            <InputOTP
                                value={data.token}
                                onChange={(value) => setData("token", value)}
                                maxLength={6}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        {errors.token && (
                            <p className="text-red-500 text-sm mt-1 text-center">
                                {errors.token}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={processing}
                    >
                        {processing ? "Verifying..." : "Verify OTP"}
                    </Button>
                </form>

                <div className="mt-2 text-center">
                    {countdown > 0 ? (
                        <p className="text-black-400 text-sm">
                            Resend available in {Math.floor(countdown / 60)}:
                            {String(countdown % 60).padStart(2, "0")}
                        </p>
                    ) : (
                        <Button
                            onClick={handleResend}
                            className="w-full bg-white text-black hover:bg-yellow-500"
                        >
                            Resend OTP
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
