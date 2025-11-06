import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-secondary',
    iconBgColor = 'bg-secondary/25',
}: StatsCardProps) {
    return (
        <Card className="border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex items-center justify-between pb-0">
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium text-foreground">
                        {title}
                    </div>
                    <div className="text-3xl font-bold text-secondary">
                        {typeof value === 'number'
                            ? value.toLocaleString('id-ID')
                            : value}
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div
                        className={`flex items-center justify-center rounded ${iconBgColor} p-4`}
                    >
                        <Icon className={`h-10 w-10 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
