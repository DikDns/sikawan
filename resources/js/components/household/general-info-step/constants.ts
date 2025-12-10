/**
 * Constants for General Info Step
 */

export const OWNERSHIP_STATUS_OPTIONS = [
    { value: 'OWN', label: 'Milik Sendiri' },
    { value: 'RENT', label: 'Sewa / Kontrak' },
    { value: 'OTHER', label: 'Numpang / Milik Pihak Lain' },
] as const;

export const BUILDING_LEGAL_STATUS_OPTIONS = [
    { value: 'IMB', label: 'IMB' },
    { value: 'NONE', label: 'Tidak Ada' },
] as const;

export const LAND_LEGAL_STATUS_OPTIONS = [
    { value: 'SHM', label: 'SHM' },
    { value: 'HGB', label: 'HGB' },
    { value: 'SURAT_PEMERINTAH', label: 'Surat yang Diakui Pemerintah' },
    {
        value: 'PERJANJIAN',
        label: 'Milik Pihak Lain / Surat Perjanjian Lainnya / Surat Adat',
    },
    { value: 'LAINNYA', label: 'Milik Pihak Lain Tanpa Surat Perjanjian' },
    { value: 'TIDAK_TAHU', label: 'Tidak Ada / Tidak Tahu' },
] as const;

export const MAIN_OCCUPATION_OPTIONS = [
    { value: 'tidak-ada', label: 'Tidak Ada' },
    { value: 'pegawai-pemerintah', label: 'Pegawai Pemerintah' },
    {
        value: 'perdagangan-jasa',
        label: 'Perdagangan / Jasa (Guru, Tenaga Kesehatan, Hotel, dll)',
    },
    {
        value: 'petani-perkebunan-kehutanan-peternakan',
        label: 'Pertanian / Perkebunan / Kehutanan / Peternakan',
    },
    { value: 'perikanan-nelayan', label: 'Perikanan / Nelayan' },
    { value: 'pertambangan-galian', label: 'Pertambangan / Galian' },
    { value: 'industri-pabrik', label: 'Industri / Pabrik' },
    { value: 'konstruksi-bangunan', label: 'Konstruksi / Bangunan' },
] as const;

export const INCOME_OPTIONS = [
    { value: '<1jt', label: '< 1 Juta' },
    { value: '1-3jt', label: '1-3 Juta' },
    { value: '3-5jt', label: '3-5 Juta' },
    { value: '>5jt', label: '> 5 Juta' },
] as const;

export const HOUSEHOLD_STATUS_OPTIONS = [
    { value: 'kepala-keluarga', label: 'Kepala Keluarga' },
    { value: 'istri', label: 'Istri' },
    { value: 'anak', label: 'Anak' },
] as const;

export const HEALTH_FACILITY_USED_OPTIONS = [
    { value: 'Puskesmas', label: 'Puskesmas' },
    { value: 'Rumah Sakit', label: 'Rumah Sakit' },
    { value: 'Klinik', label: 'Klinik' },
    { value: 'Praktik Dokter', label: 'Praktik Dokter' },
] as const;

export const FACILITY_LOCATION_OPTIONS = [
    {
        value: 'Dalam Kelurahan/Kecamatan',
        label: 'Dalam Kelurahan/Kecamatan',
    },
    {
        value: 'Luar Kelurahan/Kecamatan',
        label: 'Luar Kelurahan/Kecamatan',
    },
] as const;
