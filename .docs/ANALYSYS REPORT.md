# Perencanaan Aplikasi Sistem Informasi Pemukiman Kumuh

## Arsitektur Sistem

### Teknologi Utama

- Backend: Laravel (PHP)
- Frontend: React TypeScript
- Database: SQLite (sesuai existing project)
- Peta: Leaflet.js + OpenStreetMap
- Autentikasi: Laravel Fortify

### Struktur Modul Aplikasi

1. Manajemen Data Rumah
    - CRUD Data Rumah
    - Penilaian Kelayakan Rumah
    - Riwayat Bantuan Relokasi
    - Dokumentasi Foto
    - Pemetaan Lokasi Rumah

2. Manajemen Kawasan
    - Pemetaan Kawasan Kumuh
    - Polygon GIS
    - Kategorisasi Kawasan
    - Analisis Tingkat Kekumuhan
    - Prioritas Pembangunan

3. Manajemen PSU (Prasarana Sarana Umum)
    - Pemetaan Infrastruktur
    - Jaringan Pipa Air
    - Lokasi Fasilitas Umum
    - Kondisi Infrastruktur
    - Riwayat Pembangunan

4. Sistem Pelaporan
    - Generate Laporan Otomatis
    - Ekspor PDF/Excel
    - Visualisasi Data
    - Analitik Kawasan
    - Rekomendasi Intervensi

5. Manajemen Pengguna
    - Autentikasi Bertingkat
    - Admin
    - Super Admin
    - Pembatasan Akses
    - Log Aktivitas

## Alur Kerja Sistem

### Proses Pendataan

1. Login Pengguna
2. Pilih Wilayah Survei
3. Isi Form Baseline
4. Validasi Data
5. Simpan ke Database
6. Generate Skor Otomatis
7. Update Peta

### Proses Analisis

1. Agregasi Data
2. Perhitungan Indeks Kekumuhan
3. Visualisasi Peta
4. Identifikasi Prioritas
5. Rekomendasi Intervensi

## Desain Database

### Tabel Utama

- users (manajemen pengguna)
- houses (data rumah)
- areas (kawasan)
- infrastructure (PSU)
- surveys (hasil survei)
- reports (laporan)

## Fitur Khusus

- Validasi Input Cerdas
- Perhitungan Skor Otomatis
- Integrasi Peta Interaktif
- Manajemen Hak Akses Ketat
- Audit Log Perubahan Data

## Pertimbangan Keamanan

- Enkripsi Data Sensitif
- Validasi Input Ketat
- Pembatasan Akses Berjenjang
- Pencatatan Aktivitas Pengguna

## Skalabilitas dan Pengembangan

- Arsitektur Modular
- Dokumentasi Kode
- Persiapan Integrasi API
- Dukungan Ekspansi Fitur

## Estimasi Teknologi dan Waktu

- Persiapan Proyek: 1 Minggu
- Desain Database: 1 Minggu
- Implementasi Backend: 3 Minggu
- Implementasi Frontend: 3 Minggu
- Integrasi GIS: 2 Minggu
- Pengujian: 2 Minggu
- Total Estimasi: 12 Minggu

## Risiko dan Mitigasi

- Kompleksitas Data: Validasi Bertingkat
- Perubahan Kebutuhan: Metodologi Agile
- Keamanan Data: Enkripsi dan Audit
- Performa: Optimasi Kueri dan Caching

## Rekomendasi Lanjutan

- Konsultasi dengan Dosen Pembimbing
- Validasi Kebutuhan Pengguna
- Prototipe Awal
- Ujicoba Terbatas

## Alur Input Aplikasi (Disederhanakan dari Baseline)

Tujuan: Mempercepat entri, meminimalkan kesalahan, dan otomatis menghitung skor/indikator.

1. Pemilihan Jenis Pendataan

- Opsi: "Pendataan Rumah (RT)" atau "Pendataan Wilayah (Area)"
- Pilih wilayah administratif: Provinsi, Kab/Kota, Kecamatan, Kelurahan/Desa, RT/RW
- Tanggal Pendataan otomatis default hari ini (bisa ubah)

2. Wizard Pendataan Rumah (berbasis A.1 s/d A.6)

- Step 1: Informasi Umum
    - Nama Kepala Rumah Tangga, NIK (opsional sesuai catatan), Jumlah KK, Status (MBR/Non MBR), Komposisi ART (L/P/Difabel)
    - Validasi otomatis konsistensi jumlah (L+P = Total)
- Step 2: A.1 Keteraturan Bangunan
    - Pertanyaan akses jalan, orientasi ke jalan (dengan kategori lebar), kedekatan/posisi terhadap badan air, sempadan, dan bahaya lingkungan
    - Skor A.1 dihitung otomatis sesuai aturan
- Step 3: A.2 Kelayakan Bangunan
    - Input dimensi panjang, lebar, jumlah lantai → hitung luas
    - Input jumlah penghuni → hitung m2/jiwa dan skor
    - Input kondisi atap, dinding, jenis lantai → skor teknis otomatis
- Step 4: A.3 Akses Air Minum
    - Sumber air (dropdown)
    - Branching: jika sumber = sumur/mata air terlindung → tampilkan jarak ke septik (>=10m atau <10m)
    - Pemenuhan kebutuhan air (sepanjang tahun/tertentu/tidak tercukupi)
    - Skor akses air dan pemenuhan kebutuhan dihitung otomatis
- Step 5: A.4 Pengelolaan Sanitasi
    - Tempat BAB, jenis kloset, tujuan pembuangan tinja → skor kelayakan teknis otomatis
- Step 6: A.5 Pengelolaan Sampah
    - Tempat pembuangan, frekuensi pengangkutan → skor otomatis
- Step 7: A.6 Data Non-Fisik
    - Mata pencaharian utama, daya listrik, akses faskes/pendidikan (untuk analitik, bukan skor)
- Step 8: Lokasi & Dokumentasi
    - Titik koordinat rumah (klik peta Leaflet) + foto (opsional)
- Step 9: Ringkasan & Simpan
    - Tampilkan rekap jawaban + skor A.1–A.5 (dan sub-skor A.2)
    - Simpan sebagai satu entitas rumah dengan relasi ke komponen (air, sanitasi, dll)

3. Wizard Pendataan Wilayah (berbasis B.1 s/d B.8)

- Step 1: Informasi Umum Wilayah (SATUAN PEMUKIMAN RT/RW/Dusun)
- Step 2: B.1 Kepadatan Bangunan
    - Input luas wilayah, luas permukiman, jumlah bangunan, kemiringan >15% → hitung kepadatan
- Step 3: B.2 Jalan Lingkungan
    - Panjang total, klasifikasi lebar, perkerasan, kebutuhan jalan baru, saluran samping → hitung jangkauan dan persentase tidak rusak
- Step 4: B.3 Drainase
    - Genangan (tinggi/durasi/frekuensi/luas/sumber), panjang drainase eksisting & kebutuhan/penghubung, kondisi kebersihan/konstruksi → agregasi indikator sesuai catatan
- Step 5: B.4 Sanitasi Lingkungan
    - Pemisahan limbah cair dari drainase
- Step 6: B.5 Persampahan
    - Prasarana (TPS/TPS-3R/TPST) dan sarana pengangkutan, kondisi → persentase sesuai aturan
- Step 7: B.6 Kebakaran
    - Frekuensi, penyebab, sarana/prasarana proteksi, jalan akses ≥3,5 m → persentase ketersediaan
- Step 8: B.7 Data Non-Fisik
    - Faskes/fasdik tersedia di RT (multi-pilihan)
- Step 9: Peta Kawasan
    - Gambar polygon wilayah di peta (Leaflet), simpan sebagai GeoJSON
- Step 10: Ringkasan & Simpan
    - Rekap indikator dan persentase

4. Fitur Enti Cepat & Kualitas Data

- Autosave per step, validasi langsung, kalkulasi otomatis, tooltip kriteria
- Branching logika agar pertanyaan yang tidak relevan tersembunyi

## Pemetaan Skor (Ringkas)

- A.1: aturan kombinasi kolom [3],[5],[13] serta [7]/[8] dan [10]/[11]; 0 jika [4],[6],[9],[12],[14] = 1
- A.2: m2/jiwa ≥ 7,2 → 1; kondisi atap+dinding+lantai sesuai → 1; total presentase = jumlah skor/total × 100
- A.3: kombinasi sumber air dan jarak septik; pemenuhan kebutuhan tahunan → 1; selainnya 0
- A.4: akses jamban sendiri/bersama → 1; kloset leher angsa + septik/IPAL → 1; selainnya 0
- A.5: pengangkutan ≥2x/minggu → 1; selainnya 0
- B.2/B.3/B.5/B.6: rumus persentase sesuai ketentuan dokumen

## Skema Database (Usulan)

Catatan umum:

- Simpan geometri Point/LineString/Polygon sebagai GeoJSON (kolom `geometry_json` TEXT) untuk kompatibel dengan SQLite; koordinat titik juga disimpan sebagai `latitude`/`longitude` NUMERIC agar mudah di-query.
- Enumerasi disimpan sebagai `ENUM` (aplikatif) atau `VARCHAR` dengan validasi pada layer aplikasi; untuk beberapa enumerasi yang stabil dapat dibuat tabel referensi.

1. Manajemen Pengguna

- users: id, name, email, password_hash, role (admin|superadmin), created_at, updated_at
- audit_logs: id, user_id, action, entity_type, entity_id, metadata_json, created_at

2. Wilayah Administratif (opsional, jika dibutuhkan referensi baku)

- admin_areas: id, level (province|regency|district|village), code, name, parent_id

3. Data Rumah & Komponen

- households: id, admin_area_ids (province_id, regency_id, district_id, village_id), rt_rw, survey_date, head_name, nik (nullable), address_text, kk_count, status_mbr (MBR|NON_MBR), member_total, male_count, female_count, disabled_count, latitude, longitude, location_json, photo_folder
- house_structure_scores: id, household_id (FK), a1_access_to_road (bool), a1_facade_to_road_width (LE1_5|EQ1_5|GT1_5 with facing yes/no), a1_faces_waterbody (NONE|YES|NO), a1_in_setback (NONE|YES|NO), a1_hazard_area (bool), skor_a1 (tinyint),
  a2_length_m, a2_width_m, a2_floors, a2_area_m2, a2_occupants, a2_m2_per_person, a2_floor_area_score (tinyint),
  a2_roof_condition (GOOD|LEAK), a2_wall_condition (GOOD|DAMAGED), a2_floor_type (NON_SOIL|SOIL), a2_roof_wall_floor_score (tinyint), a2_total_score_pct (decimal(5,2))
- water_access: id, household_id (FK), source (SR_METERAN|SR_NONMETER|SUMUR_BOR|SUMUR_TRL|MATA_AIR_TRL|HUJAN|KEMASAN|SUMUR_TAK_TRL|MATA_AIR_TAK_TRL|SUNGAI|TANGKI_MOBIL), distance_to_septic (GE10M|LT10M|null), skor_air (tinyint),
  water_fulfillment (ALWAYS|SEASONAL|NEVER), skor_fulfillment (tinyint)
- sanitation: id, household_id (FK), defecation_place (PRIVATE_SHARED|PUBLIC|OPEN), score_access (tinyint),
  toilet_type (S_TRAP|NON_S_TRAP), sewage_disposal (SEPTIC_IPAL|NON_SEPTIC), score_technical (tinyint)
- waste_management: id, household_id (FK), disposal_place (PRIVATE_BIN|COMMUNAL|BURNT|OPENSPACE|WATERBODY), collection_frequency (GE2X_WEEK|LT1X_WEEK|null), score (tinyint)
- household_scores: id, household_id (FK), skor_a1, skor_a2_floor_area, skor_a2_roof_wall_floor, skor_a2_total_pct, skor_a3_access, skor_a3_fulfillment, skor_a4_access, skor_a4_technical, skor_a5, computed_at
- occupations (ref, opsional), electrical_power_levels (ref, opsional)
- household_non_physical: id, household_id (FK), main_occupation, electrical_power, health_facility_usage, education_access_summary
- relocation_histories: id, household_id (FK), willing_to_relocate (bool), relocation_land_available (bool), team_recommendation (text), surveyed_at, attachments_folder

4. Pendataan Wilayah (B.1–B.8)

- area_surveys: id, admin_area_ids (province_id, regency_id, district_id, village_id), rt_rw, unit_name, survey_date, geometry_json (Polygon), notes
- area_density_b1: id, area_survey_id (FK), area_total_ha, settlement_area_ha, buildings_total, slope_gt15_pct, building_density_unit_per_ha, density_status (LOW|MEDIUM|HIGH)
- area_roads_b2: id, area_survey_id (FK), length_total_m, length_ge_1_5_m, length_ge_1_5_hardened_m, length_needed_new_m, length_ideal_m, coverage_pct, length_ge_1_5_good_m, length_ge_1_5_soil_good_m, length_lt_1_5_hardened_good_m, length_lt_1_5_soil_good_m, length_with_side_drain_ge_1_5_m, length_with_side_drain_lt_1_5_m, length_good_total_m, good_over_total_pct
- area_drainage_b3: id, area_survey_id (FK), flood_height (NONE|LT30CM|GT30CM), flood_duration (LT2H|GT2H|null), flood_frequency (LT2_YEAR|GT2_YEAR|null), flood_area_ha, flood_source (TIDE|RIVER|RUNOFF|null), length_existing_m, has_new_plan (bool), length_needed_new_m, has_city_link (bool), length_city_link_m, is_clean (bool), length_clean_m, length_structure_good_m, no_flood_event (bool), no_flood_area_pct, length_needed_total_m, length_ideal_m, length_good_pct
- area_sanitation_b4: id, area_survey_id (FK), wastewater_separated (bool)
- area_waste_b5: id, area_survey_id (FK), has_facility (bool), has_transport (bool), facility_condition_good (bool), transport_condition_good (bool), sapras_pct, sapras_good_pct
- area_fire_b6: id, area_survey_id (FK), fire_freq (NEVER|ONCE_5Y|TWICE_5Y|GT2_5Y), causes_json, has_station (bool), has_hydrant (bool), has_vehicle_apar (bool), has_access_road_ge_3_5m (bool), prasarana_pct, sarana_pct
- area_social_b7: id, area_survey_id (FK), health_rs (bool), health_clinic (bool), health_puskesmas (bool), health_traditional (bool), health_midwife (bool), health_none (bool), edu_tk (bool), edu_sd (bool), edu_smp (bool), edu_sma (bool), edu_pt (bool), edu_none (bool)

5. PSU & GIS

- infrastructures: id, type (WATER_PIPE|POWER_LINE|HOSPITAL|SCHOOL|ETC), name, attributes_json, geometry_type (POINT|LINESTRING|POLYGON), geometry_json, latitude, longitude, created_at
- infrastructure_photos: id, infrastructure_id (FK), file_path, caption

6. Pesan & Lampiran

- messages: id, name, email, subject, content, created_at
- media: id, owner_type, owner_id, path, type (PHOTO|DOC), meta_json

7. Indeks & Integritas (contoh)

- Index pada (province_id, regency_id, district_id, village_id), household_id, area_survey_id
- Foreign key berantai untuk menjaga konsistensi

### Contoh Skema (ringkas)

```sql
-- households
CREATE TABLE households (
  id INTEGER PRIMARY KEY,
  province_id INTEGER, regency_id INTEGER, district_id INTEGER, village_id INTEGER,
  rt_rw VARCHAR(20), survey_date DATE,
  head_name VARCHAR(150), nik VARCHAR(32) NULL, address_text TEXT,
  kk_count INTEGER, status_mbr VARCHAR(10), member_total INTEGER,
  male_count INTEGER, female_count INTEGER, disabled_count INTEGER,
  latitude DECIMAL(10,6), longitude DECIMAL(10,6), location_json TEXT,
  photo_folder VARCHAR(255),
  created_at DATETIME, updated_at DATETIME
);

-- area_surveys
CREATE TABLE area_surveys (
  id INTEGER PRIMARY KEY,
  province_id INTEGER, regency_id INTEGER, district_id INTEGER, village_id INTEGER,
  rt_rw VARCHAR(20), unit_name VARCHAR(150), survey_date DATE,
  geometry_json TEXT, notes TEXT,
  created_at DATETIME, updated_at DATETIME
);

-- infrastructures (GIS-agnostic via GeoJSON)
CREATE TABLE infrastructures (
  id INTEGER PRIMARY KEY,
  type VARCHAR(50), name VARCHAR(150), attributes_json TEXT,
  geometry_type VARCHAR(20), geometry_json TEXT,
  latitude DECIMAL(10,6), longitude DECIMAL(10,6),
  created_at DATETIME, updated_at DATETIME
);
```

### Alasan Normalisasi

- Memisahkan data rumah dari komponen (air, sanitasi, sampah) memudahkan validasi dan skor per topik
- Area-level dipisahkan per kelompok indikator B.1–B.8 agar skala dan perhitungan jelas
- GIS diseragamkan via GeoJSON sehingga mudah dipakai Leaflet, tetap kompatibel dengan SQLite

### Output Dashboard & Laporan

- Rumah: tabel rekap skor per rumah + peta titik
- Kawasan: rekap indikator persentase + peta polygon
- PSU: layer per jenis (pipa air, listrik, faskes, fasdik)
- Ekspor laporan: ringkasan by wilayah dan periode
