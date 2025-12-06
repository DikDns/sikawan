import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Loader2, MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import type { MapLocationData, NominatimSearchResult } from '../types';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    data: MapLocationData;
    onChange: (data: MapLocationData) => void;
    provinceId?: string;
    provinceName?: string;
    regencyId?: string;
    regencyName?: string;
    districtId?: string;
    districtName?: string;
    villageId?: string;
    villageName?: string;
}

interface MapControllerProps {
    center: [number, number];
    zoom: number;
}

// Component to control map view
function MapController({ center, zoom }: MapControllerProps) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
}

// Component to handle map click events
interface MapClickHandlerProps {
    onMapClick: (e: L.LeafletMouseEvent) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
    useMapEvents({
        click: (e) => {
            onMapClick(e);
        },
    });
    return null;
}

export function MapPicker({
    data,
    onChange,
    provinceId,
    provinceName,
    regencyId,
    regencyName,
    districtId,
    districtName,
    villageId,
    villageName,
}: MapPickerProps) {
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        -4.2327, 103.6141,
    ]); // Muara Enim default
    const [mapZoom, setMapZoom] = useState<number>(10);
    const [markerPosition, setMarkerPosition] = useState<
        [number, number] | null
    >(
        data.latitude && data.longitude
            ? [
                  parseFloat(data.latitude.toString()),
                  parseFloat(data.longitude.toString()),
              ]
            : null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Use ref to store onChange callback to avoid it being a dependency
    const onChangeRef = useRef(onChange);

    // Use ref to track if initial load is done
    const hasLoadedRef = useRef(false);

    // Store initial coordinates to detect external changes
    const initialCoordsRef = useRef({
        latitude: data.latitude,
        longitude: data.longitude,
    });

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Nominatim API call with structured query
    const searchLocationStructured = useCallback(
        async (params: {
            city?: string;
            state?: string;
            country?: string;
        }): Promise<NominatimSearchResult | null> => {
            try {
                const searchParams = new URLSearchParams({
                    format: 'json',
                    limit: '1',
                    addressdetails: '1',
                });

                if (params.city) searchParams.append('city', params.city);
                if (params.state) searchParams.append('state', params.state);
                if (params.country)
                    searchParams.append('country', params.country);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?${searchParams}`,
                    {
                        headers: {
                            'User-Agent': 'SikaWan-HouseholdMapping/1.0',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }

                const results = await response.json();
                if (results && results.length > 0) {
                    return results[0] as NominatimSearchResult;
                }
                return null;
            } catch (err) {
                console.error('Error searching location:', err);
                return null;
            }
        },
        [],
    );

    // Load area and marker on mount or when location data changes externally
    useEffect(() => {
        // Check if coordinates changed from external source (not from map click)
        const coordsChangedExternally =
            data.latitude !== initialCoordsRef.current.latitude ||
            data.longitude !== initialCoordsRef.current.longitude;

        // Only load if not loaded yet, or if coordinates changed from external source
        if (
            !hasLoadedRef.current ||
            (coordsChangedExternally && hasLoadedRef.current)
        ) {
            const loadMap = async () => {
                console.log('🔄 Loading map...', {
                    hasLoaded: hasLoadedRef.current,
                    coordsChangedExternally,
                });

                setIsLoading(true);
                setError(null);

                try {
                    // Use structured query to search for area (city, state, country)
                    // city = unit paling kecil (desa/kelurahan, atau kabupaten jika tidak ada desa)
                    const searchParams: {
                        city?: string;
                        state?: string;
                        country: string;
                    } = {
                        country: 'Indonesia',
                    };

                    // Use province as state
                    if (provinceName) {
                        searchParams.state = provinceName;
                    }

                    // Use village as city (unit paling kecil)
                    // If village not available, use regency
                    if (villageName) {
                        searchParams.city = villageName;
                    } else if (regencyName) {
                        searchParams.city = regencyName;
                    }

                    console.log(
                        '🗺️ Searching with structured query:',
                        searchParams,
                    );

                    // Search for location with structured query
                    const locationResult =
                        await searchLocationStructured(searchParams);
                    if (locationResult) {
                        const [minLat, maxLat, minLon, maxLon] =
                            locationResult.boundingbox.map(Number);
                        const centerLat = (minLat + maxLat) / 2;
                        const centerLon = (minLon + maxLon) / 2;

                        // Calculate zoom level based on bounding box size
                        const latDiff = maxLat - minLat;
                        const lonDiff = maxLon - minLon;
                        const maxDiff = Math.max(latDiff, lonDiff);
                        const zoom =
                            maxDiff > 0.5
                                ? 10
                                : maxDiff > 0.1
                                  ? 12
                                  : maxDiff > 0.05
                                    ? 14
                                    : 15;

                        setMapCenter([centerLat, centerLon]);
                        setMapZoom(zoom);

                        console.log('✅ Location found:', {
                            center: [centerLat, centerLon],
                            zoom,
                            boundingbox: locationResult.boundingbox,
                        });

                        // If village was included in search and found, create marker (only on initial load)
                        if (
                            !hasLoadedRef.current &&
                            !data.latitude &&
                            !data.longitude
                        ) {
                            const lat = parseFloat(locationResult.lat);
                            const lon = parseFloat(locationResult.lon);
                            const newMarkerPosition: [number, number] = [
                                lat,
                                lon,
                            ];
                            setMarkerPosition(newMarkerPosition);

                            // Call onChange to save the coordinates using ref
                            onChangeRef.current({
                                latitude: lat,
                                longitude: lon,
                            });

                            console.log('✅ Village marker created:', [
                                lat,
                                lon,
                            ]);
                        }
                    } else {
                        console.warn('⚠️ Location not found in Nominatim');
                    }

                    // Check if there's existing marker data (latitude/longitude)
                    if (data.latitude && data.longitude) {
                        setMarkerPosition([
                            parseFloat(data.latitude.toString()),
                            parseFloat(data.longitude.toString()),
                        ]);

                        // Only center on marker if coordinates changed externally
                        if (coordsChangedExternally) {
                            setMapCenter([
                                parseFloat(data.latitude.toString()),
                                parseFloat(data.longitude.toString()),
                            ]);
                        }

                        console.log('✅ Using existing marker:', [
                            data.latitude,
                            data.longitude,
                        ]);
                    }

                    // Update initial coords ref
                    initialCoordsRef.current = {
                        latitude: data.latitude,
                        longitude: data.longitude,
                    };

                    // Mark as loaded
                    hasLoadedRef.current = true;
                } catch (err) {
                    console.error('Error loading map:', err);
                    setError(
                        'Gagal memuat peta. Silakan periksa koneksi internet Anda.',
                    );
                } finally {
                    setIsLoading(false);
                }
            };

            loadMap();
        }
        // Remove data.latitude and data.longitude from dependencies
        // Only refetch if location info changes (province, regency, village)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        provinceId,
        provinceName,
        regencyId,
        regencyName,
        districtId,
        districtName,
        villageId,
        villageName,
        searchLocationStructured,
    ]);

    // Handle map click to add/remove marker
    const handleMapClick = useCallback(
        (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            if (markerPosition) {
                // If marker exists, remove it
                setMarkerPosition(null);
                onChange({ latitude: undefined, longitude: undefined });
                console.log('🗑️ Marker removed');
            } else {
                // If no marker, add it
                const newPosition: [number, number] = [lat, lng];
                setMarkerPosition(newPosition);
                onChange({ latitude: lat, longitude: lng });
                console.log('📍 Marker added:', [lat, lng]);
            }
        },
        [markerPosition, onChange],
    );

    // Clear marker
    const handleClearMarker = useCallback(() => {
        setMarkerPosition(null);
        onChange({ latitude: undefined, longitude: undefined });
    }, [onChange]);

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center rounded-lg border bg-muted/50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Memuat peta...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="text-sm font-medium">
                            Pilih Lokasi di Peta
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Klik pada peta untuk menambah/menghapus marker
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!markerPosition}
                    onClick={handleClearMarker}
                >
                    Hapus Marker
                </Button>
            </div>

            <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                    Koordinat: {markerPosition?.[0]?.toFixed(6) ?? '0.000000'},{' '}
                    {markerPosition?.[1]?.toFixed(6) ?? '0.000000'}
                </AlertDescription>
            </Alert>

            <div className="h-96 overflow-hidden rounded-lg border">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={mapCenter} zoom={mapZoom} />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {markerPosition && (
                        <Marker
                            position={markerPosition}
                            eventHandlers={{
                                click: (e: L.LeafletMouseEvent) => {
                                    e.originalEvent.stopPropagation();
                                    handleClearMarker();
                                },
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
