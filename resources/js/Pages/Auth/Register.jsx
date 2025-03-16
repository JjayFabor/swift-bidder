import { useForm } from "@inertiajs/react";
import {useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "../../components/layouts/AuthLayout";
import { route } from 'ziggy-js';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <div className="w-full max-w-md bg-[#273747] p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-semibold text-center">Register</h2>
            <p className="text-gray-400 text-center text-sm">Create your account</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">Name</label>
                    <Input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={processing}>
                    {processing ? "Creating account..." : "Register"}
                </Button>
            </form>
            {errors.message && (
                <p className="text-red-500 text-sm mt-1 text-center">
                    {errors.message}
                </p>
            )}

            <p className="mt-3 text-center">Already have an account? <a href={route('login')} className="hover:text-blue-300 hover:underline text-blue-400">Login</a></p>
        </div>
    );
};

// Automatically wrap with AuthLayout
Register.layout = (page) => <AuthLayout>{page}</AuthLayout>;

