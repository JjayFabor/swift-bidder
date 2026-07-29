export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
            {/* Left Section */}
            <div className="md:w-1/2 flex flex-col items-center justify-center py-10 md:py-0 bg-[#1E2A38] text-white md:border-r border-b md:border-b-0 border-white/10">
                <div className="text-center px-6">
                    <h1 className="text-4xl font-bold">SwiftBidder</h1>
                    <p className="text-lg mt-2 text-white/80">Real-time Auction System</p>
                </div>
            </div>

            {/* Right Section (Dynamic Content) */}
            <div className="md:w-1/2 flex items-center justify-center p-6">
                {children}
            </div>
        </div>
    );
}
