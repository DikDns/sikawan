import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface Household {
    id: number;
    head_name: string;
    address_text: string;
    latitude: number | null;
    longitude: number | null;
}

const MapComponent = dynamic(() => import('./map-component'), {
    loading: () => (
        <Card className="border-border bg-muted">
            <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Memuat peta...</p>
            </CardContent>
        </Card>
    ),
    ssr: false,
});

export default function HouseholdMapTab({
    household,
}: {
    household: Household;
}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <Card className="border-border bg-muted">
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Memuat peta...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
                Lokasi Rumah
            </h3>
            {household.latitude && household.longitude ? (
                <MapComponent
                    latitude={household.latitude}
                    longitude={household.longitude}
                    householdName={household.head_name}
                    address={household.address_text}
                />
            ) : (
                <Card className="border-border bg-muted">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Koordinat lokasi tidak tersedia
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
