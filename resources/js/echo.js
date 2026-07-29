import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Pusher throws on construction when no app key is supplied. Because this module is
// imported from app.jsx, that would take the entire React app down with a blank page
// rather than merely disabling real-time updates. Broadcasting is optional here — no
// controller currently broadcasts — so skip setup when the key is absent.
const key = import.meta.env.VITE_PUSHER_APP_KEY;

if (key) {
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key,
        cluster,
        wsHost: import.meta.env.VITE_PUSHER_HOST || `ws-${cluster}.pusher.com`,
        wsPort: import.meta.env.VITE_PUSHER_PORT || 80,
        wssPort: import.meta.env.VITE_PUSHER_PORT || 443,
        forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
        enabledTransports: ['ws', 'wss'],
    });
} else if (import.meta.env.DEV) {
    console.info('[echo] VITE_PUSHER_APP_KEY not set — real-time updates are disabled.');
}
