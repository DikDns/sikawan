import {
    Map,
    MapLayerGroup,
    MapLayers,
    MapLayersControl,
    MapLocateControl,
    MapMarker,
    MapPolygon,
    MapPopup,
    MapRectangle,
    MapTileLayer,
    MapZoomControl,
} from '@/components/ui/map';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { useEffect, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Peta Sebaran',
        href: '/distribution-map',
    },
];

type HabitabilityStatus = 'RLH' | 'RTLH' | null;

interface HouseholdForMap {
    id: number;
    head_name: string;
    address_text: string;
    latitude: number;
    longitude: number;
    habitability_status: HabitabilityStatus;
    province_name?: string | null;
    regency_name?: string | null;
    district_name?: string | null;
    village_name?: string | null;
}

interface AreaFeatureGeometry {
    id: number;
    name: string;
    description?: string | null;
    geometry_json: unknown;
    province_name?: string | null;
    regency_name?: string | null;
    district_name?: string | null;
    village_name?: string | null;
    color?: string;
}

interface AreaGroupForMap {
    id: number;
    code?: string | null;
    name: string;
    description?: string | null;
    legend_color_hex?: string | null;
    legend_icon?: string | null;
    geometry_json?: unknown;
    centroid_lat?: number | null;
    centroid_lng?: number | null;
    areas: AreaFeatureGeometry[];
}

const RLH_COLOR = '#8AD463';
const RTLH_COLOR = '#EC6767';
const DEFAULT_COLOR = '#8B87E8';

const getStatusColor = (status: HabitabilityStatus) => {
    if (status === 'RLH') return RLH_COLOR;
    if (status === 'RTLH') return RTLH_COLOR;
    return DEFAULT_COLOR;
};

const HouseholdMarkerIcon = (status: HabitabilityStatus) => {
    const color = getStatusColor(status);
    return (
        <div
            className="flex size-8 items-center justify-center rounded-full border bg-background shadow-sm"
            style={{ borderColor: color }}
            aria-label="Lokasi rumah"
            tabIndex={0}
        >
            <Home className="size-5" style={{ color }} />
        </div>
    );
};

const parsePolygon = (geometry: any) => {
    if (
        !geometry ||
        geometry.type !== 'Polygon' ||
        !Array.isArray(geometry.coordinates)
    )
        return null;
    const rings = geometry.coordinates as number[][][];
    return rings.map((ring) =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number]),
    );
};

const parseRectangle = (geometry: any) => {
    if (!Array.isArray(geometry) || geometry.length !== 2) return null;
    const [[west, north], [east, south]] = geometry as [
        [number, number],
        [number, number],
    ];
    return [
        [north, west] as [number, number],
        [south, east] as [number, number],
    ] as [[number, number], [number, number]];
};

export default function DistributionMap() {
    const {
        households = [],
        areaGroups = [],
        error,
    } = usePage<{
        flash?: any;
        households: HouseholdForMap[];
        areaGroups: AreaGroupForMap[];
        error?: string;
    }>().props;

    useEffect(() => {
        const id = setInterval(() => {
            router.reload({
                only: ['households', 'areaGroups'],
            });
        }, 60000);
        return () => clearInterval(id);
    }, []);

    const center = useMemo(() => {
        if (households.length > 0) {
            const lat =
                households.reduce((s, h) => s + h.latitude, 0) /
                households.length;
            const lng =
                households.reduce((s, h) => s + h.longitude, 0) /
                households.length;
            return [lat, lng] as [number, number];
        }
        const withCentroid = areaGroups.filter(
            (g) => g.centroid_lat && g.centroid_lng,
        );
        if (withCentroid.length > 0) {
            const lat =
                withCentroid.reduce((s, g) => s + (g.centroid_lat || 0), 0) /
                withCentroid.length;
            const lng =
                withCentroid.reduce((s, g) => s + (g.centroid_lng || 0), 0) /
                withCentroid.length;
            return [lat, lng] as [number, number];
        }
        return [-4.2327, 103.6141] as [number, number];
    }, [households, areaGroups]);

    const groupLayerNames = useMemo(
        () => areaGroups.map((g) => `Kawasan ${g.name}`),
        [areaGroups],
    );
    const defaultLayerGroups = useMemo(
        () => [
            'Rumah Layak Huni',
            'Rumah Tidak Layak Huni',
            ...groupLayerNames,
        ],
        [groupLayerNames],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Sebaran" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Peta Sebaran</h1>
                        <p className="text-muted-foreground">
                            Visualisasi data rumah dan kawasan
                        </p>
                    </div>
                    {error && (
                        <div
                            role="alert"
                            className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        >
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-hidden rounded-lg border">
                    <Map center={center} className="h-full w-full">
                        <MapTileLayer name="OSM" />

                        <MapLayers defaultLayerGroups={defaultLayerGroups}>
                            <MapLayersControl
                                layerGroupsLabel="Layer"
                                tileLayersLabel="Tipe Peta"
                            />
                            <MapZoomControl />
                            <MapLocateControl />

                            <MapLayerGroup name="Rumah Layak Huni">
                                {households
                                    .filter(
                                        (h) => h.habitability_status === 'RLH',
                                    )
                                    .map((h) => (
                                        <MapMarker
                                            key={`rlh-${h.id}`}
                                            position={[h.latitude, h.longitude]}
                                            icon={HouseholdMarkerIcon('RLH')}
                                            iconAnchor={[12, 12]}
                                            popupAnchor={[0, -12]}
                                            aria-label={`Rumah RLH: ${h.head_name}`}
                                        >
                                            <MapPopup>
                                                <div
                                                    className="space-y-2"
                                                    aria-label="Informasi rumah"
                                                >
                                                    <div className="font-medium">
                                                        {h.head_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {h.address_text}
                                                    </div>
                                                    <div className="text-xs">
                                                        Status: RLH
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            Provinsi:{' '}
                                                            {h.province_name ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            Kab/Kota:{' '}
                                                            {h.regency_name ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            Kecamatan:{' '}
                                                            {h.district_name ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            Desa:{' '}
                                                            {h.village_name ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </MapPopup>
                                        </MapMarker>
                                    ))}
                            </MapLayerGroup>

                            <MapLayerGroup name="Rumah Tidak Layak Huni">
                                {households
                                    .filter(
                                        (h) => h.habitability_status === 'RTLH',
                                    )
                                    .map((h) => (
                                        <MapMarker
                                            key={`rtlh-${h.id}`}
                                            position={[h.latitude, h.longitude]}
                                            icon={HouseholdMarkerIcon('RTLH')}
                                            iconAnchor={[12, 12]}
                                            popupAnchor={[0, -12]}
                                            aria-label={`Rumah Tidak Layak Huni: ${h.head_name}`}
                                        >
                                            <MapPopup>
                                                <div
                                                    className="space-y-2"
                                                    aria-label="Informasi rumah"
                                                >
                                                    <div className="font-medium">
                                                        {h.head_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {h.address_text}
                                                    </div>
                                                    <div className="text-xs">
                                                        Status: RTLH
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            Provinsi:{' '}
                                                            {h.province_name ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            Kab/Kota:{' '}
                                                            {h.regency_name ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            Kecamatan:{' '}
                                                            {h.district_name ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            Desa:{' '}
                                                            {h.village_name ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </MapPopup>
                                        </MapMarker>
                                    ))}
                            </MapLayerGroup>

                            {areaGroups.map((group) => {
                                const groupColor = group.legend_color_hex;
                                const groupLayerName = `Kawasan ${group.name}`;
                                const groupShape = (() => {
                                    const raw =
                                        typeof group.geometry_json === 'string'
                                            ? JSON.parse(
                                                  group.geometry_json as string,
                                              )
                                            : group.geometry_json;
                                    if (!raw) return null;
                                    const poly = parsePolygon(raw);
                                    if (poly)
                                        return {
                                            type: 'polygon' as const,
                                            positions: poly,
                                        };
                                    const rect = parseRectangle(raw);
                                    if (rect)
                                        return {
                                            type: 'rectangle' as const,
                                            bounds: rect,
                                        };
                                    return null;
                                })();
                                return (
                                    <MapLayerGroup
                                        key={`group-${group.id}`}
                                        name={groupLayerName}
                                    >
                                        {group.areas.map((area) => {
                                            const raw =
                                                typeof area.geometry_json ===
                                                'string'
                                                    ? JSON.parse(
                                                          area.geometry_json as string,
                                                      )
                                                    : area.geometry_json;
                                            const color = area.color;

                                            console.log(color);
                                            const poly = parsePolygon(raw);
                                            const rect = !poly
                                                ? parseRectangle(raw)
                                                : null;
                                            if (poly) {
                                                return (
                                                    <MapPolygon
                                                        key={`area-poly-${area.id}`}
                                                        positions={poly}
                                                        pathOptions={{
                                                            color: color,
                                                            fillColor: color,
                                                            weight: 2,
                                                            opacity: 0.9,
                                                            fillOpacity: 0.2,
                                                        }}
                                                        className={`cursor-pointer fill-[${color}] stroke-[${color}] stroke-2 transition-all duration-300 hover:opacity-80`}
                                                    >
                                                        <MapPopup>
                                                            <div
                                                                className="space-y-2"
                                                                aria-label="Informasi area"
                                                            >
                                                                <div className="font-medium">
                                                                    {area.name}
                                                                </div>
                                                                <div className="text-xs whitespace-pre-line text-muted-foreground">
                                                                    {area.description ||
                                                                        '-'}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div>
                                                                        Provinsi:{' '}
                                                                        {area.province_name ||
                                                                            '-'}
                                                                    </div>
                                                                    <div>
                                                                        Kab/Kota:{' '}
                                                                        {area.regency_name ||
                                                                            '-'}
                                                                    </div>
                                                                    <div>
                                                                        Kecamatan:{' '}
                                                                        {area.district_name ||
                                                                            '-'}
                                                                    </div>
                                                                    <div>
                                                                        Desa:{' '}
                                                                        {area.village_name ||
                                                                            '-'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MapPopup>
                                                    </MapPolygon>
                                                );
                                            }
                                            if (rect) {
                                                return (
                                                    <MapRectangle
                                                        key={`area-rect-${area.id}`}
                                                        bounds={rect}
                                                        pathOptions={{
                                                            color: color,
                                                            fillColor: color,
                                                            weight: 2,
                                                            opacity: 0.9,
                                                            fillOpacity: 0.2,
                                                        }}
                                                        className={`cursor-pointer transition-all fill-[${color}] stroke-[${color}] stroke-2 duration-300 hover:opacity-80`}
                                                    >
                                                        <MapPopup>
                                                            <div
                                                                className="space-y-2"
                                                                aria-label="Informasi area"
                                                            >
                                                                <div className="font-medium">
                                                                    {area.name}
                                                                </div>
                                                                <div className="text-xs whitespace-pre-line text-muted-foreground">
                                                                    {area.description ||
                                                                        '-'}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div>
                                                                        Provinsi:{' '}
                                                                        {area.province_name ||
                                                                            '-'}
                                                                    </div>
                                                                    <div>
                                                                        Kab/Kota:{' '}
                                                                        {area.regency_name ||
                                                                            '-'}
                                                                    </div>
                                                                    <div>
                                                                        Kecamatan:{' '}
                                                                        {area.district_name ||
                                                                            '-'}
                                                                    </div>
                                                                    <div>
                                                                        Desa:{' '}
                                                                        {area.village_name ||
                                                                            '-'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MapPopup>
                                                    </MapRectangle>
                                                );
                                            }
                                            return null;
                                        })}
                                    </MapLayerGroup>
                                );
                            })}
                        </MapLayers>
                    </Map>
                </div>
            </div>
        </AppLayout>
    );
}
