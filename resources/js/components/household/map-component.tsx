import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface MapComponentProps {
    latitude: number;
    longitude: number;
    householdName: string;
    address: string;
}

export default function MapComponent({
    latitude,
    longitude,
    householdName,
    address,
}: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView(
                [latitude, longitude],
                14,
            );

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstance.current);

            L.marker([latitude, longitude], {
                icon: L.icon({
                    iconUrl:
                        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl:
                        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                }),
            })
                .addTo(mapInstance.current)
                .bindPopup(
                    `<div class="p-2">
                    <p class="font-semibold text-foreground">${householdName}</p>
                    <p class="text-sm text-muted-foreground">${address}</p>
                    <p class="text-xs text-muted-foreground mt-1">
                        Lat: ${latitude}, Lng: ${longitude}
                    </p>
                </div>`,
                );
        }

        return () => {
            // Cleanup
        };
    }, [latitude, longitude, householdName, address]);

    return (
        <div
            ref={mapRef}
            className="h-96 w-full rounded-lg border border-border bg-muted"
        />
    );
}
