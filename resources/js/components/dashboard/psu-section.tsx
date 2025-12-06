'use client';

import { Wrench } from 'lucide-react';
import { DonutChart } from './donut-chart';

const emptyData = [
    { name: 'Belum ada data', value: 1, color: '#e2e8f0' }, // color-muted
];

export function PSUSection({
    psuData,
    improvedPSUData,
}: {
    psuData?: { name: string; value: number; color: string }[];
    improvedPSUData?: { name: string; value: number; color: string }[];
}) {
    // If no real data, show "empty" chart with muted color
    const hasPsuData = psuData && psuData.some((d) => d.value > 0);
    const hasImprovedData =
        improvedPSUData && improvedPSUData.some((d) => d.value > 0);

    const displayPsuData = hasPsuData ? psuData : emptyData;
    const displayImprovedData = hasImprovedData ? improvedPSUData : emptyData;

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary">PSU</h2>
                    <div className="rounded-lg bg-accent p-3">
                        <Wrench className="h-5 w-5 text-secondary" />
                    </div>
                </div>
                <div className="relative">
                    <DonutChart data={displayPsuData as any} />
                    {!hasPsuData && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                                Belum ada data
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary">
                        Perbaikan PSU
                    </h2>
                    <div className="rounded-lg bg-accent p-3">
                        <Wrench className="h-5 w-5 text-secondary" />
                    </div>
                </div>
                <div className="relative">
                    <DonutChart data={displayImprovedData as any} />
                    {!hasImprovedData && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                                Belum ada data
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
