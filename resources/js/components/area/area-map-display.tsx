/* eslint-disable @typescript-eslint/no-explicit-any */
// This file uses dynamic Leaflet layer properties that require 'any' type assertions
import turfArea from '@turf/area';
import { Badge } from '@/components/ui/badge';
import {
    DEFAULT_CENTER,
    Map,
    MapDrawControl,
    MapDrawDelete,
    MapDrawEdit,
    MapDrawPolygon,
    MapDrawRectangle,
    MapDrawUndo,
    MapLayerGroup,
    MapMarker,
    MapPopup,
    MapTileLayer,
    useLeaflet,
} from '@/components/ui/map';
import { type HouseholdForMap } from '@/pages/areas/detail';
import { usePage } from '@inertiajs/react';
import type { LatLngExpression } from 'leaflet';
import { Calculator, Home } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Area as AreaDetail } from './area-feature-list';

export interface AreaFeatureGeometry {
    id: number;
    name: string;
    geometry_json: string;
    centroid_lat?: number | null;
    centroid_lng?: number | null;
    color?: string;
}

export interface AreaMapDisplayProps {
    features: AreaFeatureGeometry[];
    defaultColor?: string;
    className?: string;
    center?: LatLngExpression;
    zoom?: number;
    onLayerCreated?: (geometry: unknown, layerNumber: number, areaM2?: number | null) => void;
    onLayerDeleted?: (id: number) => void;
    onLayerEdited?: (id: number, geometry: unknown) => void;
    // Mapping from temporary client layer number to server-assigned ID
    resolvedLayerIds?: Record<number, number>;
    households?: HouseholdForMap[];
}

export function AreaMapDisplay({
    features,
    defaultColor = '#F28AAA',
    className,
    center,
    zoom = 13,
    onLayerCreated,
    onLayerDeleted,
    onLayerEdited,
    resolvedLayerIds,
    households = [],
}: AreaMapDisplayProps) {
    const { L } = useLeaflet();
    const page = usePage();
    const areasFromProps = (page.props as Record<string, unknown>)?.areas as
        | AreaDetail[]
        | undefined;
    const [numberOfShapes, setNumberOfShapes] = useState(0);
    const drawLayersRef = useRef<L.FeatureGroup | null>(null);
    const layerCounterRef = useRef(0);
    const featureLayersRef = useRef<Record<number, L.Layer>>({});
    const createdLayersRef = useRef<Record<number, L.Layer>>({});
    const isInitialLoadDoneRef = useRef(false);
    // Debounce timers and payloads for create events
    const pendingCreateTimeoutsRef = useRef<Record<number, number>>({});
    const pendingCreateGeometryRef = useRef<Record<number, unknown>>({});
    const CREATE_DEBOUNCE_MS = 250;
    const pendingCreateAreaRef = useRef<Record<number, number | null>>({});

    // Calculate area in m² from a GeoJSON geometry object
    const calcAreaM2 = useCallback((geometry: unknown): number | null => {
        if (!geometry || typeof geometry !== 'object') return null;
        try {
            const geo = geometry as Record<string, unknown>;
            const geoJson = geo.type === 'Feature'
                ? geo
                : { type: 'Feature', geometry: geo, properties: {} };
            const m2 = turfArea(geoJson as unknown as Parameters<typeof turfArea>[0]);
            return m2 > 0 ? Math.round(m2 * 100) / 100 : null;
        } catch {
            return null;
        }
    }, []);

    // Calculate center from features if not provided
    const validCentroids = useMemo(
        () => features.filter((f) => f.centroid_lat && f.centroid_lng),
        [features],
    );

    const mapCenter = useMemo(() => {
        if (center) return center;

        if (validCentroids.length === 0) {
            return DEFAULT_CENTER;
        }

        const avgLat =
            validCentroids.reduce((sum, f) => sum + (f.centroid_lat || 0), 0) /
            validCentroids.length;
        const avgLng =
            validCentroids.reduce((sum, f) => sum + (f.centroid_lng || 0), 0) /
            validCentroids.length;

        return [avgLat, avgLng] as LatLngExpression;
    }, [validCentroids, center]);

    // Cleanup manually drawn layers when features update (sync from backend)
    useEffect(() => {
        // Remove all client-side drawn layers that were tracked to prevent duplicates
        // when the server returns the saved feature
        Object.values(createdLayersRef.current).forEach((layer) => {
            drawLayersRef.current?.removeLayer(layer);
        });
        createdLayersRef.current = {};
    }, [features]);

    // Parse geometry JSON and render polygons
    const polygons = useMemo(() => {
        return features
            .filter((f) => f.geometry_json)
            .map((feature) => {
                try {
                    const geometry =
                        typeof feature.geometry_json === 'string'
                            ? JSON.parse(feature.geometry_json)
                            : feature.geometry_json;
                    return {
                        ...feature,
                        geometry,
                    };
                } catch (error) {
                    console.error(
                        `Error parsing geometry for feature ${feature.id}:`,
                        error,
                    );
                    return null;
                }
            })
            .filter((f) => f !== null);
    }, [features]);

    // Map of feature id -> feature for quick lookup (e.g., tooltip/pop-up labels)
    // const featuresById = useMemo(() => {
    //     const map = new globalThis.Map<number, AreaFeatureGeometry>();
    //     features.forEach((f) => map.set(f.id, f));
    //     return map;
    // }, [features]);

    // Prepare initial shapes to render inside FeatureGroup for edit/delete support
    const initialShapes = useMemo(() => {
        if (!L)
            return [] as Array<
                | {
                      type: 'polygon';
                      id: number;
                      positions: LatLngExpression[][];
                      color?: string;
                  }
                | {
                      type: 'rectangle';
                      id: number;
                      bounds: [[number, number], [number, number]];
                      color?: string;
                  }
            >;

        const shapes: Array<
            | {
                  type: 'polygon';
                  id: number;
                  positions: LatLngExpression[][];
                  color?: string;
              }
            | {
                  type: 'rectangle';
                  id: number;
                  bounds: [[number, number], [number, number]];
                  color?: string;
              }
        > = [];

        polygons.forEach((feature) => {
            const { geometry, id, color } = feature as {
                id: number;
                color?: string;
                geometry: unknown;
            };

            // GeoJSON-like Polygon: { type: 'Polygon', coordinates: number[][][] }
            const geomObj = geometry as Record<string, unknown>;
            if (
                geometry &&
                typeof geometry === 'object' &&
                geomObj.type === 'Polygon' &&
                Array.isArray(geomObj.coordinates)
            ) {
                const coords: number[][][] =
                    geomObj.coordinates as number[][][];
                const positions: LatLngExpression[][] = coords.map((ring) =>
                    ring.map(([lng, lat]) => [lat, lng] as [number, number]),
                );
                shapes.push({ type: 'polygon', id, positions, color });
                return;
            }

            // Rectangle bounds: [[west, north], [east, south]] in [lng, lat]
            const geomArray = geometry as unknown[];
            if (
                Array.isArray(geometry) &&
                geometry.length === 2 &&
                Array.isArray(geomArray[0]) &&
                Array.isArray(geomArray[1])
            ) {
                const [[west, north], [east, south]] = geometry as [
                    [number, number],
                    [number, number],
                ];
                const bounds: [[number, number], [number, number]] = [
                    [north, west],
                    [south, east],
                ];
                shapes.push({ type: 'rectangle', id, bounds, color });
                return;
            }
        });

        return shapes;
    }, [L, polygons]);

    // UI classes adapted from MapPopup/MapTooltip to keep visual consistency
    const POPUP_CLASSNAME =
        'bg-popover text-popover-foreground animate-in fade-out-0 fade-in-0 zoom-out-95 zoom-in-95 slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 font-sans shadow-md outline-hidden';
    const TOOLTIP_CLASSNAME =
        'animate-in fade-in-0 zoom-in-95 fade-out-0 zoom-out-95 relative z-50 w-fit text-xs text-balance transition-opacity';

    // Attach hover tooltip and click popup to a given Leaflet layer
    const attachInfoUI = useCallback(
        (layer: L.Layer, label?: string) => {
            if (!L || !layer) return;

            let tipe = 'Area';
            if (layer instanceof L.Rectangle) tipe = 'Persegi Panjang';
            else if (layer instanceof L.Polygon) tipe = 'Poligon';
            else if (layer instanceof L.Circle) tipe = 'Lingkaran';
            else if (layer instanceof L.Polyline) tipe = 'Garis';
            else if (layer instanceof L.Marker) tipe = 'Titik';

            // Resolve area details from the same source as AreaFormDialog (Inertia props)
            const serverId = (layer as unknown as { __initialId?: number })
                .__initialId;
            const areaDetail: AreaDetail | undefined = Array.isArray(
                areasFromProps,
            )
                ? areasFromProps.find((a) => a.id === serverId)
                : undefined;

            const esc = (v: unknown) =>
                String(v ?? '-')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');

            const displayName = esc(areaDetail?.name ?? label ?? 'Area');

            // Tooltip (hover) — show the area name consistently
            try {
                layer.bindTooltip(displayName, {
                    className: TOOLTIP_CLASSNAME,
                    sticky: true,
                    opacity: 1,
                    direction: 'top',
                    offset: L.point(0, 15),
                });
            } catch (err) {
                console.warn('Failed to bind tooltip', err);
            }

            // Popup (click) — mirror labels/order used in AreaFormDialog
            const popupContent = `
                <div class="space-y-4" aria-label="Informasi kawasan">
                    <div>
                        <div class="text-xs text-muted-foreground">Nama Area</div>
                        <div class="font-medium">${displayName}</div>
                    </div>
                    <div>
                        <div class="text-xs text-muted-foreground">Deskripsi</div>
                        <div class="text-sm whitespace-pre-line">${esc(areaDetail?.description)}</div>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <div class="text-xs text-muted-foreground">Provinsi</div>
                            <div class="text-sm">${esc(areaDetail?.province_name)}</div>
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Kota/Kabupaten</div>
                            <div class="text-sm">${esc(areaDetail?.regency_name)}</div>
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Kecamatan</div>
                            <div class="text-sm">${esc(areaDetail?.district_name)}</div>
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Kelurahan/Desa</div>
                            <div class="text-sm">${esc(areaDetail?.village_name)}</div>
                        </div>
                    </div>
                    <div class="text-xs text-muted-foreground">Tipe: ${esc(tipe)}</div>
                </div>
            `;
            try {
                layer.bindPopup(popupContent, {
                    className: POPUP_CLASSNAME,
                    maxWidth: 360,
                    closeButton: true,
                    autoPan: true,
                    autoPanPadding: L.point(10, 10),
                });
            } catch (err) {
                console.warn('Failed to bind popup', err);
            }
        },
        [L, areasFromProps],
    );

    // Handle changes from MapDrawControl with explicit changeType
    const handleLayersChange = useCallback(
        (
            layers: L.FeatureGroup,
            changeType: 'initialized' | 'created' | 'edited' | 'deleted',
            changedLayers?: L.LayerGroup,
        ) => {
            if (!L) return;

            drawLayersRef.current = layers;
            setNumberOfShapes(layers.getLayers().length);

            console.log('[AreaMapDisplay] onLayersChange', {
                changeType,
                totalLayers: layers.getLayers().length,
            });

            // Initial load: register existing layers but do NOT create backend records
            if (changeType === 'initialized') {
                isInitialLoadDoneRef.current = true;
                layers.eachLayer((layer: L.Layer) => {
                    const initialId = (layer as any).__initialId as
                        | number
                        | null;
                    if (typeof initialId === 'number' && initialId > 0) {
                        featureLayersRef.current[initialId] = layer;
                        // Attach tooltip/popup using feature data
                        const feat = features.find((f) => f.id === initialId);
                        const label = feat?.name ?? `Kawasan #${initialId}`;
                        attachInfoUI(layer, label);
                    }
                });
                console.log(
                    '[AreaMapDisplay] initialized: registered ids',
                    Object.keys(featureLayersRef.current),
                );
                return;
            }

            // Created: only newly drawn layers by the user
            if (changeType === 'created') {
                const sourceGroup: L.LayerGroup = (changedLayers ||
                    layers) as L.LayerGroup;
                sourceGroup.eachLayer((layer: L.Layer) => {
                    const isKnown = Object.values(
                        featureLayersRef.current,
                    ).some((existingLayer) => existingLayer === layer);
                    if (isKnown) return;

                    // Also skip if this layer already has a temp id registered
                    const existingTempId = (layer as any).__clientTempId as
                        | number
                        | undefined;
                    if (
                        existingTempId &&
                        createdLayersRef.current[existingTempId]
                    ) {
                        // We may still update geometry payload but avoid assigning again
                    }

                    let geometry: unknown = null;

                    if (layer instanceof L.Marker) {
                        geometry = {
                            type: 'Point',
                            coordinates: [
                                layer.getLatLng().lng,
                                layer.getLatLng().lat,
                            ],
                        };
                    } else if (
                        layer instanceof L.Polyline &&
                        !(layer instanceof L.Polygon)
                    ) {
                        const latlngs = (
                            layer as L.Polyline
                        ).getLatLngs() as L.LatLng[];
                        geometry = {
                            type: 'LineString',
                            coordinates: latlngs.map((ll) => [ll.lng, ll.lat]),
                        };
                    } else if (layer instanceof L.Circle) {
                        const center = layer.getLatLng();
                        const radius = layer.getRadius();
                        geometry = {
                            type: 'Circle',
                            center: [center.lng, center.lat],
                            radius: radius,
                        };
                    } else if (layer instanceof L.Rectangle) {
                        const bounds = layer.getBounds();
                        geometry = [
                            [bounds.getWest(), bounds.getNorth()],
                            [bounds.getEast(), bounds.getSouth()],
                        ];
                    } else if (layer instanceof L.Polygon) {
                        const latlngs = layer.getLatLngs() as L.LatLng[][];
                        geometry = {
                            type: 'Polygon',
                            coordinates: latlngs.map((ring) =>
                                ring.map((ll) => [ll.lng, ll.lat]),
                            ),
                        };
                    }

                    if (geometry && onLayerCreated) {
                        // Assign or reuse temporary client ID to newly drawn layer
                        let tempId = (layer as any).__clientTempId as
                            | number
                            | undefined;
                        if (!tempId) {
                            layerCounterRef.current += 1;
                            tempId = layerCounterRef.current;
                            (layer as any).__clientTempId = tempId;
                            createdLayersRef.current[tempId] = layer;
                        }

                        // Attach default tooltip/popup for newly created layer
                        // Calculate area for polygon/rectangle
                        let areaM2: number | null = null;
                        if (layer instanceof L.Rectangle) {
                            const b = layer.getBounds();
                            const rectGeom = {
                                type: 'Polygon',
                                coordinates: [[[b.getWest(), b.getSouth()], [b.getEast(), b.getSouth()], [b.getEast(), b.getNorth()], [b.getWest(), b.getNorth()], [b.getWest(), b.getSouth()]]],
                            };
                            areaM2 = calcAreaM2(rectGeom);
                        } else if (layer instanceof L.Polygon) {
                            areaM2 = calcAreaM2(geometry);
                        }
                        pendingCreateAreaRef.current[tempId] = areaM2;

                        const areaLabel = areaM2
                            ? `${(areaM2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Ha`
                            : null;
                        attachInfoUI(layer, areaLabel ? `Area baru #${tempId} · ${areaLabel}` : `Area baru #${tempId}`);

                        // Debounce dispatch to prevent duplicate POSTs
                        pendingCreateGeometryRef.current[tempId] = geometry;
                        const existingTimer =
                            pendingCreateTimeoutsRef.current[tempId];
                        if (existingTimer) {
                            clearTimeout(existingTimer);
                        }
                        pendingCreateTimeoutsRef.current[tempId] =
                            window.setTimeout(() => {
                                // Use latest geometry for this tempId
                                const geom =
                                    pendingCreateGeometryRef.current[tempId!];
                                const area = pendingCreateAreaRef.current[tempId!] ?? undefined;
                                delete pendingCreateTimeoutsRef.current[
                                    tempId!
                                ];
                                if (!geom) return;
                                console.log(
                                    '[AreaMapDisplay] created: debounced dispatch for tempId',
                                    tempId,
                                );
                                onLayerCreated(geom, tempId!, area);
                            }, CREATE_DEBOUNCE_MS);
                    }
                });
                return;
            }

            // Edited: user modified layers
            if (changeType === 'edited') {
                console.log('[AreaMapDisplay] edited: user modified layers');
                if (!changedLayers) return;
                changedLayers.eachLayer((layer: L.Layer) => {
                    const id = (
                        layer as unknown as { __initialId?: number | null }
                    ).__initialId;
                    if (typeof id !== 'number' || id <= 0) return;

                    let geometry: Record<string, unknown> | null = null;

                    // Check specifically for Rectangle first (not just getBounds, since Polygon also has it)
                    if (layer instanceof L.Rectangle) {
                        const bounds = layer.getBounds();
                        geometry = {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [bounds.getWest(), bounds.getSouth()],
                                    [bounds.getEast(), bounds.getSouth()],
                                    [bounds.getEast(), bounds.getNorth()],
                                    [bounds.getWest(), bounds.getNorth()],
                                    [bounds.getWest(), bounds.getSouth()],
                                ],
                            ],
                        };
                    } else if ((layer as L.Polygon).getLatLngs) {
                        // For Polygon (including edited rectangles that became polygons)
                        const latlngs = (
                            layer as L.Polygon
                        ).getLatLngs() as L.LatLng[][];
                        geometry = {
                            type: 'Polygon',
                            coordinates: latlngs.map((ring) =>
                                ring.map((ll) => [ll.lng, ll.lat]),
                            ),
                        };
                    }

                    if (geometry && onLayerEdited) {
                        console.log(
                            '[AreaMapDisplay] edited: sending geometry for id',
                            id,
                        );
                        onLayerEdited(id, geometry);
                    }
                });
                return;
            }

            // Deleted: find server-provided layers removed from the group
            if (changeType === 'deleted') {
                const removedIds: number[] = [];
                if (changedLayers) {
                    changedLayers.eachLayer((layer: L.Layer) => {
                        const id = (layer as any).__initialId as number | null;
                        if (typeof id === 'number' && id > 0) {
                            removedIds.push(id);
                        }
                    });
                } else {
                    // Fallback: diff against known feature map
                    Object.entries(featureLayersRef.current).forEach(
                        ([idStr, lyr]) => {
                            const exists = layers.hasLayer(lyr);
                            if (!exists) removedIds.push(Number(idStr));
                        },
                    );
                }
                if (removedIds.length > 0) {
                    console.log('[AreaMapDisplay] deleted ids', removedIds);
                    removedIds.forEach((id) => {
                        delete featureLayersRef.current[id];
                        onLayerDeleted?.(id);
                    });
                }
                return;
            }
        },
        [
            L,
            onLayerCreated,
            onLayerDeleted,
            onLayerEdited,
            attachInfoUI,
            features,
        ],
    );

    // When parent resolves server IDs for newly created layers, bind them here
    useEffect(() => {
        if (!L || !resolvedLayerIds) return;
        Object.entries(resolvedLayerIds).forEach(([tempIdStr, serverId]) => {
            const tempId = Number(tempIdStr);
            const layer = createdLayersRef.current[tempId];
            if (!layer) return;
            if (typeof serverId !== 'number' || serverId <= 0) return;

            // Attach server ID so edit/delete handlers work consistently
            (layer as any).__initialId = serverId;
            featureLayersRef.current[serverId] = layer;
            delete createdLayersRef.current[tempId];

            // Refresh tooltip/popup with server-backed name, if available
            const feat = features.find((f) => f.id === serverId);
            const label = feat?.name ?? `Kawasan #${serverId}`;
            attachInfoUI(layer, label);

            console.log(
                '[AreaMapDisplay] resolved tempId -> serverId',
                tempId,
                serverId,
            );
        });
    }, [resolvedLayerIds, L, features, attachInfoUI]);

    // Cleanup timers and refs on unmount to avoid leaks or duplicate bindings
    useEffect(() => {
        return () => {
            Object.values(pendingCreateTimeoutsRef.current).forEach((t) => {
                try {
                    clearTimeout(t);
                } catch (e) {
                    void e;
                }
            });
            pendingCreateTimeoutsRef.current = {};
            pendingCreateGeometryRef.current = {};
            drawLayersRef.current = null;
            featureLayersRef.current = {} as Record<number, L.Layer>;
            createdLayersRef.current = {} as Record<number, L.Layer>;
            isInitialLoadDoneRef.current = false;
        };
    }, []);

    // Deletion is handled directly within handleLayersChange('deleted') to avoid race conditions

    if (!L) return null;

    type HabitabilityStatus = 'RLH' | 'RTLH' | null;
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

    return (
        <div className={className}>
            <Map center={mapCenter} zoom={zoom} className="h-full w-full">
                <MapTileLayer />

                <MapLayerGroup name="Rumah Layak Huni">
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
                                                Desa: {h.village_name || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </MapPopup>
                            </MapMarker>
                        ))}
                </MapLayerGroup>
                <MapLayerGroup name="Rumah Tidak Layak Huni">
                    {households
                        .filter((h) => h.habitability_status === 'RTLH')
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
                                                Desa: {h.village_name || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </MapPopup>
                            </MapMarker>
                        ))}
                </MapLayerGroup>
                <MapDrawControl
                    onLayersChange={handleLayersChange}
                    initialShapes={initialShapes}
                >
                    <MapDrawRectangle shapeOptions={{ color: defaultColor }} />
                    <MapDrawPolygon shapeOptions={{ color: defaultColor }} />
                    <MapDrawEdit />
                    <MapDrawDelete />
                    <MapDrawUndo />
                </MapDrawControl>
                <Badge
                    className="absolute right-1 bottom-1 z-[1000]"
                    aria-label="Jumlah area pada peta"
                >
                    Area: {numberOfShapes || initialShapes.length}
                </Badge>
            </Map>
        </div>
    );
}
