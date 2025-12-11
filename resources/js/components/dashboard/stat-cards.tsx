import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { AlertCircle, Building2, Hammer, Home, Plus } from 'lucide-react';

import { LucideIcon } from 'lucide-react';

type StatItem = { label: string; value: number | string; href?: string };
type ExtendedStatItem = StatItem & {
    icon?: LucideIcon;
    bgColor?: string;
    iconColor?: string;
};

type ProcessedStat = {
    label: string;
    value: number | string;
    href?: string;
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
};

export function StatCards({
    data,
    columns = 4,
}: {
    data?: ExtendedStatItem[];
    columns?: number;
}) {
    const stats: ProcessedStat[] = (data && data.length > 0 ? data : []).map(
        (s) => {
            const mapIcon = (label: string): LucideIcon => {
                if (label === 'Rumah') return Home;
                if (label === 'RLH' || label === 'Backlog Kelayakan')
                    return Building2;
                if (label === 'RTLH') return Hammer;
                if (label === 'Backlog Kepemilikan') return AlertCircle;
                return Plus;
            };
            const icon = s.icon ?? mapIcon(s.label);
            const bgColor = s.bgColor ?? 'bg-blue-100 dark:bg-blue-900';
            const iconColor = s.iconColor ?? 'text-blue-600 dark:text-blue-400';
            const href = s.href;
            return { ...s, icon, bgColor, iconColor, href };
        },
    );

    // Allow custom columns, default to 4 for backward compatibility
    const gridCols = {
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4',
        5: 'lg:grid-cols-5',
    };

    if (stats.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground">
                Belum ada data statistik.
            </div>
        );
    }
    return (
        <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridCols[columns as keyof typeof gridCols] || 'lg:grid-cols-4'}`}
        >
            {stats.map((stat) => {
                const Icon = stat.icon;
                const CardComponent = (
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`${stat.bgColor} rounded-lg p-3`}
                                >
                                    <Icon
                                        className={`h-6 w-6 ${stat.iconColor}`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

                if (stat.href) {
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="block h-full"
                        >
                            {CardComponent}
                        </Link>
                    );
                }

                return (
                    <div key={stat.label} className="h-full">
                        {CardComponent}
                    </div>
                );
            })}
        </div>
    );
}
