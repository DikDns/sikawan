import {
    AreaFeatureList,
    type AreaFeature,
} from '@/components/area/area-feature-list';
import {
    AreaMapDisplay,
    type AreaFeatureGeometry,
} from '@/components/area/area-map-display';
import { Button } from '@/components/ui/button';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kawasan',
        href: '/areas',
    },
    {
        title: 'Detail Kawasan',
        href: '#',
    },
];

interface AreaGroup {
    id: number;
    code: string;
    name: string;
    description: string | null;
    legend_color_hex: string;
    legend_icon: string | null;
    is_active: boolean;
    feature_count: number;
    household_count: number;
    family_count: number;
}

interface Props {
    areaGroup: AreaGroup;
    features: AreaFeature[];
}

export default function AreaDetail({ areaGroup, features }: Props) {
    const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(
        features.length > 0 ? features[0].id : null,
    );

    const handleFeatureSelect = (feature: AreaFeature) => {
        setSelectedFeatureId(feature.id);
    };

    const handleAdd = () => {
        console.log('Add new area feature');
        // TODO: Navigate to add page or open add modal
    };

    // Prepare features for map display
    const mapFeatures: AreaFeatureGeometry[] = features.map((feature) => ({
        id: feature.id,
        name: feature.name,
        geometry_json: feature.geometry_json || '',
        centroid_lat: feature.centroid_lat,
        centroid_lng: feature.centroid_lng,
        color: areaGroup.legend_color_hex,
        household_count: feature.household_count,
        family_count: feature.family_count,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${areaGroup.name} - Detail Kawasan`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: areaGroup.legend_color_hex }}
                        >
                            {areaGroup.name}
                        </h1>
                        {areaGroup.description && (
                            <p className="mt-1 text-muted-foreground">
                                {areaGroup.description}
                            </p>
                        )}
                    </div>
                    <Button onClick={handleAdd} className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Tambah Kawasan</span>
                    </Button>
                </div>

                {/* Main Content: Split View */}
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-0 flex-1"
                >
                    {/* Left Panel: Area Features List */}
                    <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
                        <div className="flex h-full flex-col">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">
                                    Daftar Area ({features.length})
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Total:{' '}
                                    {areaGroup.household_count.toLocaleString()}{' '}
                                    Rumah •{' '}
                                    {areaGroup.family_count.toLocaleString()}{' '}
                                    Keluarga
                                </p>
                            </div>
                            <AreaFeatureList
                                features={features}
                                selectedFeatureId={selectedFeatureId}
                                onFeatureSelect={handleFeatureSelect}
                                className="flex-1"
                            />
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Panel: Map Display */}
                    <ResizablePanel defaultSize={60} minSize={40} maxSize={70}>
                        <div className="h-full rounded-md border">
                            <AreaMapDisplay
                                features={mapFeatures}
                                defaultColor={areaGroup.legend_color_hex}
                                className="h-full w-full"
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    );
}
