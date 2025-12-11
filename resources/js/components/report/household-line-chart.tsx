'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { forwardRef, useMemo, useState } from 'react';
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

dayjs.locale('id');
dayjs.extend(isSameOrBefore);

interface Household {
    id: number;
    created_at: string;
    habitability_status: string | null;
}

const HouseholdLineChart = forwardRef<
    HTMLDivElement,
    {
        houses: Household[];
        startDate?: string | null;
        endDate?: string | null;
    }
>(function HouseholdLineChart({ houses }, ref) {
    const today = dayjs().endOf('day');
    const defaultEnd = today;
    const defaultStart = today.subtract(10, 'day').startOf('day');
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    const generateDateRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        const dates: string[] = [];
        let current = start.clone();

        while (current.isSameOrBefore(end)) {
            dates.push(current.format('YYYY-MM-DD'));
            current = current.add(1, 'day');
        }
        return dates;
    };

    const chartData = useMemo(() => {
        const range = generateDateRange(startDate, endDate);
        const grouped: Record<string, number> = {};

        range.forEach((d) => (grouped[d] = 0));

        houses.forEach((h) => {
            const d = dayjs(h.created_at);
            if (!d.isValid()) return;

            if (d.isBefore(startDate) || d.isAfter(endDate)) return;

            const key = d.format('YYYY-MM-DD');
            grouped[key] = (grouped[key] || 0) + 1;
        });

        return range.map((date) => ({
            date: dayjs(date).format('DD MMM'),
            total: grouped[date] ?? 0,
        }));
    }, [houses, startDate, endDate]);

    return (
        <Card className="w-full" ref={ref}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Jumlah Rumah Per Tanggal</CardTitle>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate.format('YYYY-MM-DD')}
                            max={today.format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const v = dayjs(e.target.value).startOf('day');
                                if (!v.isValid()) return;
                                if (endDate && v.isAfter(endDate)) return;
                                if (v.isAfter(today)) return;

                                setStartDate(v);
                            }}
                            className="rounded border px-2 py-1 text-sm"
                        />
                    </div>
                    <div className="mt-1">-</div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={endDate.format('YYYY-MM-DD')}
                            max={today.format('YYYY-MM-DD')}
                            min={startDate.format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const v = dayjs(e.target.value).endOf('day');
                                if (!v.isValid()) return;
                                if (startDate && v.isBefore(startDate)) return;
                                if (v.isAfter(today)) return;

                                setEndDate(v);
                            }}
                            className="rounded border px-2 py-1 text-sm"
                        />
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                        {startDate.format('DD MMM')} -{' '}
                        {endDate.format('DD MMM')}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 25, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            name="Jumlah Rumah"
                            stroke="#3b82f6"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
});

export default HouseholdLineChart;
