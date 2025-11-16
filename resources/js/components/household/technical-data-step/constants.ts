/**
 * Constants for Technical Data Step
 * Based on SCHEMA_DB_V2.md and PENDATAAN BASELINE.md
 */

// A.1 KETERATURAN BANGUNAN HUNIAN
export const ROAD_WIDTH_CATEGORY_OPTIONS = [
    { value: 'LE1_5', label: 'Lebar jalan < 1.5 meter' },
    { value: 'EQ1_5', label: 'Lebar jalan = 1.5 meter' },
    { value: 'GT1_5', label: 'Lebar jalan > 1.5 meter' },
] as const;

export const YES_NO_OPTIONS = [
    { value: 'true', label: 'Ya' },
    { value: 'false', label: 'Tidak' },
] as const;

// A.2 KELAYAKAN BANGUNAN HUNIAN - Material & Kondisi
export const ROOF_MATERIAL_OPTIONS = [
    { value: 'SENG', label: 'Seng' },
    { value: 'GENTENG', label: 'Genteng' },
    { value: 'ASBES', label: 'Asbes' },
    { value: 'BETON', label: 'Beton' },
    { value: 'IJUK', label: 'Ijuk' },
    { value: 'KAYU', label: 'Kayu' },
    { value: 'DAUN', label: 'Daun' },
    { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export const ROOF_CONDITION_OPTIONS = [
    { value: 'GOOD', label: 'Tidak Bocor' },
    { value: 'LEAK', label: 'Bocor' },
] as const;

export const WALL_MATERIAL_OPTIONS = [
    { value: 'TEMBOK', label: 'Tembok' },
    { value: 'KAYU', label: 'Kayu' },
    { value: 'SENG', label: 'Seng' },
    { value: 'BAMBU', label: 'Bambu' },
    { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export const WALL_CONDITION_OPTIONS = [
    { value: 'GOOD', label: 'Baik' },
    { value: 'DAMAGED', label: 'Rusak' },
] as const;

export const FLOOR_MATERIAL_OPTIONS = [
    { value: 'KERAMIK', label: 'Keramik' },
    { value: 'SEMEN', label: 'Semen' },
    { value: 'KAYU', label: 'Kayu' },
    { value: 'TANAH', label: 'Tanah' },
    { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export const FLOOR_CONDITION_OPTIONS = [
    { value: 'LAYAK', label: 'Bukan Tanah' },
    { value: 'TIDAK_LAYAK', label: 'Tanah' },
] as const;

// A.3 AKSES AIR MINUM
export const WATER_SOURCE_OPTIONS = [
    { value: 'SR_METERAN', label: 'Ledeng Meteran/SR' },
    { value: 'SR_NONMETER', label: 'Ledeng Tanpa Meteran' },
    { value: 'SUMUR_BOR', label: 'Sumur Bor/Pompa' },
    { value: 'SUMUR_TRL', label: 'Sumur Terlindung' },
    { value: 'MATA_AIR_TRL', label: 'Mata Air Terlindung' },
    { value: 'HUJAN', label: 'Air Hujan' },
    { value: 'KEMASAN', label: 'Air Kemasan/Air Isi Ulang' },
    { value: 'SUMUR_TAK_TRL', label: 'Sumur Tak Terlindung' },
    { value: 'MATA_AIR_TAK_TRL', label: 'Mata Air Tak Terlindung' },
    { value: 'SUNGAI', label: 'Sungai/Danau/Kolam' },
    { value: 'TANGKI_MOBIL', label: 'Tangki/Mobil/Gerobak Air' },
] as const;

export const WATER_DISTANCE_CATEGORY_OPTIONS = [
    { value: 'GE10M', label: '≥ 10 meter' },
    { value: 'LT10M', label: '< 10 meter' },
] as const;

export const WATER_FULFILLMENT_OPTIONS = [
    { value: 'ALWAYS', label: 'Tercukupi/terpenuhi sepanjang tahun' },
    { value: 'SEASONAL', label: 'Tercukupi hanya pada bulan tertentu' },
    { value: 'NEVER', label: 'Tidak pernah tercukupi' },
] as const;

// A.4 PENGELOLAAN SANITASI
export const DEFECATION_PLACE_OPTIONS = [
    {
        value: 'PRIVATE_SHARED',
        label: 'Jamban sendiri/bersama (maks 5 KK untuk 1 jamban bersama)',
    },
    {
        value: 'PUBLIC',
        label: 'Jamban umum (jika digunakan >5 KK dan/atau membayar)',
    },
    { value: 'OPEN', label: 'Tidak di jamban' },
] as const;

export const TOILET_TYPE_OPTIONS = [
    { value: 'S_TRAP', label: 'Leher angsa' },
    {
        value: 'NON_S_TRAP',
        label: 'Bukan leher angsa (plengsengan/cemplung/cubluk/dll)',
    },
] as const;

export const SEWAGE_DISPOSAL_OPTIONS = [
    { value: 'SEPTIC_IPAL', label: 'Septictank pribadi/komunal/IPAL' },
    { value: 'NON_SEPTIC', label: 'Bukan septictank/IPAL' },
] as const;

// A.5 PENGELOLAAN SAMPAH
export const WASTE_DISPOSAL_PLACE_OPTIONS = [
    { value: 'PRIVATE_BIN', label: 'Tempat sampah pribadi' },
    { value: 'COMMUNAL', label: 'Tempat sampah komunal/TPS/TPS-3R' },
    { value: 'BURNT', label: 'Dalam Lubang/dibakar' },
    { value: 'OPENSPACE', label: 'Ruang terbuka/lahan kosong/jalan' },
    {
        value: 'WATERBODY',
        label: 'Sungai/Saluran Irigasi/Danau/Laut/Drainase (Got/Selokan)',
    },
] as const;

export const WASTE_COLLECTION_FREQUENCY_OPTIONS = [
    { value: 'GE2X_WEEK', label: '≥ 2x seminggu' },
    { value: 'LT1X_WEEK', label: '< 1x seminggu' },
] as const;

// SUMBER LISTRIK
export const ELECTRICITY_SOURCE_OPTIONS = [
    { value: 'PLN', label: 'PLN' },
    { value: 'GENSET', label: 'Genset' },
    { value: 'SOLAR', label: 'Solar Panel' },
    { value: 'MENUMPANG', label: 'Menumpang ke tetangga' },
    { value: 'TIDAK_ADA', label: 'Tidak ada' },
    { value: 'LAINNYA', label: 'Lainnya' },
] as const;
