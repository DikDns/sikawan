# Analisis Kekurangan Data UI untuk Kalkulasi Skor Kelayakan (RLH/RTLH)

## Ringkasan

Dokumen ini menganalisis gap antara data yang tersedia di `HOUSEHOLD_UI_DATA.md` dengan data yang diperlukan untuk kalkulasi skor kelayakan huni berdasarkan `PENDATAAN BASELINE.md`.

---

## Parameter Skor yang Diperlukan (dari Baseline)

Berdasarkan `PENDATAAN BASELINE.md`, ada 5 parameter utama untuk kalkulasi skor:

1. **A.1 KETERATURAN BANGUNAN HUNIAN** - Skor 0 atau 1
2. **A.2 KELAYAKAN BANGUNAN HUNIAN** - Skor luas lantai (0/1) + Skor struktur (0/1) = Total persentase
3. **A.3 AKSES AIR MINUM** - Skor akses (0/1) + Skor pemenuhan (0/1)
4. **A.4 PENGELOLAAN SANITASI** - Skor akses (0/1) + Skor teknis (0/1)
5. **A.5 PENGELOLAAN SAMPAH** - Skor 0 atau 1

---

## Analisis Per Parameter

### A.1 KETERATURAN BANGUNAN HUNIAN

#### Data yang Diperlukan (dari Baseline):

1. ✅ Akses langsung ke jalan (Ya/Tidak)
2. ❌ **KURANG**: Posisi muka bangunan menghadap jalan dengan detail:
    - lebar jalan <= 1,5 meter (Ya/Tidak)
    - lebar jalan == 1,5 meter (Ya/Tidak)
    - lebar jalan > 1,5 meter (Ya/Tidak)
3. ❌ **KURANG**: Posisi bangunan menghadap sungai/laut/rawa/danau:
    - Tidak ada sungai/laut/rawa/danau
    - Ya (menghadap)
    - Tidak (tidak menghadap)
4. ❌ **KURANG**: Bangunan di atas lahan sempadan:
    - Tidak ada sungai/laut/rawa/danau
    - Ya (di atas sempadan)
    - Tidak (tidak di atas sempadan)
5. ✅ Daerah limbah/dibawah jalur listrik tegangan tinggi (Ya/Tidak)

#### Data yang Ada di UI:

- ✅ Akses jalan <1,5 m (boolean)
- ✅ Hadap jalan <1,5 m (boolean)
- ✅ Akses Jalan >1,5 m (boolean)
- ✅ Hadap Jalan >1,5 m (boolean)
- ✅ Menghadap Sempadan (boolean)
- ✅ Diatas Sempadan (boolean)
- ✅ Daerah Limbah/ Dibawah jalur Listrik Tegangan Tinggi (boolean)

#### Gap Analysis:

- ⚠️ **MASALAH**: UI menggunakan boolean terpisah, sedangkan baseline memerlukan logika kondisional:
    - UI: `Akses jalan <1,5 m` dan `Akses Jalan >1,5 m` (dua boolean terpisah)
    - Baseline: Butuh kategori lebar jalan (<=1.5m, ==1.5m, >1.5m) DAN apakah menghadap jalan
- ⚠️ **MASALAH**: UI tidak membedakan "tidak ada sungai/laut" vs "ada tapi tidak menghadap"
- ✅ **SOLUSI**: Perlu field tambahan:
    - `road_width_category`: ENUM('LE1_5', 'EQ1_5', 'GT1_5')
    - `waterbody_exists`: BOOLEAN (ada/tidak ada sungai/laut/rawa)
    - `faces_waterbody`: BOOLEAN (jika ada, apakah menghadap)
    - `setback_exists`: BOOLEAN (ada/tidak ada sempadan)
    - `in_setback_area`: BOOLEAN (jika ada, apakah di atas sempadan)

---

### A.2 KELAYAKAN BANGUNAN HUNIAN

#### Data yang Diperlukan (dari Baseline):

1. ✅ Panjang Bangunan (meter)
2. ✅ Lebar Bangunan (meter)
3. ✅ Jumlah Lantai
4. ✅ Luas Bangunan (calculated: Panjang × Lebar × Jumlah Lantai)
5. ✅ Jumlah penghuni (jiwa)
6. ✅ Luas Lantai/jiwa (calculated: Luas Bangunan ÷ Jumlah penghuni)
7. ✅ Kondisi atap terluas (Tidak Bocor/Bocor)
8. ✅ Kondisi dinding terluas (Baik/Rusak)
9. ✅ Jenis lantai terluas (Bukan Tanah/Tanah)

#### Data yang Ada di UI:

- ✅ Panjang Bangunan (numeric)
- ✅ Lebar Bangunan (numeric)
- ✅ Jumlah Lantai (numeric)
- ✅ Ketinggian perlantai (numeric) - **BONUS** (tidak ada di baseline)
- ✅ Luas Bangunan (numeric)
- ✅ Luas Lantai Bangunan/ jiwa (numeric)
- ✅ Pondasi (boolean)
- ✅ Sloof (boolean)
- ✅ Ring Balok (boolean)
- ✅ Struktur Atap (boolean)
- ✅ Tiang Kolom (boolean)
- ✅ Material Atap (string)
- ✅ Kondisi Atap (string)
- ✅ Material Dinding (string)
- ✅ Kondisi Dinding (string)
- ✅ Material Lantai (string)
- ✅ Kondisi Lantai (string)

#### Gap Analysis:

- ✅ **LENGKAP**: Semua data yang diperlukan sudah ada
- ⚠️ **PERLU VALIDASI**: Pastikan enum value untuk kondisi sesuai:
    - Kondisi Atap: 'GOOD' (Tidak Bocor) / 'LEAK' (Bocor)
    - Kondisi Dinding: 'GOOD' (Baik) / 'DAMAGED' (Rusak)
    - Kondisi Lantai: 'LAYAK' (Bukan Tanah) / 'TIDAK_LAYAK' (Tanah)
- ✅ **BONUS**: Data struktur bangunan (Pondasi, Sloof, dll) ada di UI, bisa digunakan untuk validasi tambahan

---

### A.3 AKSES AIR MINUM

#### Data yang Diperlukan (dari Baseline):

1. ✅ Sumber utama air (11 pilihan: Ledeng Meteran, Ledeng Tanpa Meteran, Sumur Bor, Sumur Terlindung, Mata Air Terlindung, Air Hujan, Air Kemasan, Sumur tak terlindungi, Mata Air tak Terlindung, Sungai/Danau/Kolam, tangki/mobil/gerobak air)
2. ⚠️ Jarak ke penampung tinja/kotoran terdekat (≥ 10 m / < 10 m) - **Hanya jika sumber = Sumur Bor/Sumur Terlindung/Mata Air Terlindung**
3. ✅ Kecukupan air pertahun (Tercukupi sepanjang tahun / Tercukupi hanya bulan tertentu / Tidak pernah tercukupi)

#### Data yang Ada di UI:

- ✅ Sumber Utama (string?)
- ⚠️ Jarak sumber air ke penampung tinja/kotoran terdekat (numeric?)
- ⚠️ kecukupan air pertahun (boolean? tercukupi/tidak tercukupi)

#### Gap Analysis:

- ⚠️ **MASALAH**: UI menggunakan `string?` untuk sumber utama, perlu mapping ke enum yang tepat
- ⚠️ **MASALAH**: UI menggunakan `numeric?` untuk jarak, sedangkan baseline butuh kategori (≥10m / <10m)
- ⚠️ **MASALAH**: UI menggunakan `boolean?` untuk kecukupan, sedangkan baseline butuh 3 pilihan (sepanjang tahun / bulan tertentu / tidak pernah)
- ✅ **SOLUSI**: Perlu field:
    - `water_source`: ENUM dengan 11 pilihan sesuai baseline
    - `water_distance_to_septic_m`: DECIMAL (jarak dalam meter)
    - `water_distance_category`: ENUM('GE10M', 'LT10M') - calculated dari jarak
    - `water_fulfillment`: ENUM('ALWAYS', 'SEASONAL', 'NEVER')

---

### A.4 PENGELOLAAN SANITASI

#### Data yang Diperlukan (dari Baseline):

1. ✅ Tempat Buang Air Besar (Jamban sendiri/bersama / Jamban umum / Tidak di jamban)
2. ✅ Jenis Kloset (Leher angsa / Bukan leher angsa)
3. ✅ Pembuangan Limbah (Septictank pribadi/komunal/IPAL / Bukan septictank/IPAL)

#### Data yang Ada di UI:

- ✅ Tempat Buang Air Besar (string?)
- ✅ Jenis Kloset (string?)
- ✅ Pembuangan Limbah (string?)

#### Gap Analysis:

- ⚠️ **MASALAH**: UI menggunakan `string?`, perlu mapping ke enum yang tepat
- ✅ **SOLUSI**: Perlu field dengan enum:
    - `defecation_place`: ENUM('PRIVATE_SHARED', 'PUBLIC', 'OPEN')
    - `toilet_type`: ENUM('S_TRAP', 'NON_S_TRAP')
    - `sewage_disposal`: ENUM('SEPTIC_IPAL', 'NON_SEPTIC')

---

### A.5 PENGELOLAAN SAMPAH

#### Data yang Diperlukan (dari Baseline):

1. ✅ Tempat pembuangan sampah (5 pilihan: Tempat sampah pribadi / Tempat sampah komunal/TPS/TPS-3R / Dalam Lubang/dibakar / Ruang terbuka/lahan kosong/jalan / Sungai/Saluran Irigasi/Danau/Laut/Drainase)
2. ✅ Frekuensi pengangkutan sampah (≥ 2x seminggu / < 1x seminggu)

#### Data yang Ada di UI:

- ✅ Pembuangan Sampah (string?)
- ⚠️ Pengangkutan Sampah (string?)

#### Gap Analysis:

- ⚠️ **MASALAH**: UI menggunakan `string?`, perlu mapping ke enum yang tepat
- ⚠️ **MASALAH**: UI tidak jelas format untuk frekuensi pengangkutan
- ✅ **SOLUSI**: Perlu field dengan enum:
    - `waste_disposal_place`: ENUM('PRIVATE_BIN', 'COMMUNAL', 'BURNT', 'OPENSPACE', 'WATERBODY')
    - `waste_collection_frequency`: ENUM('GE2X_WEEK', 'LT1X_WEEK')

---

## Data Tambahan yang Diperlukan

### 1. Data untuk Kalkulasi Skor A.2 (Struktur Bangunan)

UI sudah memiliki data struktur (Pondasi, Sloof, Ring Balok, dll), tapi tidak digunakan dalam kalkulasi baseline. Namun, data ini bisa digunakan untuk:

- Validasi tambahan
- Laporan detail
- Analisis lebih lanjut

### 2. Data Sumber Listrik

UI memiliki:

- ✅ Sumber Utama (string?)
- ✅ Daya Listrik (numeric?)

**Catatan**: Data listrik tidak digunakan dalam kalkulasi skor baseline (A.1-A.5), tapi diperlukan untuk:

- Data non-fisik (A.6)
- Dashboard dan analisis
- Laporan

---

## Rekomendasi Perbaikan UI

### Prioritas Tinggi (Wajib untuk Kalkulasi Skor):

1. **A.1 Keteraturan Bangunan:**
    - Ganti boolean terpisah dengan:
        - Dropdown: "Kategori Lebar Jalan" (<=1.5m / ==1.5m / >1.5m)
        - Checkbox: "Menghadap Jalan" (Ya/Tidak)
        - Radio: "Ada Sungai/Laut/Rawa?" (Ya/Tidak) → jika Ya, lanjut: "Menghadap?" (Ya/Tidak)
        - Radio: "Ada Sempadan?" (Ya/Tidak) → jika Ya, lanjut: "Di Atas Sempadan?" (Ya/Tidak)

2. **A.3 Akses Air:**
    - Dropdown: "Sumber Air" (11 pilihan sesuai baseline)
    - Conditional: Jika sumber = Sumur Bor/Sumur Terlindung/Mata Air Terlindung:
        - Input: "Jarak ke Penampung Tinja (meter)"
        - Auto-calculate: Kategori (≥10m / <10m)
    - Radio: "Kecukupan Air" (Sepanjang Tahun / Bulan Tertentu / Tidak Pernah)

3. **A.4 & A.5:**
    - Ganti `string?` dengan dropdown enum sesuai baseline

### Prioritas Sedang (Perbaikan Data):

1. **Validasi Enum Value:**
    - Pastikan semua kondisi menggunakan enum yang sesuai (GOOD/LEAK, GOOD/DAMAGED, dll)
    - Tambahkan validasi di form

2. **Auto-calculation:**
    - Luas Bangunan = Panjang × Lebar × Jumlah Lantai
    - Luas/jiwa = Luas Bangunan ÷ Jumlah penghuni
    - Jarak kategori = calculated dari jarak numeric

### Prioritas Rendah (Nice to Have):

1. **Data Struktur Bangunan:**
    - Tetap tampilkan di UI untuk informasi detail
    - Bisa digunakan untuk validasi tambahan

2. **Data Listrik:**
    - Tetap tampilkan untuk data non-fisik
    - Tidak mempengaruhi skor baseline

---

## Mapping Data UI ke Skema Database

### Tabel: `household_technical_data`

| Field UI                 | Field DB                   | Tipe    | Catatan                                           |
| ------------------------ | -------------------------- | ------- | ------------------------------------------------- |
| Akses jalan <1,5 m       | has_road_access            | BOOLEAN | Perlu logika: jika road_width_category <= 'LE1_5' |
| Hadap jalan <1,5 m       | facade_faces_road          | BOOLEAN | Perlu logika: jika road_width_category <= 'LE1_5' |
| Akses Jalan >1,5 m       | has_road_access            | BOOLEAN | Perlu logika: jika road_width_category > 'GT1_5'  |
| Hadap Jalan >1,5 m       | facade_faces_road          | BOOLEAN | Perlu logika: jika road_width_category > 'GT1_5'  |
| **NEW**                  | road_width_category        | ENUM    | Kategori lebar jalan                              |
| **NEW**                  | waterbody_exists           | BOOLEAN | Ada/tidak ada sungai/laut                         |
| Menghadap Sempadan       | faces_waterbody            | BOOLEAN | Jika waterbody_exists = true                      |
| **NEW**                  | setback_exists             | BOOLEAN | Ada/tidak ada sempadan                            |
| Diatas Sempadan          | in_setback_area            | BOOLEAN | Jika setback_exists = true                        |
| Daerah Limbah            | in_hazard_area             | BOOLEAN | ✅                                                |
| Panjang Bangunan         | building_length_m          | DECIMAL | ✅                                                |
| Lebar Bangunan           | building_width_m           | DECIMAL | ✅                                                |
| Jumlah Lantai            | floor_count                | INTEGER | ✅                                                |
| Ketinggian perlantai     | floor_height_m             | DECIMAL | ✅                                                |
| Luas Bangunan            | building_area_m2           | DECIMAL | Calculated                                        |
| Luas/jiwa                | area_per_person_m2         | DECIMAL | Calculated                                        |
| Pondasi                  | has_foundation             | BOOLEAN | ✅                                                |
| Sloof                    | has_sloof                  | BOOLEAN | ✅                                                |
| Ring Balok               | has_ring_beam              | BOOLEAN | ✅                                                |
| Struktur Atap            | has_roof_structure         | BOOLEAN | ✅                                                |
| Tiang Kolom              | has_columns                | BOOLEAN | ✅                                                |
| Material Atap            | roof_material              | VARCHAR | ✅                                                |
| Kondisi Atap             | roof_condition             | ENUM    | Perlu validasi: GOOD/LEAK                         |
| Material Dinding         | wall_material              | VARCHAR | ✅                                                |
| Kondisi Dinding          | wall_condition             | ENUM    | Perlu validasi: GOOD/DAMAGED                      |
| Material Lantai          | floor_material             | VARCHAR | ✅                                                |
| Kondisi Lantai           | floor_condition            | ENUM    | Perlu validasi: LAYAK/TIDAK_LAYAK                 |
| Sumber Utama             | water_source               | ENUM    | Perlu mapping ke 11 pilihan                       |
| Jarak ke penampung tinja | water_distance_to_septic_m | DECIMAL | ✅                                                |
| **NEW**                  | water_distance_category    | ENUM    | Calculated: GE10M/LT10M                           |
| kecukupan air pertahun   | water_fulfillment          | ENUM    | Perlu: ALWAYS/SEASONAL/NEVER                      |
| Sumber Utama Listrik     | electricity_source         | VARCHAR | ✅                                                |
| Daya Listrik             | electricity_power_watt     | INTEGER | ✅                                                |
| Tempat Buang Air Besar   | defecation_place           | ENUM    | Perlu mapping                                     |
| Jenis Kloset             | toilet_type                | ENUM    | Perlu mapping                                     |
| Pembuangan Limbah        | sewage_disposal            | ENUM    | Perlu mapping                                     |
| Pembuangan Sampah        | waste_disposal_place       | ENUM    | Perlu mapping                                     |
| Pengangkutan Sampah      | waste_collection_frequency | ENUM    | Perlu mapping                                     |

---

## Kesimpulan

### Data yang KURANG untuk Kalkulasi Skor:

1. ❌ **A.1**: Detail kategori lebar jalan dan logika kondisional untuk sungai/sempadan
2. ⚠️ **A.3**: Format enum untuk sumber air, kategori jarak, dan kecukupan air
3. ⚠️ **A.4**: Format enum untuk tempat BAB, jenis kloset, pembuangan limbah
4. ⚠️ **A.5**: Format enum untuk pembuangan dan pengangkutan sampah

### Data yang SUDAH LENGKAP:

1. ✅ **A.2**: Semua data teknis bangunan sudah ada
2. ✅ Data dasar (panjang, lebar, lantai, material, kondisi)

### Rekomendasi:

1. **Perbaiki UI Form** untuk menambahkan field yang kurang
2. **Validasi Enum** untuk memastikan data sesuai baseline
3. **Auto-calculation** untuk memudahkan input
4. **Mapping Service** untuk convert data UI ke format database

---

**Catatan**: Skema V2 di `SCHEMA_DB_V2.md` sudah mengakomodasi semua kebutuhan ini dengan struktur yang disederhanakan.
