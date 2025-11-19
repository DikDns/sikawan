'use client';

import { BarChart } from './bar-chart';

interface RegionCardProps {
    region: {
        name: string;
        houses: string;
    };
    data: Array<{
        label: string;
        value: number;
        color: string;
    }>;
}

export function RegionCard({ region, data }: RegionCardProps) {
    return (
        <div className="rounded-lg border border-border bg-card p-4 md:p-6">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-2">
                    <h3 className="text-lg font-semibold text-secondary">
                        {region.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {region.houses}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-10">
                    <BarChart data={data} />
                </div>
            </div>
        </div>
    );
}
