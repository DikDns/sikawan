import InfoSection from '@/components/household/info-section';
import { type HouseholdDetail } from '@/types/household';
import {
    formatIncome,
    getBuildingLegalStatusLabel,
    getLandLegalStatusLabel,
    getMainOccupationLabel,
    getOwnershipLabel,
} from '@/utils/household-formatters';

interface GeneralInfoTabProps {
    household: HouseholdDetail;
}

export default function GeneralInfoTab({ household }: GeneralInfoTabProps) {
    return (
        <div className="mt-6 space-y-6">
            <InfoSection
                title="Informasi Umum"
                items={[
                    {
                        label: 'Id Rumah',
                        value: household.id,
                    },
                    {
                        label: 'Tanggal Pendataan',
                        value: household.survey_date,
                    },
                    {
                        label: 'Alamat',
                        value: household.address_text,
                    },
                    {
                        label: 'Provinsi',
                        value: household.province_name,
                    },
                    {
                        label: 'Kota/Kabupaten',
                        value: household.regency_name,
                    },
                    {
                        label: 'Desa/Kelurahan',
                        value: household.village_name,
                    },
                    {
                        label: 'Kecamatan',
                        value: household.district_name,
                    },
                    {
                        label: 'RT/RW',
                        value: household.rt_rw,
                    },
                ]}
            />

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Penguasaan Bangunan & Lahan"
                    items={[
                        {
                            label: 'Status Hunian Bangunan',
                            value: getOwnershipLabel(
                                household.ownership_status_building,
                            ),
                        },
                        {
                            label: 'Status Lahan Hunian',
                            value: getOwnershipLabel(
                                household.ownership_status_land,
                            ),
                        },
                        {
                            label: 'Legalitas Bangunan',
                            value: getBuildingLegalStatusLabel(
                                household.building_legal_status,
                            ),
                        },
                        {
                            label: 'Legalitas Lahan',
                            value: getLandLegalStatusLabel(
                                household.land_legal_status,
                            ),
                        },
                    ]}
                />
            </div>

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Data Penghuni"
                    columns={2}
                    items={[
                        {
                            label: 'Nama Kepala Keluarga',
                            value: household.head_name,
                        },
                        {
                            label: 'NIK',
                            value: household.nik,
                        },
                        {
                            label: 'Pekerjaan Utama',
                            value: getMainOccupationLabel(
                                household.main_occupation,
                            ),
                        },
                        {
                            label: 'Penghasilan',
                            value: formatIncome(household.monthly_income_idr),
                        },
                        {
                            label: 'Jumlah KK',
                            value: household.kk_count,
                        },
                        {
                            label: 'Anggota Laki-laki',
                            value: household.male_count,
                        },
                        {
                            label: 'Anggota Perempuan',
                            value: household.female_count,
                        },
                        {
                            label: 'Anggota Difabel',
                            value: household.disabled_count,
                        },
                        {
                            label: 'Total Jiwa',
                            value: household.member_total,
                        },
                    ]}
                />
            </div>

            <div className="border-t border-border pt-6">
                <InfoSection
                    title="Fasilitas"
                    columns={2}
                    items={[
                        {
                            label: 'Fasilitas Kesehatan',
                            value: household.health_facility_used ?? '-',
                        },
                        {
                            label: 'Lokasi Fasilitas Kesehatan',
                            value: household.health_facility_location ?? '-',
                        },
                        {
                            label: 'Lokasi Fasilitas Pendidikan',
                            value: household.education_facility_location ?? '-',
                        },
                    ]}
                />
            </div>
        </div>
    );
}
