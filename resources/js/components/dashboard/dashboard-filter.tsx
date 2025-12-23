import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useWilayah } from '@/hooks/use-wilayah';
import { router } from '@inertiajs/react';
import { Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const MUARA_ENIM_REGENCY_ID = '1603';

interface DashboardFilterProps {
    years: string[];
    selectedEconomicYear?: string | string[];
    selectedDistrict?: string;
    selectedVillage?: string;
}

export function DashboardFilter({
    years = [],
    selectedEconomicYear,
    selectedDistrict,
    selectedVillage,
}: DashboardFilterProps) {
    // Local state for filters to allow UI updates before triggering router
    const [year, setYear] = useState<string[]>(
        Array.isArray(selectedEconomicYear)
            ? selectedEconomicYear.map(String)
            : selectedEconomicYear
              ? [String(selectedEconomicYear)]
              : [],
    );
    const [districtId, setDistrictId] = useState<string>(
        selectedDistrict ?? '',
    );
    const [villageId, setVillageId] = useState<string>(selectedVillage ?? '');

    const { subDistricts, villages, loadSubDistricts, loadVillages } =
        useWilayah();

    // 1. Load Sub-Districts on Mount
    useEffect(() => {
        loadSubDistricts(MUARA_ENIM_REGENCY_ID);
    }, [loadSubDistricts]);

    // 2. Load Villages when District changes (and clear village if district cleared)
    useEffect(() => {
        if (districtId && districtId !== 'all') {
            loadVillages(districtId);
        } else {
            // If district is cleared or 'all', we technically don't have villages for 'all'
            // unless we fetch ALL villages (not recommended).
            // Logic: reset village selection if logic requires proper dependency
        }
    }, [districtId, loadVillages]);

    // Trigger Filter Function
    const applyFilters = (
        newYear: string[],
        newDistrict: string,
        newVillage: string,
    ) => {
        const params: Record<string, string | string[]> = {};

        if (newYear.length > 0) {
            params['economic_year'] = newYear;
        }

        if (newDistrict && newDistrict !== 'all') {
            params.district = newDistrict;
        }

        if (newVillage && newVillage !== 'all') {
            params.village = newVillage;
        }

        router.get('/dashboard', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: [
                'statCardsData',
                'analysisData',
                'chartSectionData',
                'psuData',
                'improvedPSUData',
                'bottomStatsData',
                'economicData',
                'regionStats',
                'areaSummaryRows',
                'slumAreaTotalM2',
                'householdsInSlumArea',
                'rtlhTotal',
                'selectedEconomicYear',
                'selectedDistrict',
                'selectedVillage',
            ],
        });
    };

    // Handlers
    const handleYearChange = (newYears: string[]) => {
        setYear(newYears);
        applyFilters(newYears, districtId, villageId);
    };

    const handleDistrictChange = (value: string) => {
        const newVal = value === 'all' ? '' : value;
        setDistrictId(newVal);
        setVillageId(''); // Reset village when district changes
        applyFilters(year, newVal, '');
    };

    const handleVillageChange = (value: string) => {
        const newVal = value === 'all' ? '' : value;
        setVillageId(newVal);
        applyFilters(year, districtId, newVal);
    };

    const handleReset = () => {
        setYear([]);
        setDistrictId('');
        setVillageId('');
        router.get(
            '/dashboard',
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const hasActiveFilters = year.length > 0 || !!districtId || !!villageId;

    return (
        <Card className="w-full">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            Filter Dashboard
                        </span>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={handleReset}
                        >
                            <X className="mr-1 h-4 w-4" />
                            Reset Filter
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="w-full">
                        <MultiSelect
                            options={years.map((y) => ({ value: y, label: y }))}
                            value={year}
                            onChange={handleYearChange}
                            placeholder="Pilih Tahun"
                            searchPlaceholder="Cari tahun..."
                        />
                    </div>
                    <div className="w-full">
                        <Select
                            value={districtId || 'all'}
                            onValueChange={handleDistrictChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Kecamatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Kecamatan
                                </SelectItem>
                                {subDistricts.map((d) => (
                                    <SelectItem key={d.value} value={d.value}>
                                        {d.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full">
                        <Select
                            value={villageId || 'all'}
                            onValueChange={handleVillageChange}
                            disabled={!districtId || districtId === 'all'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Kelurahan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Kelurahan
                                </SelectItem>
                                {villages.map((v) => (
                                    <SelectItem key={v.value} value={v.value}>
                                        {v.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </Card>
    );
}
