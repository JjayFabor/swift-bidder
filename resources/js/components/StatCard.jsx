import { Card } from "@/components/ui/card";

export default function StatCard({ icon: Icon, iconColor, iconBgColor, title, value, bgColor, borderColor }) {
    return (
        <>
            <Card
                className={`bg-gradient-to-br ${bgColor} ${borderColor} p-4`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">{title}</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {value}
                        </p>
                    </div>
                    <div className={`${iconBgColor} p-2 rounded-md`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
            </Card>
        </>
    );
}
