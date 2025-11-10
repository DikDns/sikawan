import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AreaFeatureCard } from './area-feature-card';

export interface AreaFeature {
    id: number;
    name: string;
    description?: string | null;
    household_count: number;
    family_count: number;
    is_visible: boolean;
    geometry_json?: string | null;
    geometry_type?: string | null;
    centroid_lat?: number | null;
    centroid_lng?: number | null;
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
    features: AreaFeature[];
    selectedFeatureId?: number | null;
    onFeatureSelect?: (feature: AreaFeature) => void;
    className?: string;
}

export function AreaFeatureList({
    features,
    selectedFeatureId,
    onFeatureSelect,
    className,
}: AreaFeatureListProps) {
    return (
        <ScrollArea className={cn('h-full', className)}>
            <div className="space-y-3 pr-4">
                {features.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Tidak ada area feature
                    </div>
                ) : (
                    features.map((feature) => (
                        <AreaFeatureCard
                            key={feature.id}
                            id={feature.id}
                            name={feature.name}
                            description={feature.description}
                            householdCount={feature.household_count}
                            familyCount={feature.family_count}
                            isVisible={feature.is_visible}
                            onClick={() => onFeatureSelect?.(feature)}
                            className={
                                selectedFeatureId === feature.id
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
