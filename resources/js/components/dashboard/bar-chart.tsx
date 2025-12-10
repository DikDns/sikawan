import { ChartContainer } from '@/components/ui/chart';
import {
    Bar,
    CartesianGrid,
    Cell,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface BarChartProps {
    data: Array<{
        label: string;
        value: number;
        color: string;
    }>;
}

interface TooltipPayload {
    name: string;
    value: number;
    payload: { name: string; value: number };
}

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: TooltipPayload[];
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {payload[0].payload.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export function BarChart({ data }: BarChartProps) {
    const chartData = data.map((item) => ({
        name: item.label,
        value: item.value,
        fill: item.color,
    }));

    const chartConfig = {
        value: {
            label: 'Value',
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    data={chartData}
                    layout="vertical"
                    // margin={{ top: 0, right: 30, left: 80, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                    <XAxis type="number" style={{ display: 'none' }} />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={75}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar
                        dataKey="value"
                        fill="currentColor"
                        radius={[0, 4, 4, 0]}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
