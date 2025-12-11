import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
    DEFAULT_CENTER,
    Map,
    MapLayerGroup,
    MapLayers,
    MapLayersControl,
    MapLocateControl,
    MapMarker,
    MapPolygon,
    MapPolyline,
    MapPopup,
    MapRectangle,
    MapTileLayer,
    MapZoomControl,
} from '@/components/ui/map';
import { home, login } from '@/routes';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    Droplet,
    GraduationCap,
    Home,
    Hospital,
    Trash2,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';

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

interface InfrastructureItem {
    id: number;
    name: string;
    description?: string | null;
    geometry_type: 'Point' | 'LineString' | 'Polygon';
    geometry_json: unknown;
    color?: string | null;
}

interface InfrastructureGroupForMap {
    id: number;
    code?: string | null;
    name: string;
    category?: string | null;
    type: 'Marker' | 'Polyline' | 'Polygon';
    legend_color_hex?: string | null;
    legend_icon?: string | null;
    description?: string | null;
    items: InfrastructureItem[];
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

const parsePolygon = (geometry: unknown) => {
    const g = geometry as { type?: unknown; coordinates?: unknown };
    if (!g || g.type !== 'Polygon' || !Array.isArray(g.coordinates))
        return null;
    const rings = g.coordinates as number[][][];
    return rings.map((ring) =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number]),
    );
};

const parseRectangle = (geometry: unknown) => {
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

const parsePoint = (geometry: unknown) => {
    const g = geometry as { type?: unknown; coordinates?: unknown };
    if (!g || g.type !== 'Point' || !Array.isArray(g.coordinates)) return null;
    const [lng, lat] = g.coordinates as [number, number];
    return [lat, lng] as [number, number];
};

const parseLineString = (geometry: unknown) => {
    const g = geometry as { type?: unknown; coordinates?: unknown };
    if (!g || g.type !== 'LineString' || !Array.isArray(g.coordinates))
        return null;
    return (g.coordinates as [number, number][])?.map(
        ([lng, lat]) => [lat, lng] as [number, number],
    );
};

export default function PublicDistributionMap() {
    const {
        households = [],
        areaGroups = [],
        infrastructureGroups = [],
    } = usePage<{
        households: HouseholdForMap[];
        areaGroups: AreaGroupForMap[];
        infrastructureGroups: InfrastructureGroupForMap[];
        error?: string;
    }>().props;

    // Auto-refresh data periodically
    useEffect(() => {
        const reloadData = () => {
            router.reload({
                only: ['households', 'areaGroups', 'infrastructureGroups'],
            });
        };

        const intervalId = setInterval(reloadData, 15000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                reloadData();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, []);

    // const center = useMemo(() => {
    //     if (households.length > 0) {
    //         const lat =
    //             households.reduce((s, h) => s + h.latitude, 0) /
    //             households.length;
    //         const lng =
    //             households.reduce((s, h) => s + h.longitude, 0) /
    //             households.length;
    //         return [lat, lng] as [number, number];
    //     }
    //     const withCentroid = areaGroups.filter(
    //         (g) => g.centroid_lat && g.centroid_lng,
    //     );
    //     if (withCentroid.length > 0) {
    //         const lat =
    //             withCentroid.reduce((s, g) => s + (g.centroid_lat || 0), 0) /
    //             withCentroid.length;
    //         const lng =
    //             withCentroid.reduce((s, g) => s + (g.centroid_lng || 0), 0) /
    //             withCentroid.length;
    //         return [lat, lng] as [number, number];
    //     }
    //     return [-3.6632234, 103.7781606] as [number, number];
    // }, [households, areaGroups]);

    // Layer names grouped by category - matching distribution-map.tsx format
    const rumahLayerNames = useMemo(
        () => ['Rumah: Layak Huni (RLH)', 'Rumah: Tidak Layak Huni (RTLH)'],
        [],
    );
    const kawasanLayerNames = useMemo(
        () => areaGroups.map((g) => `Kawasan: ${g.name}`),
        [areaGroups],
    );
    const psuLayerNames = useMemo(
        () => infrastructureGroups.map((g) => `PSU: ${g.name}`),
        [infrastructureGroups],
    );
    const defaultLayerGroups = useMemo(
        () => [...rumahLayerNames, ...kawasanLayerNames, ...psuLayerNames],
        [rumahLayerNames, kawasanLayerNames, psuLayerNames],
    );

    function PSUMarkerIcon(group: InfrastructureGroupForMap) {
        const color = group.legend_color_hex || DEFAULT_COLOR;
        const name = (group.legend_icon || '').toLowerCase();
        let iconEl = <Building2 className="size-6" style={{ color }} />;
        if (name === 'hospital')
            iconEl = <Hospital className="size-6" style={{ color }} />;
        else if (name === 'graduation-cap')
            iconEl = <GraduationCap className="size-6" style={{ color }} />;
        else if (name === 'zap')
            iconEl = <Zap className="size-6" style={{ color }} />;
        else if (name === 'droplet')
            iconEl = <Droplet className="size-6" style={{ color }} />;
        else if (name === 'trash-2')
            iconEl = <Trash2 className="size-6" style={{ color }} />;
        else if (name === 'building-2')
            iconEl = <Building2 className="size-6" style={{ color }} />;
        return (
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    backgroundColor: '#ffffff',
                    borderRadius: 9999,
                    border: '2px solid #0f172a',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                }}
            >
                {iconEl}
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col">
            <Head title="Peta Sebaran" />
            {/* Fixed Header */}
            <header className="fixed top-0 z-50 w-full bg-secondary/95 text-secondary-foreground backdrop-blur-sm">
                <Container>
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/sikawan-logo.png"
                                alt="SIHUMA"
                                className="h-8 w-8"
                            />
                            <span className="text-lg font-semibold text-primary">
                                SIHUMA
                            </span>
                        </div>
                        <nav className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href={home()}>Home</Link>
                            </Button>
                            <Button asChild>
                                <Link href={login()}>Login</Link>
                            </Button>
                        </nav>
                    </div>
                </Container>
            </header>

            {/* Map Container - fills remaining height after header */}
            <div className="flex-1 pt-16">
                <Map
                    center={DEFAULT_CENTER}
                    zoom={15}
                    className="h-full w-full"
                >
                    <MapTileLayer name="OSM" />

                    <MapLayers defaultLayerGroups={defaultLayerGroups}>
                        <MapLayersControl
                            layerGroupsLabel="Layer"
                            tileLayersLabel="Tipe Peta"
                        />
                        <MapZoomControl />
                        <MapLocateControl />

                        <MapLayerGroup name="Rumah: Layak Huni (RLH)">
                            {households
                                .filter((h) => h.habitability_status === 'RLH')
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
                                                        {h.province_name || '-'}
                                                    </div>
                                                    <div>
                                                        Kab/Kota:{' '}
                                                        {h.regency_name || '-'}
                                                    </div>
                                                    <div>
                                                        Kecamatan:{' '}
                                                        {h.district_name || '-'}
                                                    </div>
                                                    <div>
                                                        Desa:{' '}
                                                        {h.village_name || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </MapPopup>
                                    </MapMarker>
                                ))}
                        </MapLayerGroup>

                        <MapLayerGroup name="Rumah: Tidak Layak Huni (RTLH)">
                            {households
                                .filter((h) => h.habitability_status === 'RTLH')
                                .map((h) => (
                                    <MapMarker
                                        key={`rtlh-${h.id}`}
                                        position={[h.latitude, h.longitude]}
                                        icon={HouseholdMarkerIcon('RTLH')}
                                        iconAnchor={[12, 12]}
                                        popupAnchor={[0, -12]}
                                        aria-label={`Rumah RTLH: ${h.head_name}`}
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
                                                        {h.province_name || '-'}
                                                    </div>
                                                    <div>
                                                        Kab/Kota:{' '}
                                                        {h.regency_name || '-'}
                                                    </div>
                                                    <div>
                                                        Kecamatan:{' '}
                                                        {h.district_name || '-'}
                                                    </div>
                                                    <div>
                                                        Desa:{' '}
                                                        {h.village_name || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </MapPopup>
                                    </MapMarker>
                                ))}
                        </MapLayerGroup>

                        {areaGroups.map((group) => (
                            <MapLayerGroup
                                key={`group-${group.id}`}
                                name={`Kawasan: ${group.name}`}
                            >
                                {group.areas.map((area) => {
                                    let raw = area.geometry_json;
                                    if (typeof raw === 'string') {
                                        try {
                                            raw = JSON.parse(raw);
                                        } catch {
                                            raw = null;
                                        }
                                    }
                                    const color =
                                        area.color ||
                                        group.legend_color_hex ||
                                        DEFAULT_COLOR;
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
                                                    color,
                                                    fillColor: color,
                                                    weight: 2,
                                                    opacity: 0.9,
                                                    fillOpacity: 0.2,
                                                }}
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
                                                    color,
                                                    fillColor: color,
                                                    weight: 2,
                                                    opacity: 0.9,
                                                    fillOpacity: 0.2,
                                                }}
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
                                                    </div>
                                                </MapPopup>
                                            </MapRectangle>
                                        );
                                    }
                                    return null;
                                })}
                            </MapLayerGroup>
                        ))}

                        {infrastructureGroups.map((group) => (
                            <MapLayerGroup
                                key={`psu-${group.id}`}
                                name={`PSU: ${group.name}`}
                            >
                                {group.items.map((item) => {
                                    let raw = item.geometry_json;
                                    if (typeof raw === 'string') {
                                        try {
                                            raw = JSON.parse(raw);
                                        } catch {
                                            raw = null;
                                        }
                                    }
                                    const color =
                                        item.color ||
                                        group.legend_color_hex ||
                                        DEFAULT_COLOR;
                                    const point = parsePoint(raw);
                                    const line = !point
                                        ? parseLineString(raw)
                                        : null;
                                    const poly =
                                        !point && !line
                                            ? parsePolygon(raw)
                                            : null;
                                    if (point) {
                                        return (
                                            <MapMarker
                                                key={`psu-point-${item.id}`}
                                                position={point}
                                                icon={PSUMarkerIcon(group)}
                                                iconAnchor={[14, 14]}
                                                popupAnchor={[0, -14]}
                                                aria-label={`PSU: ${item.name || 'Titik'}`}
                                            >
                                                <MapPopup>
                                                    <div
                                                        className="space-y-2"
                                                        aria-label="Informasi PSU"
                                                    >
                                                        <div className="font-medium">
                                                            {item.name || 'PSU'}
                                                        </div>
                                                        <div className="text-xs whitespace-pre-line text-muted-foreground">
                                                            {item.description ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                </MapPopup>
                                            </MapMarker>
                                        );
                                    }
                                    if (line) {
                                        return (
                                            <MapPolyline
                                                key={`psu-line-${item.id}`}
                                                positions={line}
                                                pathOptions={{
                                                    color,
                                                    weight: 3,
                                                    opacity: 0.9,
                                                }}
                                            >
                                                <MapPopup>
                                                    <div
                                                        className="space-y-2"
                                                        aria-label="Informasi PSU"
                                                    >
                                                        <div className="font-medium">
                                                            {item.name || 'PSU'}
                                                        </div>
                                                        <div className="text-xs whitespace-pre-line text-muted-foreground">
                                                            {item.description ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                </MapPopup>
                                            </MapPolyline>
                                        );
                                    }
                                    if (poly) {
                                        return (
                                            <MapPolygon
                                                key={`psu-poly-${item.id}`}
                                                positions={poly}
                                                pathOptions={{
                                                    color,
                                                    fillColor: color,
                                                    weight: 2,
                                                    opacity: 0.9,
                                                    fillOpacity: 0.15,
                                                }}
                                            >
                                                <MapPopup>
                                                    <div
                                                        className="space-y-2"
                                                        aria-label="Informasi PSU"
                                                    >
                                                        <div className="font-medium">
                                                            {item.name || 'PSU'}
                                                        </div>
                                                        <div className="text-xs whitespace-pre-line text-muted-foreground">
                                                            {item.description ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                </MapPopup>
                                            </MapPolygon>
                                        );
                                    }
                                    return null;
                                })}
                            </MapLayerGroup>
                        ))}
                    </MapLayers>
                </Map>
            </div>
        </div>
    );
}
