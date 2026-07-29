import { useState } from 'react';
import { Check, Copy, UserRound } from 'lucide-react';

/**
 * Lists the seeded demo accounts on the login screen so a reviewer handed only a
 * URL can get in. Rendered only when the backend passes accounts through, which
 * it does exclusively while demo mode is enabled.
 */
export default function DemoAccounts({ accounts, onFill }) {
    const [copied, setCopied] = useState(null);

    if (!accounts?.length) return null;

    const copy = async (account) => {
        try {
            await navigator.clipboard.writeText(`${account.email} / ${account.password}`);
            setCopied(account.email);
            setTimeout(() => setCopied(null), 1500);
        } catch {
            // Clipboard is unavailable over plain HTTP and in some browsers —
            // filling the form is the primary action, so this is non-critical.
        }
    };

    return (
        <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-4">
            <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold">Demo accounts</h3>
                <span className="text-xs text-muted-foreground">click to fill</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
                Shared test data — anything you change here may be reset.
            </p>

            <ul className="mt-3 space-y-1.5">
                {accounts.map((account) => (
                    <li key={account.email}>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onFill(account)}
                                title={account.description}
                                className="group flex flex-1 items-center gap-2 rounded-md border bg-background px-2.5 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <UserRound className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                                <span className="w-16 shrink-0 text-xs font-medium">{account.label}</span>
                                <span className="truncate font-mono text-xs text-muted-foreground group-hover:text-foreground">
                                    {account.email}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => copy(account)}
                                aria-label={`Copy credentials for ${account.label}`}
                                className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                {copied === account.email
                                    ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
