import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';

export interface AreaFeatureCardProps {
    id: number;
    name: string;
    description?: string | null;
    provinceName?: string | null;
    regencyName?: string | null;
    districtName?: string | null;
    villageName?: string | null;
    onClick?: () => void;
    onEdit?: () => void;
    className?: string;
}

export function AreaFeatureCard({
    name,
    description,
    provinceName,
    regencyName,
    districtName,
    villageName,
    onClick,
    onEdit,
    className,
}: AreaFeatureCardProps) {
    const locationParts = [
        villageName,
        districtName,
        regencyName,
        provinceName,
    ].filter(Boolean);

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
                        <CardTitle className="text-base">{name}</CardTitle>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                        {locationParts.length > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {locationParts.join(', ')}
                            </p>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.();
                                }}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
        </Card>
    );
}
