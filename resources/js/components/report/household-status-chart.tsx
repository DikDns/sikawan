"use client";

import { useMemo, useState, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CalendarIcon } from "lucide-react";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface Household {
    habitability_status: "RLH" | "RTLH" | null;
    male_count: number;
    female_count: number;
    member_total: number;
    created_at: string;
}

const HouseholdCharts= forwardRef<HTMLDivElement, { houses: Household[] }>(
    function HouseholdCharts({ houses }, ref)
{
    const today = dayjs().endOf("day");
    const [startStatus, setStartStatus] = useState<dayjs.Dayjs | null>(null);
    const [endStatus, setEndStatus] = useState<dayjs.Dayjs | null>(null);
    const [startPeople, setStartPeople] = useState<dayjs.Dayjs | null>(null);
    const [endPeople, setEndPeople] = useState<dayjs.Dayjs | null>(null);

    const filteredStatus = useMemo(() => {
        return houses.filter(h => {
            const d = dayjs(h.created_at);

            if (startStatus && d.isBefore(startStatus)) return false;
            if (endStatus && d.isAfter(endStatus)) return false;

            return true;
        });
    }, [houses, startStatus, endStatus]);

    const filteredPeople = useMemo(() => {
        return houses.filter(h => {
            const d = dayjs(h.created_at);

            if (startPeople && d.isBefore(startPeople)) return false;
            if (endPeople && d.isAfter(endPeople)) return false;

            return true;
        });
    }, [houses, startPeople, endPeople]);

    const totalHouses = filteredStatus.length;
    const rlhCount = filteredStatus.filter(h => h.habitability_status === "RLH").length;
    const rtlhCount = filteredStatus.filter(h => h.habitability_status === "RTLH").length;

    const statusChartData = [
        { name: "RLH (Rumah Layak Huni)", value: rlhCount, fill: "#10b981" },
        { name: "RTLH (Rumah Tidak Layak Huni)", value: rtlhCount, fill: "#ef4444" },
    ];

    const totalMale = filteredPeople.reduce((a, h) => a + (h.male_count ?? 0), 0);
    const totalFemale = filteredPeople.reduce((a, h) => a + (h.female_count ?? 0), 0);
    const totalMember = filteredPeople.reduce((a, h) => a + (h.member_total ?? 0), 0);

    const peopleChartData = [
        { name: "Laki-laki", value: totalMale, fill: "#3b82f6" },
        { name: "Perempuan", value: totalFemale, fill: "#ec4899" },
    ];

    const date = (value: string | null) =>
        value ? dayjs(value).startOf("day") : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card ref={ref}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Status Kelayakan Rumah</CardTitle>
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {totalHouses}
                        </span>
                    </div>
                </CardHeader>
                <div className="flex gap-3 px-6 pb-2">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <input
                            type="date"
                            value={startStatus ? startStatus.format("YYYY-MM-DD") : ""}
                            max={today.format("YYYY-MM-DD")}
                            onChange={(e) => {
                                const v = date(e.target.value);
                                if (v && endStatus && v.isAfter(endStatus)) return;
                                setStartStatus(v);
                            }}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <input
                            type="date"
                            value={endStatus ? endStatus.format("YYYY-MM-DD") : ""}
                            min={startStatus ? startStatus.format("YYYY-MM-DD") : ""}
                            max={today.format("YYYY-MM-DD")}
                            onChange={(e) => {
                                const v = dayjs(e.target.value).endOf("day");
                                if (startStatus && v.isBefore(startStatus)) return;
                                setEndStatus(v);
                            }}
                            className="border rounded px-2 py-1 text-sm"
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
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Komposisi Penduduk</CardTitle>
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {totalMember}
                        </span>
                    </div>
                </CardHeader>
                <div className="flex gap-3 px-6 pb-2">
                    <input
                        type="date"
                        value={startPeople ? startPeople.format("YYYY-MM-DD") : ""}
                        max={today.format("YYYY-MM-DD")}
                        onChange={(e) => {
                            const v = date(e.target.value);
                            if (v && endPeople && v.isAfter(endPeople)) return;
                            setStartPeople(v);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                        type="date"
                        value={endPeople ? endPeople.format("YYYY-MM-DD") : ""}
                        min={startPeople ? startPeople.format("YYYY-MM-DD") : ""}
                        max={today.format("YYYY-MM-DD")}
                        onChange={(e) => {
                            const v = dayjs(e.target.value).endOf("day");
                            if (startPeople && v.isBefore(startPeople)) return;
                            setEndPeople(v);
                        }}
                        className="border rounded px-2 py-1 text-sm"
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
});

export default HouseholdCharts;
