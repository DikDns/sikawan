import { cn } from '@/lib/utils';
import { Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    // Theme switching is disabled - show a simple message instead
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800',
                className,
            )}
            {...props}
        >
            <Sun className="h-4 w-4" />
            <span>Light mode is enabled (theme switching disabled)</span>
        </div>
    );
}
