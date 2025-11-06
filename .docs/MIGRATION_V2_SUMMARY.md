# Ringkasan Migrasi ke Schema V2

## Perubahan Database

### Tabel Baru

1. **`household_technical_data`** - Menggabungkan semua data teknis (A.1-A.5) yang sebelumnya terpisah
2. **`household_members`** - Data detail penghuni (terpisah dari ringkasan di `households`)
3. **`household_photos`** - Foto-foto rumah tangga

### Tabel yang Diperbarui

1. **`households`** - Menambahkan field baru sesuai SCHEMA_DB_V2.md:
    - `main_occupation`, `health_facility_used`, `health_facility_location`, `education_facility_location`
    - `habitability_status`, `eligibility_score_total`, `eligibility_computed_at`
    - Menghapus: `location_json`, `nearest_psu_json`, `area_survey_id`, `electricity_connected`

2. **`household_scores`** - Diperbarui dengan field baru:
    - `score_a2_structure` (mengganti `score_a2_roof_wall_floor`)
    - `total_score`, `habitability_status`, `computation_notes`

3. **`house_assistances`** - Menambahkan field `program`

### Tabel yang Dihapus

- `house_structure_scores` → digabung ke `household_technical_data`
- `water_accesses` → digabung ke `household_technical_data`
- `sanitatons` → digabung ke `household_technical_data`
- `waste_managements` → digabung ke `household_technical_data`
- `household_non_physicals` → data pindah ke `households`
- `house_physical_details` → digabung ke `household_technical_data`
- `land_details` → tidak ada di V2 (opsional untuk fitur lain)
- `house_eligibilities` → digabung ke `households` dan `household_scores`
- `relocation_histories` → tidak ada di V2 (opsional untuk fitur lain)

## Model Baru

1. **`HouseholdTechnicalData`** - Model untuk data teknis (A.1-A.5)
2. **`HouseholdMember`** - Model untuk data penghuni detail
3. **`HouseholdPhoto`** - Model untuk foto rumah tangga

## Model yang Diperbarui

1. **`Household`** - Relasi baru:
    - `technicalData()` - HasOne HouseholdTechnicalData
    - `members()` - HasMany HouseholdMember
    - `photos()` - HasMany HouseholdPhoto
    - Menghapus relasi lama: `structureScore()`, `waterAccess()`, `sanitaton()`, `wasteManagement()`, `nonPhysical()`, `physicalDetail()`, `landDetail()`, `eligibility()`, `relocationAssessments()`

2. **`HouseholdScore`** - Field baru sesuai schema V2

3. **`HouseAssistance`** - Menambahkan field `program`

## Model yang Obsolete (Belum Dihapus)

Model-model berikut masih ada di `app/Models/` tapi tidak digunakan lagi dalam schema V2:

- `HouseStructureScore` → gunakan `HouseholdTechnicalData`
- `WaterAccess` → gunakan `HouseholdTechnicalData`
- `Sanitaton` → gunakan `HouseholdTechnicalData`
- `WasteManagement` → gunakan `HouseholdTechnicalData`
- `HouseholdNonPhysical` → data pindah ke `Household`
- `HousePhysicalDetail` → gunakan `HouseholdTechnicalData`
- `HouseEligibility` → data pindah ke `Household` dan `HouseholdScore`

**Catatan**: Model-model ini bisa dihapus setelah memastikan tidak ada referensi di controllers atau file lain.

## Cara Menjalankan Migrasi

```bash
# Reset database dan jalankan semua migrasi
php artisan migrate:fresh

# Atau jalankan migrasi V2 saja (akan drop tabel lama)
php artisan migrate --path=database/migrations/2025_01_15_000000_reset_household_schema_v2.php
```

## Mapping Data dari Schema Lama ke V2

### Dari `house_structure_scores` → `household_technical_data`

- `a1_access_to_road` → `has_road_access`
- `a1_facade_width_category` → `road_width_category`
- `a1_facade_faces_road` → `facade_faces_road`
- `a1_faces_waterbody` → `faces_waterbody` (perlu konversi dari NONE|YES|NO ke boolean)
- `a1_in_setback` → `in_setback_area` (perlu konversi dari NONE|YES|NO ke boolean)
- `a1_hazard_area` → `in_hazard_area`
- `a2_length_m` → `building_length_m`
- `a2_width_m` → `building_width_m`
- `a2_floors` → `floor_count`
- `a2_area_m2` → `building_area_m2`
- `a2_m2_per_person` → `area_per_person_m2`
- `a2_roof_condition` → `roof_condition`
- `a2_wall_condition` → `wall_condition`
- `a2_floor_type` → `floor_condition` (NON_SOIL → LAYAK, SOIL → TIDAK_LAYAK)

### Dari `water_accesses` → `household_technical_data`

- `source` → `water_source`
- `distance_to_septic` → `water_distance_category` (sudah kategori)
- `water_fulfillment` → `water_fulfillment`

### Dari `sanitatons` → `household_technical_data`

- `defecation_place` → `defecation_place`
- `toilet_type` → `toilet_type`
- `sewage_disposal` → `sewage_disposal`

### Dari `waste_managements` → `household_technical_data`

- `disposal_place` → `waste_disposal_place`
- `collection_frequency` → `waste_collection_frequency`

### Dari `household_non_physicals` → `households`

- `main_occupation` → `main_occupation`
- Data listrik pindah ke `household_technical_data` (`electricity_source`, `electricity_power_watt`, `electricity_connected`)

## Field Baru yang Perlu Diisi

Berdasarkan `ANALYSIS_HOUSEHOLD_SCORE_GAPS.md`, field berikut perlu ditambahkan/diperbaiki di UI:

1. **A.1 Keteraturan Bangunan:**
    - `road_width_category` (LE1_5|EQ1_5|GT1_5) - dropdown kategori lebar jalan
    - Field boolean untuk `waterbody_exists` dan `setback_exists` (bisa dihitung dari data)

2. **A.3 Akses Air:**
    - `water_distance_to_septic_m` - input numeric (meter)
    - `water_distance_category` - auto-calculate dari jarak
    - `water_fulfillment` - enum (ALWAYS|SEASONAL|NEVER)

3. **A.4 & A.5:**
    - Pastikan semua enum sesuai dengan schema V2
