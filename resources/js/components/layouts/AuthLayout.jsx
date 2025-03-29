export default function AuthLayout({ children }) {
    return (
        <div className="h-screen bg-[#1E2A38] flex">
            {/* Left Section */}
            <div className="w-1/2 flex flex-col items-center justify-center text-white border-r border-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">SwiftBidder</h1>
                    <p className="text-lg mt-2">Real-time Auction System</p>
                </div>
            </div>

            {/* Right Section (Dynamic Content) */}
            <div className="w-1/2 flex items-center justify-center text-white">
                {children}
            </div>
        </div>
    );
}
