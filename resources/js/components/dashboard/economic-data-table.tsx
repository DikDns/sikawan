import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

const fallbackEconomicData = [
    { indicator: 'Pendapatan rata-rata', value: '-' },
    { indicator: 'Tingkat Pengangguran', value: '-' },
    { indicator: 'Akses Pendidikan Dasar', value: '-' },
    { indicator: 'Akses Kesehatan', value: '-' },
];

interface EconomicDataTableProps {
    data?: { indicator: string; value: string }[];
    availableYears?: string[];
    selectedYear?: string | null;
}

export function EconomicDataTable({
    data,
    availableYears = [],
    selectedYear,
}: EconomicDataTableProps) {
    const displayYear =
        selectedYear ||
        (availableYears[0] ?? new Date().getFullYear().toString());

    const handleYearChange = (year: string) => {
        router.get(
            '/dashboard',
            { economic_year: year },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Data Sosial Ekonomi</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            {displayYear}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {availableYears.length > 0 ? (
                            availableYears.map((year) => (
                                <DropdownMenuItem
                                    key={year}
                                    onClick={() => handleYearChange(year)}
                                    className={
                                        year === displayYear ? 'bg-accent' : ''
                                    }
                                >
                                    {year}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>
                                Tidak ada data
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4 text-sm font-semibold">
                        <div>Indikator</div>
                        <div className="text-right">Nilai</div>
                    </div>
                    {(data && data.length > 0
                        ? data
                        : fallbackEconomicData
                    ).map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-2 gap-4 py-2 text-sm"
                        >
                            <div className="text-muted-foreground">
                                {item.indicator}
                            </div>
                            <div className="text-right font-medium text-foreground">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
