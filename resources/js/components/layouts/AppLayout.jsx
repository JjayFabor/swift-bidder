import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Clock from "../Clock";
import { Bell } from 'lucide-react';

export default function AppLayout({ children }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
                <AppSidebar />
                <main className="flex-grow overflow-auto">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4 bg-card text-card-foreground border rounded-lg p-2 shadow-sm">
                            <div className="flex items-center">
                                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <ThemeToggle />
                                <Sheet>
                                    <SheetTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Bell className="h-5 w-5 cursor-pointer" />
                                    </SheetTrigger>
                                    <SheetContent side="right">
                                        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
                                        <p className="text-sm text-muted-foreground">No new notifications</p>
                                        {/* Add dynamic notifications here */}
                                    </SheetContent>
                                </Sheet>

                                <Clock />
                            </div>
                        </div>
                        <Separator />
                        <div>{children}</div>
                        <Toaster />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
