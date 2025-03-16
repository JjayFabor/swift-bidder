import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <AppSidebar />
        <main className="flex-grow overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <div>{children}</div>
            <Toaster />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
