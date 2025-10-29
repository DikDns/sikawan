# Skema Basis Data dan Rencana Implementasi (Laravel)

Sistem Informasi Perumahan dan Kawasan Permukiman Kabupaten Muara Enim
Dokumen ini merinci skema basis data yang dinormalisasi, tipe data, relasi, indeks, serta rencana implementasi migrasi, model, factories, dan seeders. Skema disusun agar kompatibel dengan SQLite (default proyek) namun portable ke MySQL/PostgreSQL.

## Konvensi Umum

- Primary key: `id` (INTEGER AUTOINCREMENT di SQLite; BIGINT/UNSIGNED BIGINT di MySQL)
- Timestamp: `created_at`, `updated_at` (nullable: tidak)
- JSON: gunakan kolom `TEXT` di SQLite (Laravel cast: `json`)
- ENUM: simpan sebagai `VARCHAR` dengan validasi di aplikasi atau CHECK constraint (opsional)
- Boolean: simpan sebagai `TINYINT`/`INTEGER` (0/1) di SQLite, cast ke boolean di model
- Geometri: simpan `geometry_json` (GeoJSON) dan/atau koordinat `latitude`, `longitude`

## Tabel dan Tipe Data

### 1. Users dan Audit

- users (sudah ada di proyek; tidak diubah di sini)
- audit_logs
    - id: INTEGER PK
    - user_id: INTEGER FK → users.id
    - action: VARCHAR(100)
    - entity_type: VARCHAR(100)
    - entity_id: INTEGER NULLABLE
    - metadata_json: TEXT NULLABLE (cast json)
    - created_at: DATETIME
    - updated_at: DATETIME
    - INDEX: (user_id), (entity_type, entity_id)

### 2. Wilayah Administratif (opsional jika pakai referensi baku)

- admin_areas
    - id: INTEGER PK
    - level: VARCHAR(16) CHECK in ('province','regency','district','village')
    - code: VARCHAR(32)
    - name: VARCHAR(150)
    - parent_id: INTEGER NULLABLE FK → admin_areas.id
    - created_at, updated_at
    - INDEX: (level, code), (parent_id)

### 3. Data Rumah Tangga (Households) dan Komponen

- households
    - id: INTEGER PK
    - province_id, regency_id, district_id, village_id: INTEGER NULLABLE FK → admin_areas.id
    - rt_rw: VARCHAR(20)
    - survey_date: DATE
    - head_name: VARCHAR(150)
    - nik: VARCHAR(32) NULLABLE
    - address_text: TEXT NULLABLE
    - kk_count: INTEGER
    - status_mbr: VARCHAR(8) CHECK in ('MBR','NON_MBR')
    - member_total: INTEGER
    - male_count: INTEGER
    - female_count: INTEGER
    - disabled_count: INTEGER
    - latitude: DECIMAL(10,6) NULLABLE
    - longitude: DECIMAL(10,6) NULLABLE
    - location_json: TEXT NULLABLE (cast json)
    - photo_folder: VARCHAR(255) NULLABLE
    - created_at, updated_at
    - INDEX: (province_id, regency_id, district_id, village_id), (latitude, longitude)

- house_structure_scores (A.1 & A.2)
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - a1_access_to_road: INTEGER (0/1)
    - a1_facade_width_category: VARCHAR(8) CHECK in ('LE1_5','EQ1_5','GT1_5')
    - a1_facade_faces_road: INTEGER (0/1)
    - a1_faces_waterbody: VARCHAR(8) CHECK in ('NONE','YES','NO')
    - a1_in_setback: VARCHAR(8) CHECK in ('NONE','YES','NO')
    - a1_hazard_area: INTEGER (0/1)
    - score_a1: TINYINT
    - a2_length_m: DECIMAL(8,2)
    - a2_width_m: DECIMAL(8,2)
    - a2_floors: INTEGER
    - a2_area_m2: DECIMAL(10,2)
    - a2_occupants: INTEGER
    - a2_m2_per_person: DECIMAL(10,2)
    - score_a2_floor_area: TINYINT
    - a2_roof_condition: VARCHAR(8) CHECK in ('GOOD','LEAK')
    - a2_wall_condition: VARCHAR(8) CHECK in ('GOOD','DAMAGED')
    - a2_floor_type: VARCHAR(10) CHECK in ('NON_SOIL','SOIL')
    - score_a2_roof_wall_floor: TINYINT
    - score_a2_total_pct: DECIMAL(5,2)
    - created_at, updated_at
    - UNIQUE: (household_id)

- water_accesses (A.3)
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - source: VARCHAR(20) CHECK in ('SR_METERAN','SR_NONMETER','SUMUR_BOR','SUMUR_TRL','MATA_AIR_TRL','HUJAN','KEMASAN','SUMUR_TAK_TRL','MATA_AIR_TAK_TRL','SUNGAI','TANGKI_MOBIL')
    - distance_to_septic: VARCHAR(6) NULLABLE CHECK in ('GE10M','LT10M')
    - score_a3_access_water: TINYINT
    - water_fulfillment: VARCHAR(10) CHECK in ('ALWAYS','SEASONAL','NEVER')
    - score_a3_fulfillment: TINYINT
    - created_at, updated_at
    - UNIQUE: (household_id)

- sanitatons (A.4)
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - defecation_place: VARCHAR(14) CHECK in ('PRIVATE_SHARED','PUBLIC','OPEN')
    - score_a4_access_sanitation: TINYINT
    - toilet_type: VARCHAR(10) CHECK in ('S_TRAP','NON_S_TRAP')
    - sewage_disposal: VARCHAR(12) CHECK in ('SEPTIC_IPAL','NON_SEPTIC')
    - score_a4_technical: TINYINT
    - created_at, updated_at
    - UNIQUE: (household_id)

- waste_managements (A.5)
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - disposal_place: VARCHAR(12) CHECK in ('PRIVATE_BIN','COMMUNAL','BURNT','OPENSPACE','WATERBODY')
    - collection_frequency: VARCHAR(12) NULLABLE CHECK in ('GE2X_WEEK','LT1X_WEEK')
    - score: TINYINT
    - created_at, updated_at
    - UNIQUE: (household_id)

- household_non_physicals (A.6)
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - main_occupation: VARCHAR(40) NULLABLE
    - electrical_power: VARCHAR(10) NULLABLE CHECK in ('<=450','900','1300','>=2200','OTHER')
    - health_facility_usage: VARCHAR(20) NULLABLE
    - education_access_summary: VARCHAR(50) NULLABLE
    - created_at, updated_at
    - UNIQUE: (household_id)

- household_scores (rekap)
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - score_a1: TINYINT
    - score_a2_floor_area: TINYINT
    - score_a2_roof_wall_floor: TINYINT
    - score_a2_total_pct: DECIMAL(5,2)
    - score_a3_access_water: TINYINT
    - score_a3_fulfillment: TINYINT
    - score_a4_access_sanitation: TINYINT
    - score_a4_technical: TINYINT
    - score_a5_waste: TINYINT
    - computed_at: DATETIME
    - created_at, updated_at
    - UNIQUE: (household_id)

- relocation_histories
    - id: INTEGER PK
    - household_id: INTEGER FK → households.id
    - willing_to_relocate: INTEGER (0/1)
    - relocation_land_available: INTEGER (0/1)
    - team_recommendation: TEXT NULLABLE
    - surveyed_at: DATE NULLABLE
    - attachments_folder: VARCHAR(255) NULLABLE
    - created_at, updated_at
    - INDEX: (household_id, surveyed_at)

### 4. Pendataan Kawasan (B.1–B.8)

- area_surveys
    - id: INTEGER PK
    - province_id, regency_id, district_id, village_id: INTEGER NULLABLE FK → admin_areas.id
    - rt_rw: VARCHAR(20)
    - unit_name: VARCHAR(150)
    - survey_date: DATE
    - geometry_json: TEXT (Polygon GeoJSON)
    - notes: TEXT NULLABLE
    - created_at, updated_at
    - INDEX: (province_id, regency_id, district_id, village_id)

- area_density_b1
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - area_total_ha: DECIMAL(10,2)
    - settlement_area_ha: DECIMAL(10,2)
    - buildings_total: INTEGER
    - slope_gt15_pct: DECIMAL(5,2)
    - building_density_unit_per_ha: DECIMAL(10,2)
    - density_status: VARCHAR(8) CHECK in ('LOW','MEDIUM','HIGH')
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

- area_roads_b2
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - length_total_m: INTEGER
    - length_ge_1_5_m: INTEGER
    - length_ge_1_5_hardened_m: INTEGER
    - length_needed_new_m: INTEGER
    - length_ideal_m: INTEGER
    - coverage_pct: DECIMAL(5,2)
    - length_ge_1_5_good_m: INTEGER
    - length_ge_1_5_soil_good_m: INTEGER
    - length_lt_1_5_hardened_good_m: INTEGER
    - length_lt_1_5_soil_good_m: INTEGER
    - length_with_side_drain_ge_1_5_m: INTEGER
    - length_with_side_drain_lt_1_5_m: INTEGER
    - length_good_total_m: INTEGER
    - good_over_total_pct: DECIMAL(5,2)
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

- area_drainage_b3
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - flood_height: VARCHAR(8) CHECK in ('NONE','LT30CM','GT30CM')
    - flood_duration: VARCHAR(6) NULLABLE CHECK in ('LT2H','GT2H')
    - flood_frequency: VARCHAR(10) NULLABLE CHECK in ('LT2_YEAR','GT2_YEAR')
    - flood_area_ha: DECIMAL(10,2)
    - flood_source: VARCHAR(10) NULLABLE CHECK in ('TIDE','RIVER','RUNOFF')
    - length_existing_m: INTEGER
    - has_new_plan: INTEGER (0/1)
    - length_needed_new_m: INTEGER NULLABLE
    - has_city_link: INTEGER (0/1)
    - length_city_link_m: INTEGER NULLABLE
    - is_clean: INTEGER (0/1)
    - length_clean_m: INTEGER NULLABLE
    - length_structure_good_m: INTEGER
    - no_flood_event: INTEGER (0/1)
    - no_flood_area_pct: DECIMAL(5,2)
    - length_needed_total_m: INTEGER
    - length_ideal_m: INTEGER
    - length_good_pct: DECIMAL(5,2)
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

- area_sanitation_b4
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - wastewater_separated: INTEGER (0/1)
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

- area_waste_b5
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - has_facility: INTEGER (0/1)
    - has_transport: INTEGER (0/1)
    - facility_condition_good: INTEGER (0/1)
    - transport_condition_good: INTEGER (0/1)
    - sapras_pct: DECIMAL(5,2)
    - sapras_good_pct: DECIMAL(5,2)
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

- area_fire_b6
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - fire_freq: VARCHAR(10) CHECK in ('NEVER','ONCE_5Y','TWICE_5Y','GT2_5Y')
    - causes_json: TEXT NULLABLE (cast json)
    - has_station: INTEGER (0/1)
    - has_hydrant: INTEGER (0/1)
    - has_vehicle_apar: INTEGER (0/1)
    - has_access_road_ge_3_5m: INTEGER (0/1)
    - prasarana_pct: DECIMAL(5,2)
    - sarana_pct: DECIMAL(5,2)
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

- area_social_b7
    - id: INTEGER PK
    - area_survey_id: INTEGER FK → area_surveys.id
    - health_rs: INTEGER (0/1)
    - health_clinic: INTEGER (0/1)
    - health_puskesmas: INTEGER (0/1)
    - health_traditional: INTEGER (0/1)
    - health_midwife: INTEGER (0/1)
    - health_none: INTEGER (0/1)
    - edu_tk: INTEGER (0/1)
    - edu_sd: INTEGER (0/1)
    - edu_smp: INTEGER (0/1)
    - edu_sma: INTEGER (0/1)
    - edu_pt: INTEGER (0/1)
    - edu_none: INTEGER (0/1)
    - created_at, updated_at
    - UNIQUE: (area_survey_id)

### 5. PSU (Infrastruktur) & GIS

- infrastructures
    - id: INTEGER PK
    - type: VARCHAR(20) CHECK in ('WATER_PIPE','POWER_LINE','HOSPITAL','SCHOOL','ETC')
    - name: VARCHAR(150)
    - attributes_json: TEXT NULLABLE (cast json)
    - geometry_type: VARCHAR(12) CHECK in ('POINT','LINESTRING','POLYGON')
    - geometry_json: TEXT
    - latitude: DECIMAL(10,6) NULLABLE
    - longitude: DECIMAL(10,6) NULLABLE
    - created_at, updated_at
    - INDEX: (type)

- infrastructure_photos
    - id: INTEGER PK
    - infrastructure_id: INTEGER FK → infrastructures.id
    - file_path: VARCHAR(255)
    - caption: VARCHAR(150) NULLABLE
    - created_at, updated_at
    - INDEX: (infrastructure_id)

### 6. Pesan & Media

- messages
    - id: INTEGER PK
    - name: VARCHAR(150)
    - email: VARCHAR(150)
    - subject: VARCHAR(150)
    - content: TEXT
    - created_at, updated_at

- media
    - id: INTEGER PK
    - owner_type: VARCHAR(100)
    - owner_id: INTEGER
    - path: VARCHAR(255)
    - type: VARCHAR(10) CHECK in ('PHOTO','DOC')
    - meta_json: TEXT NULLABLE (cast json)
    - created_at, updated_at
    - INDEX: (owner_type, owner_id)

## Relasi Utama

- households 1–1 house_structure_scores, water_accesses, sanitatons, waste_managements, household_non_physicals, household_scores
- households 1–N relocation_histories
- area_surveys 1–1 ke masing-masing B.1…B.7 table
- infrastructures 1–N infrastructure_photos
- admin_areas (tree via parent_id) dan direlasikan ke households/area_surveys

## Indeks Penting

- Lokasi administratif: pada semua kolom area id
- Geospasial dasar: (latitude, longitude) untuk households dan infrastructures
- Lookup cepat: (entity_type, entity_id) pada audit_logs, (owner_type, owner_id) pada media

---

# Rencana Implementasi di Laravel

## 1) Migrasi (database/migrations)

Urutan yang disarankan:

1. create_admin_areas_table
2. create_households_table
3. create_household_component_tables: house_structure_scores, water_accesses, sanitatons, waste_managements, household_non_physicals, household_scores, relocation_histories
4. create_area_surveys_table
5. create_area_indicator_tables: area_density_b1, area_roads_b2, area_drainage_b3, area_sanitation_b4, area_waste_b5, area_fire_b6, area_social_b7
6. create_infrastructures_table and create_infrastructure_photos_table
7. create_messages_table and create_media_table
8. create_audit_logs_table

Catatan migrasi:

- SQLite: pastikan `foreign_key_constraints` aktif (sudah true di config)
- ENUM gunakan `string` + validation; opsional pakai CHECK via raw SQL (Schema::raw)
- Kolom JSON gunakan `text()` dan cast di model
- Tambahkan indeks komposit sesuai daftar di atas

## 2) Model (app/Models)

Buat model berikut beserta relasinya dan casts:

- AdminArea: `hasMany` children; `belongsTo` parent; level enum
- Household: `belongsTo` AdminArea (province/regency/district/village), `hasOne` ke setiap komponen, `hasMany` RelocationHistory; casts: location_json → array, latitude/longitude numeric
- HouseStructureScore, WaterAccess, Sanitaton, WasteManagement, HouseholdNonPhysical, HouseholdScore: `belongsTo Household`; tambahkan casts untuk nilai numerik/boolean
- AreaSurvey: `belongsTo` AdminArea, `hasOne` ke setiap tabel B.1…B.7; casts: geometry_json → array
- AreaDensityB1, AreaRoadsB2, AreaDrainageB3, AreaSanitationB4, AreaWasteB5, AreaFireB6, AreaSocialB7: `belongsTo AreaSurvey`
- Infrastructure: `hasMany InfrastructurePhoto`; casts: attributes_json/geometry_json → array
- InfrastructurePhoto: `belongsTo Infrastructure`
- Message, Media, AuditLog: relasi sesuai kebutuhan (`morph` untuk Media jika ingin polymorphic)

Casts (contoh Household):

- `'location_json' => 'array'`
- `'latitude' => 'decimal:6', 'longitude' => 'decimal:6'`
- komponen boolean: cast ke `boolean`

## 3) Konfigurasi Database (config/database.php)

- Default sudah `sqlite`
- Pastikan `.env` menyetel `DB_DATABASE=database/database.sqlite`
- `foreign_key_constraints` sudah `true` → biarkan
- Jika pindah ke MySQL/Postgres, skema tetap kompatibel; sesuaikan tipe (unsignedBigInteger, decimal) di migrasi

## 4) Factories (database/factories)

Prioritas factories untuk data dummy pengembangan:

- AdminAreaFactory (opsional): membuat hirarki province → regency → district → village
- HouseholdFactory: generate alamat, lat/long di bounding box Muara Enim, komposisi ART konsisten
- HouseStructureScoreFactory: hitung luas dan m2/jiwa, set score sesuai aturan sederhana
- WaterAccessFactory, SanitatonFactory, WasteManagementFactory, HouseholdNonPhysicalFactory, HouseholdScoreFactory
- RelocationHistoryFactory
- AreaSurveyFactory: polygon sederhana (GeoJSON) + indikator default pada B.1…B.7
- AreaDensityB1Factory, AreaRoadsB2Factory, AreaDrainageB3Factory, AreaSanitationB4Factory, AreaWasteB5Factory, AreaFireB6Factory, AreaSocialB7Factory
- InfrastructureFactory, InfrastructurePhotoFactory
- MessageFactory, MediaFactory, AuditLogFactory

Tips:

- Gunakan `state()` untuk variasi enum (MBR vs NON_MBR, dll)
- Buat helper untuk generate polygon GeoJSON (persegi/segitiga) untuk uji peta
- Validasi konsistensi (male+female = member_total)

## 5) Seeders (database/seeders)

- DatabaseSeeder: panggil seeder di bawah secara berurutan
- AdminAreaSeeder (opsional): isi minimal 1 provinsi, 1 kab/kota, 1 kecamatan, 1 desa untuk demo
- HouseholdSeeder: buat 50–200 households tersebar, dan untuk tiap household buat record komponen + score + 0–2 relocation_histories
- AreaSurveySeeder: buat 5–10 area_surveys dengan masing-masing tabel B.1…B.7 terisi
- InfrastructureSeeder: 20–50 record (WATER_PIPE sebagai LineString, POWER_LINE LineString, HOSPITAL/SCHOOL Point)
- MessageSeeder dan MediaSeeder (opsional)
- AuditLogSeeder (opsional): log dummy

Orkestrasi contoh di DatabaseSeeder:

- AdminAreaSeeder → AreaSurveySeeder → InfrastructureSeeder → HouseholdSeeder → MessageSeeder

## 6) Validasi & Integritas

- Gunakan Form Request untuk validasi enum/constraint
- Trigger re-kalkulasi `household_scores` setelah komponen terkait berubah
- Pastikan soft delete jika dibutuhkan (tidak didefinisikan di skema dasar ini)

## 7) Langkah Implementasi Cepat

1. Tulis migrasi sesuai urutan (fokus: households dan komponen dulu, lalu area, lalu PSU)
2. Buat model + relasi + casts
3. Tulis factories minimal untuk Household dan AreaSurvey
4. Tulis seeders agar dashboard punya data uji
5. Jalankan migrasi dan seeding

```bash
php artisan migrate:fresh --seed
```

## Penambahan Berbasis UI: Halaman Rumah (Overview, Kondisi Fisik, Lokasi, Bantuan)

Tambahan ini tidak menghapus skema sebelumnya; hanya memperkaya agar mendukung kebutuhan UI.

### Perluasan Tabel `households`

- ownership_status_building: VARCHAR(10) CHECK in ('OWN','RENT','OTHER') -- Status Kepemilikan Bangunan (Milik Pribadi/Sewa/Lainnya)
- ownership_status_land: VARCHAR(10) NULLABLE CHECK in ('OWN','RENT','OTHER') -- Status Kepemilikan Tanah
- building_legal_status: VARCHAR(6) NULLABLE CHECK in ('IMB','NONE') -- Legalitas Bangunan
- land_legal_status: VARCHAR(12) NULLABLE CHECK in ('SHM','HGB','SURAT_PEMERINTAH','PERJANJIAN','LAINNYA','TIDAK_TAHU') -- Legalitas Lahan
- monthly_income_idr: BIGINT NULLABLE -- Penghasilan bulanan (Rp)
- electricity_connected: INTEGER (0/1) NULLABLE -- Listrik tersambung (boolean)
- area_survey_id: INTEGER NULLABLE FK → area_surveys.id -- relasi opsional ke polygon kawasan
- nearest_psu_json: TEXT NULLABLE (cast json) -- ringkasan PSU terdekat untuk tampilan

INDEX tambahan: (area_survey_id)

### Tabel Baru: `house_physical_details`

Detail teknis tampilan UI (opsional; melengkapi A.2 yang sudah ada):

- id: INTEGER PK
- household_id: INTEGER FK → households.id (UNIQUE)
- building_area_m2: DECIMAL(10,2) NULLABLE -- redundansi terkontrol untuk tampilan (bisa sinkron dengan A.2)
- room_count: INTEGER NULLABLE
- floor_count: INTEGER NULLABLE -- mirror a2_floors (untuk akses cepat UI)
- floor_elevation_m: DECIMAL(6,2) NULLABLE -- ketinggian/ambang lantai
- ventilation_quality: VARCHAR(8) NULLABLE CHECK in ('GOOD','FAIR','POOR')
- sanitation_facility_present: INTEGER (0/1) NULLABLE -- ada sarana sanitasi (summary)
- roof_material: VARCHAR(30) NULLABLE -- contoh: 'SENG','GENTENG','ASBES','LAINNYA'
- roof_condition_level: VARCHAR(12) NULLABLE CHECK in ('GOOD','RINGAN','SEDANG','BERAT')
- wall_material: VARCHAR(30) NULLABLE
- wall_condition_level: VARCHAR(12) NULLABLE CHECK in ('GOOD','RINGAN','SEDANG','BERAT')
- floor_material: VARCHAR(30) NULLABLE
- floor_condition_level: VARCHAR(12) NULLABLE CHECK in ('LAYAK','TIDAK_LAYAK','RINGAN','SEDANG','BERAT')
- created_at, updated_at

UNIQUE: (household_id)

### Tabel Baru: `land_details`

Data tanah untuk tampilan UI Data Tanah:

- id: INTEGER PK
- household_id: INTEGER FK → households.id (UNIQUE)
- owner_name: VARCHAR(150) NULLABLE
- land_address_text: TEXT NULLABLE
- land_area_m2: DECIMAL(10,2) NULLABLE
- kdb_pct: DECIMAL(6,2) NULLABLE -- Koefisien Dasar Bangunan (%)
- klb_ratio: DECIMAL(6,2) NULLABLE -- Koefisien Lantai Bangunan (rasio)
- kdh_pct: DECIMAL(6,2) NULLABLE -- Koefisien Dasar Hijau (%)
- front_setback_m: DECIMAL(6,2) NULLABLE -- garis muka bangunan
- side_setback_m: DECIMAL(6,2) NULLABLE -- garis samping bangunan
- rear_setback_m: DECIMAL(6,2) NULLABLE -- garis belakang bangunan
- created_at, updated_at

UNIQUE: (household_id)

### Tabel Baru: `house_eligibilities`

Ringkasan kelayakan pada tab Kelayakan di UI:

- id: INTEGER PK
- household_id: INTEGER FK → households.id (UNIQUE)
- habitability_status: VARCHAR(8) CHECK in ('LAYAK','RLH','RTLH') -- Rumah Layak Huni / Rumah Layak Huni (RLH) / Rumah Tidak Layak Huni (RTLH)
- eligibility_reason: TEXT NULLABLE -- alasan singkat
- assistance_status: VARCHAR(6) NULLABLE CHECK in ('SUDAH','BELUM') -- status bantuan
- assistance_type: VARCHAR(50) NULLABLE -- jenis bantuan (mis. BSPS)
- assistance_year: INTEGER NULLABLE
- created_at, updated_at

UNIQUE: (household_id)

### Tabel Baru: `house_assistances`

Riwayat bantuan/relokasi detail (tab Bantuan + halaman detail bantuan):

- id: INTEGER PK
- household_id: INTEGER FK → households.id
- assistance_type: VARCHAR(30) -- 'RELOKASI','REHABILITASI','BSPS','LAINNYA'
- funding_source: VARCHAR(80) NULLABLE -- contoh: BSPS
- status: VARCHAR(10) NULLABLE CHECK in ('SELESAI','PROSES','DIBATALKAN')
- started_at: DATE NULLABLE -- Tanggal Penanganan
- completed_at: DATE NULLABLE -- Tanggal Selesai
- cost_amount_idr: BIGINT NULLABLE -- Biaya
- description: TEXT NULLABLE
- document_path: VARCHAR(255) NULLABLE -- lampiran PDF (atau gunakan tabel media)
- created_at, updated_at

INDEX: (household_id), (assistance_type, status)

Catatan: foto/dokumen tambahan dapat direlasikan via tabel `media` dengan `owner_type='house_assistance'` dan `owner_id` = id bantuan.

### Penyesuaian Rencana Implementasi (Laravel)

- Tambah migrasi: `create_house_physical_details_table`, `create_land_details_table`, `create_house_eligibilities_table`, `create_house_assistances_table`, dan alter pada `households` untuk kolom kepemilikan/legalitas/income/map.
- Model baru: `HousePhysicalDetail`, `LandDetail`, `HouseEligibility`, `HouseAssistance` dengan relasi `belongsTo Household`; household `hasOne` untuk detail/eligibility dan `hasMany` untuk assistance.
- Casts: `nearest_psu_json` (array), boolean untuk `electricity_connected` dan flag lain, decimal casts untuk koordinat/angka pecahan.
- Factories: tambahkan factories untuk empat model baru; perbanyak variasi enum (habitability_status, ownership, legalitas) dan buat 0–3 `HouseAssistance` per `Household`.
- Seeders: update `HouseholdSeeder` untuk mengisi detail/eligibility; buat `HouseAssistanceSeeder` atau isi di seeder yang sama.

---

## Validasi Terhadap FORM RELOKASI RUMAH.md

Form berisi 3 blok besar: Identitas Penghuni, Kondisi Fisik Rumah, dan Catatan Hasil Survei (kesediaan relokasi, ketersediaan lahan, rekomendasi). Skema saat ini telah menampung ringkasan bantuan pada `house_assistances` dan ringkasan kelayakan pada `house_eligibilities`. Untuk menampung seluruh butir form detail, tambahkan tabel penilaian berikut dan kaitkan dengan bantuan.

### Tabel Baru: `relocation_assessments`

Mewakili satu hasil pengisian FORM RELOKASI untuk satu rumah.

- id: INTEGER PK
- household_id: INTEGER FK → households.id
- house_assistance_id: INTEGER NULLABLE FK → house_assistances.id -- opsional; assessment bisa dibuat dulu, bantuan ditautkan kemudian
- survey_date: DATE NULLABLE
- location_admin_snapshot_json: TEXT NULLABLE (cast json) -- snapshot DESA/KEC/KAB/PROV teks jika diperlukan

Identitas Penghuni

- full_name: VARCHAR(150)
- full_address: TEXT
- nik: VARCHAR(32) NULLABLE
- kk_in_house_count: INTEGER
- gender: VARCHAR(10) NULLABLE CHECK in ('MALE','FEMALE')
- main_occupation: VARCHAR(40) NULLABLE -- ambil enumerasi dari form (PNS, Petani, dll)
- income_band: VARCHAR(20) NULLABLE -- '<1.2JT','1.9-2.1','2.2-2.6','2.7-3.1','3.2-3.6','3.7-4.2','>4.2'
- land_ownership_status: VARCHAR(16) CHECK in ('OWN','STATE','NOT_OWN')
- house_ownership_status: VARCHAR(16) CHECK in ('OWN','NOT_OWN','RENT')
- has_other_land_asset: INTEGER (0/1)
- settlement_zone_flags_json: TEXT NULLABLE (cast json) -- multi-pilihan: banjir, KSPN, KEK, pesisir, perbatasan, pulau kecil, kumuh, tertinggal, transmigrasi, jalur berbahaya, rawan bencana, diperuntukkan permukiman
- hazard_distance_band: VARCHAR(16) NULLABLE -- '1-5','5-10','10-15','15-20','20-25','25-30'
- hazard_type: VARCHAR(20) NULLABLE -- 'LONGSOR','GEMPA','BANJIR','GUNUNG_API','BANJIR_BANDANG','PUTING_BELIUNG','TSUNAMI'

Kondisi Fisik Rumah

- has_foundation: INTEGER (0/1)
- has_sloof: INTEGER (0/1)
- has_ring_beam: INTEGER (0/1)
- has_roof_structure: INTEGER (0/1)
- has_columns: INTEGER (0/1)
- house_area_m2: DECIMAL(10,2) NULLABLE
- occupants_count: INTEGER NULLABLE
- roof_material: VARCHAR(20) NULLABLE -- 'GENTENG','SENG','ASBES','JERAMI','RUMBIA','IJUK','LAINNYA','DAUN'
- roof_condition_level: VARCHAR(12) NULLABLE CHECK in ('BAIK','RINGAN','SEDANG','BERAT')
- wall_material: VARCHAR(20) NULLABLE -- 'TEMBOK_PLASTER','TEMBOK_TANPA_PLASTER','BAMBU','KAYU','PLASTER_ANYAMAN_BAMBU','RUMBIA','GCR_ASBES','ANYAMAN_BAMBU','LAINNYA'
- wall_condition_level: VARCHAR(12) NULLABLE CHECK in ('BAIK','RINGAN','SEDANG','BERAT')
- floor_material: VARCHAR(15) NULLABLE -- 'TANAH','PLESTER','UBIN','KAYU','BAMBU','KERAMIK','MARMER_GRANIT'
- floor_condition_level: VARCHAR(12) NULLABLE CHECK in ('BAIK','RINGAN','SEDANG','BERAT')

Catatan Hasil Survei

- willing_to_relocate: INTEGER (0/1)
- relocation_land_available: INTEGER (0/1)
- team_recommendation: TEXT NULLABLE
- signed_at: DATE NULLABLE
- signatories_json: TEXT NULLABLE (cast json) -- kepala desa, tim survei, dsb

- created_at, updated_at

INDEX: (household_id), (house_assistance_id)

Catatan: Banyak enumerasi bersifat daftar tetap pada form; validasi dilakukan di layer aplikasi. Field `*_json` dipakai untuk opsi multi-pilihan atau snapshot teks.

### Relasi dan Penyesuaian

- Household `hasMany RelocationAssessment`
- HouseAssistance `belongsTo Household` dan opsional `hasOne RelocationAssessment`
- Disarankan memaketkan dokumen/foto form via `media` dengan `owner_type='relocation_assessment'`.

### Dampak ke `house_assistances`

Tambahkan kolom opsional:

- relocation_assessment_id: INTEGER NULLABLE FK → relocation_assessments.id (redundan dua arah, pilih salah satu arah relasi; salah satunya cukup, rekomendasi: relasi satu arah dari assessment ke assistance agar assistance dapat dibuat setelah penilaian)

---

## Alur Entri Data (tanpa perubahan UI besar)

Karena di UI belum ada penambahan bantuan, usulkan flow berikut pada tab "Bantuan":

1. Pada tab Bantuan rumah, tombol "Tambah Bantuan".
2. Dialog pilihan: "Isi Form Penilaian Relokasi" atau "Input Bantuan Langsung".
    - Isi Form Penilaian Relokasi → wizard 3 langkah sesuai form (Identitas → Kondisi Fisik → Catatan & Tanda Tangan). Hasilnya membuat 1 record `relocation_assessments`. Di akhir wizard, opsional: "Buat entri bantuan dari penilaian ini" yang mengisi otomatis `house_assistances` (jenis, sumber dana, tanggal penanganan) dan menautkan ke assessment.
    - Input Bantuan Langsung → form ringkas untuk `house_assistances` (jenis, sumber dana, tanggal mulai/selesai, biaya, deskripsi, dokumen). Penilaian bisa dilengkapi nanti.
3. Lampiran foto/dokumen diunggah sebagai `media` bertipe `PHOTO/DOC` dengan `owner_type` sesuai (assessment/assistance).

Keuntungan alur ini:

- Mendukung kebutuhan administrasi (bantuan ringkas) maupun audit teknis (penilaian lengkap)
- Tidak memaksa perubahan besar UI; cukup tombol dan wizard di tab Bantuan

### Rencana Implementasi (tambahan)

- Migrasi: `create_relocation_assessments_table` + alter `house_assistances` jika memakai FK searah.
- Model: `RelocationAssessment` dengan casts json dan relasi ke `Household` (+ opsional ke `HouseAssistance`).
- Factories/Seeders: buat assessment sample dan tautkan sebagian ke assistance; generate variasi enumerasi.

---

## Validasi dan Penyesuaian Skema: Kawasan & PSU (berdasarkan UI)

Berikut penyesuaian agar skema mendukung tampilan list, detail, legenda, dan pengelolaan geometri di UI Kawasan dan PSU. Penambahan ini tidak menghapus skema sebelumnya.

### A. Kawasan (List: Id Kawasan, Nama Kawasan, Jumlah, Legend; Detail: daftar kawasan dengan polygon di peta)

UI menunjukkan konsep "kelompok kawasan" (contoh: Kawasan Kumuh, Kawasan Permukiman, Kawasan Rawan Bencana, Lokasi Prioritas Pembangunan), di mana setiap kelompok memiliki banyak fitur polygon (Kawasan Kumuh 1, 2, 3, dst) beserta ringkasan angka Rumah/Keluarga.

#### Tabel Baru: `area_groups`

Mewakili baris pada list Data Kawasan (group/category) dengan pengaturan legenda.

- id: INTEGER PK
- code: VARCHAR(40) UNIQUE -- mis. 'SLUM','SETTLEMENT','DISASTER_RISK','PRIORITY_DEV'
- name: VARCHAR(150) -- Nama Kawasan di UI
- description: TEXT NULLABLE
- legend_color_hex: VARCHAR(7) NULLABLE -- contoh '#F28AAA'
- legend_icon: VARCHAR(80) NULLABLE -- nama ikon opsional
- is_active: INTEGER (0/1) DEFAULT 1
- created_at, updated_at

Indeks: (code), (is_active)

#### Tabel Baru: `area_features`

Fitur polygon per kawasan yang ditampilkan pada panel kiri di halaman detail Kawasan.

- id: INTEGER PK
- area_group_id: INTEGER FK → area_groups.id
- name: VARCHAR(150) -- contoh: 'Kawasan Kumuh 1'
- description: TEXT NULLABLE
- geometry_type: VARCHAR(12) CHECK in ('POLYGON','MULTIPOLYGON')
- geometry_json: TEXT -- GeoJSON
- centroid_lat: DECIMAL(10,6) NULLABLE
- centroid_lng: DECIMAL(10,6) NULLABLE
- household_count: INTEGER NULLABLE -- angka Rumah (opsional: dihitung dari join spasial di tahap lanjut)
- family_count: INTEGER NULLABLE -- angka Keluarga
- area_survey_id: INTEGER NULLABLE FK → area_surveys.id -- opsional untuk mengaitkan indikator baseline wilayah
- attributes_json: TEXT NULLABLE (cast json)
- is_visible: INTEGER (0/1) DEFAULT 1
- created_at, updated_at

Indeks: (area_group_id), (area_survey_id), (is_visible)

Catatan:

- Nilai "Jumlah" pada list Kawasan diambil dari COUNT(area_features) per `area_group_id`.
- Warna/legenda diambil dari `area_groups.legend_color_hex`.

### B. PSU (List: Id PSU, Nama PSU, Kategori, Jenis, Jumlah, Legend; Detail: daftar item (Pipa Air 1..n) + peta)

UI menunjukkan satu entitas list sebagai "kelompok PSU" (contoh: Jalur Pipa Air, Tiang PLN, SMA, Rumah Sakit) dan di dalamnya terdapat banyak item geometri (line/point) yang dapat dilihat pada peta.

#### Tabel Baru: `infrastructure_groups`

Mewakili baris pada list Data PSU dengan info kategori, jenis, dan legenda.

- id: INTEGER PK
- code: VARCHAR(40) UNIQUE -- contoh: 'WATER_PIPE','POWER_POLE','SMA','HOSPITAL'
- name: VARCHAR(150) -- Nama PSU di UI ('Jalur Pipa Air')
- category: VARCHAR(40) -- 'Air Bersih','Listrik','Pendidikan','Kesehatan', dll
- jenis: VARCHAR(12) CHECK in ('PRASARANA','SARANA')
- legend_color_hex: VARCHAR(7) NULLABLE -- warna garis/ikon di list
- legend_icon: VARCHAR(80) NULLABLE -- nama ikon (petir, rumah sakit, dsb)
- description: TEXT NULLABLE
- is_active: INTEGER (0/1) DEFAULT 1
- created_at, updated_at

Indeks: (code), (category, jenis), (is_active)

#### Perluasan Tabel: `infrastructures` (sebagai item per kelompok)

Tambahkan kolom berikut untuk mendukung grouping dan UI detail:

- infrastructure_group_id: INTEGER FK → infrastructure_groups.id
- title: VARCHAR(150) NULLABLE -- contoh: 'Pipa Air 1'
- is_visible: INTEGER (0/1) DEFAULT 1
- order_index: INTEGER NULLABLE -- urutan di panel kiri

Indeks tambahan: (infrastructure_group_id), (is_visible), (order_index)

Catatan:

- Kolom yang sudah ada (`geometry_type`, `geometry_json`, `attributes_json`, lat/lng) tetap dipakai; garis pipa = LINESTRING, tiang PLN = POINT.
- Nilai "Jumlah" pada list PSU diambil dari COUNT(infrastructures) per `infrastructure_group_id`.

### Dampak pada Relasi

- AreaGroup `hasMany AreaFeature`
- AreaFeature `belongsTo AreaGroup` dan opsional `belongsTo AreaSurvey`
- InfrastructureGroup `hasMany Infrastructure`
- Infrastructure `belongsTo InfrastructureGroup`

### Rencana Migrasi Tambahan (Laravel)

- create_area_groups_table
- create_area_features_table
- create_infrastructure_groups_table
- alter_infrastructures_table_add_grouping (tambah FK, title, is_visible, order_index)

### Rencana Model

- AreaGroup, AreaFeature
- InfrastructureGroup (baru), Infrastructure (ditambah relasi `belongsTo InfrastructureGroup`)

### Rencana Factories & Seeders

- AreaGroupFactory + AreaFeatureFactory (generate beberapa group: SLUM, SETTLEMENT, DISASTER_RISK, PRIORITY_DEV; untuk tiap group buat 3–10 polygon demo dengan warna berbeda)
- InfrastructureGroupFactory (buat 4 contoh: WATER_PIPE(PRASARANA), POWER_POLE(PRASARANA), SMA(SARANA), HOSPITAL(SARANA))
- InfrastructureFactory (untuk WATER_PIPE buat 5 LINESTRING; untuk POWER_POLE buat 10 POINT; untuk SMA/HOSPITAL buat 2–5 POINT)

### Alur Entri Data di UI

#### Kawasan

1. Halaman list menampilkan `area_groups` dengan kolom: Id, Nama, Jumlah (COUNT fitur), Legend (warna/icon).
2. Detail group (contoh: Kawasan Kumuh):
    - Panel kiri: daftar `area_features` (Kawasan Kumuh 1..n).
    - Tombol "Tambah Kawasan" membuka wizard gambar polygon (Leaflet → draw) → isian nama, deskripsi, household_count, family_count → simpan `area_features` ke group.
    - Toggling visibilitas mengubah `area_features.is_visible`.

#### PSU

1. Halaman list menampilkan `infrastructure_groups` dengan kolom: Id, Nama PSU, Kategori, Jenis, Jumlah (COUNT item), Legend (warna/icon).
2. Detail group (contoh: Jalur Pipa Air):
    - Panel kiri: daftar `infrastructures` milik group (title/order), tombol mata untuk `is_visible`.
    - Tombol "Tambah PSU" → pilih tipe geometri (POINT/LINESTRING/POLYGON) → gambar di peta → isi title/atribut → simpan `infrastructures` dengan `infrastructure_group_id`.

---
