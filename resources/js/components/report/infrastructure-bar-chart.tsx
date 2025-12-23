'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { forwardRef, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

dayjs.locale('id');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;

    return (
        <div className="rounded bg-white p-2 text-sm shadow">
            <div className="font-semibold">{item.name}</div>
            <div>Jumlah: {item.count}</div>
            <div>
                Tipe:{' '}
                <span
                    className={
                        item.type === 'Polyline'
                            ? 'text-purple-600'
                            : 'text-green-600'
                    }
                >
                    {item.type === 'Polyline' ? 'Polyline' : 'Marker'}
                </span>
            </div>
            <div>Kategori: {item.category}</div>
        </div>
    );
}

interface InfrastructureItem {
    name?: string | null;
    infrastructure_count?: number;
    type?: string;
    category?: string | null;
    created_at?: string | null;
}

const InfrastructureBarChart = forwardRef<
    HTMLDivElement,
    { infrastructures: InfrastructureItem[] }
>(function InfrastructureBarChart({ infrastructures }, ref) {
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const today = dayjs();

    const filteredData = infrastructures.filter((item) => {
        if (!item.created_at) return true; // Keep if no date and no filter? Or just use date
        const date = dayjs(item.created_at);

        if (startDate && date.isBefore(startDate, 'day')) return false;
        if (endDate && date.isAfter(endDate, 'day')) return false;

        return true;
    });

    const chartData = filteredData.map((item) => ({
        name: item.name || 'Unknown',
        count: item.infrastructure_count ?? 0,
        type: item.type || 'Unknown',
        category: item.category || 'Unknown',
    }));

    const totalPSU = filteredData.reduce(
        (sum, i) => sum + (i.infrastructure_count ?? 0),
        0,
    );

    return (
        <Card ref={ref}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Jumlah PSU</CardTitle>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-semibold">{totalPSU}</span>
                </div>
            </CardHeader>
            {/* date filter */}
            <div className="flex gap-3 px-6 pb-2">
                <input
                    type="date"
                    value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    max={today.format('YYYY-MM-DD')}
                    onChange={(e) => {
                        const v = e.target.value ? dayjs(e.target.value) : null;
                        if (v && endDate && v.isAfter(endDate)) return;
                        setStartDate(v);
                    }}
                    className="rounded border px-2 py-1 text-sm"
                />
                <div className="mt-1">-</div>
                <input
                    type="date"
                    value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                    min={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    max={today.format('YYYY-MM-DD')}
                    onChange={(e) => {
                        const v = e.target.value
                            ? dayjs(e.target.value).endOf('day')
                            : null;
                        if (startDate && v && v.isBefore(startDate)) return;
                        setEndDate(v);
                    }}
                    className="rounded border px-2 py-1 text-sm"
                />
            </div>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        Tidak ada data PSU
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 60,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                interval={0}
                                angle={-25}
                                textAnchor="end"
                                tickMargin={12}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="count"
                                radius={[6, 6, 0, 0]}
                                fillOpacity={1}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                shape={(props: any) => {
                                    const { x, y, width, height, payload } =
                                        props;
                                    const fillColor =
                                        payload.type === 'Polyline'
                                            ? '#8B5CF6'
                                            : '#22c55e';
                                    return (
                                        <g>
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                fill={fillColor}
                                                rx={6}
                                                ry={6}
                                            />
                                        </g>
                                    );
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
});

export default InfrastructureBarChart;
