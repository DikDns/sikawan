# Skema Basis Data V2 - Simplified (Laravel)

Sistem Informasi Perumahan dan Kawasan Permukiman Kabupaten Muara Enim
**Versi 2: Skema yang Disederhanakan untuk Household dan Penghuni**

Dokumen ini merinci skema basis data yang disederhanakan untuk data rumah tangga (household) dan penghuni, dengan fokus pada kemudahan penggunaan dan kalkulasi skor kelayakan huni (RLH/RTLH).

## Prinsip Dasar V2

1. **Simplifikasi**: Menggabungkan data teknis ke satu tabel utama, menghilangkan kompleksitas A.1-A.7 yang terpisah
2. **Fokus UI**: Struktur mengikuti kebutuhan UI yang sudah didefinisikan
3. **Kalkulasi Skor**: Semua data yang diperlukan untuk kalkulasi skor tersedia dalam struktur yang mudah diakses
4. **Normalisasi Minimal**: Tetap normalisasi untuk data yang berulang (penghuni, bantuan, media)

## Konvensi Umum

- Primary key: `id` (INTEGER AUTOINCREMENT di SQLite; BIGINT/UNSIGNED BIGINT di MySQL)
- Timestamp: `created_at`, `updated_at` (nullable: tidak)
- JSON: gunakan kolom `TEXT` di SQLite (Laravel cast: `json`)
- ENUM: simpan sebagai `VARCHAR` dengan validasi di aplikasi
- Boolean: simpan sebagai `TINYINT`/`INTEGER` (0/1) di SQLite, cast ke boolean di model
- Geometri: simpan koordinat `latitude`, `longitude` (DECIMAL 10,6)

---

## Tabel Utama: Household dan Penghuni

### 1. `households` - Data Utama Rumah Tangga

Tabel utama yang menampung semua informasi dasar rumah tangga sesuai dengan Tab Umum di UI.

```sql
households
- id: INTEGER PK
- province_id: VARCHAR(10) NULLABLE -- province_code dari package SQLite (contoh: "31")
- province_name: VARCHAR(150) NULLABLE -- Nama provinsi (contoh: "DKI JAKARTA")
- regency_id: VARCHAR(10) NULLABLE -- city_code dari package SQLite (contoh: "3171")
- regency_name: VARCHAR(150) NULLABLE -- Nama kab/kota (contoh: "KOTA JAKARTA SELATAN")
- district_id: VARCHAR(10) NULLABLE -- sub_district_code dari package SQLite (contoh: "3171020")
- district_name: VARCHAR(150) NULLABLE -- Nama kecamatan (contoh: "KEBAYORAN BARU")
- village_id: VARCHAR(10) NULLABLE -- village_code dari package SQLite (contoh: "3171020001")
- village_name: VARCHAR(150) NULLABLE -- Nama kelurahan/desa (contoh: "SENAYAN")
- rt_rw: VARCHAR(20) NULLABLE
- survey_date: DATE NULLABLE
- address_text: TEXT NULLABLE
- latitude: DECIMAL(10,6) NULLABLE
- longitude: DECIMAL(10,6) NULLABLE
- photo_folder: VARCHAR(255) NULLABLE

-- Penguasaan Bangunan & Lahan (Tab Umum)
- ownership_status_building: VARCHAR(10) CHECK in ('OWN','RENT','OTHER')
- ownership_status_land: VARCHAR(10) NULLABLE CHECK in ('OWN','RENT','OTHER')
- building_legal_status: VARCHAR(6) NULLABLE CHECK in ('IMB','NONE')
- land_legal_status: VARCHAR(12) NULLABLE CHECK in ('SHM','HGB','SURAT_PEMERINTAH','PERJANJIAN','LAINNYA','TIDAK_TAHU')

-- Data Penghuni (Ringkasan - detail di household_members)
- head_name: VARCHAR(150) -- Nama Kepala Keluarga
- nik: VARCHAR(32) NULLABLE
- status_mbr: VARCHAR(8) CHECK in ('MBR','NON_MBR')
- kk_count: INTEGER -- Jumlah Kepala Keluarga
- member_total: INTEGER -- Total Jiwa
- male_count: INTEGER
- female_count: INTEGER
- disabled_count: INTEGER

-- Data Non-Fisik (Tab Umum)
- main_occupation: VARCHAR(40) NULLABLE -- Pekerjaan Utama
- monthly_income_idr: BIGINT NULLABLE -- Penghasilan Bulanan (Rp)
- health_facility_used: VARCHAR(50) NULLABLE -- Fasilitas kesehatan yang digunakan
- health_facility_location: VARCHAR(100) NULLABLE -- Lokasi fasilitas kesehatan
- education_facility_location: VARCHAR(100) NULLABLE -- Lokasi fasilitas pendidikan

-- Status Kelayakan (Dihitung Otomatis)
- habitability_status: VARCHAR(8) CHECK in ('RLH','RTLH') -- Rumah Layak Huni / Rumah Tidak Layak Huni
- eligibility_score_total: DECIMAL(5,2) NULLABLE -- Total skor kelayakan (0-100)
- eligibility_computed_at: DATETIME NULLABLE

- created_at, updated_at
- INDEX: (province_id), (regency_id), (district_id), (village_id), (latitude, longitude), (habitability_status), (status_mbr)
```

### 2. `household_technical_data` - Data Teknis Bangunan (Tab Data Teknis)

**PENYEDERHANAAN**: Menggabungkan semua data teknis (A.1, A.2, A.3, A.4, A.5) ke dalam satu tabel untuk kemudahan akses dan kalkulasi.

```sql
household_technical_data
- id: INTEGER PK
- household_id: INTEGER FK → households.id (UNIQUE)

-- A.1 KETERATURAN BANGUNAN HUNIAN
- has_road_access: INTEGER (0/1) -- Akses langsung ke jalan
- road_width_category: VARCHAR(8) NULLABLE CHECK in ('LE1_5','EQ1_5','GT1_5') -- Kategori lebar jalan
- facade_faces_road: INTEGER (0/1) -- Hadap jalan
- faces_waterbody: INTEGER (0/1) -- Menghadap sungai/laut/rawa/danau
- in_setback_area: INTEGER (0/1) -- Di atas sempadan
- in_hazard_area: INTEGER (0/1) -- Daerah limbah/dibawah jalur listrik tegangan tinggi
- score_a1: TINYINT NULLABLE -- Skor A.1 (0 atau 1)

-- A.2 KELAYAKAN BANGUNAN HUNIAN
- building_length_m: DECIMAL(8,2) NULLABLE -- Panjang Bangunan
- building_width_m: DECIMAL(8,2) NULLABLE -- Lebar Bangunan
- floor_count: INTEGER NULLABLE -- Jumlah Lantai
- floor_height_m: DECIMAL(6,2) NULLABLE -- Ketinggian per lantai
- building_area_m2: DECIMAL(10,2) NULLABLE -- Luas Bangunan (calculated)
- area_per_person_m2: DECIMAL(10,2) NULLABLE -- Luas Lantai/jiwa (calculated)
- score_a2_floor_area: TINYINT NULLABLE -- Skor luas lantai (0 atau 1)

-- Material & Kondisi (A.2)
- roof_material: VARCHAR(30) NULLABLE -- Material Atap (SENG, GENTENG, ASBES, dll)
- roof_condition: VARCHAR(12) NULLABLE CHECK in ('GOOD','LEAK','RINGAN','SEDANG','BERAT') -- Kondisi Atap
- wall_material: VARCHAR(30) NULLABLE -- Material Dinding
- wall_condition: VARCHAR(12) NULLABLE CHECK in ('GOOD','DAMAGED','RINGAN','SEDANG','BERAT') -- Kondisi Dinding
- floor_material: VARCHAR(30) NULLABLE -- Material Lantai
- floor_condition: VARCHAR(12) NULLABLE CHECK in ('LAYAK','TIDAK_LAYAK','RINGAN','SEDANG','BERAT') -- Kondisi Lantai
- score_a2_structure: TINYINT NULLABLE -- Skor kondisi atap, dinding, lantai (0 atau 1)
- score_a2_total_pct: DECIMAL(5,2) NULLABLE -- Skor total A.2 (persentase)

-- A.3 AKSES AIR MINUM
- water_source: VARCHAR(20) NULLABLE CHECK in ('SR_METERAN','SR_NONMETER','SUMUR_BOR','SUMUR_TRL','MATA_AIR_TRL','HUJAN','KEMASAN','SUMUR_TAK_TRL','MATA_AIR_TAK_TRL','SUNGAI','TANGKI_MOBIL')
- water_distance_to_septic_m: DECIMAL(6,2) NULLABLE -- Jarak sumber air ke penampung tinja (meter)
- water_distance_category: VARCHAR(6) NULLABLE CHECK in ('GE10M','LT10M') -- Kategori jarak
- water_fulfillment: VARCHAR(10) NULLABLE CHECK in ('ALWAYS','SEASONAL','NEVER') -- Kecukupan air pertahun
- score_a3_access: TINYINT NULLABLE -- Skor akses air (0 atau 1)
- score_a3_fulfillment: TINYINT NULLABLE -- Skor pemenuhan kebutuhan air (0 atau 1)

-- A.4 PENGELOLAAN SANITASI
- defecation_place: VARCHAR(14) NULLABLE CHECK in ('PRIVATE_SHARED','PUBLIC','OPEN') -- Tempat Buang Air Besar
- toilet_type: VARCHAR(10) NULLABLE CHECK in ('S_TRAP','NON_S_TRAP') -- Jenis Kloset (Leher angsa / Bukan leher angsa)
- sewage_disposal: VARCHAR(12) NULLABLE CHECK in ('SEPTIC_IPAL','NON_SEPTIC') -- Pembuangan Limbah
- score_a4_access: TINYINT NULLABLE -- Skor akses sanitasi (0 atau 1)
- score_a4_technical: TINYINT NULLABLE -- Skor kelayakan teknis sarana BAB (0 atau 1)

-- A.5 PENGELOLAAN SAMPAH
- waste_disposal_place: VARCHAR(12) NULLABLE CHECK in ('PRIVATE_BIN','COMMUNAL','BURNT','OPENSPACE','WATERBODY') -- Pembuangan Sampah
- waste_collection_frequency: VARCHAR(12) NULLABLE CHECK in ('GE2X_WEEK','LT1X_WEEK') -- Pengangkutan Sampah
- score_a5: TINYINT NULLABLE -- Skor A.5 (0 atau 1)

-- Sumber Listrik (Tab Data Teknis)
- electricity_source: VARCHAR(30) NULLABLE -- Sumber Utama Listrik
- electricity_power_watt: INTEGER NULLABLE -- Daya Listrik (Watt)
- electricity_connected: INTEGER (0/1) NULLABLE -- Listrik tersambung

- created_at, updated_at
- UNIQUE: (household_id)
```

### 3. `household_members` - Data Penghuni Detail

Tabel terpisah untuk data penghuni (sesuai catatan di UI: "ini nanti menjadi tabel terpisah").

```sql
household_members
- id: INTEGER PK
- household_id: INTEGER FK → households.id
- name: VARCHAR(150) -- Nama (untuk kepala keluarga, ini sama dengan head_name di households)
- nik: VARCHAR(32) NULLABLE
- relationship: VARCHAR(20) NULLABLE CHECK in ('HEAD','SPOUSE','CHILD','OTHER') -- Hubungan dengan kepala keluarga
- gender: VARCHAR(10) NULLABLE CHECK in ('MALE','FEMALE')
- is_disabled: INTEGER (0/1) DEFAULT 0
- birth_date: DATE NULLABLE
- occupation: VARCHAR(40) NULLABLE
- created_at, updated_at
- INDEX: (household_id), (relationship)
```

**Catatan**: Untuk kemudahan, data ringkasan (head_name, nik, jumlah anggota) tetap ada di `households` untuk query cepat. Detail lengkap ada di `household_members`.

### 4. `household_scores` - Rekap Skor Kelayakan

Tabel untuk menyimpan hasil kalkulasi skor dan status kelayakan.

```sql
household_scores
- id: INTEGER PK
- household_id: INTEGER FK → households.id (UNIQUE)

-- Skor Individual
- score_a1: TINYINT NULLABLE -- Skor A.1 Keteraturan Bangunan
- score_a2_floor_area: TINYINT NULLABLE -- Skor A.2 Luas Lantai
- score_a2_structure: TINYINT NULLABLE -- Skor A.2 Struktur (atap, dinding, lantai)
- score_a2_total_pct: DECIMAL(5,2) NULLABLE -- Skor A.2 Total (persentase)
- score_a3_access: TINYINT NULLABLE -- Skor A.3 Akses Air
- score_a3_fulfillment: TINYINT NULLABLE -- Skor A.3 Pemenuhan Air
- score_a4_access: TINYINT NULLABLE -- Skor A.4 Akses Sanitasi
- score_a4_technical: TINYINT NULLABLE -- Skor A.4 Teknis Sanitasi
- score_a5: TINYINT NULLABLE -- Skor A.5 Sampah

-- Skor Total
- total_score: DECIMAL(5,2) NULLABLE -- Total skor (0-100)
- habitability_status: VARCHAR(8) NULLABLE CHECK in ('RLH','RTLH') -- Status kelayakan

-- Metadata
- computed_at: DATETIME NULLABLE
- computation_notes: TEXT NULLABLE -- Catatan perhitungan

- created_at, updated_at
- UNIQUE: (household_id)
```

### 5. `house_assistances` - Riwayat Bantuan (Tab Bantuan)

```sql
house_assistances
- id: INTEGER PK
- household_id: INTEGER FK → households.id
- assistance_type: VARCHAR(30) -- 'RELOKASI','REHABILITASI','BSPS','LAINNYA'
- program: VARCHAR(100) NULLABLE -- Program bantuan
- funding_source: VARCHAR(80) NULLABLE -- Sumber dana
- status: VARCHAR(10) NULLABLE CHECK in ('SELESAI','PROSES','DIBATALKAN')
- started_at: DATE NULLABLE -- Tanggal Penanganan
- completed_at: DATE NULLABLE -- Tanggal Selesai
- cost_amount_idr: BIGINT NULLABLE -- Biaya
- description: TEXT NULLABLE
- document_path: VARCHAR(255) NULLABLE -- Dokumen

- created_at, updated_at
- INDEX: (household_id), (assistance_type, status)
```

### 6. `household_photos` - Foto Rumah

```sql
household_photos
- id: INTEGER PK
- household_id: INTEGER FK → households.id
- file_path: VARCHAR(255)
- caption: VARCHAR(150) NULLABLE
- order_index: INTEGER NULLABLE -- Urutan tampil
- created_at, updated_at
- INDEX: (household_id), (order_index)
```

---

## Relasi Utama

- `households` 1-1 `household_technical_data` (UNIQUE)
- `households` 1-1 `household_scores` (UNIQUE)
- `households` 1-N `household_members`
- `households` 1-N `house_assistances`
- `households` 1-N `household_photos`

**Catatan**: Data wilayah (provinsi, kab/kota, kecamatan, kelurahan) disimpan sebagai string (code dan nama) di tabel `households`. Data wilayah diambil dari package SQLite: `maftuhichsan/sqlite-wilayah-indonesia`.

**Struktur Database Package:**

- `provinces` → `province_code`, `province_name`
- `cities` → `city_code`, `city_name`, `city_province_code`
- `sub_districts` → `sub_district_code`, `sub_district_name`, `sub_district_city_code`
- `villages` → `village_code`, `village_name`, `village_sub_district_code`

**Install Package:**

```bash
composer require maftuhichsan/sqlite-wilayah-indonesia
```

**Lokasi Database:**
`vendor/maftuhichsan/sqlite-wilayah-indonesia/database/records.sqlite`

**Referensi:** https://github.com/maftuhichsan/sqlite-wilayah-indonesia

---

## Kalkulasi Skor Kelayakan (RLH/RTLH)

### Parameter yang Diperlukan dari UI

Berdasarkan analisis `HOUSEHOLD_UI_DATA.md` vs `PENDATAAN BASELINE.md`, berikut data yang **KURANG** untuk kalkulasi skor:

#### ✅ Data yang SUDAH ADA di UI:

1. ✅ Keteraturan Bangunan (A.1) - sebagian (perlu dilengkapi detail)
2. ✅ Teknis Bangunan (A.2) - sebagian (perlu dilengkapi detail)
3. ✅ Sumber Air (A.3) - sebagian (perlu dilengkapi detail)
4. ✅ Limbah/Sanitasi (A.4) - sebagian (perlu dilengkapi detail)
5. ✅ Pengelolaan Sampah (A.5) - sebagian (perlu dilengkapi detail)

#### ❌ Data yang KURANG di UI:

**A.1 Keteraturan Bangunan:**

- ❌ Detail posisi muka bangunan (lebar jalan <=1.5m, ==1.5m, >1.5m) - UI hanya punya boolean
- ❌ Detail menghadap sungai/laut/rawa (ada/tidak ada/ya/tidak) - UI hanya boolean
- ❌ Detail sempadan (ada/tidak ada/ya/tidak) - UI hanya boolean

**A.2 Kelayakan Bangunan:**

- ✅ Panjang, Lebar, Jumlah Lantai - ADA
- ✅ Luas Bangunan, Luas/jiwa - ADA (calculated)
- ✅ Material & Kondisi Atap, Dinding, Lantai - ADA
- ✅ Struktur (Pondasi, Sloof, Ring Balok, dll) - ADA
- ⚠️ Perlu validasi: apakah kondisi atap/dinding/lantai menggunakan enum yang sesuai (GOOD/LEAK, GOOD/DAMAGED, NON_SOIL/SOIL)

**A.3 Akses Air:**

- ✅ Sumber Utama - ADA (tapi perlu mapping ke enum yang benar)
- ⚠️ Jarak ke penampung tinja - ADA tapi perlu validasi format (numeric vs kategori GE10M/LT10M)
- ✅ Kecukupan air pertahun - ADA (tapi perlu mapping ke enum ALWAYS/SEASONAL/NEVER)

**A.4 Sanitasi:**

- ✅ Tempat Buang Air Besar - ADA (tapi perlu mapping ke enum)
- ✅ Jenis Kloset - ADA (tapi perlu mapping ke enum)
- ✅ Pembuangan Limbah - ADA (tapi perlu mapping ke enum)

**A.5 Sampah:**

- ✅ Pembuangan Sampah - ADA (tapi perlu mapping ke enum)
- ⚠️ Pengangkutan Sampah - ADA tapi perlu validasi format (string vs enum GE2X_WEEK/LT1X_WEEK)

### Logika Kalkulasi Skor

#### A.1 Keteraturan Bangunan (score_a1)

```
Skor = 1 jika:
- has_road_access = 1 (Ya)
- facade_faces_road = 1 (Ya) DAN (road_width_category = 'EQ1_5' ATAU 'GT1_5')
- faces_waterbody = 0 (Tidak) ATAU tidak ada sungai/laut/rawa
- in_setback_area = 0 (Tidak) ATAU tidak ada sempadan
- in_hazard_area = 0 (Tidak)

Skor = 0 jika salah satu kondisi di atas tidak terpenuhi
```

#### A.2 Kelayakan Bangunan

**A.2.1 Luas Lantai (score_a2_floor_area):**

```
Skor = 1 jika area_per_person_m2 >= 7.2
Skor = 0 jika area_per_person_m2 < 7.2
```

**A.2.2 Struktur (score_a2_structure):**

```
Skor = 1 jika:
- roof_condition = 'GOOD' (Tidak Bocor)
- wall_condition = 'GOOD' (Baik)
- floor_condition != 'TIDAK_LAYAK' (Bukan Tanah)

Skor = 0 jika salah satu tidak terpenuhi
```

**A.2 Total (score_a2_total_pct):**

```
score_a2_total_pct = ((score_a2_floor_area + score_a2_structure) / 2) * 100
```

#### A.3 Akses Air

**A.3.1 Akses (score_a3_access):**

```
Skor = 1 jika:
- water_source IN ('SR_METERAN', 'SR_NONMETER', 'HUJAN') ATAU
- (water_source IN ('SUMUR_BOR', 'SUMUR_TRL', 'MATA_AIR_TRL') DAN water_distance_category = 'GE10M')

Skor = 0 jika:
- water_source IN ('KEMASAN', 'SUMUR_TAK_TRL', 'MATA_AIR_TAK_TRL', 'SUNGAI', 'TANGKI_MOBIL') ATAU
- (water_source IN ('SUMUR_BOR', 'SUMUR_TRL', 'MATA_AIR_TRL') DAN water_distance_category = 'LT10M')
```

**A.3.2 Pemenuhan (score_a3_fulfillment):**

```
Skor = 1 jika water_fulfillment = 'ALWAYS'
Skor = 0 jika water_fulfillment IN ('SEASONAL', 'NEVER')
```

#### A.4 Sanitasi

**A.4.1 Akses (score_a4_access):**

```
Skor = 1 jika defecation_place = 'PRIVATE_SHARED'
Skor = 0 jika defecation_place IN ('PUBLIC', 'OPEN')
```

**A.4.2 Teknis (score_a4_technical):**

```
Skor = 1 jika:
- toilet_type = 'S_TRAP' (Leher angsa)
- sewage_disposal = 'SEPTIC_IPAL'

Skor = 0 jika salah satu tidak terpenuhi
```

#### A.5 Sampah (score_a5)

```
Skor = 1 jika waste_collection_frequency = 'GE2X_WEEK' (≥ 2x seminggu)
Skor = 0 jika waste_collection_frequency = 'LT1X_WEEK' (< 1x seminggu)
```

### Total Skor dan Status Kelayakan

```
total_score = (
    score_a1 * 20 +
    score_a2_total_pct * 0.20 +
    score_a3_access * 15 +
    score_a3_fulfillment * 10 +
    score_a4_access * 15 +
    score_a4_technical * 10 +
    score_a5 * 10
) / 100

habitability_status:
- 'RLH' jika total_score >= 60
- 'RTLH' jika total_score < 60
```

**Catatan**: Bobot masih asumsi
