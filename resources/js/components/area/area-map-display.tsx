import { Badge } from '@/components/ui/badge';
import {
    Map,
    MapDrawControl,
    MapDrawDelete,
    MapDrawEdit,
    MapDrawPolygon,
    MapDrawRectangle,
    MapDrawUndo,
    MapTileLayer,
    useLeaflet,
} from '@/components/ui/map';
import type { LatLngExpression } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    onLayerCreated?: (geometry: unknown, layerNumber: number) => void;
    onLayerDeleted?: (id: number) => void;
    onLayerEdited?: (id: number, geometry: unknown) => void;
    // Mapping from temporary client layer number to server-assigned ID
    resolvedLayerIds?: Record<number, number>;
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
}: AreaMapDisplayProps) {
    const { L } = useLeaflet();
    const [numberOfShapes, setNumberOfShapes] = useState(0);
    const drawLayersRef = useRef<L.FeatureGroup | null>(null);
    const layerCounterRef = useRef(0);
    const featureLayersRef = useRef<Record<number, L.Layer>>({});
    const createdLayersRef = useRef<Record<number, L.Layer>>({});
    const isInitialLoadDoneRef = useRef(false);

    // Calculate center from features if not provided
    const mapCenter = useMemo(() => {
        if (center) return center;

        const validCentroids = features.filter(
            (f) => f.centroid_lat && f.centroid_lng,
        );

        if (validCentroids.length === 0) {
            return [-6.2, 106.816666] as LatLngExpression; // Default to Jakarta
        }

        const avgLat =
            validCentroids.reduce((sum, f) => sum + (f.centroid_lat || 0), 0) /
            validCentroids.length;
        const avgLng =
            validCentroids.reduce((sum, f) => sum + (f.centroid_lng || 0), 0) /
            validCentroids.length;

        return [avgLat, avgLng] as LatLngExpression;
    }, [features, center]);

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
            if (
                geometry &&
                typeof geometry === 'object' &&
                (geometry as any).type === 'Polygon' &&
                Array.isArray((geometry as any).coordinates)
            ) {
                const coords: number[][][] = (geometry as any).coordinates;
                const positions: LatLngExpression[][] = coords.map((ring) =>
                    ring.map(([lng, lat]) => [lat, lng] as [number, number]),
                );
                shapes.push({ type: 'polygon', id, positions, color });
                return;
            }

            // Rectangle bounds: [[west, north], [east, south]] in [lng, lat]
            if (
                Array.isArray(geometry) &&
                geometry.length === 2 &&
                Array.isArray((geometry as any)[0]) &&
                Array.isArray((geometry as any)[1])
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

    // Handle changes from MapDrawControl with explicit changeType
    const handleLayersChange = (
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
                const initialId = (layer as any).__initialId as number | null;
                if (typeof initialId === 'number' && initialId > 0) {
                    featureLayersRef.current[initialId] = layer;
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
            layers.eachLayer((layer) => {
                const isKnown = Object.values(featureLayersRef.current).some(
                    (existingLayer) => existingLayer === layer,
                );
                if (isKnown) return;

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
                    // Assign temporary client ID to newly drawn layer
                    layerCounterRef.current += 1;
                    const tempId = layerCounterRef.current;
                    (layer as any).__clientTempId = tempId;
                    createdLayersRef.current[tempId] = layer;

                    console.log('[AreaMapDisplay] created: sending geometry with tempId', tempId);
                    onLayerCreated(geometry, tempId);
                }
            });
            return;
        }

        // Edited: user modified layers
        if (changeType === 'edited') {
            console.log('[AreaMapDisplay] edited: user modified layers');
            if (!changedLayers) return;
            changedLayers.eachLayer((layer: L.Layer) => {
                const id = (layer as any).__initialId as number | null;
                if (typeof id !== 'number' || id <= 0) return;

                let geometry: any = null;
                if ((layer as any).getBounds) {
                    const bounds = (layer as any).getBounds();
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
                } else if ((layer as any).getLatLngs) {
                    const latlngs = (layer as any).getLatLngs() as L.LatLng[][];
                    geometry = {
                        type: 'Polygon',
                        coordinates: latlngs.map((ring) =>
                            ring.map((ll) => [ll.lng, ll.lat]),
                        ),
                    };
                }

                if (geometry && onLayerEdited) {
                    console.log('[AreaMapDisplay] edited: sending geometry for id', id);
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
                Object.entries(featureLayersRef.current).forEach(([idStr, lyr]) => {
                    const exists = layers.hasLayer(lyr);
                    if (!exists) removedIds.push(Number(idStr));
                });
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
    };

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

            console.log('[AreaMapDisplay] resolved tempId -> serverId', tempId, serverId);
        });
    }, [resolvedLayerIds, L]);

    // Deletion is handled directly within handleLayersChange('deleted') to avoid race conditions

    if (!L) return null;

    return (
        <div className={className}>
            <Map center={mapCenter} zoom={zoom} className="h-full w-full">
                <MapTileLayer />
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
