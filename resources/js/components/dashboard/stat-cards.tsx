import { Card, CardContent } from '@/components/ui/card';
import { Building2, Hammer, Home, Plus } from 'lucide-react';

const fallbackStats = [
    {
        label: 'Rumah',
        value: '40,689',
        icon: Home,
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        label: 'RLH',
        value: '40,689',
        icon: Building2,
        bgColor: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-600 dark:text-green-400',
    },
    {
        label: 'RTLH',
        value: '40,689',
        icon: Hammer,
        bgColor: 'bg-red-100 dark:bg-red-900',
        iconColor: 'text-red-600 dark:text-red-400',
    },
    {
        label: 'Butuh Rumah Baru',
        value: '40,689',
        icon: Plus,
        bgColor: 'bg-purple-100 dark:bg-purple-900',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
];

type StatItem = { label: string; value: number | string };

export function StatCards({ data }: { data?: StatItem[] }) {
    const stats = (data && data.length > 0 ? data : fallbackStats).map((s) => {
        const mapIcon = (label: string) => {
            if (label === 'Rumah') return Home;
            if (label === 'RLH') return Building2;
            if (label === 'RTLH') return Hammer;
            return Plus;
        };
        const icon = 'icon' in s ? (s as any).icon : mapIcon((s as any).label);
        const bgColor = 'bgColor' in s ? (s as any).bgColor : 'bg-blue-100 dark:bg-blue-900';
        const iconColor = 'iconColor' in s ? (s as any).iconColor : 'text-blue-600 dark:text-blue-400';
        return { ...s, icon, bgColor, iconColor } as any;
    });
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.label} className="overflow-hidden">
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
            })}
        </div>
    );
}
