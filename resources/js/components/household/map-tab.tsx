import { Card, CardContent } from '@/components/ui/card';
import { lazy, Suspense } from 'react';

interface Household {
    id: number;
    head_name: string;
    address_text: string;
    latitude: number | null;
    longitude: number | null;
    province_name?: string | null;
    regency_name?: string | null;
    district_name?: string | null;
    village_name?: string | null;
    habitability_status?: string | null;
}

const MapComponent = lazy(() => import('./map-component'));

export default function HouseholdMapTab({
    household,
}: {
    household: Household;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
                Lokasi Rumah
            </h3>
            {household.latitude && household.longitude ? (
                <Suspense
                    fallback={
                        <Card className="border-border bg-muted">
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    Memuat peta...
                                </p>
                            </CardContent>
                        </Card>
                    }
                >
                    <MapComponent
                        latitude={household.latitude}
                        longitude={household.longitude}
                        householdName={household.head_name}
                        address={household.address_text}
                        provinceName={household.province_name}
                        regencyName={household.regency_name}
                        districtName={household.district_name}
                        villageName={household.village_name}
                        habitabilityStatus={household.habitability_status}
                    />
                </Suspense>
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
