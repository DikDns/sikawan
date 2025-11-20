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

const fallbackChartData = [
    { name: 'Belum Dioperasikan', value: 280, fill: '#ef4444' },
    { name: 'Sedang Dioperasikan', value: 0, fill: '#fbbf24' },
    { name: 'Selesai', value: 100, fill: '#10b981' },
];

export function ChartSection({ rtlhData, rumahBaruData }: { rtlhData?: { name: string; value: number; fill: string }[]; rumahBaruData?: { name: string; value: number; fill: string }[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Perolehan RTUH */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            Perolehan RTLH
                        </CardTitle>
                        <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                360
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={(rtlhData && rtlhData.length > 0 ? rtlhData : fallbackChartData) as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {(rtlhData && rtlhData.length > 0 ? rtlhData : fallbackChartData).map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pembangunan Rumah Baru */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            Pembangunan Rumah Baru
                        </CardTitle>
                        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                360
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={(rumahBaruData && rumahBaruData.length > 0 ? rumahBaruData : [
                                    {
                                        name: 'Butuh Dibangun',
                                        value: 280,
                                        fill: '#6366f1',
                                    },
                                    {
                                        name: 'Sedang Dibangun',
                                        value: 0,
                                        fill: '#fbbf24',
                                    },
                                    {
                                        name: 'Selesai',
                                        value: 100,
                                        fill: '#10b981',
                                    },
                                ]) as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {(
                                    rumahBaruData && rumahBaruData.length > 0
                                        ? rumahBaruData
                                        : [
                                              { fill: '#6366f1' },
                                              { fill: '#fbbf24' },
                                              { fill: '#10b981' },
                                          ]
                                ).map((entry: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
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
