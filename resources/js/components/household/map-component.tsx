import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from '@/components/ui/map';
import { Home } from 'lucide-react';

interface MapComponentProps {
    latitude: number;
    longitude: number;
    householdName: string;
    address: string;
    provinceName?: string | null;
    regencyName?: string | null;
    districtName?: string | null;
    villageName?: string | null;
    habitabilityStatus?: string | null;
}

const MarkerIcon = () => (
    <div
        className="flex size-8 items-center justify-center rounded-full border border-primary bg-background shadow-sm"
        aria-label="Lokasi rumah"
        tabIndex={0}
    >
        <Home className="size-5 text-primary" />
    </div>
);

export default function MapComponent({
    latitude,
    longitude,
    householdName,
    address,
    provinceName,
    regencyName,
    districtName,
    villageName,
    habitabilityStatus,
}: MapComponentProps) {
    return (
        <div className="h-96 w-full overflow-hidden rounded-lg border border-border">
            <Map
                center={[latitude, longitude]}
                zoom={15}
                className="h-full w-full"
            >
                <MapTileLayer name="OSM" />
                <MapZoomControl />
                <MapMarker
                    position={[latitude, longitude]}
                    icon={<MarkerIcon />}
                    iconAnchor={[16, 16]}
                    popupAnchor={[0, -16]}
                    aria-label={`Lokasi rumah: ${householdName}`}
                >
                    <MapPopup>
                        <div className="space-y-2" aria-label="Informasi rumah">
                            <div className="font-medium">{householdName}</div>
                            <div className="text-xs text-muted-foreground">
                                {address}
                            </div>
                            {habitabilityStatus && (
                                <div className="text-xs">
                                    Status: {habitabilityStatus}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Provinsi: {provinceName || '-'}</div>
                                <div>Kab/Kota: {regencyName || '-'}</div>
                                <div>Kecamatan: {districtName || '-'}</div>
                                <div>Desa: {villageName || '-'}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Koordinat: {Number(latitude).toFixed(6)},{' '}
                                {Number(longitude).toFixed(6)}
                            </div>
                        </div>
                    </MapPopup>
                </MapMarker>
            </Map>
        </div>
    );
}
