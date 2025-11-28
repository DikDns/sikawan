import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import {
    Map,
    MapLayerGroup,
    MapLayers,
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
    Eye,
    EyeOff,
    GraduationCap,
    Home,
    Hospital,
    Search,
    Trash2,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

const parsePoint = (geometry: any) => {
    if (
        !geometry ||
        geometry.type !== 'Point' ||
        !Array.isArray(geometry.coordinates)
    )
        return null;
    const [lng, lat] = geometry.coordinates as [number, number];
    return [lat, lng] as [number, number];
};

const parseLineString = (geometry: any) => {
    if (
        !geometry ||
        geometry.type !== 'LineString' ||
        !Array.isArray(geometry.coordinates)
    )
        return null;
    return (geometry.coordinates as [number, number][]).map(
        ([lng, lat]) => [lat, lng] as [number, number],
    );
};

export default function PublicDistributionMap() {
    const {
        households = [],
        areaGroups = [],
        infrastructureGroups = [],
        error,
    } = usePage<{
        households: HouseholdForMap[];
        areaGroups: AreaGroupForMap[];
        infrastructureGroups: InfrastructureGroupForMap[];
        error?: string;
    }>().props;

    const [query, setQuery] = useState('');
    const [showRumah, setShowRumah] = useState(true);
    const [showKawasan, setShowKawasan] = useState(true);
    const [showPSU, setShowPSU] = useState(true);

    useEffect(() => {
        const id = setInterval(() => {
            router.reload({
                only: ['households', 'areaGroups', 'infrastructureGroups'],
            });
        }, 60000);
        return () => clearInterval(id);
    }, []);

    const filteredHouseholds = useMemo(() => {
        if (!query) return households;
        const q = query.toLowerCase();
        return households.filter(
            (h) =>
                h.head_name.toLowerCase().includes(q) ||
                h.address_text.toLowerCase().includes(q) ||
                h.village_name?.toLowerCase().includes(q) ||
                h.district_name?.toLowerCase().includes(q),
        );
    }, [households, query]);

    const filteredAreaGroups = useMemo(() => {
        if (!query) return areaGroups;
        const q = query.toLowerCase();
        return areaGroups.filter((g) => g.name.toLowerCase().includes(q));
    }, [areaGroups, query]);

    const filteredInfraGroups = useMemo(() => {
        if (!query) return infrastructureGroups;
        const q = query.toLowerCase();
        return infrastructureGroups
            .map((g) => ({
                ...g,
                items: g.items.filter((i) =>
                    (i.name || '').toLowerCase().includes(q),
                ),
            }))
            .filter((g) => g.items.length > 0);
    }, [infrastructureGroups, query]);

    const center = useMemo(() => {
        const list =
            filteredHouseholds.length > 0 ? filteredHouseholds : households;
        if (list.length > 0) {
            const lat = list.reduce((s, h) => s + h.latitude, 0) / list.length;
            const lng = list.reduce((s, h) => s + h.longitude, 0) / list.length;
            return [lat, lng] as [number, number];
        }
        const withCentroid = (areaGroups || []).filter(
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
    }, [filteredHouseholds, households, areaGroups]);

    const kawasanLayerNames = useMemo(
        () => filteredAreaGroups.map((g) => `Kawasan ${g.name}`),
        [filteredAreaGroups],
    );
    const psuLayerNames = useMemo(
        () => filteredInfraGroups.map((g) => `PSU ${g.name}`),
        [filteredInfraGroups],
    );

    const activeGroups = useMemo(() => {
        const base: string[] = [];
        if (showRumah) base.push('Rumah Layak Huni', 'Rumah Tidak Layak Huni');
        if (showKawasan) base.push(...kawasanLayerNames);
        if (showPSU) base.push(...psuLayerNames);
        return base;
    }, [showRumah, showKawasan, showPSU, kawasanLayerNames, psuLayerNames]);

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
        <div className="flex min-h-screen flex-col">
            <Head title="Peta Sebaran" />
            <header className="fixed z-50 w-full">
                <div className="bg-secondary/75 text-secondary-foreground backdrop-blur-sm">
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
                </div>
            </header>
            <div className="relative h-[calc(100vh-64px)] w-full pt-16">
                <Map
                    center={[-4.2327, 103.6141]}
                    zoom={13}
                    className="h-full w-full"
                >
                    <MapTileLayer name="OSM" />

                    <MapLayers
                        key={activeGroups.sort().join('|')}
                        defaultLayerGroups={activeGroups}
                    >
                        <MapZoomControl />
                        <MapLocateControl />

                        <MapLayerGroup name="Rumah Layak Huni">
                            {filteredHouseholds
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
                                            </div>
                                        </MapPopup>
                                    </MapMarker>
                                ))}
                        </MapLayerGroup>

                        <MapLayerGroup name="Rumah Tidak Layak Huni">
                            {filteredHouseholds
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
                                            </div>
                                        </MapPopup>
                                    </MapMarker>
                                ))}
                        </MapLayerGroup>

                        {filteredAreaGroups.map((group) => (
                            <MapLayerGroup
                                key={`group-${group.id}`}
                                name={`Kawasan ${group.name}`}
                            >
                                {group.areas.map((area) => {
                                    let raw: any = area.geometry_json;
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
                                                    </div>
                                                </MapPopup>
                                            </MapRectangle>
                                        );
                                    }
                                    return null;
                                })}
                            </MapLayerGroup>
                        ))}

                        {filteredInfraGroups.map((group) => (
                            <MapLayerGroup
                                key={`psu-${group.id}`}
                                name={`PSU ${group.name}`}
                            >
                                {group.items.map((item) => {
                                    let raw: any = item.geometry_json;
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
                                                iconAnchor={[12, 12]}
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
                                            />
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
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </MapLayerGroup>
                        ))}
                    </MapLayers>
                </Map>

                <div className="pointer-events-none absolute inset-0">
                    <div className="pointer-events-auto absolute top-20 right-3 z-[1000] w-[86vw] max-w-[320px] rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur-sm sm:w-[360px]">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari"
                                className="pl-10"
                                aria-label="Cari"
                            />
                        </div>
                        <div className="mt-3 space-y-2">
                            <Card className="bg-card">
                                <CardContent className="flex items-center justify-between p-3">
                                    <div className="font-medium">Rumah</div>
                                    <Button
                                        type="button"
                                        size="icon-sm"
                                        variant={
                                            showRumah ? 'default' : 'secondary'
                                        }
                                        aria-label="Tampilkan Rumah"
                                        onClick={() => setShowRumah((v) => !v)}
                                    >
                                        {showRumah ? (
                                            <Eye className="size-4" />
                                        ) : (
                                            <EyeOff className="size-4" />
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="bg-card">
                                <CardContent className="flex items-center justify-between p-3">
                                    <div className="font-medium">Kawasan</div>
                                    <Button
                                        type="button"
                                        size="icon-sm"
                                        variant={
                                            showKawasan
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        aria-label="Tampilkan Kawasan"
                                        onClick={() =>
                                            setShowKawasan((v) => !v)
                                        }
                                    >
                                        {showKawasan ? (
                                            <Eye className="size-4" />
                                        ) : (
                                            <EyeOff className="size-4" />
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="bg-card">
                                <CardContent className="flex items-center justify-between p-3">
                                    <div className="font-medium">PSU</div>
                                    <Button
                                        type="button"
                                        size="icon-sm"
                                        variant={
                                            showPSU ? 'default' : 'secondary'
                                        }
                                        aria-label="Tampilkan PSU"
                                        onClick={() => setShowPSU((v) => !v)}
                                    >
                                        {showPSU ? (
                                            <Eye className="size-4" />
                                        ) : (
                                            <EyeOff className="size-4" />
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        {error && (
                            <div
                                role="alert"
                                className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                            >
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-secondary py-3">
                <p className="text-center text-xs text-secondary-foreground/80">
                    ©2025 Dinas Perumahan Rakyat dan Kawasan Permukiman
                    Kabupaten Muara Enim. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
