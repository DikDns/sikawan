import BooleanBadge from '@/components/household/boolean-badge';
import InfoSection from '@/components/household/info-section';
import HouseholdMapTab from '@/components/household/map-tab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type HouseholdDetail } from '@/types/household';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, FileDown, MapPin, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Detail Rumah', href: '/households/{id}' },
];

interface Props {
    household: HouseholdDetail;
}

export default function HouseholdDetail({ household }: Props) {
    const formatCurrency = (value: number | null) => {
        if (!value) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getOwnershipLabel = (status: string | null) => {
        const labels: Record<string, string> = {
            OWN: 'Milik Sendiri',
            RENT: 'Sewa',
            OTHER: 'Lainnya',
        };
        return labels[status || ''] || '-';
    };

    const getLegalStatusLabel = (status: string | null) => {
        const labels: Record<string, string> = {
            IMB: 'IMB',
            NONE: 'Tidak Ada',
            SHM: 'SHM',
            HGB: 'HGB',
            SURAT_PEMERINTAH: 'Surat Pemerintah',
            PERJANJIAN: 'Perjanjian',
            LAINNYA: 'Lainnya',
            TIDAK_TAHU: 'Tidak Tahu',
        };
        return labels[status || ''] || '-';
    };

    const getWaterSourceLabel = (source: string | null) => {
        const labels: Record<string, string> = {
            SR_METERAN: 'Ledeng Meteran',
            SR_NONMETER: 'Ledeng Non Meter',
            SUMUR_BOR: 'Sumur Bor',
            SUMUR_TRL: 'Sumur Terlindungi',
            MATA_AIR_TRL: 'Mata Air Terlindungi',
            HUJAN: 'Air Hujan',
            KEMASAN: 'Air Kemasan',
            SUMUR_TAK_TRL: 'Sumur Tak Terlindungi',
            MATA_AIR_TAK_TRL: 'Mata Air Tak Terlindungi',
            SUNGAI: 'Sungai',
            TANGKI_MOBIL: 'Tangki Mobil',
        };
        return labels[source || ''] || '-';
    };

    const getDefecationPlaceLabel = (place: string | null) => {
        const labels: Record<string, string> = {
            PRIVATE_SHARED: 'Jamban Sendiri',
            PUBLIC: 'Jamban Umum',
            OPEN: 'Tidak Ada',
        };
        return labels[place || ''] || '-';
    };

    const getToiletTypeLabel = (type: string | null) => {
        const labels: Record<string, string> = {
            S_TRAP: 'Leher Angsa',
            NON_S_TRAP: 'Plengsengan',
        };
        return labels[type || ''] || '-';
    };

    const getSewageLabel = (sewage: string | null) => {
        const labels: Record<string, string> = {
            SEPTIC_IPAL: 'Septictank',
            NON_SEPTIC: 'Non Septictank',
        };
        return labels[sewage || ''] || '-';
    };

    const getWasteDisposalLabel = (disposal: string | null) => {
        const labels: Record<string, string> = {
            PRIVATE_BIN: 'Tempat Sampah Pribadi',
            COMMUNAL: 'Tempat Sampah Komunal',
            BURNT: 'Dibakar',
            OPENSPACE: 'Ruang Terbuka',
            WATERBODY: 'Ke Sungai/Laut',
        };
        return labels[disposal || ''] || '-';
    };

    const getWasteFrequencyLabel = (frequency: string | null) => {
        const labels: Record<string, string> = {
            GE2X_WEEK: '≥ 2x Seminggu',
            LT1X_WEEK: '< 1x Seminggu',
        };
        return labels[frequency || ''] || '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rumah ${household.head_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 bg-background p-6">
                {/* Header */}
                <Button
                    variant="ghost"
                    onClick={() => router.visit('/households')}
                    className="mb-4 w-fit gap-2 text-muted-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Data Rumah
                </Button>

                {/* Detail Card with Image Background */}
                <Card className="overflow-hidden border-border shadow-lg">
                    <div className="relative h-64 bg-gradient-to-br from-[#8B87E8] to-[#8B87E8]/80">
                        <img
                            src="/rumah-tradisional.jpg"
                            alt={household.head_name}
                            className="h-full w-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8B87E8]/60 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <h1 className="mb-2 text-3xl font-bold text-white">
                                {household.head_name}
                            </h1>
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="h-4 w-4" />
                                <span>{household.address_text}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <CardContent className="p-6">
                        <Tabs defaultValue="umum" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-muted">
                                <TabsTrigger value="umum">Umum</TabsTrigger>
                                <TabsTrigger value="teknis">
                                    Data Teknis
                                </TabsTrigger>
                                <TabsTrigger value="lokasi">
                                    Lokasi Peta
                                </TabsTrigger>
                                <TabsTrigger value="bantuan">
                                    Bantuan
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab: Umum */}
                            <TabsContent
                                value="umum"
                                className="mt-6 space-y-6"
                            >
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
                                                value: getLegalStatusLabel(
                                                    household.building_legal_status,
                                                ),
                                            },
                                            {
                                                label: 'Legalitas Lahan',
                                                value: getLegalStatusLabel(
                                                    household.land_legal_status,
                                                ),
                                            },
                                        ]}
                                    />
                                </div>

                                <div className="border-t border-border pt-6">
                                    <InfoSection
                                        title="Data Penghuni"
                                        columns={3}
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
                                                value: household.main_occupation,
                                            },
                                            {
                                                label: 'Penghasilan',
                                                value: formatCurrency(
                                                    household.monthly_income_idr,
                                                ),
                                            },
                                            {
                                                label: 'Status Rumah Tangga',
                                                value: household.status_mbr,
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
                                                label: 'total Jiwa',
                                                value: household.member_total,
                                            },
                                        ]}
                                    />
                                </div>

                                <div className="border-t border-border pt-6">
                                    <InfoSection
                                        title="Fasilitas Kesehatan Yang Digunakan"
                                        items={[
                                            {
                                                label: 'Fasilitas Kesehatan Yang Digunakan',
                                                value: household.health_facility_used,
                                            },
                                            {
                                                label: 'Lokasi Fasilitas Kesehatan',
                                                value: household.health_facility_location,
                                            },
                                        ]}
                                    />
                                </div>

                                <div className="border-t border-border pt-6">
                                    <InfoSection
                                        title="Lokasi Fasilitas Pendidikan"
                                        items={[
                                            {
                                                label: 'Lokasi Fasilitas Pendidikan',
                                                value: household.education_facility_location,
                                            },
                                        ]}
                                    />
                                </div>
                            </TabsContent>

                            {/* Tab: Data Teknis */}
                            <TabsContent
                                value="teknis"
                                className="mt-6 space-y-6"
                            >
                                {household.technical_data ? (
                                    <>
                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-foreground">
                                                Keteraturan Bangunan
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Akses jalan &lt;1,5 m
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .road_width_category ===
                                                            'LE1_5'
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Akses Jalan &gt;1,5 m
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .road_width_category ===
                                                            'GT1_5'
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Hadap jalan
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .facade_faces_road
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Menghadap Sempadan
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .faces_waterbody
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Diatas Sempadan
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .in_setback_area
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Daerah Limbah/ Dibawah
                                                        jalur listrik tegangan
                                                        tinggi
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .in_hazard_area
                                                        }
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
                                                        value: household
                                                            .technical_data
                                                            .building_length_m
                                                            ? `${household.technical_data.building_length_m}m`
                                                            : '-',
                                                    },
                                                    {
                                                        label: 'Lebar Bangunan',
                                                        value: household
                                                            .technical_data
                                                            .building_width_m
                                                            ? `${household.technical_data.building_width_m}m`
                                                            : '-',
                                                    },
                                                    {
                                                        label: 'Jumlah Lantai',
                                                        value: household
                                                            .technical_data
                                                            .floor_count,
                                                    },
                                                    {
                                                        label: 'Ketinggian perlantai',
                                                        value: household
                                                            .technical_data
                                                            .floor_height_m
                                                            ? `${household.technical_data.floor_height_m} m`
                                                            : '-',
                                                    },
                                                    {
                                                        label: 'Luas Bangunan',
                                                        value: household
                                                            .technical_data
                                                            .building_area_m2
                                                            ? `${household.technical_data.building_area_m2} m²`
                                                            : '-',
                                                    },
                                                    {
                                                        label: 'Luas Lantai Bangunan/ jiwa',
                                                        value: household
                                                            .technical_data
                                                            .area_per_person_m2
                                                            ? `> ${household.technical_data.area_per_person_m2} meter/jiwa`
                                                            : '-',
                                                    },
                                                ]}
                                            />

                                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Pondasi
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .has_foundation
                                                        }
                                                        trueLabel="Ada"
                                                        falseLabel="Tidak Ada"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Sloof
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .has_sloof
                                                        }
                                                        trueLabel="Ada"
                                                        falseLabel="Tidak Ada"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Ring Balok
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .has_ring_beam
                                                        }
                                                        trueLabel="Ada"
                                                        falseLabel="Tidak Ada"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Struktur Atap
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .has_roof_structure
                                                        }
                                                        trueLabel="Ada"
                                                        falseLabel="Tidak Ada"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        Tiang Kolom
                                                    </p>
                                                    <BooleanBadge
                                                        value={
                                                            household
                                                                .technical_data
                                                                .has_columns
                                                        }
                                                        trueLabel="Ada"
                                                        falseLabel="Tidak Ada"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <InfoSection
                                                    title=""
                                                    columns={3}
                                                    items={[
                                                        {
                                                            label: 'Material Atap',
                                                            value: household
                                                                .technical_data
                                                                .roof_material,
                                                        },
                                                        {
                                                            label: 'Kondisi Atap',
                                                            value: household
                                                                .technical_data
                                                                .roof_condition,
                                                        },
                                                        {
                                                            label: 'Material Dinding',
                                                            value: household
                                                                .technical_data
                                                                .wall_material,
                                                        },
                                                        {
                                                            label: 'Kondisi Dinding',
                                                            value: household
                                                                .technical_data
                                                                .wall_condition,
                                                        },
                                                        {
                                                            label: 'Material Lantai',
                                                            value: household
                                                                .technical_data
                                                                .floor_material,
                                                        },
                                                        {
                                                            label: 'Kondisi Dinding',
                                                            value: household
                                                                .technical_data
                                                                .floor_condition,
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
                                                            household
                                                                .technical_data
                                                                .water_source,
                                                        ),
                                                    },
                                                    {
                                                        label: 'Jarak Sumber air ke penampung tinja/kotoran',
                                                        value: household
                                                            .technical_data
                                                            .water_distance_to_septic_m
                                                            ? `< ${household.technical_data.water_distance_to_septic_m}m`
                                                            : '-',
                                                    },
                                                    {
                                                        label: 'Kecukupan air pertahun',
                                                        value: household
                                                            .technical_data
                                                            .water_fulfillment,
                                                    },
                                                ]}
                                            />
                                        </div>

                                        <div className="border-t border-border pt-6">
                                            <InfoSection
                                                title="Sumber Listrik"
                                                items={[
                                                    {
                                                        label: 'Sumber Utama',
                                                        value: household
                                                            .technical_data
                                                            .electricity_source,
                                                    },
                                                    {
                                                        label: 'Daya Listrik',
                                                        value: household
                                                            .technical_data
                                                            .electricity_power_watt
                                                            ? `>${household.technical_data.electricity_power_watt}`
                                                            : '-',
                                                    },
                                                ]}
                                            />
                                        </div>

                                        <div className="border-t border-border pt-6">
                                            <InfoSection
                                                title="Limbah/Sanitasi"
                                                items={[
                                                    {
                                                        label: 'Tempat Buang Air',
                                                        value: getDefecationPlaceLabel(
                                                            household
                                                                .technical_data
                                                                .defecation_place,
                                                        ),
                                                    },
                                                    {
                                                        label: 'Jenis Kloset',
                                                        value: getToiletTypeLabel(
                                                            household
                                                                .technical_data
                                                                .toilet_type,
                                                        ),
                                                    },
                                                    {
                                                        label: 'Pembuangan limbah',
                                                        value: getSewageLabel(
                                                            household
                                                                .technical_data
                                                                .sewage_disposal,
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
                                                            household
                                                                .technical_data
                                                                .waste_disposal_place,
                                                        ),
                                                    },
                                                    {
                                                        label: 'Pengangkutan Sampah',
                                                        value: getWasteFrequencyLabel(
                                                            household
                                                                .technical_data
                                                                .waste_collection_frequency,
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <Card className="border-border bg-muted">
                                        <CardContent className="py-12 text-center">
                                            <p className="text-muted-foreground">
                                                Data teknis belum tersedia
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Tab: Lokasi Peta */}
                            <TabsContent value="lokasi" className="mt-6">
                                <HouseholdMapTab household={household} />
                            </TabsContent>

                            {/* Tab: Bantuan */}
                            <TabsContent
                                value="bantuan"
                                className="mt-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        Bantuan Perbaikan
                                    </h3>
                                    <Button
                                        size="sm"
                                        className="gap-2 bg-[#B4F233] text-[#3A3A3A] hover:bg-[#B4F233]/90"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Data
                                    </Button>
                                </div>

                                {household.assistances &&
                                household.assistances.length > 0 ? (
                                    <div className="space-y-4">
                                        {household.assistances.map(
                                            (assistance) => (
                                                <Card
                                                    key={assistance.id}
                                                    className="border-border bg-muted"
                                                >
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <CardTitle className="text-base text-foreground">
                                                                    {
                                                                        assistance.program
                                                                    }
                                                                </CardTitle>
                                                                <CardDescription className="mt-1">
                                                                    {
                                                                        assistance.started_at
                                                                    }
                                                                </CardDescription>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    assistance.status ===
                                                                    'SELESAI'
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                className="border-0 bg-[#D7EDFF] text-[#4A9FFF]"
                                                            >
                                                                {
                                                                    assistance.status
                                                                }
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Program
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {
                                                                    assistance.program
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Sumber Dana
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {
                                                                    assistance.funding_source
                                                                }
                                                            </p>
                                                        </div>
                                                        {assistance.cost_amount_idr && (
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Biaya
                                                                </p>
                                                                <p className="text-xl font-bold text-foreground">
                                                                    {formatCurrency(
                                                                        assistance.cost_amount_idr,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {assistance.description && (
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Deskripsi
                                                                </p>
                                                                <p className="text-foreground">
                                                                    {
                                                                        assistance.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <Card className="border-border bg-muted">
                                        <CardContent className="py-12 text-center">
                                            <p className="text-muted-foreground">
                                                Belum ada bantuan perbaikan
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                <Button className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                    <FileDown className="h-4 w-4" />
                                    Download Laporan
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
