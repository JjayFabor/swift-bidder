import { useForm } from "@inertiajs/react";
import {useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "../../components/layouts/AuthLayout";
import DemoAccounts from "@/components/auth/DemoAccounts";
import { route } from 'ziggy-js';

export default function Login({ demoAccounts })  {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    const fillDemoAccount = (account) => {
        setData({ email: account.email, password: account.password });
    };

    return (
        <div className="w-full max-w-md bg-card text-card-foreground border p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
            <p className="text-muted-foreground text-center text-m">Enter your credentials</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={processing}>
                    {processing ? "Logging in..." : "Login"}
                </Button>
            </form>
            {errors.message && (
                <p className="text-red-500 text-sm mt-1 text-center">
                    Invalid login credentials. Please try again.
                </p>
            )}

            <div className="items-center justify-between mt-4">
                <p className="mt-3 text-center">Don't have an account? <a href={route('register')} className="hover:text-blue-300 hover:underline text-blue-400">Register Now</a></p>
            </div>

            <DemoAccounts accounts={demoAccounts} onFill={fillDemoAccount} />
        </div>
    );
};

// Automatically wrap with AuthLayout
Login.layout = (page) => <AuthLayout>{page}</AuthLayout>;

