import {
    AreaMapDisplay,
    type AreaFeatureGeometry,
} from '@/components/area/area-map-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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
    const handleAdd = () => {
        console.log('Add new area group');
        // TODO: Navigate to add page or open add modal
    };

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

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Left Panel: Area Group Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kawasan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                            {areaGroup.centroid_lat.toFixed(6)},{' '}
                                            {areaGroup.centroid_lng.toFixed(6)}
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Right Panel: Map Display */}
                    <Card>
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
