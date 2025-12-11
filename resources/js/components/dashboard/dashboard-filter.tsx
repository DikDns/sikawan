import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
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
    const [filters, setFilters] = useState({
        year: Array.isArray(selectedEconomicYear)
            ? selectedEconomicYear.map(String)
            : (selectedEconomicYear ? [String(selectedEconomicYear)] : []),
        district: selectedDistrict ?? '',
        village: selectedVillage ?? '',
    });

    const triggerFilter = (years: string[], district: string, village: string) => {
        const params: Record<string, string | string[]> = {};

        if (years.length > 0) {
            params['economic_year'] = years;
        }

        if (district) {
            params.district = district;
        }

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

    const hasActiveFilters = filters.year.length > 0 || filters.district || filters.village;

    return (
        <Card className="w-full">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-sm">Filter by</span>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleReset}
                        >
                            <X className="w-4 h-4 mr-1" />
                            Reset
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="w-full">
                        <MultiSelect
                            options={years.map((y) => ({ value: y, label: y }))}
                            value={filters.year}
                            onChange={handleYearChange}
                            placeholder="Pilih Tahun"
                            searchPlaceholder="Cari tahun..."
                        />
                    </div>
                    <div className="w-full">
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
                    <div className="w-full sm:col-span-2 lg:col-span-1">
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
                </div>
            </div>
        </Card>
    );
}
