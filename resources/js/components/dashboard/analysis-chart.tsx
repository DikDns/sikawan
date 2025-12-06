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

export function AnalysisChart({ data }: { data?: any[] }) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Analisis Rumah</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
                        Belum ada data analisis tahunan.
                    </div>
                </CardContent>
            </Card>
        );
    }

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
                        data={data}
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
