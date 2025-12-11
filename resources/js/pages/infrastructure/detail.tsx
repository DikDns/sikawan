import {
    InfrastructureFeatureList,
    type InfrastructureItem,
} from '@/components/infrastructure/infrastructure-feature-list';
import {
    InfrastructureFormDialog,
    type InfrastructureItemForm,
} from '@/components/infrastructure/infrastructure-form-dialog';
import {
    InfrastructureMapDisplay,
    type InfrastructureFeatureGeometry,
} from '@/components/infrastructure/infrastructure-map-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { csrfFetch, handleCsrfError } from '@/lib/csrf';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'PSU', href: '/infrastructure' },
    { title: 'Detail PSU', href: '#' },
];

interface InfrastructureGroupProps {
    id: number;
    code: string;
    name: string;
    category: string;
    type: 'Marker' | 'Polyline' | 'Polygon';
    legend_color_hex: string;
    legend_icon: string | null;
    description: string | null;
}

interface Props {
    group: InfrastructureGroupProps;
    items: InfrastructureItem[];
}

export default function InfrastructureDetail({ group, items }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] =
        useState<InfrastructureItemForm | null>(null);
    const [itemsState, setItemsState] = useState<InfrastructureItem[]>(items);
    const [resolvedLayerIds, setResolvedLayerIds] = useState<
        Record<number, number>
    >({});
    const createInFlightRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        setItemsState(items);
    }, [items]);

    const mapFeatures: InfrastructureFeatureGeometry[] = useMemo(
        () =>
            itemsState.map((item) => {
                const gt: 'Point' | 'LineString' | 'Polygon' =
                    item.geometry_type === 'Point' ||
                    item.geometry_type === 'LineString' ||
                    item.geometry_type === 'Polygon'
                        ? item.geometry_type
                        : group.type === 'Marker'
                          ? 'Point'
                          : group.type === 'Polyline'
                            ? 'LineString'
                            : 'Polygon';
                const gj =
                    typeof item.geometry_json === 'string'
                        ? (item.geometry_json as string)
                        : JSON.stringify(item.geometry_json);
                return {
                    id: item.id,
                    name: item.name,
                    geometry_type: gt,
                    geometry_json: gj,
                    color: group.legend_color_hex,
                };
            }),
        [itemsState, group.legend_color_hex, group.type],
    );

    const handleLayerCreated = useCallback(
        async (
            geometry: unknown,
            layerNumber: number,
            geometryType: 'Point' | 'LineString' | 'Polygon',
        ) => {
            const defaultName = `${group.name} ${layerNumber}`;

            try {
                if (createInFlightRef.current.has(layerNumber)) return;
                createInFlightRef.current.add(layerNumber);

                const payload = {
                    name: defaultName,
                    description: null,
                    geometry_type: geometryType,
                    geometry_json: geometry,
                    condition_status: 'baik',
                };

                const response = await csrfFetch(
                    `/infrastructure/${group.id}/items`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    },
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    if (response.status === 419) {
                        toast.error(handleCsrfError(response, errorData));
                        return;
                    }
                    throw new Error(
                        errorData.message ||
                            `HTTP error! status: ${response.status}`,
                    );
                }

                window.location.reload();

                const data = await response.json();
                toast.success(data.message || 'PSU berhasil ditambahkan');
                const created = data?.data?.item || data?.item;
                if (created && created.id) {
                    setItemsState((prev) => [...prev, created]);
                    setResolvedLayerIds((prev) => ({
                        ...prev,
                        [layerNumber]: created.id,
                    }));
                } else {
                    router.reload({ only: ['items'] });
                }
            } catch (error) {
                const msg =
                    error instanceof Error
                        ? error.message
                        : 'Gagal menyimpan PSU';
                toast.error(msg);
            } finally {
                createInFlightRef.current.delete(layerNumber);
            }
        },
        [group.id, group.name],
    );

    const handleFormSuccess = () => {
        window.location.reload();
        setEditingItem(null);
    };

    const handleItemEditDetail = (item: InfrastructureItem) => {
        setEditingItem({
            id: item.id,
            name: item.name,
            description: item.description || null,
            geometry_type: item.geometry_type,
            geometry_json: item.geometry_json,
        });
        setIsDialogOpen(true);
    };

    const handleItemDelete = useCallback(
        async (itemId: number) => {
            try {
                const response = await csrfFetch(
                    `/infrastructure/${group.id}/items/${itemId}`,
                    {
                        method: 'DELETE',
                    },
                );
                if (!response.ok) {
                    const errText = await response.text();
                    if (response.status === 419 || errText.includes('CSRF')) {
                        toast.error(
                            handleCsrfError(response, { message: errText }),
                        );
                        return;
                    }
                    throw new Error('Gagal menghapus PSU');
                }

                window.location.reload();

                const data = await response.json().catch(() => ({}));
                toast.success(data.message || 'PSU berhasil dihapus');
                setItemsState((prev) => prev.filter((a) => a.id !== itemId));
            } catch (error) {
                const msg =
                    error instanceof Error
                        ? error.message
                        : 'Gagal menghapus PSU';
                toast.error(msg);
            }
        },
        [group.id],
    );

    const handleLayerEdited = useCallback(
        async (
            id: number,
            geometry: unknown,
            geometryType: 'Point' | 'LineString' | 'Polygon',
        ) => {
            try {
                const response = await csrfFetch(
                    `/infrastructure/${group.id}/items/${id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name:
                                itemsState.find((a) => a.id === id)?.name || '',
                            description:
                                itemsState.find((a) => a.id === id)
                                    ?.description || null,
                            geometry_type: geometryType,
                            geometry_json: geometry,
                        }),
                    },
                );
                if (!response.ok) {
                    const errText = await response.text();
                    if (response.status === 419 || errText.includes('CSRF')) {
                        toast.error(
                            handleCsrfError(response, { message: errText }),
                        );
                        return;
                    }
                    throw new Error(errText || 'Gagal mengedit PSU');
                }

                window.location.reload();

                const data = await response.json().catch(() => ({}));
                toast.success(data.message || 'PSU berhasil diperbarui');
                setItemsState((prev) =>
                    prev.map((a) =>
                        a.id === id ? { ...a, geometry_json: geometry } : a,
                    ),
                );
            } catch (err) {
                const msg =
                    err instanceof Error ? err.message : 'Gagal mengedit PSU';
                toast.error(msg);
            }
        },
        [group.id, itemsState],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${group.name} - Detail PSU`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: group.legend_color_hex }}
                    >
                        {group.name}
                    </h1>
                    {group.description ? (
                        <p className="mt-1 text-muted-foreground">
                            {group.description}
                        </p>
                    ) : null}
                </div>

                <div className="min-h-0 flex-1 gap-4 md:flex md:flex-row md:items-stretch">
                    <Card className="md:h-[calc(100%-196px)] md:w-1/3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>
                                Daftar Fitur ({itemsState.length})
                            </CardTitle>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    setEditingItem(null);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Plus className="mr-1 size-4" />
                                Tambah
                            </Button>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ScrollArea className="h-[calc(100%-80px)]">
                                <InfrastructureFeatureList
                                    items={itemsState}
                                    onItemEdit={handleItemEditDetail}
                                    className="h-full"
                                />
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="mt-4 md:mt-0 md:h-[calc(100%-196px)] md:flex-1">
                        <CardHeader>
                            <CardTitle>Peta PSU</CardTitle>
                        </CardHeader>
                        <CardContent className="md:h-[calc(100%-80px)]">
                            <div className="h-[360px] rounded-md border md:h-full">
                                <InfrastructureMapDisplay
                                    type={group.type}
                                    features={mapFeatures}
                                    defaultColor={group.legend_color_hex}
                                    className="h-full w-full"
                                    resolvedLayerIds={resolvedLayerIds}
                                    onLayerCreated={handleLayerCreated}
                                    onLayerDeleted={(id) => {
                                        void handleItemDelete(id);
                                    }}
                                    onLayerEdited={handleLayerEdited}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <InfrastructureFormDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingItem(null);
                }}
                groupId={group.id}
                groupType={group.type}
                item={editingItem}
                onSuccess={handleFormSuccess}
            />
        </AppLayout>
    );
}
