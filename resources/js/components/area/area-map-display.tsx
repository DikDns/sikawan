import { Map, MapLayerGroup, MapTileLayer } from '@/components/ui/map';
import type { LatLngExpression } from 'leaflet';
import { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';

export interface AreaFeatureGeometry {
    id: number;
    name: string;
    geometry_json: string;
    centroid_lat?: number | null;
    centroid_lng?: number | null;
    color?: string;
    household_count?: number;
    family_count?: number;
}

export interface AreaMapDisplayProps {
    features: AreaFeatureGeometry[];
    defaultColor?: string;
    className?: string;
    center?: LatLngExpression;
    zoom?: number;
}

export function AreaMapDisplay({
    features,
    defaultColor = '#F28AAA',
    className,
    center,
    zoom = 13,
}: AreaMapDisplayProps) {
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
                    const geometry = JSON.parse(feature.geometry_json);
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

    return (
        <div className={className}>
            <Map center={mapCenter} zoom={zoom} className="h-full w-full">
                <MapTileLayer />
                <MapLayerGroup name="area-features">
                    {polygons.map((polygon) => {
                        if (!polygon) return null;

                        const color = polygon.color || defaultColor;

                        return (
                            <GeoJSON
                                key={polygon.id}
                                data={polygon.geometry}
                                style={{
                                    color: color,
                                    weight: 2,
                                    opacity: 0.8,
                                    fillColor: color,
                                    fillOpacity: 0.3,
                                }}
                                onEachFeature={(feature, layer) => {
                                    const popupContent = `
                                        <div style="font-size: 12px; padding: 4px;">
                                            <div style="font-weight: bold; margin-bottom: 4px;">
                                                ${polygon.name}
                                            </div>
                                            ${polygon.household_count ? `<div>Rumah: ${polygon.household_count.toLocaleString()}</div>` : ''}
                                            ${polygon.family_count ? `<div>Keluarga: ${polygon.family_count.toLocaleString()}</div>` : ''}
                                        </div>
                                    `;
                                    layer.bindPopup(popupContent);
                                }}
                            />
                        );
                    })}
                </MapLayerGroup>
            </Map>
        </div>
    );
}
