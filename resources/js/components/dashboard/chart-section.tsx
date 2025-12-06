'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const emptyChartData = [{ name: 'Belum ada data', value: 1, fill: '#e2e8f0' }];

interface ChartSectionProps {
    rtlhData?: { name: string; value: number; fill: string }[];
    rtlhTotal: number;
}

export function ChartSection({ rtlhData, rtlhTotal }: ChartSectionProps) {
    const hasRtlhData = rtlhData && rtlhData.some((d) => d.value > 0);
    const displayRtlhData = hasRtlhData ? rtlhData : emptyChartData;

    return (
        <div className="w-full">
            {/* Perolehan RTLH */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            Perolehan RTLH
                        </CardTitle>
                        <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {rtlhTotal}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={displayRtlhData as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {displayRtlhData!.map(
                                    (entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                        />
                                    ),
                                )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
