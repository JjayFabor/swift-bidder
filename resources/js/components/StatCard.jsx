import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Tailwind can't resolve dynamically-built class names, so every tone is spelled
// out in full. Base classes are the light palette; `dark:` keeps the original
// dark treatment.
const TONES = {
    blue: {
        surface: "from-blue-50 to-blue-100/40 border-blue-200 dark:from-blue-900/40 dark:to-blue-800/20 dark:border-blue-800/50",
        icon: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    purple: {
        surface: "from-purple-50 to-purple-100/40 border-purple-200 dark:from-purple-900/40 dark:to-purple-800/20 dark:border-purple-800/50",
        icon: "text-purple-600 dark:text-purple-400",
        iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    },
    green: {
        surface: "from-green-50 to-green-100/40 border-green-200 dark:from-green-900/40 dark:to-green-800/20 dark:border-green-800/50",
        icon: "text-green-600 dark:text-green-400",
        iconBg: "bg-green-500/10 dark:bg-green-500/20",
    },
    amber: {
        surface: "from-amber-50 to-amber-100/40 border-amber-200 dark:from-amber-900/40 dark:to-amber-800/20 dark:border-amber-800/50",
        icon: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
};

export default function StatCard({ icon: Icon, title, value, tone = "blue" }) {
    const palette = TONES[tone] ?? TONES.blue;

    return (
        <Card className={cn("bg-gradient-to-br p-4", palette.surface)}>
            <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                    <p className="text-muted-foreground text-sm truncate">{title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                        {value}
                    </p>
                </div>
                <div className={cn("p-2 rounded-md shrink-0", palette.iconBg)}>
                    <Icon className={cn("w-5 h-5", palette.icon)} />
                </div>
            </div>
        </Card>
    );
}
