import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export interface AreaSummaryRow {
    name: string;
    rumah: number;
}

export function AreaSummaryTable({ rows }: { rows?: AreaSummaryRow[] }) {
    const { availableYears = [], selectedRegionYear } =
        usePage<DashboardProps>().props;

    const data = rows && rows.length > 0 ? rows : [];
    const currentYear =
        selectedRegionYear ||
        availableYears[0] ||
        new Date().getFullYear().toString();

    const handleYearChange = (year: string) => {
        router.get(
            '/dashboard',
            { region_year: year },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Total Kawasan
                    </h2>
                    <p className="text-3xl font-bold text-secondary">
                        {data.length}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="gap-2 bg-transparent font-semibold text-secondary"
                        >
                            {currentYear}
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
                                        year === currentYear ? 'bg-accent' : ''
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
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-secondary/25">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">
                                Nama Kawasan
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-secondary">
                                Rumah
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b border-border transition-colors hover:bg-muted"
                                >
                                    <td className="px-4 py-3 text-sm text-foreground">
                                        {row.name}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                                        {row.rumah}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                                >
                                    Tidak ada data untuk tahun {currentYear}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
