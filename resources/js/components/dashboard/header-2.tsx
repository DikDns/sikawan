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

export function Header2() {
    const { availableYears = [], selectedRegionYear } =
        usePage<DashboardProps>().props;

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
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Kelayakan Rumah
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        per Kecamatan
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
        </div>
    );
}
