import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface Coordinate {
    lat: string;
    lng: string;
}

interface GeometryEditorProps {
    geometryJson: unknown;
    onGeometryChange: (geometry: unknown, geometryType?: string) => void;
    geometryType?: 'Point' | 'LineString' | 'Polygon' | 'Rectangle';
    disabled?: boolean;
}

// Parse GeoJSON geometry to coordinate array
function parseGeometryToCoordinates(
    geometry: unknown,
): { coords: Coordinate[]; type: string } {
    if (!geometry) return { coords: [], type: '' };

    // Handle Rectangle format: [[west, north], [east, south]]
    if (
        Array.isArray(geometry) &&
        geometry.length === 2 &&
        Array.isArray(geometry[0]) &&
        Array.isArray(geometry[1]) &&
        typeof geometry[0][0] === 'number'
    ) {
        const [[west, north], [east, south]] = geometry as [
            [number, number],
            [number, number],
        ];
        return {
            coords: [
                { lat: String(north), lng: String(west) },
                { lat: String(south), lng: String(east) },
            ],
            type: 'Rectangle',
        };
    }

    const g = geometry as { type?: string; coordinates?: unknown };
    if (!g || !g.type || !g.coordinates) return { coords: [], type: '' };

    if (g.type === 'Point') {
        const [lng, lat] = g.coordinates as [number, number];
        return {
            coords: [{ lat: String(lat), lng: String(lng) }],
            type: 'Point',
        };
    }

    if (g.type === 'LineString') {
        const coords = (g.coordinates as [number, number][]).map(
            ([lng, lat]) => ({
                lat: String(lat),
                lng: String(lng),
            }),
        );
        return { coords, type: 'LineString' };
    }

    if (g.type === 'Polygon') {
        // Take the first ring (outer boundary), skip the closing point if it matches the first
        const ring = (g.coordinates as number[][][])[0] || [];
        let coords = ring.map(([lng, lat]) => ({
            lat: String(lat),
            lng: String(lng),
        }));
        // Remove closing point if it duplicates the first
        if (
            coords.length > 1 &&
            coords[0].lat === coords[coords.length - 1].lat &&
            coords[0].lng === coords[coords.length - 1].lng
        ) {
            coords = coords.slice(0, -1);
        }
        return { coords, type: 'Polygon' };
    }

    return { coords: [], type: '' };
}

// Convert coordinate array back to GeoJSON geometry
function coordinatesToGeometry(
    coords: Coordinate[],
    type: string,
): unknown {
    const validCoords = coords.filter(
        (c) => c.lat !== '' && c.lng !== '' && !isNaN(Number(c.lat)) && !isNaN(Number(c.lng)),
    );

    if (validCoords.length === 0) return null;

    if (type === 'Rectangle' && validCoords.length >= 2) {
        // Rectangle format: [[west, north], [east, south]]
        const north = Number(validCoords[0].lat);
        const west = Number(validCoords[0].lng);
        const south = Number(validCoords[1].lat);
        const east = Number(validCoords[1].lng);
        return [
            [west, north],
            [east, south],
        ];
    }

    if (type === 'Point' && validCoords.length >= 1) {
        return {
            type: 'Point',
            coordinates: [Number(validCoords[0].lng), Number(validCoords[0].lat)],
        };
    }

    if (type === 'LineString' && validCoords.length >= 2) {
        return {
            type: 'LineString',
            coordinates: validCoords.map((c) => [Number(c.lng), Number(c.lat)]),
        };
    }

    if (type === 'Polygon' && validCoords.length >= 3) {
        // Close the polygon by repeating the first point
        const ring = validCoords.map((c) => [Number(c.lng), Number(c.lat)]);
        ring.push([...ring[0]]);
        return {
            type: 'Polygon',
            coordinates: [ring],
        };
    }

    return null;
}

export function GeometryEditor({
    geometryJson,
    onGeometryChange,
    geometryType: propGeometryType,
    disabled = false,
}: GeometryEditorProps) {
    const parsed = useMemo(
        () => parseGeometryToCoordinates(geometryJson),
        [geometryJson],
    );

    // Use a key to reset local state when geometryJson changes significantly
    const [localKey] = useState(0);
    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
    const [geoType, setGeoType] = useState('');
    const [initialized, setInitialized] = useState(false);

    // Only sync from props on mount or when key changes (not during local edits)
    if (!initialized || localKey !== 0) {
        if (!initialized) {
            setInitialized(true);
            setCoordinates(parsed.coords);
            setGeoType(propGeometryType || parsed.type || '');
        }
    }

    const updateCoordinate = useCallback(
        (index: number, field: 'lat' | 'lng', value: string) => {
            setCoordinates((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], [field]: value };
                return updated;
            });
        },
        [],
    );

    const addCoordinate = useCallback(() => {
        setCoordinates((prev) => [...prev, { lat: '', lng: '' }]);
        // When adding points to a Rectangle, it becomes a Polygon
        if (geoType === 'Rectangle') {
            setGeoType('Polygon');
        }
    }, [geoType]);

    const removeCoordinate = useCallback((index: number) => {
        setCoordinates((prev) => {
            const newCoords = prev.filter((_, i) => i !== index);
            return newCoords;
        });
    }, []);

    // Update parent when coordinates or type change
    const handleApply = useCallback(() => {
        // Determine effective geometry type based on coordinate count
        let effectiveType = geoType;

        // If we have more than 2 points and it was a Rectangle, treat as Polygon
        if (geoType === 'Rectangle' && coordinates.length > 2) {
            effectiveType = 'Polygon';
        }

        const newGeometry = coordinatesToGeometry(coordinates, effectiveType);
        onGeometryChange(newGeometry, effectiveType);
    }, [coordinates, geoType, onGeometryChange]);

    const getLabel = () => {
        // Show Polygon label if Rectangle has more than 2 points
        const displayType = (geoType === 'Rectangle' && coordinates.length > 2) ? 'Polygon' : geoType;
        if (displayType === 'Rectangle') return 'Koordinat Persegi';
        if (displayType === 'Point') return 'Koordinat Titik';
        if (displayType === 'LineString') return 'Koordinat Garis';
        if (displayType === 'Polygon') return 'Koordinat Poligon';
        return 'Koordinat';
    };

    // Allow adding points for Rectangle (converts to Polygon), LineString, Polygon, or when no geometry yet (but not for Point)
    // Point type should only have 1 coordinate
    const canAdd =
        (geoType === '' && propGeometryType !== 'Point') ||
        geoType === 'LineString' ||
        geoType === 'Polygon' ||
        geoType === 'Rectangle';
    const canRemove =
        (geoType === 'LineString' && coordinates.length > 2) ||
        (geoType === 'Polygon' && coordinates.length > 3) ||
        (geoType === 'Rectangle' && coordinates.length > 2) ||
        (geoType === '' && coordinates.length > 0) ||
        (geoType === 'Point' && coordinates.length > 0); // Can remove point coordinate

    // Handler to add first coordinate and set default type
    const handleAddFirstCoordinate = useCallback(() => {
        if (geoType === '') {
            // Use propGeometryType if provided, otherwise default to Polygon
            setGeoType(propGeometryType || 'Polygon');
        }
        setCoordinates((prev) => [...prev, { lat: '', lng: '' }]);
    }, [geoType, propGeometryType]);

    return (
        <Field>
            <FieldLabel>{getLabel()}</FieldLabel>
            <div className="space-y-2 rounded-md border p-3">
                {coordinates.length === 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Belum ada koordinat. Gambar area di peta atau tambahkan
                            koordinat secara manual.
                        </p>
                        {!disabled && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddFirstCoordinate}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Tambahkan Koordinat Manual
                            </Button>
                        )}
                    </div>
                )}
                {coordinates.map((coord, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="w-8 text-xs text-muted-foreground">
                            {geoType === 'Rectangle'
                                ? index === 0
                                    ? 'NW'
                                    : 'SE'
                                : `#${index + 1}`}
                        </span>
                        <div className="grid flex-1 grid-cols-2 gap-2">
                            <Input
                                type="number"
                                step="any"
                                placeholder="Latitude"
                                value={coord.lat}
                                onChange={(e) =>
                                    updateCoordinate(index, 'lat', e.target.value)
                                }
                                disabled={disabled}
                                className="text-xs"
                            />
                            <Input
                                type="number"
                                step="any"
                                placeholder="Longitude"
                                value={coord.lng}
                                onChange={(e) =>
                                    updateCoordinate(index, 'lng', e.target.value)
                                }
                                disabled={disabled}
                                className="text-xs"
                            />
                        </div>
                        {canRemove && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => removeCoordinate(index)}
                                disabled={disabled}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                    {canAdd && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addCoordinate}
                            disabled={disabled}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Tambah Titik
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleApply}
                        disabled={disabled || coordinates.length === 0}
                    >
                        Terapkan Koordinat
                    </Button>
                </div>
            </div>
        </Field>
    );
}
