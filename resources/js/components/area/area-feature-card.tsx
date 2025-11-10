import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface AreaFeatureCardProps {
    id: number;
    name: string;
    description?: string | null;
    householdCount: number;
    familyCount: number;
    isVisible: boolean;
    onClick?: () => void;
    className?: string;
}

export function AreaFeatureCard({
    name,
    description,
    householdCount,
    familyCount,
    isVisible,
    onClick,
    className,
}: AreaFeatureCardProps) {
    return (
        <Card
            className={cn(
                'cursor-pointer transition-colors hover:bg-accent',
                className,
            )}
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            {name}
                            {isVisible ? (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                        </CardTitle>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="text-xs">
                        {householdCount.toLocaleString()} Rumah
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {familyCount.toLocaleString()} Keluarga
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
