'use client';

import { ChartContainer } from '@/components/ui/chart';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface DonutChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {payload[0].name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export function DonutChart({ data }: DonutChartProps) {
    const chartConfig = data.reduce(
        (acc, item) => {
            acc[item.name] = {
                label: item.name,
                color: item.color,
            };
            return acc;
        },
        {} as Record<string, { label: string; color: string }>,
    );

    return (
        <div className="flex flex-col items-center gap-4">
            <ChartContainer
                config={chartConfig}
                className="flex h-48 w-full justify-center"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={70}
                            innerRadius={40}
                            paddingAngle={1}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
