import {
    AreaFeatureList,
    type Area,
} from '@/components/area/area-feature-list';
import {
    AreaFormDialog,
    type Area as AreaFormType,
} from '@/components/area/area-form-dialog';
import {
    AreaMapDisplay,
    type AreaFeatureGeometry,
} from '@/components/area/area-map-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { csrfFetch, handleCsrfError } from '@/lib/csrf';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

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
    areas: Area[];
    households?: HouseholdForMap[];
}

type HabitabilityStatus = 'RLH' | 'RTLH' | null;
export interface HouseholdForMap {
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
    updated_at?: string | null;
}

export default function AreaDetail({
    areaGroup,
    areas,
    households = [],
}: Props) {
    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<AreaFormType | null>(null);
    const [areasState, setAreasState] = useState<Area[]>(areas);
    // Map temporary layer numbers to server-assigned IDs for new shapes
    const [resolvedLayerIds, setResolvedLayerIds] = useState<
        Record<number, number>
    >({});
    // In-flight guard to prevent duplicate POSTs for the same layer
    const createInFlightRef = useRef<Set<number>>(new Set());

    const [relatedHouseholds, setRelatedHouseholds] = useState<
        HouseholdForMap[]
    >([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<{
        status: string;
        last_at: string | null;
    } | null>(null);

    // keep local state in sync if server prop changes
    useEffect(() => {
        setAreasState(areas);
    }, [areas]);

    // Prepare geometry for map display from local state
    const mapFeatures: AreaFeatureGeometry[] = useMemo(
        () =>
            areasState.map((area) => ({
                id: area.id,
                name: area.name,
                geometry_json:
                    typeof area.geometry_json === 'string'
                        ? area.geometry_json
                        : JSON.stringify(area.geometry_json),
                color: areaGroup.legend_color_hex,
            })),
        [areasState, areaGroup.legend_color_hex],
    );

    // Handle layer creation from map
    const handleLayerCreated = useCallback(
        async (geometry: unknown, layerNumber: number) => {
            // Generate default name
            const defaultName = `${areaGroup.name} ${layerNumber}`;

            try {
                // Prevent duplicate POSTs for the same layer while one is in-flight
                if (createInFlightRef.current.has(layerNumber)) {
                    console.warn(
                        '[AreaDetail] Suppressed duplicate create for layer',
                        layerNumber,
                    );
                    return;
                }
                createInFlightRef.current.add(layerNumber);

                const payload = {
                    name: defaultName,
                    description: null,
                    geometry_json: geometry,
                };

                const response = await csrfFetch(
                    `/areas/${areaGroup.id}/areas`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    },
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error(
                        '[AreaDetail] Create error:',
                        response.status,
                        errorData,
                    );

                    // Handle CSRF token mismatch specifically
                    if (response.status === 419) {
                        toast.error(handleCsrfError(response, errorData));
                        return;
                    }

                    throw new Error(
                        errorData.message ||
                            `HTTP error! status: ${response.status}`,
                    );
                }

                const data = await response.json();
                toast.success(data.message || 'Area berhasil ditambahkan');
                // Optimistically add to local state if backend returns the new area
                const createdArea: Area | undefined =
                    data?.data?.area || data?.area;
                if (createdArea && createdArea.id) {
                    setAreasState((prev) => [...prev, createdArea]);
                    // Resolve temp layer number to server ID so edit/delete work
                    setResolvedLayerIds((prev) => ({
                        ...prev,
                        [layerNumber]: createdArea.id,
                    }));
                } else {
                    // Fallback soft reload if no payload returned
                    router.reload({ only: ['areas'] });
                }
            } catch (error) {
                console.error('Error creating area:', error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Gagal menyimpan area';
                toast.error(errorMessage);
            } finally {
                createInFlightRef.current.delete(layerNumber);
            }
        },
        [areaGroup.name, areaGroup.id],
    );

    // Handle area form success
    const handleFormSuccess = () => {
        window.location.reload();
    };

    // Handle area edit
    const handleAreaEditDetail = (area: Area) => {
        setEditingArea({
            id: area.id,
            name: area.name,
            description: area.description || null,
            geometry_json: area.geometry_json || null,
            province_id: area.province_id || null,
            province_name: area.province_name || null,
            regency_id: area.regency_id || null,
            regency_name: area.regency_name || null,
            district_id: area.district_id || null,
            district_name: area.district_name || null,
            village_id: area.village_id || null,
            village_name: area.village_name || null,
            is_slum: area.is_slum,
            area_total_m2: area.area_total_m2,
        });
        setIsDialogOpen(true);
    };

    // Handle area delete
    const handleAreaDelete = useCallback(
        async (areaId: number) => {
            try {
                const response = await csrfFetch(
                    `/areas/${areaGroup.id}/areas/${areaId}`,
                    {
                        method: 'DELETE',
                    },
                );

                if (!response.ok) {
                    const errText = await response.text();
                    console.error(
                        '[AreaDetail] Delete error:',
                        response.status,
                        errText,
                    );

                    // Handle CSRF token mismatch specifically
                    if (response.status === 419 || errText.includes('CSRF')) {
                        toast.error(
                            handleCsrfError(response, { message: errText }),
                        );
                        return;
                    }

                    throw new Error('Gagal menghapus area');
                }

                const data = await response.json();
                toast.success(data.message || 'Area berhasil dihapus');
                // Optimistically remove from local state
                setAreasState((prev) => prev.filter((a) => a.id !== areaId));
            } catch (error) {
                console.error('Error deleting area:', error);
                const msg =
                    error instanceof Error
                        ? error.message
                        : 'Gagal menghapus area';
                toast.error(msg);
            }
        },
        [areaGroup.id],
    );

    // Handle area select
    const handleAreaSelect = useCallback((area: Area) => {
        setSelectedAreaId(area.id);
    }, []);

    const selectedArea = useMemo(
        () =>
            selectedAreaId
                ? areasState.find((a) => a.id === selectedAreaId) || null
                : null,
        [areasState, selectedAreaId],
    );

    useEffect(() => {
        const load = async () => {
            if (!selectedAreaId) {
                setRelatedHouseholds([]);
                setSyncStatus(null);
                return;
            }
            setRelatedLoading(true);
            setRelatedError(null);
            try {
                const res = await csrfFetch(
                    `/areas/${selectedAreaId}/households?limit=50`,
                    { method: 'GET' },
                );
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setRelatedError(handleCsrfError(res, data));
                    setRelatedHouseholds([]);
                    setSyncStatus(null);
                    return;
                }
                const data = await res.json();
                const list: HouseholdForMap[] = (data?.data || []).map(
                    (h: {
                        id: number;
                        head_name: string;
                        habitability_status?: HabitabilityStatus;
                        updated_at?: string | null;
                    }) => ({
                        id: h.id,
                        head_name: h.head_name,
                        address_text: '',
                        latitude: 0,
                        longitude: 0,
                        habitability_status: h.habitability_status ?? null,
                        updated_at: h.updated_at ?? null,
                    }),
                );
                setRelatedHouseholds(list);
                setSyncStatus({
                    status: data?.sync?.status ?? 'unknown',
                    last_at: data?.sync?.last_at ?? null,
                });
            } catch {
                setRelatedError('Gagal memuat data rumah');
                setRelatedHouseholds([]);
                setSyncStatus(null);
            } finally {
                setRelatedLoading(false);
            }
        };
        void load();
    }, [selectedAreaId]);

    const handleLayerEdited = useCallback(
        async (id: number, geometry: unknown) => {
            try {
                const response = await csrfFetch(
                    `/areas/${areaGroup.id}/areas/${id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name:
                                areasState.find((a) => a.id === id)?.name || '',
                            geometry_json: geometry,
                        }),
                    },
                );

                if (!response.ok) {
                    const errText = await response.text();
                    console.error(
                        '[AreaDetail] Server response error:',
                        response.status,
                        errText,
                    );

                    // Handle CSRF token mismatch specifically
                    if (response.status === 419 || errText.includes('CSRF')) {
                        toast.error(
                            handleCsrfError(response, { message: errText }),
                        );
                        return;
                    }

                    throw new Error(errText || 'Gagal mengedit area');
                }

                const data = await response.json().catch(() => ({}));
                toast.success(data.message || 'Area berhasil diperbarui');
                setAreasState((prev) =>
                    prev.map((a) =>
                        a.id === id ? { ...a, geometry_json: geometry } : a,
                    ),
                );
            } catch (err) {
                console.error('Error editing area:', err);
                const msg =
                    err instanceof Error ? err.message : 'Gagal mengedit area';
                toast.error(msg);
            }
        },
        [areaGroup.id, areasState],
    );

    // Cleanup in-flight guards on unmount
    useEffect(() => {
        const inFlight = createInFlightRef.current;
        return () => {
            inFlight.clear();
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${areaGroup.name} - Detail Kawasan`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                {/* Header */}
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

                <div className="min-h-0 flex-1 gap-4 md:flex md:flex-row md:items-stretch">
                    <Card className="md:h-full md:max-h-[500px] md:w-1/3">
                        <CardHeader>
                            <CardTitle>
                                Daftar Kawasan ({areasState.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ScrollArea className="h-[calc(100%-80px)]">
                                <AreaFeatureList
                                    areas={areasState}
                                    selectedAreaId={selectedAreaId}
                                    onAreaSelect={handleAreaSelect}
                                    onAreaEdit={handleAreaEditDetail}
                                    className="h-full"
                                />
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="mt-4 md:mt-0 md:h-full md:max-h-[500px] md:flex-1">
                        <CardHeader>
                            <CardTitle>Peta Kawasan</CardTitle>
                        </CardHeader>
                        <CardContent className="md:h-[calc(100%-80px)]">
                            <div className="h-[360px] rounded-md border md:h-full">
                                <AreaMapDisplay
                                    features={mapFeatures}
                                    defaultColor={areaGroup.legend_color_hex}
                                    className="h-full w-full"
                                    resolvedLayerIds={resolvedLayerIds}
                                    onLayerCreated={handleLayerCreated}
                                    onLayerDeleted={useCallback(
                                        (id: number) => {
                                            void handleAreaDelete(id);
                                        },
                                        [handleAreaDelete],
                                    )}
                                    onLayerEdited={handleLayerEdited}
                                    households={households}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {selectedAreaId
                                ? `Rumah di ${selectedArea?.name ?? `#${selectedAreaId}`}`
                                : `Semua Rumah di Kawasan Ini (${households.length})`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedAreaId && relatedLoading ? (
                            <div className="text-sm text-muted-foreground">
                                Memuat data untuk Kawasan{' '}
                                {selectedArea?.name ?? `#${selectedAreaId}`}...
                            </div>
                        ) : selectedAreaId && relatedError ? (
                            <div className="text-sm text-red-600">
                                {relatedError}
                            </div>
                        ) : (selectedAreaId ? relatedHouseholds : households)
                              .length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                Data rumah tidak ditemukan.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {(selectedAreaId
                                    ? relatedHouseholds
                                    : households
                                ).map((h) => (
                                    <div
                                        key={h.id}
                                        className="rounded-md border p-3"
                                    >
                                        <div className="text-xs text-muted-foreground">
                                            Nomor rumah
                                        </div>
                                        <div className="font-medium">
                                            {h.id}
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Nama penghuni
                                        </div>
                                        <div>{h.head_name || '-'}</div>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Status hunian
                                        </div>
                                        <div className="font-medium">
                                            {h.habitability_status || '-'}
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Lokasi
                                        </div>
                                        <div className="text-xs">
                                            {h.village_name}, {h.district_name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {selectedAreaId
                                ? `Status Sinkronisasi ${selectedArea?.name ?? `#${selectedAreaId}`}`
                                : 'Status Sinkronisasi'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!selectedAreaId ? (
                            <div className="text-sm text-muted-foreground">
                                Pilih kawasan terlebih dahulu untuk melihat
                                status sinkronisasi.
                            </div>
                        ) : syncStatus ? (
                            <div className="flex flex-col gap-1 text-sm">
                                <div>
                                    <span className="text-muted-foreground">
                                        Status:
                                    </span>{' '}
                                    {syncStatus.status}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">
                                        Terakhir:
                                    </span>{' '}
                                    {syncStatus.last_at
                                        ? new Date(
                                              syncStatus.last_at,
                                          ).toLocaleString()
                                        : '-'}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                Belum ada informasi sinkronisasi
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Area Form Dialog */}
            <AreaFormDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingArea(null);
                    }
                }}
                areaGroupId={areaGroup.id}
                area={editingArea}
                onSuccess={handleFormSuccess}
            />
        </AppLayout>
    );
}
