import BooleanBadge from '@/components/household/boolean-badge';
import InfoSection from '@/components/household/info-section';
import { Card, CardContent } from '@/components/ui/card';
import { type HouseholdDetail } from '@/types/household';
import {
    getDefecationPlaceLabel,
    getElectricitySourceLabel,
    getFloorConditionLabel,
    getFloorMaterialLabel,
    getRoofConditionLabel,
    getRoofMaterialLabel,
    getRoadWidthCategoryLabel,
    getSewageLabel,
    getToiletTypeLabel,
    getWallConditionLabel,
    getWallMaterialLabel,
    getWasteDisposalLabel,
    getWasteFrequencyLabel,
    getWaterDistanceCategoryLabel,
    getWaterFulfillmentLabel,
    getWaterSourceLabel,
} from '@/utils/household-formatters';

interface TechnicalDataTabProps {
    household: HouseholdDetail;
}

export default function TechnicalDataTab({ household }: TechnicalDataTabProps) {
    if (!household.technical_data) {
        return (
            <Card className="mt-6 border-border bg-muted">
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                        Data teknis belum tersedia
                    </p>
                </CardContent>
            </Card>
        );
    }

    const technicalData = household.technical_data;

    return (
        <div className="mt-6 space-y-6">
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Keteraturan Bangunan
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Akses Jalan
                        </p>
                        <BooleanBadge
                            value={technicalData.has_road_access === true}
                        />
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Lebar Jalan
                        </p>
                        <p className="text-sm font-medium">
                            {getRoadWidthCategoryLabel(
                                technicalData.road_width_category ?? null,
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Hadap Jalan
                        </p>
                        <BooleanBadge
                            value={technicalData.facade_faces_road === true}
                        />
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Menghadap Sungai/Laut/Rawa/Danau
                        </p>
                        <BooleanBadge
                            value={technicalData.faces_waterbody === true}
                        />
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Pemukiman Limbah
                        </p>
                        <BooleanBadge
                            value={technicalData.in_setback_area === true}
                        />
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Daerah Limbah / Dibawah Jalur Listrik Tegangan
                            Tinggi
                        </p>
                        <BooleanBadge
                            value={technicalData.in_hazard_area === true}
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Teknis Bangunan"
                    columns={3}
                    items={[
                        {
                            label: 'Panjang Bangunan',
                            value: technicalData.building_length_m
                                ? `${technicalData.building_length_m}m`
                                : '-',
                        },
                        {
                            label: 'Lebar Bangunan',
                            value: technicalData.building_width_m
                                ? `${technicalData.building_width_m}m`
                                : '-',
                        },
                        {
                            label: 'Jumlah Lantai',
                            value: technicalData.floor_count ?? '-',
                        },
                        {
                            label: 'Ketinggian perlantai',
                            value: technicalData.floor_height_m
                                ? `${technicalData.floor_height_m} m`
                                : '-',
                        },
                        {
                            label: 'Luas Bangunan',
                            value: technicalData.building_area_m2
                                ? `${technicalData.building_area_m2} m²`
                                : '-',
                        },
                        {
                            label: 'Luas Lantai Bangunan/ jiwa',
                            value: technicalData.area_per_person_m2
                                ? `${technicalData.area_per_person_m2} m²/jiwa`
                                : '-',
                        },
                    ]}
                />

                <div className="mt-6">
                    <InfoSection
                        title="Material & Kondisi"
                        columns={3}
                        items={[
                            {
                                label: 'Material Atap',
                                value: getRoofMaterialLabel(
                                    technicalData.roof_material ?? null,
                                ),
                            },
                            {
                                label: 'Kondisi Atap',
                                value: getRoofConditionLabel(
                                    technicalData.roof_condition ?? null,
                                ),
                            },
                            {
                                label: 'Material Dinding',
                                value: getWallMaterialLabel(
                                    technicalData.wall_material ?? null,
                                ),
                            },
                            {
                                label: 'Kondisi Dinding',
                                value: getWallConditionLabel(
                                    technicalData.wall_condition ?? null,
                                ),
                            },
                            {
                                label: 'Material Lantai',
                                value: getFloorMaterialLabel(
                                    technicalData.floor_material ?? null,
                                ),
                            },
                            {
                                label: 'Kondisi Lantai',
                                value: getFloorConditionLabel(
                                    technicalData.floor_condition ?? null,
                                ),
                            },
                        ]}
                    />
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Sumber Air"
                    items={[
                        {
                            label: 'Sumber Utama',
                            value: getWaterSourceLabel(
                                technicalData.water_source ?? null,
                            ),
                        },
                        {
                            label: 'Jarak ke Penampung Tinja',
                            value: technicalData.water_distance_to_septic_m
                                ? `${technicalData.water_distance_to_septic_m}m`
                                : '-',
                        },
                        {
                            label: 'Kategori Jarak',
                            value: getWaterDistanceCategoryLabel(
                                technicalData.water_distance_category ?? null,
                            ),
                        },
                        {
                            label: 'Kecukupan Air',
                            value: getWaterFulfillmentLabel(
                                technicalData.water_fulfillment ?? null,
                            ),
                        },
                    ]}
                />
            </div>

            <div className="border-t border-border pt-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Sumber Listrik
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Sumber Utama
                        </p>
                        <p className="font-semibold text-foreground">
                            {getElectricitySourceLabel(
                                technicalData.electricity_source ?? null,
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Daya Listrik (Watt)
                        </p>
                        <p className="font-semibold text-foreground">
                            {technicalData.electricity_power_watt
                                ? `${technicalData.electricity_power_watt}W`
                                : '-'}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Listrik Tersambung
                        </p>
                        <BooleanBadge
                            value={technicalData.electricity_connected === true}
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Limbah & Sanitasi"
                    items={[
                        {
                            label: 'Tempat Buang Air',
                            value: getDefecationPlaceLabel(
                                technicalData.defecation_place ?? null,
                            ),
                        },
                        {
                            label: 'Jenis Kloset',
                            value: getToiletTypeLabel(
                                technicalData.toilet_type ?? null,
                            ),
                        },
                        {
                            label: 'Pembuangan Limbah',
                            value: getSewageLabel(
                                technicalData.sewage_disposal ?? null,
                            ),
                        },
                    ]}
                />
            </div>

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Pengelolaan Sampah"
                    items={[
                        {
                            label: 'Pembuangan Sampah',
                            value: getWasteDisposalLabel(
                                technicalData.waste_disposal_place ?? null,
                            ),
                        },
                        {
                            label: 'Pengangkutan Sampah',
                            value: getWasteFrequencyLabel(
                                technicalData.waste_collection_frequency ??
                                    null,
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}
