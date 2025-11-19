'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const analysisData = [
    { year: '2014', rumah: 45, rlh: 35, rtuh: 40, rumahBaru: 30 },
    { year: '2015', rumah: 50, rlh: 38, rtuh: 42, rumahBaru: 32 },
    { year: '2016', rumah: 48, rlh: 40, rtuh: 45, rumahBaru: 35 },
    { year: '2017', rumah: 55, rlh: 42, rtuh: 48, rumahBaru: 38 },
    { year: '2018', rumah: 60, rlh: 45, rtuh: 50, rumahBaru: 40 },
    { year: '2019', rumah: 65, rlh: 48, rtuh: 55, rumahBaru: 42 },
    { year: '2020', rumah: 70, rlh: 50, rtuh: 60, rumahBaru: 45 },
    { year: '2021', rumah: 75, rlh: 52, rtuh: 65, rumahBaru: 48 },
    { year: '2022', rumah: 80, rlh: 55, rtuh: 70, rumahBaru: 50 },
    { year: '2023', rumah: 85, rlh: 58, rtuh: 75, rumahBaru: 52 },
    { year: '2024', rumah: 90, rlh: 60, rtuh: 80, rumahBaru: 55 },
    { year: '2025', rumah: 95, rlh: 62, rtuh: 85, rumahBaru: 58 },
];

export function AnalysisChart() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Analisis Rumah</CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                    Pertahun
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        data={analysisData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="rumah"
                            stroke="#3b82f6"
                            name="Rumah"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="rlh"
                            stroke="#10b981"
                            name="RLH"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="rtuh"
                            stroke="#ef4444"
                            name="RTLH"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="rumahBaru"
                            stroke="#8b5cf6"
                            name="Butuh Rumah Baru"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
