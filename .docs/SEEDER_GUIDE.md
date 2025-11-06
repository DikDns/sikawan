# Household Seeder Guide

## Overview

`HouseholdSeeder` akan membuat 50 data rumah tangga dummy lengkap dengan:

- ✅ Data household (50 records)
- ✅ Data teknis bangunan (50 records)
- ✅ Anggota keluarga (2-5 members per household = ~175 records)
- ✅ Skor kelayakan (50 records)
- ✅ Bantuan yang diterima (random ~15 records, 30% households)
- ✅ Foto rumah (random ~25 households, 2-5 photos each = ~100 records)

**Total records**: ~400+ records

## Cara Menjalankan Seeder

### 1. Reset Database & Run Seeder

```bash
# Reset database dan jalankan semua migrations + seeders
php artisan migrate:fresh --seed
```

### 2. Run Seeder Saja (Tanpa Reset)

```bash
# Jalankan hanya seeder households
php artisan db:seed --class=HouseholdSeeder
```

### 3. Run Semua Seeders

```bash
# Jalankan DatabaseSeeder yang include HouseholdSeeder
php artisan db:seed
```

## Data yang Di-generate

### 1. **Households (50 records)**

**Wilayah yang Digunakan:**

- DKI Jakarta (KOTA JAKARTA SELATAN)
- Jawa Barat (KOTA BANDUNG)
- Jawa Tengah (KOTA SEMARANG)
- Jawa Timur (KOTA SURABAYA)
- Bali (KOTA DENPASAR)

**Data Household Mencakup:**

- Alamat lengkap dengan koordinat GPS (latitude/longitude)
- RT/RW random
- Tanggal survey (random dalam 1 tahun terakhir)
- Status kepemilikan (OWN/RENT/OTHER)
- Legalitas bangunan & lahan
- Nama kepala keluarga (dari 52 nama Indonesia)
- NIK (auto-generated)
- Status MBR/NON_MBR (70% MBR)
- Jumlah anggota keluarga (2-7 orang)
- Pekerjaan & penghasilan (Rp 1jt - 8jt)
- Status kelayakan RLH/RTLH (60% RLH, 40% RTLH)

### 2. **Technical Data (50 records)**

**A.1 Keteraturan Bangunan:**

- Akses jalan (random boolean)
- Lebar jalan (LE1_5, EQ1_5, GT1_5)
- Hadap jalan, menghadap sempadan, dll

**A.2 Kelayakan Bangunan:**

- Dimensi: Panjang (6-15m), Lebar (4-10m)
- Luas bangunan (calculated)
- Luas per jiwa (calculated)
- Struktur: Pondasi, Sloof, Ring Balok, Atap, Kolom
- Material: Atap, Dinding, Lantai
- Kondisi: Baik/Rusak dengan level kerusakan

**A.3 Akses Air:**

- Sumber air (Ledeng Meteran, Sumur, dll)
- Jarak ke septictank (5-15m)
- Kecukupan air (Always/Seasonal/Never)

**A.4 Sanitasi:**

- Tempat BAB (Private/Public/Open)
- Jenis kloset (S-Trap/Non S-Trap)
- Pembuangan limbah (Septictank/Non-Septictank)

**A.5 Sampah:**

- Tempat pembuangan
- Frekuensi pengangkutan

**Listrik:**

- Sumber (PLN/Genset/Surya)
- Daya (450W - 2200W)

### 3. **Household Members (2-5 per household)**

**Relasi:**

- HEAD (Kepala Keluarga)
- SPOUSE (Pasangan)
- CHILD (Anak-anak)
- OTHER (Lainnya)

**Data:**

- Nama (random dari 52 nama)
- NIK (auto-generated)
- Gender (MALE/FEMALE)
- Status difabel (10% chance)
- Tanggal lahir (1-60 tahun lalu)
- Pekerjaan (disesuaikan dengan usia & relasi)

### 4. **Household Scores (50 records)**

**Skor Individual:**

- A.1: Keteraturan Bangunan (0-1)
- A.2: Luas Lantai (0-1)
- A.2: Struktur (0-1)
- A.3: Akses Air (0-1)
- A.3: Pemenuhan Air (0-1)
- A.4: Akses Sanitasi (0-1)
- A.4: Teknis Sanitasi (0-1)
- A.5: Sampah (0-1)

**Total Score:**

- RLH: 51-100
- RTLH: 0-50

### 5. **House Assistances (~15 records, 30% households)**

**Jenis Bantuan:**

- RELOKASI
- REHABILITASI
- BSPS (Bantuan Stimulan Perumahan Swadaya)
- LAINNYA

**Program:**

- Peningkatan Kualitas
- Bantuan Stimulan Perumahan
- Rehab Berat
- Rehab Sedang

**Sumber Dana:**

- APBN
- APBD
- CSR
- Swadaya

**Status:**

- SELESAI (50%)
- PROSES (25%)
- DIBATALKAN (25%)

**Biaya:**

- Rp 10 juta - Rp 150 juta

### 6. **Household Photos (~100 photos, 50% households)**

**Jenis Foto:**

- Tampak Depan
- Tampak Samping
- Ruang Tamu
- Kamar Tidur
- Dapur
- Kamar Mandi

**Path:**

- `households/YYYY/MM/[unique_id]/photo_[n].jpg`

## Statistik Data

Setelah seeder berjalan, Anda akan mendapatkan:

```
Total Households: 50
├── RLH (Layak Huni): ~30 (60%)
├── RTLH (Tidak Layak): ~20 (40%)
├── MBR: ~35 (70%)
└── NON_MBR: ~15 (30%)

By Location:
├── DKI Jakarta: 10
├── Jawa Barat: 10
├── Jawa Tengah: 10
├── Jawa Timur: 10
└── Bali: 10

Ownership:
├── Milik Sendiri (OWN): ~17 (33%)
├── Sewa (RENT): ~17 (33%)
└── Lainnya (OTHER): ~16 (33%)

Assistances:
├── Total: ~15
├── Status SELESAI: ~8
├── Status PROSES: ~4
└── Status DIBATALKAN: ~3

Photos:
├── Households with photos: ~25 (50%)
└── Total photos: ~100 (2-5 per household)
```

## Verifikasi Data

### 1. Check di Database

```bash
# Connect ke SQLite
sqlite3 database/database.sqlite

# Count records
SELECT COUNT(*) FROM households;
SELECT COUNT(*) FROM household_technical_data;
SELECT COUNT(*) FROM household_members;
SELECT COUNT(*) FROM household_scores;
SELECT COUNT(*) FROM house_assistances;
SELECT COUNT(*) FROM household_photos;
```

### 2. Check via Tinker

```bash
php artisan tinker

# Count records
\App\Models\Household::count();
\App\Models\HouseholdTechnicalData::count();
\App\Models\HouseholdMember::count();

# Get sample household with relations
$household = \App\Models\Household::with(['technicalData', 'members', 'score', 'assistances', 'photos'])->first();
$household->toArray();
```

### 3. Check via Browser

Akses aplikasi dan cek:

- `/households` - List households (harus ada 50 records)
- `/households/1` - Detail household pertama
- Stats cards harus menunjukkan:
    - Total: 50
    - RLH: ~30
    - RTLH: ~20

## Troubleshooting

### Error: "Class 'HouseholdSeeder' not found"

```bash
# Regenerate autoload
composer dump-autoload
```

### Error: Foreign Key Constraint

```bash
# Reset database properly
php artisan migrate:fresh
php artisan db:seed
```

### Error: Memory Limit

Jika terjadi memory limit (unlikely dengan 50 records):

```bash
# Increase memory limit
php -d memory_limit=512M artisan db:seed
```

### Ingin Generate Lebih Banyak Data

Edit `database/seeders/HouseholdSeeder.php`:

```php
// Line 129: Change loop count
for ($i = 0; $i < 50; $i++) {  // Change 50 to desired number
```

**Note**: Untuk data lebih dari 100, consider chunking untuk performa.

## Reset & Re-seed

```bash
# Full reset
php artisan migrate:fresh --seed

# Atau step by step
php artisan migrate:fresh
php artisan db:seed --class=HouseholdSeeder
```

## Data untuk Testing

Seeder ini perfect untuk:

- ✅ Development & testing UI
- ✅ Testing fitur search & filter
- ✅ Testing pagination
- ✅ Testing relationship queries
- ✅ Demo ke client
- ✅ Load testing (dengan adjust jumlah)

## Next Steps

Setelah data ter-seed:

1. **Test List Page**: Buka `/households`
2. **Test Detail Page**: Klik salah satu household
3. **Test Search**: Cari nama/alamat
4. **Test Actions**: Edit, Delete
5. **Test Filters**: By wilayah, status, dll

Happy Testing! 🚀
