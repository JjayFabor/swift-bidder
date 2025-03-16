import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { route } from 'ziggy-js';

export default function UserDashboard() {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Hello, world!</h1>
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}


