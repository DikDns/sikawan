import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { AreaFeatureCard } from './area-feature-card';

export interface Area {
    id: number;
    name: string;
    description?: string | null;
    geometry_json?: unknown | null;
    province_id?: string | null;
    province_name?: string | null;
    regency_id?: string | null;
    regency_name?: string | null;
    district_id?: string | null;
    district_name?: string | null;
    village_id?: string | null;
    village_name?: string | null;
    is_slum?: boolean;
    area_total_m2?: number | null;
}

export interface AreaFeatureListProps {
    areas: Area[];
    selectedAreaId?: number | null;
    onAreaSelect?: (area: Area) => void;
    onAreaEdit?: (area: Area) => void;
    className?: string;
}

export function AreaFeatureList({
    areas,
    selectedAreaId,
    onAreaSelect,
    onAreaEdit,
    className,
}: AreaFeatureListProps) {
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [selectedVillage, setSelectedVillage] = useState<string>('all');

    // Extract unique districts from areas
    const districts = useMemo(() => {
        const unique = new Set(
            areas
                .map((a) => a.district_name)
                .filter((n): n is string => Boolean(n)),
        );
        return Array.from(unique).sort();
    }, [areas]);

    // Extract unique villages from areas (filtered by district if selected)
    const villages = useMemo(() => {
        const unique = new Set(
            areas
                .filter(
                    (a) =>
                        selectedDistrict === 'all' ||
                        a.district_name === selectedDistrict,
                )
                .map((a) => a.village_name)
                .filter((n): n is string => Boolean(n)),
        );
        return Array.from(unique).sort();
    }, [areas, selectedDistrict]);

    // Filter areas for display
    const filteredAreas = useMemo(() => {
        return areas.filter((area) => {
            const matchDistrict =
                selectedDistrict === 'all' ||
                area.district_name === selectedDistrict;
            const matchVillage =
                selectedVillage === 'all' ||
                area.village_name === selectedVillage;
            return matchDistrict && matchVillage;
        });
    }, [areas, selectedDistrict, selectedVillage]);

    return (
        <div className={cn('flex h-full flex-col', className)}>
            <div className="space-y-2 px-2 pb-2">
                <Select
                    value={selectedDistrict}
                    onValueChange={(val) => {
                        setSelectedDistrict(val);
                        setSelectedVillage('all'); // Reset village when district changes
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Semua Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kecamatan</SelectItem>
                        {districts.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedVillage}
                    onValueChange={setSelectedVillage}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Semua Kelurahan/Desa" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Semua Kelurahan/Desa
                        </SelectItem>
                        {villages.map((v) => (
                            <SelectItem key={v} value={v}>
                                {v}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-3 px-2 py-4">
                    {filteredAreas.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            {areas.length === 0
                                ? 'Tidak ada kawasan. Buat area baru dengan menggambar di peta.'
                                : 'Tidak ada kawasan yang sesuai filter.'}
                        </div>
                    ) : (
                        filteredAreas.map((area) => (
                            <AreaFeatureCard
                                key={area.id}
                                id={area.id}
                                name={area.name}
                                description={area.description}
                                provinceName={area.province_name}
                                regencyName={area.regency_name}
                                districtName={area.district_name}
                                villageName={area.village_name}
                                isSlum={area.is_slum}
                                areaTotalM2={area.area_total_m2}
                                onClick={() => onAreaSelect?.(area)}
                                onEdit={() => onAreaEdit?.(area)}
                                className={
                                    selectedAreaId === area.id
                                        ? 'ring-2 ring-primary'
                                        : ''
                                }
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
