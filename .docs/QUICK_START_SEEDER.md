# Quick Start: Household Seeder

## 🚀 Run Seeder (Recommended)

```bash
# Reset database & seed semua data (RECOMMENDED)
php artisan migrate:fresh --seed
```

Ini akan:

1. ✅ Drop semua tables
2. ✅ Run semua migrations (create tables)
3. ✅ Seed 1 user (superadmin@sikawan.com)
4. ✅ Seed 50 households dengan semua data terkait (~400+ records)

## 📊 Data yang Dibuat

```
50 Households
├── 50 Technical Data
├── 175 Members (2-5 per household)
├── 50 Scores
├── 15 Assistances (30% households)
└── 100 Photos (50% households, 2-5 each)

Total: ~400+ records
```

## ✅ Verifikasi

### Via Browser

```
http://localhost/households
```

Harus muncul:

- Total Rumah: **50**
- RLH: **~30**
- RTLH: **~20**

### Via Tinker

```bash
php artisan tinker

>>> \App\Models\Household::count()
=> 50

>>> \App\Models\Household::with('technicalData')->first()
=> App\Models\Household {...}
```

### Via SQLite

```bash
sqlite3 database/database.sqlite "SELECT COUNT(*) FROM households"
```

## 🔄 Re-seed (Jika Perlu)

```bash
# Full reset
php artisan migrate:fresh --seed

# Atau hanya households
php artisan db:seed --class=HouseholdSeeder
```

## 📝 Data Sample

**Wilayah:**

- Jakarta, Bandung, Semarang, Surabaya, Denpasar

**Status:**

- 70% MBR
- 60% RLH (Layak Huni)
- 30% mendapat bantuan

**Variasi:**

- Berbagai jenis kepemilikan (OWN/RENT/OTHER)
- Berbagai kondisi bangunan
- Berbagai sumber air & listrik
- Anggota keluarga 2-7 orang

## 🎯 Next Steps

1. ✅ Run seeder
2. ✅ Akses `/households`
3. ✅ Test search & filter
4. ✅ Klik detail household
5. ✅ Test semua tabs (Umum, Teknis, Peta, Bantuan)

## 💡 Tips

- Data di-generate random tapi realistis
- Koordinat GPS di-generate sekitar wilayah yang dipilih
- NIK & ID unik untuk setiap record
- Tanggal survey dalam 1 tahun terakhir

## 🐛 Troubleshooting

**Error: Class not found**

```bash
composer dump-autoload
```

**Error: Foreign key**

```bash
php artisan migrate:fresh --seed
```

Untuk detail lengkap, lihat: `.docs/SEEDER_GUIDE.md`
