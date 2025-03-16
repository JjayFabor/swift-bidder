import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/components/Layouts/AppLayout';

export default function UserDashboard() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">User Dashboard</h1>
            </div>
        </div>
    );
}

UserDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
