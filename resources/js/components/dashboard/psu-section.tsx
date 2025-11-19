'use client';

import { Wrench } from 'lucide-react';
import { DonutChart } from './donut-chart';

const psuData = [
    { name: 'Baik', value: 260, color: '#655B9C' },
    { name: 'Rusak Ringan', value: 0, color: '#FFAA22' },
    { name: 'Rusak Berat', value: 100, color: '#EF4C4C' },
];

const improvedPSUData = [
    { name: 'Baik', value: 260, color: '#655B9C' },
    { name: 'Rusak Ringan', value: 0, color: '#FFAA22' },
    { name: 'Rusak Berat', value: 100, color: '#EF4C4C' },
];

export function PSUSection() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary">PSU</h2>
                    <div className="rounded-lg bg-accent p-3">
                        <Wrench className="h-5 w-5 text-secondary" />
                    </div>
                </div>
                <DonutChart data={psuData} />
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
                <DonutChart data={improvedPSUData} />
            </div>
        </div>
    );
}
