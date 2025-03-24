import { useEffect, useState } from "react";

export default function TestPage() {
    const [message, setMessage] = useState("Waiting for broadcast...");

    useEffect(() => {
        window.Echo.channel("test-channel")
            .listen(".TestEvent", (event) => {
                console.log("Event received:", event);
                setMessage(event.message);
            });

        return () => {
            window.Echo.leaveChannel("test-channel");
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Pusher Test Page</h1>
            <p className="mt-4 p-4 bg-gray-100 border rounded text-black">{message}</p>
        </div>
    );
}

