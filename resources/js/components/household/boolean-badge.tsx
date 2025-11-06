import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface BooleanBadgeProps {
    value: boolean | null | undefined;
    trueLabel?: string;
    falseLabel?: string;
}

export default function BooleanBadge({
    value,
    trueLabel = 'Ya',
    falseLabel = 'Tidak',
}: BooleanBadgeProps) {
    return (
        <Badge
            variant={value ? 'default' : 'destructive'}
            className="gap-1 font-medium"
        >
            {value ? (
                <>
                    <Check className="h-3 w-3" />
                    {trueLabel}
                </>
            ) : (
                <>
                    <X className="h-3 w-3" />
                    {falseLabel}
                </>
            )}
        </Badge>
    );
}
