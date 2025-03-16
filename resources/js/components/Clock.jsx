import { useEffect, useState } from "react";

export default function Clock() {
    const [currentDateTime, setCurrentDateTime] = useState({
        date: new Date().toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentDateTime({
                date: now.toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
                time: now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-right">
            <div className="text-lg font-semibold">{currentDateTime.date} {currentDateTime.time}</div>
        </div>
    );
}
