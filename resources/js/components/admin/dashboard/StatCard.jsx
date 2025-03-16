export default function StatCard ({ icon: Icon, title, value, bgColor }) {
    return (
        <div className="flex items-center p-5 rounded-lg shadow-lg bg-gray-800 h-24">
            <div className={`${bgColor} p-3 rounded-full mr-4 flex-shrink-0`}>
                <Icon className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-sm opacity-75">{title}</div>
                <div className="text-xl font-semibold mt-1">{value}</div>
            </div>
        </div>
    );
};
