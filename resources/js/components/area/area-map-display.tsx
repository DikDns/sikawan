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
import { useState } from 'react';

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
    const TORONTO_COORDINATES = [43.6532, -79.3832] satisfies LatLngExpression;
    const { L } = useLeaflet();
    const [numberOfShapes, setNumberOfShapes] = useState(0);

    return L ? (
        <Map center={TORONTO_COORDINATES}>
            <MapTileLayer />
            <MapDrawControl
                onLayersChange={(layers) => {
                    setNumberOfShapes(layers.getLayers().length);
                    layers.eachLayer((layer) => {
                        if (layer instanceof L.Marker) {
                            console.log('Marker:', layer.getLatLng());
                        } else if (
                            layer instanceof L.Polyline &&
                            !(layer instanceof L.Polygon)
                        ) {
                            console.log('Polyline:', layer.getLatLngs());
                        } else if (layer instanceof L.Circle) {
                            console.log(
                                'Circle center:',
                                layer.getLatLng(),
                                'radius:',
                                layer.getRadius(),
                            );
                        } else if (layer instanceof L.Rectangle) {
                            console.log('Rectangle bounds:', layer.getBounds());
                        } else if (layer instanceof L.Polygon) {
                            console.log('Polygon:', layer.getLatLngs());
                        }
                    });
                }}
            >
                <MapDrawRectangle shapeOptions={{ color: defaultColor }} />
                <MapDrawPolygon shapeOptions={{ color: defaultColor }} />
                <MapDrawEdit />
                <MapDrawDelete />
                <MapDrawUndo />
            </MapDrawControl>
            <Badge className="absolute right-1 bottom-1 z-1000">
                Shapes: {numberOfShapes}
            </Badge>
        </Map>
    ) : null;
}
