import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { SearchableSelect } from "@/components/ui/searchable-select";
import { MultiSelect } from '@/components/ui/multi-select';

export function DashboardFilter({
    years = [],
    districts = [],
    villages = [],
    selectedEconomicYear,
    selectedDistrict,
    selectedVillage,
}: {
    years: string[];
    districts: { id: string; name: string }[];
    villages: { id: string; name: string }[];
    selectedEconomicYear?: string | string[];
    selectedDistrict?: string;
    selectedVillage?: string;
}) {
    // Use useState instead of useForm to avoid auto-submission
    const [filters, setFilters] = useState({
        year: Array.isArray(selectedEconomicYear)
            ? selectedEconomicYear.map(String)
            : (selectedEconomicYear ? [String(selectedEconomicYear)] : []),
        district: selectedDistrict ?? '',
        village: selectedVillage ?? '',
    });

    const triggerFilter = (years: string[], district: string, village: string) => {
        const params: Record<string, string | string[]> = {};

        // Add years as array
        if (years.length > 0) {
            params['economic_year'] = years;
        }

        // Add district if exists
        if (district) {
            params.district = district;
        }

        // Add village if exists
        if (village) {
            params.village = village;
        }

        router.get('/dashboard', params, {
            preserveState: true,
            replace: true,
            only: ['statCardsData', 'analysisData', 'chartSectionData', 'psuData', 'improvedPSUData', 'bottomStatsData', 'economicData', 'regionStats', 'areaSummaryRows', 'slumAreaTotalM2', 'householdsInSlumArea', 'rtlhTotal']
        });
    };

    const handleYearChange = (newYears: string[]) => {
        setFilters(prev => ({ ...prev, year: newYears }));
        triggerFilter(newYears, filters.district, filters.village);
    };

    const handleDistrictChange = (newDistrict: string) => {
        setFilters(prev => ({ ...prev, district: newDistrict }));
        triggerFilter(filters.year, newDistrict, filters.village);
    };

    const handleVillageChange = (newVillage: string) => {
        setFilters(prev => ({ ...prev, village: newVillage }));
        triggerFilter(filters.year, filters.district, newVillage);
    };

    const handleReset = () => {
        setFilters({
            year: [],
            district: '',
            village: '',
        });
        router.get('/dashboard', {}, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <Card className="flex flex-row items-center justify-end gap-4 px-4 py-2 w-full">
            <div className="flex flex-row items-center gap-2 mr-auto">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm whitespace-nowrap">
                    Filter by
                </span>
            </div>
            <div className="min-w-[180px]">
                <MultiSelect
                    options={years.map((y) => ({ value: y, label: y }))}
                    value={filters.year}
                    onChange={handleYearChange}
                    placeholder="Pilih Tahun"
                    searchPlaceholder="Cari tahun..."
                />
            </div>
            <div className="min-w-[200px]">
                <SearchableSelect
                    options={districts.map((d) => ({
                        value: d.id,
                        label: d.name
                    }))}
                    value={filters.district}
                    onValueChange={handleDistrictChange}
                    placeholder="Pilih Kecamatan"
                    searchPlaceholder="Cari kecamatan..."
                    emptyMessage="Kecamatan tidak ditemukan"
                    clearable={true}
                />
            </div>
            <div className="min-w-[200px]">
                <SearchableSelect
                    options={villages.map((v) => ({
                        value: v.id,
                        label: v.name
                    }))}
                    value={filters.village}
                    onValueChange={handleVillageChange}
                    placeholder="Pilih Kelurahan"
                    searchPlaceholder="Cari kelurahan..."
                    emptyMessage="Kelurahan tidak ditemukan"
                    clearable={true}
                />
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-500 border-red-400 hover:bg-red-50"
                onClick={handleReset}
            >
                Reset
            </Button>
        </Card>
    );
}
