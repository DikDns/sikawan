import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Eye, EyeOff, Home, MapPin, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    GeoJSON,
    LayerGroup,
    MapContainer,
    TileLayer,
    ZoomControl,
} from 'react-leaflet';

// Fix leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJsonObject = any;

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.setIcon(DefaultIcon);

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

interface Household {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status_mbr: 'MBR' | 'NON_MBR';
    member_total: number;
    score?: number;
}

interface AreaFeature {
    id: number;
    name: string;
    area_group_id: string;
    geometry: GeoJsonObject;
    household_count: number;
    family_count: number;
}

interface Infrastructure {
    id: number;
    name: string;
    type: string;
    geometry: GeoJsonObject;
    category: string;
}

const MOCK_HOUSEHOLDS: Household[] = [
    {
        id: 1,
        name: 'Rumah Keluarga Jaya',
        address: 'Jl. Muara Enim No. 123',
        latitude: -3.0627,
        longitude: 104.7429,
        status_mbr: 'MBR',
        member_total: 5,
        score: 75,
    },
    {
        id: 2,
        name: 'Rumah Sejahtera',
        address: 'Jl. Gunung Megang No. 45',
        latitude: -3.0632,
        longitude: 104.7435,
        status_mbr: 'NON_MBR',
        member_total: 4,
        score: 82,
    },
    {
        id: 3,
        name: 'Rumah Makmur',
        address: 'Jl. Rambang No. 67',
        latitude: -3.065,
        longitude: 104.7445,
        status_mbr: 'MBR',
        member_total: 6,
        score: 68,
    },
    {
        id: 4,
        name: 'Rumah Berkah',
        address: 'Jl. Tangga Laut No. 89',
        latitude: -3.0615,
        longitude: 104.741,
        status_mbr: 'NON_MBR',
        member_total: 3,
        score: 88,
    },
    {
        id: 5,
        name: 'Rumah Harapan',
        address: 'Jl. Lawang Kidul No. 12',
        latitude: -3.068,
        longitude: 104.7455,
        status_mbr: 'MBR',
        member_total: 7,
        score: 72,
    },
];

const MOCK_AREAS: AreaFeature[] = [
    {
        id: 1,
        name: 'Kawasan Kumuh 1',
        area_group_id: 'SLUM',
        geometry: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [104.74, -3.064],
                                [104.742, -3.064],
                                [104.742, -3.066],
                                [104.74, -3.066],
                                [104.74, -3.064],
                            ],
                        ],
                    },
                },
            ],
        },
        household_count: 45,
        family_count: 40,
    },
    {
        id: 2,
        name: 'Kawasan Permukiman 1',
        area_group_id: 'SETTLEMENT',
        geometry: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [104.741, -3.062],
                                [104.744, -3.062],
                                [104.744, -3.065],
                                [104.741, -3.065],
                                [104.741, -3.062],
                            ],
                        ],
                    },
                },
            ],
        },
        household_count: 120,
        family_count: 110,
    },
];

const MOCK_INFRASTRUCTURE: Infrastructure[] = [
    {
        id: 1,
        name: 'Jalur Pipa Air 1',
        type: 'WATER_PIPE',
        category: 'Air Bersih',
        geometry: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [104.74, -3.061],
                            [104.745, -3.068],
                        ],
                    },
                },
            ],
        },
    },
    {
        id: 2,
        name: 'Tiang PLN',
        type: 'POWER_POLE',
        category: 'Listrik',
        geometry: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [104.7425, -3.0635],
                    },
                },
            ],
        },
    },
    {
        id: 3,
        name: 'Rumah Sakit',
        type: 'HOSPITAL',
        category: 'Kesehatan',
        geometry: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: { type: 'Point', coordinates: [104.743, -3.062] },
                },
            ],
        },
    },
];

export default function DistributionMap() {
    const [selectedAreas, setSelectedAreas] = useState<Set<string>>(
        new Set(['SLUM', 'SETTLEMENT']),
    );
    const [selectedInfra, setSelectedInfra] = useState<Set<string>>(
        new Set(['WATER_PIPE', 'POWER_POLE', 'HOSPITAL']),
    );
    const [householdStatus, setHouseholdStatus] = useState<string>('all');
    const [visibleHouseholds, setVisibleHouseholds] = useState(true);
    const [visibleAreas, setVisibleAreas] = useState(true);
    const [visibleInfra, setVisibleInfra] = useState(true);

    const filteredHouseholds = useMemo(() => {
        return MOCK_HOUSEHOLDS.filter(
            (h) =>
                householdStatus === 'all' || h.status_mbr === householdStatus,
        );
    }, [householdStatus]);

    const filteredAreas = useMemo(() => {
        return MOCK_AREAS.filter((a) => selectedAreas.has(a.area_group_id));
    }, [selectedAreas]);

    const filteredInfra = useMemo(() => {
        return MOCK_INFRASTRUCTURE.filter((i) => selectedInfra.has(i.type));
    }, [selectedInfra]);

    const toggleAreaGroup = (groupId: string): void => {
        const newSet = new Set(selectedAreas);
        if (newSet.has(groupId)) {
            newSet.delete(groupId);
        } else {
            newSet.add(groupId);
        }
        setSelectedAreas(newSet);
    };

    const toggleInfraType = (type: string): void => {
        const newSet = new Set(selectedInfra);
        if (newSet.has(type)) {
            newSet.delete(type);
        } else {
            newSet.add(type);
        }
        setSelectedInfra(newSet);
    };

    const getColorForArea = (groupId: string): string => {
        const colors: Record<string, string> = {
            SLUM: '#F28AAA',
            SETTLEMENT: '#B2F02C',
            DISASTER_RISK: '#FF6B6B',
            PRIORITY_DEV: '#4C6EF5',
        };
        return colors[groupId] || '#999999';
    };

    const getIconForInfra = (type: string): string => {
        switch (type) {
            case 'WATER_PIPE':
                return '💧';
            case 'POWER_POLE':
                return '⚡';
            case 'HOSPITAL':
                return '🏥';
            default:
                return '📍';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Sebaran" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Peta Sebaran</h1>
                        <p className="text-muted-foreground">
                            Visualisasi geografis data rumah, kawasan, dan
                            infrastruktur
                        </p>
                    </div>
                </div>

                <div className="flex flex-1 gap-4 overflow-hidden">
                    <Card className="w-80 overflow-y-auto">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                                Filter Data
                            </CardTitle>
                            <CardDescription>
                                Pilih data yang ingin ditampilkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold">
                                    Tampilkan/Sembunyikan
                                </h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() =>
                                            setVisibleHouseholds(
                                                !visibleHouseholds,
                                            )
                                        }
                                        className="flex w-full items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted"
                                    >
                                        {visibleHouseholds ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                        <span>
                                            Rumah ({filteredHouseholds.length})
                                        </span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setVisibleAreas(!visibleAreas)
                                        }
                                        className="flex w-full items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted"
                                    >
                                        {visibleAreas ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                        <span>
                                            Kawasan ({filteredAreas.length})
                                        </span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setVisibleInfra(!visibleInfra)
                                        }
                                        className="flex w-full items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted"
                                    >
                                        {visibleInfra ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                        <span>
                                            Infrastruktur (
                                            {filteredInfra.length})
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold">
                                    <Home className="h-4 w-4" />
                                    Filter Rumah
                                </h4>
                                <Select
                                    value={householdStatus}
                                    onValueChange={setHouseholdStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status KK" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="MBR">
                                            MBR (Masyarakat Berpenghasilan
                                            Rendah)
                                        </SelectItem>
                                        <SelectItem value="NON_MBR">
                                            Non-MBR
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold">
                                    <MapPin className="h-4 w-4" />
                                    Kawasan
                                </h4>
                                <div className="space-y-2">
                                    {[
                                        { id: 'SLUM', name: 'Kawasan Kumuh' },
                                        {
                                            id: 'SETTLEMENT',
                                            name: 'Kawasan Permukiman',
                                        },
                                        {
                                            id: 'DISASTER_RISK',
                                            name: 'Kawasan Rawan Bencana',
                                        },
                                        {
                                            id: 'PRIORITY_DEV',
                                            name: 'Lokasi Prioritas',
                                        },
                                    ].map((group) => (
                                        <label
                                            key={group.id}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={selectedAreas.has(
                                                    group.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleAreaGroup(group.id)
                                                }
                                            />
                                            <span className="flex flex-1 items-center gap-2 text-sm">
                                                <div
                                                    className="h-3 w-3 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            getColorForArea(
                                                                group.id,
                                                            ),
                                                    }}
                                                />
                                                {group.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold">
                                    <Zap className="h-4 w-4" />
                                    Infrastruktur
                                </h4>
                                <div className="space-y-2">
                                    {[
                                        { id: 'WATER_PIPE', name: 'Pipa Air' },
                                        { id: 'POWER_POLE', name: 'Tiang PLN' },
                                        { id: 'HOSPITAL', name: 'Rumah Sakit' },
                                    ].map((infra) => (
                                        <label
                                            key={infra.id}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={selectedInfra.has(
                                                    infra.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleInfraType(infra.id)
                                                }
                                            />
                                            <span className="flex items-center gap-2 text-sm">
                                                <span>
                                                    {getIconForInfra(infra.id)}
                                                </span>
                                                {infra.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2 rounded-md bg-muted p-3">
                                <div className="text-xs font-semibold text-muted-foreground">
                                    Ringkasan
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div>
                                        Rumah: {filteredHouseholds.length}
                                    </div>
                                    <div>Kawasan: {filteredAreas.length}</div>
                                    <div>PSU: {filteredInfra.length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex-1 overflow-hidden rounded-lg border">
                        <MapContainer
                            center={[-3.0638, 104.7429]}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <ZoomControl position="topright" />

                            {visibleHouseholds && (
                                <LayerGroup>
                                    {filteredHouseholds.map((household) => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const data: any = {
                                            type: 'FeatureCollection',
                                            features: [
                                                {
                                                    type: 'Feature',
                                                    properties: {
                                                        name: household.name,
                                                    },
                                                    geometry: {
                                                        type: 'Point',
                                                        coordinates: [
                                                            household.longitude,
                                                            household.latitude,
                                                        ],
                                                    },
                                                },
                                            ],
                                        };
                                        return (
                                            <GeoJSON
                                                key={household.id}
                                                data={data}
                                                pointToLayer={(
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    feature: any,
                                                    latlng,
                                                ) => {
                                                    const color =
                                                        household.status_mbr ===
                                                        'MBR'
                                                            ? '#3BD300'
                                                            : '#1E83FF';
                                                    return L.circleMarker(
                                                        latlng,
                                                        {
                                                            radius: 8,
                                                            fillColor: color,
                                                            color: '#fff',
                                                            weight: 2,
                                                            opacity: 1,
                                                            fillOpacity: 0.8,
                                                        },
                                                    );
                                                }}
                                                onEachFeature={(
                                                    feature,
                                                    layer,
                                                ) => {
                                                    layer.bindPopup(
                                                        `<div style="font-size:12px"><div style="font-weight:bold;margin-bottom:4px">${household.name}</div><div style="margin-bottom:2px;color:#666">${household.address}</div><div style="margin:4px 0"><span style="display:inline-block;padding:2px 6px;background:${household.status_mbr === 'MBR' ? '#3BD300' : '#1E83FF'};color:white;border-radius:3px;font-size:11px;margin-right:4px">${household.status_mbr}</span><span style="display:inline-block;padding:2px 6px;background:#f0f0f0;border-radius:3px;font-size:11px">${household.member_total} jiwa</span></div>${household.score ? `<div style="margin-top:4px;padding-top:4px;border-top:1px solid #eee">Skor: <strong>${household.score}</strong></div>` : ''}</div>`,
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </LayerGroup>
                            )}

                            {visibleAreas && (
                                <LayerGroup>
                                    {filteredAreas.map((area) => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const data: any = area.geometry;
                                        return (
                                            <GeoJSON
                                                key={area.id}
                                                data={data}
                                                style={() => ({
                                                    color: getColorForArea(
                                                        area.area_group_id,
                                                    ),
                                                    weight: 2,
                                                    opacity: 0.8,
                                                    fillOpacity: 0.3,
                                                })}
                                                onEachFeature={(
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    feature: any,
                                                    layer,
                                                ) => {
                                                    layer.bindPopup(
                                                        `<div style="font-size:12px"><div style="font-weight:bold">${area.name}</div><div>Rumah: ${area.household_count}</div><div>Keluarga: ${area.family_count}</div></div>`,
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </LayerGroup>
                            )}

                            {visibleInfra && (
                                <LayerGroup>
                                    {filteredInfra.map((infra) => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const data: any = infra.geometry;
                                        return (
                                            <GeoJSON
                                                key={infra.id}
                                                data={data}
                                                pointToLayer={(
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    feature: any,
                                                    latlng,
                                                ) => {
                                                    const colors: Record<
                                                        string,
                                                        string
                                                    > = {
                                                        WATER_PIPE: '#00D9FF',
                                                        POWER_POLE: '#FFD700',
                                                        HOSPITAL: '#FF6B9D',
                                                    };
                                                    const color =
                                                        colors[infra.type] ||
                                                        '#999999';
                                                    return L.circleMarker(
                                                        latlng,
                                                        {
                                                            radius: 7,
                                                            fillColor: color,
                                                            color: '#fff',
                                                            weight: 2,
                                                            opacity: 1,
                                                            fillOpacity: 0.9,
                                                        },
                                                    );
                                                }}
                                                style={() => ({
                                                    color:
                                                        infra.type ===
                                                        'WATER_PIPE'
                                                            ? '#00D9FF'
                                                            : infra.type ===
                                                                'POWER_POLE'
                                                              ? '#FFD700'
                                                              : '#FF6B9D',
                                                    weight: 2,
                                                    opacity: 0.8,
                                                })}
                                                onEachFeature={(
                                                    feature,
                                                    layer,
                                                ) => {
                                                    layer.bindPopup(
                                                        `<div style="font-size:12px"><div style="font-weight:bold">${infra.name}</div><div>${infra.category}</div></div>`,
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </LayerGroup>
                            )}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
