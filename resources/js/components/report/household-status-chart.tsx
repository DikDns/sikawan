'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { forwardRef, useMemo, useState } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

dayjs.locale('id');
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface Household {
    habitability_status?: 'RLH' | 'RTLH' | null | string;
    male_count?: number;
    female_count?: number;
    member_total?: number;
    created_at?: string | null;
}

const HouseholdCharts = forwardRef<HTMLDivElement, { houses: Household[] }>(
    function HouseholdCharts({ houses }, ref) {
        const today = dayjs().endOf('day');
        const [startStatus, setStartStatus] = useState<dayjs.Dayjs | null>(
            null,
        );
        const [endStatus, setEndStatus] = useState<dayjs.Dayjs | null>(null);
        const [startPeople, setStartPeople] = useState<dayjs.Dayjs | null>(
            null,
        );
        const [endPeople, setEndPeople] = useState<dayjs.Dayjs | null>(null);

        const filteredStatus = useMemo(() => {
            return houses.filter((h) => {
                const d = dayjs(h.created_at);

                if (startStatus && d.isBefore(startStatus)) return false;
                if (endStatus && d.isAfter(endStatus)) return false;

                return true;
            });
        }, [houses, startStatus, endStatus]);

        const filteredPeople = useMemo(() => {
            return houses.filter((h) => {
                const d = dayjs(h.created_at);

                if (startPeople && d.isBefore(startPeople)) return false;
                if (endPeople && d.isAfter(endPeople)) return false;

                return true;
            });
        }, [houses, startPeople, endPeople]);

        const totalHouses = filteredStatus.length;
        const rlhCount = filteredStatus.filter(
            (h) => h.habitability_status === 'RLH',
        ).length;
        const rtlhCount = filteredStatus.filter(
            (h) => h.habitability_status === 'RTLH',
        ).length;

        const statusChartData = [
            {
                name: 'RLH (Rumah Layak Huni)',
                value: rlhCount,
                fill: '#10b981',
            },
            {
                name: 'RTLH (Rumah Tidak Layak Huni)',
                value: rtlhCount,
                fill: '#ef4444',
            },
        ];

        const totalMale = filteredPeople.reduce(
            (a, h) => a + (h.male_count ?? 0),
            0,
        );
        const totalFemale = filteredPeople.reduce(
            (a, h) => a + (h.female_count ?? 0),
            0,
        );
        const totalMember = filteredPeople.reduce(
            (a, h) => a + (h.member_total ?? 0),
            0,
        );

        const peopleChartData = [
            { name: 'Laki-laki', value: totalMale, fill: '#3b82f6' },
            { name: 'Perempuan', value: totalFemale, fill: '#ec4899' },
        ];

        const date = (value: string | null) =>
            value ? dayjs(value).startOf('day') : null;

        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card ref={ref}>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg">
                            Status Kelayakan Rumah
                        </CardTitle>
                        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {totalHouses}
                            </span>
                        </div>
                    </CardHeader>
                    <div className="flex gap-3 px-6 pb-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={
                                    startStatus
                                        ? startStatus.format('YYYY-MM-DD')
                                        : ''
                                }
                                max={today.format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const v = date(e.target.value);
                                    if (v && endStatus && v.isAfter(endStatus))
                                        return;
                                    setStartStatus(v);
                                }}
                                className="rounded border px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="mt-1">-</div>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={
                                    endStatus
                                        ? endStatus.format('YYYY-MM-DD')
                                        : ''
                                }
                                min={
                                    startStatus
                                        ? startStatus.format('YYYY-MM-DD')
                                        : ''
                                }
                                max={today.format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const v = dayjs(e.target.value).endOf(
                                        'day',
                                    );
                                    if (startStatus && v.isBefore(startStatus))
                                        return;
                                    setEndStatus(v);
                                }}
                                className="rounded border px-2 py-1 text-sm"
                            />
                        </div>
                    </div>

                    <CardContent>
                        {filteredStatus.length === 0 ? (
                            <div className="py-24 text-center text-sm text-gray-500">
                                Tidak ada data status kelayakan rumah
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={statusChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {statusChartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg">
                            Komposisi Penduduk
                        </CardTitle>
                        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {totalMember}
                            </span>
                        </div>
                    </CardHeader>
                    <div className="flex gap-3 px-6 pb-2">
                        <input
                            type="date"
                            value={
                                startPeople
                                    ? startPeople.format('YYYY-MM-DD')
                                    : ''
                            }
                            max={today.format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const v = date(e.target.value);
                                if (v && endPeople && v.isAfter(endPeople))
                                    return;
                                setStartPeople(v);
                            }}
                            className="rounded border px-2 py-1 text-sm"
                        />
                        <div className="mt-1">-</div>
                        <input
                            type="date"
                            value={
                                endPeople ? endPeople.format('YYYY-MM-DD') : ''
                            }
                            min={
                                startPeople
                                    ? startPeople.format('YYYY-MM-DD')
                                    : ''
                            }
                            max={today.format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const v = dayjs(e.target.value).endOf('day');
                                if (startPeople && v.isBefore(startPeople))
                                    return;
                                setEndPeople(v);
                            }}
                            className="rounded border px-2 py-1 text-sm"
                        />
                    </div>

                    <CardContent>
                        {filteredPeople.length === 0 ? (
                            <div className="py-24 text-center text-sm text-gray-500">
                                Tidak ada data komposisi penduduk
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={peopleChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {peopleChartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    },
);

export default HouseholdCharts;
