# Implementasi Households dengan Inertia.js

## Overview

Sistem households telah diimplementasikan lengkap dengan Laravel backend + Inertia.js frontend sesuai desain Figma. Sistem ini mengelola data rumah tangga lengkap dengan data teknis, anggota keluarga, dan bantuan yang diterima.

## Struktur File

### Backend (Laravel)

```
app/
├── Http/
│   └── Controllers/
│       └── HouseholdController.php       # Main controller untuk households
├── Models/
│   ├── Household.php                     # Model utama
│   ├── HouseholdTechnicalData.php        # Data teknis bangunan
│   ├── HouseholdMember.php               # Anggota keluarga
│   ├── HouseAssistance.php               # Bantuan yang diterima
│   ├── HouseholdScore.php                # Skor kelayakan
│   └── HouseholdPhoto.php                # Foto rumah
```

### Frontend (React + TypeScript)

```
resources/js/
├── pages/
│   ├── households.tsx                    # List halaman rumah (table view)
│   └── households/
│       └── detail-households.tsx         # Detail rumah (tabs view)
├── components/
│   ├── household/
│   │   ├── info-section.tsx             # Reusable info section
│   │   ├── section-header.tsx           # Reusable section header
│   │   ├── stats-card.tsx               # Reusable stats card
│   │   ├── boolean-badge.tsx            # Badge untuk true/false
│   │   ├── map-component.tsx            # Leaflet map
│   │   └── map-tab.tsx                  # Tab lokasi peta
│   └── ui/                               # Shadcn components
└── types/
    └── household.ts                      # TypeScript types
```

## Routes

```php
// routes/web.php
Route::get('households', [HouseholdController::class, 'index'])->name('households.index');
Route::get('households/create', [HouseholdController::class, 'create'])->name('households.create');
Route::get('households/{id}', [HouseholdController::class, 'show'])->name('households.show');
Route::get('households/{id}/edit', [HouseholdController::class, 'edit'])->name('households.edit');
Route::post('households', [HouseholdController::class, 'store'])->name('households.store');
Route::put('households/{id}', [HouseholdController::class, 'update'])->name('households.update');
Route::delete('households/{id}', [HouseholdController::class, 'destroy'])->name('households.destroy');
```

## Controller Methods

### `index()`

Menampilkan daftar rumah dengan statistik:

- Total rumah
- Jumlah RLH (Rumah Layak Huni)
- Jumlah RTLH (Rumah Tidak Layak Huni)

**Props yang dikirim:**

```typescript
{
    households: Household[],
    stats: {
        total: number,
        rlh: number,
        rtlh: number
    }
}
```

### `show($id)`

Menampilkan detail rumah lengkap dengan:

- Data umum (wilayah, penghuni, dll)
- Data teknis (bangunan, air, listrik, sanitasi, sampah)
- Lokasi peta
- Bantuan yang diterima
- Foto-foto

**Props yang dikirim:**

```typescript
{
    household: HouseholdDetail;
}
```

## Komponen Reusable

### 1. InfoSection

Komponen untuk menampilkan informasi dalam bentuk grid key-value pairs.

**Props:**

```typescript
interface InfoSectionProps {
    title: string;
    items: InfoItem[];
    columns?: 1 | 2 | 3 | 4; // Default: 2
    className?: string;
}

interface InfoItem {
    label: string;
    value: string | number | null | undefined;
}
```

**Contoh Penggunaan:**

```tsx
<InfoSection
    title="Informasi Umum"
    columns={2}
    items={[
        { label: 'Id Rumah', value: household.id },
        { label: 'Tanggal Pendataan', value: household.survey_date },
        { label: 'Alamat', value: household.address_text },
    ]}
/>
```

### 2. SectionHeader

Komponen untuk header section dengan title, subtitle, dan optional action button.

**Props:**

```typescript
interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}
```

**Contoh Penggunaan:**

```tsx
<SectionHeader
    title="Bantuan Perbaikan"
    subtitle="Daftar bantuan yang telah diterima"
    action={
        <Button>
            <Plus className="h-4 w-4" />
            Tambah
        </Button>
    }
/>
```

### 3. StatsCard

Komponen untuk menampilkan statistik dengan icon.

**Props:**

```typescript
interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
}
```

**Contoh Penggunaan:**

```tsx
<StatsCard
    title="Rumah"
    value={stats.total}
    icon={Home}
    iconColor="text-[#8B87E8]"
    iconBgColor="bg-[#8B87E8]/10"
/>
```

### 4. BooleanBadge

Komponen untuk menampilkan badge boolean (Ya/Tidak) dengan icon.

**Props:**

```typescript
interface BooleanBadgeProps {
    value: boolean;
    trueLabel?: string; // Default: "Ya"
    falseLabel?: string; // Default: "Tidak"
}
```

**Contoh Penggunaan:**

```tsx
<BooleanBadge
    value={household.technical_data.has_foundation}
    trueLabel="Ada"
    falseLabel="Tidak Ada"
/>
```

## Fitur Utama

### 1. List Households (Table View)

- **Search**: Cari berdasarkan nama, alamat, atau ID
- **Checkbox Selection**: Pilih multiple households
- **Table Sortable**: Kolom bisa di-sort
- **Actions Menu**: Lihat detail, Edit, Hapus
- **Statistics Cards**: Total, RLH, RTLH

### 2. Detail Household (Tabs View)

#### Tab Umum

- Informasi Umum (ID, tanggal, alamat, wilayah)
- Penguasaan Bangunan & Lahan (status kepemilikan, legalitas)
- Data Penghuni (KK, anggota keluarga, pekerjaan, penghasilan)
- Fasilitas Kesehatan & Pendidikan

#### Tab Data Teknis

- **Keteraturan Bangunan**: Akses jalan, hadap jalan, sempadan, dll (Boolean badges)
- **Teknis Bangunan**: Dimensi, struktur, material, kondisi
- **Sumber Air**: Sumber utama, jarak ke septictank, kecukupan
- **Sumber Listrik**: Sumber, daya
- **Limbah/Sanitasi**: Tempat BAB, jenis kloset, pembuangan limbah
- **Pengelolaan Sampah**: Pembuangan, frekuensi pengangkutan

#### Tab Lokasi Peta

- Leaflet map dengan marker lokasi rumah
- Popup dengan info rumah dan koordinat

#### Tab Bantuan

- List bantuan yang diterima
- Detail: Program, sumber dana, biaya, status, deskripsi
- Button tambah bantuan
- Download laporan

## Styling & Design

### Warna Utama

- **Primary Green**: `#B4F233` - Button tambah
- **Purple**: `#8B87E8` - Icon rumah, header detail
- **Green**: `#8AD463` - RLH stats
- **Red**: `#EC6767` - RTLH stats
- **Blue**: `#4A9FFF` - Status badges, bantuan

### Typography

- **Font**: System default (Geist)
- **Heading**: Bold, 3xl untuk page title
- **Body**: Regular untuk content

## Helper Functions

### Format Currency

```typescript
const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};
```

### Label Mapping

```typescript
const getOwnershipLabel = (status: string | null) => {
    const labels: Record<string, string> = {
        OWN: 'Milik Sendiri',
        RENT: 'Sewa',
        OTHER: 'Lainnya',
    };
    return labels[status || ''] || '-';
};
```

## Navigation dengan Inertia

### Link ke Detail

```typescript
router.visit(`/households/${household.id}`);
```

### Kembali ke List

```typescript
router.visit('/households');
```

### Delete dengan Confirmation

```typescript
if (confirm('Apakah Anda yakin ingin menghapus data rumah ini?')) {
    router.delete(`/households/${household.id}`);
}
```

## TypeScript Types

Semua types tersedia di `resources/js/types/household.ts`:

### Types untuk List Page

- `HouseholdListItem` - Data household untuk list/table (dari `HouseholdController@index`)
- `HouseholdStats` - Statistik dashboard (total, rlh, rtlh)

### Types untuk Detail Page

- `Household` - Data utama rumah lengkap
- `HouseholdTechnicalData` - Data teknis (keteraturan, bangunan, air, listrik, sanitasi, sampah)
- `HouseholdMember` - Anggota keluarga
- `HouseAssistance` - Bantuan yang diterima
- `HouseholdPhoto` - Foto rumah
- `HouseholdDetail` - Kombinasi semua data (extends `Household` + relations)

### Contoh Penggunaan

**List Page (`households.tsx`):**

```typescript
import { type HouseholdListItem, type HouseholdStats } from '@/types/household';

interface Props {
    households: HouseholdListItem[];
    stats: HouseholdStats;
}

export default function Households({ households, stats }: Props) {
    // ...
}
```

**Detail Page (`detail-households.tsx`):**

```typescript
import { type HouseholdDetail } from '@/types/household';

interface Props {
    household: HouseholdDetail;
}

export default function HouseholdDetail({ household }: Props) {
    // household.technical_data (HouseholdTechnicalData | null)
    // household.members (HouseholdMember[])
    // household.assistances (HouseAssistance[])
    // household.photos (HouseholdPhoto[])
}
```

## Next Steps

### Implementasi yang Perlu Ditambahkan:

1. **Create Household Page**
    - Form wizard multi-step
    - Validasi client-side & server-side
    - Upload foto

2. **Edit Household Page**
    - Pre-fill form dengan data existing
    - Update data

3. **Store & Update Methods**
    - Validasi lengkap
    - Transaction untuk data relasi
    - Handle file upload

4. **Export/Download**
    - Export ke Excel/PDF
    - Generate laporan

5. **Filters & Advanced Search**
    - Filter by wilayah (provinsi, kab/kota, kecamatan, desa)
    - Filter by status kelayakan
    - Filter by status kepemilikan
    - Date range

6. **Pagination**
    - Server-side pagination
    - Per page selection

## Testing

Untuk testing, gunakan data mock atau seed database dengan:

```bash
php artisan db:seed --class=HouseholdSeeder
```

## Dependencies

### Backend

- Laravel 11+
- Inertia.js Laravel Adapter

### Frontend

- React 18+
- TypeScript
- Inertia.js React Adapter
- Leaflet (untuk maps)
- Shadcn UI Components
- Lucide React (icons)

## Troubleshooting

### Map tidak muncul

Pastikan Leaflet CSS di-import di `map-component.tsx`:

```typescript
import 'leaflet/dist/leaflet.css';
```

### TypeScript errors

Pastikan semua types sudah di-import dari `@/types/household`

### Inertia props tidak muncul

Check di browser DevTools > Network > Response untuk melihat data yang dikirim dari controller

## Referensi

- [Inertia.js Documentation](https://inertiajs.com)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [Leaflet Documentation](https://leafletjs.com)
