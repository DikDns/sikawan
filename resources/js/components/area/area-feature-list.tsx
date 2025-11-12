import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
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
    return (
        <ScrollArea className={cn('max-h-screen', className)}>
            <div className="space-y-3 px-2 py-4">
                {areas.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Tidak ada kawasan. Buat area baru dengan menggambar di
                        peta.
                    </div>
                ) : (
                    areas.map((area) => (
                        <AreaFeatureCard
                            key={area.id}
                            id={area.id}
                            name={area.name}
                            description={area.description}
                            provinceName={area.province_name}
                            regencyName={area.regency_name}
                            districtName={area.district_name}
                            villageName={area.village_name}
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
    );
}
