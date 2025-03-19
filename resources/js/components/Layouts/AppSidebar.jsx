import { Home, Settings, LogOut, ChevronLeft, ChevronRight, User } from "lucide-react";
import { route } from 'ziggy-js';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

export function AppSidebar() {
    const { post } = useForm();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = usePage().props;

    const handleLogout = () => {
        post(route('logout'));
    };

    const items = [
        {
        title: "Home",
        url: auth.user.role === 'admin' ? route('admin.dashboard') : route('user.dashboard'),
        icon: Home,
        },
    ];

    const handleClick = (item) => {
        if (item.action) {
            item.action();
        } else if (item.url) {
            window.location.href = item.url;
        }
    };

    return (
        <Sidebar className="bg-[#1E2A38] text-white flex h-screen flex-cols">
            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-2xl font-bold mb-8 mt-4 px-4">
                        Swift Bidder
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => handleClick(item)}
                                        className="hover:bg-[#273747] px-4 py-2 rounded-md"
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer with User Profile */}
            <div className="mt-2 p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center justify-between w-full p-2 rounded-md hover:bg-[#273747] transition-colors">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                    {auth?.user?.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-medium">{auth?.user?.name || "User"}</span>
                                    <span className="text-xs text-gray-400">{auth?.user?.email || "user@example.com"}</span>
                                </div>
                            </div>
                            <ChevronRight className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#273747] text-white border-[#32455A]">
                        <DropdownMenuItem
                            className="hover:bg-[#32455A] cursor-pointer"
                            onClick={() => window.location.href = route('profile.edit')}
                        >
                            <User className="h-4 w-4 mr-2" />
                            My Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="hover:bg-[#32455A] cursor-pointer"
                            onClick={() => window.location.href = route('settings')}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#32455A]" />
                        <DropdownMenuItem
                            className="text-red-400 hover:bg-red-900 hover:bg-opacity-20 cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Sidebar>
    );
}
