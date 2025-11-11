import {
    AreaMapDisplay,
    type AreaFeatureGeometry,
} from '@/components/area/area-map-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
    geometry_json: unknown | null;
    centroid_lat: number | null;
    centroid_lng: number | null;
}

interface Props {
    areaGroup: AreaGroup;
}

export default function AreaDetail({ areaGroup }: Props) {
    // Prepare geometry for map display if available
    const mapFeatures: AreaFeatureGeometry[] = areaGroup.geometry_json
        ? [
              {
                  id: areaGroup.id,
                  name: areaGroup.name,
                  geometry_json: JSON.stringify(areaGroup.geometry_json),
                  centroid_lat: areaGroup.centroid_lat,
                  centroid_lng: areaGroup.centroid_lng,
                  color: areaGroup.legend_color_hex,
              },
          ]
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${areaGroup.name} - Detail Kawasan`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                {/* Main Content */}
                <div className="flex w-full flex-col gap-4 md:flex-row">
                    {/* Left Panel: Area Group Info */}
                    <Card className="basis-1/3 p-0">
                        <CardContent className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-secondary">
                                        {areaGroup.name}
                                    </h1>
                                    {areaGroup.description && (
                                        <p className="mt-1 text-muted-foreground">
                                            {areaGroup.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Kode
                                </label>
                                <p className="text-base">{areaGroup.code}</p>
                            </div>
                            {areaGroup.description && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Deskripsi
                                    </label>
                                    <p className="text-base">
                                        {areaGroup.description}
                                    </p>
                                </div>
                            )}
                            {areaGroup.legend_icon && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Ikon
                                    </label>
                                    <p className="text-base">
                                        {areaGroup.legend_icon}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Warna Legend
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <div
                                        className="h-8 w-8 rounded border"
                                        style={{
                                            backgroundColor:
                                                areaGroup.legend_color_hex,
                                        }}
                                    />
                                    <span className="text-sm">
                                        {areaGroup.legend_color_hex}
                                    </span>
                                </div>
                            </div>
                            {areaGroup.centroid_lat &&
                                areaGroup.centroid_lng && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Koordinat Pusat
                                        </label>
                                        <p className="text-base">
                                            {areaGroup.centroid_lat},{' '}
                                            {areaGroup.centroid_lng}
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Right Panel: Map Display */}
                    <Card className="basis-2/3">
                        <CardHeader>
                            <CardTitle>Peta Kawasan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] rounded-md border">
                                {mapFeatures.length > 0 ? (
                                    <AreaMapDisplay
                                        features={mapFeatures}
                                        defaultColor={
                                            areaGroup.legend_color_hex
                                        }
                                        className="h-full w-full"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        Tidak ada data geometri
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
