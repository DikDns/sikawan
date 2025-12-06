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
import { useEffect } from 'react';

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
        province_id?: string;
        regency_id?: string;
        district_id?: string;
        village_id?: string;
        area_id?: string;
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
    const {
        provinces,
        cities,
        subDistricts,
        villages,
        loadProvinces,
        loadCities,
        loadSubDistricts,
        loadVillages,
    } = useWilayah();

    useEffect(() => {
        loadProvinces();
    }, [loadProvinces]);

    console.log(filters);
    console.log(
        filters?.province_id
            ? provinces.find(
                  (p) => Number(p.value) === Number(filters.province_id),
              )
            : null,
    );

    useEffect(() => {
        if (filters?.province_id) {
            loadCities(filters.province_id);
        } else {
            // Clear cities if province is deselected or not present
            // But we can't clear here because useWilayah doesn't expose clearCities
            // It's fine, the select will just show empty or previous options but disabled
        }
    }, [filters?.province_id, loadCities]);

    useEffect(() => {
        if (filters?.regency_id) {
            loadSubDistricts(filters.regency_id);
        }
    }, [filters?.regency_id, loadSubDistricts]);

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
                            placeholder="Cari nama, alamat, atau ID rumah..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Select
                        value={filters?.province_id ? filters.province_id : ''}
                        onValueChange={(value) =>
                            onFilterChange?.({
                                province_id: value === 'all' ? null : value,
                                regency_id: null,
                                district_id: null,
                                village_id: null,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Provinsi</SelectItem>
                            {provinces.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters?.regency_id ? filters.regency_id : ''}
                        disabled={!filters?.province_id}
                        onValueChange={(value) =>
                            onFilterChange?.({
                                regency_id: value === 'all' ? null : value,
                                district_id: null,
                                village_id: null,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Kabupaten/Kota" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kab/Kota</SelectItem>
                            {cities.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                    {c.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters?.district_id ? filters.district_id : ''}
                        disabled={!filters?.regency_id}
                        onValueChange={(value) =>
                            onFilterChange?.({
                                district_id: value === 'all' ? null : value,
                                village_id: null,
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
                        value={filters?.village_id ? filters.village_id : ''}
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
                        value={filters?.area_id ? filters.area_id : ''}
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
