import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useWilayah } from '@/hooks/use-wilayah';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

// Muara Enim regency ID (locked)
const MUARA_ENIM_REGENCY_ID = '1603';

interface AreaOption {
    value: string;
    label: string;
}

interface Props {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    areas?: AreaOption[];
    filters?: {
        habitability_status?: string;
        district_id?: string;
        village_id?: string;
        area_id?: string;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
    onFilterChange?: (newValues: Record<string, string | null>) => void;
}

export default function HouseholdsSearch({
    searchQuery,
    onSearchChange,
    filters,
    onFilterChange,
    areas,
}: Props) {
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const { subDistricts, villages, loadSubDistricts, loadVillages } =
        useWilayah();

    // Debounced search to reduce server requests
    const debouncedSearch = useDebouncedCallback(
        useCallback(
            (value: string) => {
                onSearchChange(value);
            },
            [onSearchChange],
        ),
        500,
    );

    // Update local search and trigger debounced search
    const handleSearchInput = (value: string) => {
        setLocalSearch(value);
        debouncedSearch(value);
    };

    // Sync local search with prop (e.g., when navigating back)
    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    // Load sub-districts for Muara Enim on mount
    useEffect(() => {
        loadSubDistricts(MUARA_ENIM_REGENCY_ID);
    }, [loadSubDistricts]);

    // Load villages when district changes
    useEffect(() => {
        if (filters?.district_id) {
            loadVillages(filters.district_id);
        }
    }, [filters?.district_id, loadVillages]);

    return (
        <Card className="border-border bg-card shadow-sm">
            <CardHeader>
                <CardTitle>Cari & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari nama, alamat, atau NIK"
                            value={localSearch}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            className="border-border pl-10"
                        />
                    </div>
                    <div className="w-full md:w-[240px]">
                        <Select
                            value={filters?.habitability_status || 'all'}
                            onValueChange={(value) =>
                                onFilterChange?.({
                                    habitability_status:
                                        value === 'all' ? null : value,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status Hunian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Status
                                </SelectItem>
                                <SelectItem value="RLH">
                                    RLH (Layak Huni)
                                </SelectItem>
                                <SelectItem value="RTLH">
                                    RTLH (Tidak Layak Huni)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Select
                        value={filters?.district_id || 'all'}
                        onValueChange={(value) =>
                            onFilterChange?.({
                                district_id: value === 'all' ? null : value,
                                village_id: null, // Reset village when district changes
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kecamatan</SelectItem>
                            {subDistricts.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                    {d.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters?.village_id || 'all'}
                        disabled={!filters?.district_id}
                        onValueChange={(value) =>
                            onFilterChange?.({
                                village_id: value === 'all' ? null : value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Desa/Kelurahan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Desa/Kelurahan
                            </SelectItem>
                            {villages.map((v) => (
                                <SelectItem key={v.value} value={v.value}>
                                    {v.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters?.area_id || 'all'}
                        onValueChange={(value) =>
                            onFilterChange?.({
                                area_id: value === 'all' ? null : value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Kawasan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kawasan</SelectItem>
                            {areas?.map((a) => (
                                <SelectItem key={a.value} value={a.value}>
                                    {a.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
