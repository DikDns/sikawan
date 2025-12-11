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

// Muara Enim regency ID (locked)
const MUARA_ENIM_REGENCY_ID = '1606';

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
    const { subDistricts, villages, loadSubDistricts, loadVillages } =
        useWilayah();

    // Load sub-districts for Muara Enim on mount
    useEffect(() => {
        loadSubDistricts(MUARA_ENIM_REGENCY_ID);
    }, [loadSubDistricts]);

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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Select
                        value={filters?.district_id ? filters.district_id : ''}
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
