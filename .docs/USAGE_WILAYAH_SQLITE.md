# Panduan Penggunaan Package SQLite Wilayah Indonesia

## Instalasi

```bash
composer require maftuhichsan/sqlite-wilayah-indonesia
```

## Lokasi Database

Setelah instalasi, database SQLite berada di:

```
vendor/maftuhichsan/sqlite-wilayah-indonesia/database/records.sqlite
```

## Struktur Database

Package ini menyediakan database SQLite dengan tabel-tabel berikut:

### 1. `provinces` - Data Provinsi

- `province_code` (VARCHAR) - Kode provinsi (contoh: "31")
- `province_name` (VARCHAR) - Nama provinsi (contoh: "DKI JAKARTA")

### 2. `cities` - Data Kabupaten/Kota

- `city_code` (VARCHAR) - Kode kab/kota (contoh: "3171")
- `city_name` (VARCHAR) - Nama kab/kota (contoh: "KOTA JAKARTA SELATAN")
- `city_province_code` (VARCHAR) - Kode provinsi (FK ke `provinces.province_code`)

### 3. `sub_districts` - Data Kecamatan

- `sub_district_code` (VARCHAR) - Kode kecamatan (contoh: "3171020")
- `sub_district_name` (VARCHAR) - Nama kecamatan (contoh: "KEBAYORAN BARU")
- `sub_district_city_code` (VARCHAR) - Kode kab/kota (FK ke `cities.city_code`)

### 4. `villages` - Data Desa/Kelurahan

- `village_code` (VARCHAR) - Kode desa/kelurahan (contoh: "3171020001")
- `village_name` (VARCHAR) - Nama desa/kelurahan (contoh: "SENAYAN")
- `village_sub_district_code` (VARCHAR) - Kode kecamatan (FK ke `sub_districts.sub_district_code`)

## Penggunaan di Laravel

### 1. Setup Connection Database SQLite Wilayah

Tambahkan connection baru di `config/database.php`:

```php
'connections' => [
    // ... existing connections

    'wilayah' => [
        'driver' => 'sqlite',
        'database' => base_path('vendor/maftuhichsan/sqlite-wilayah-indonesia/database/records.sqlite'),
        'prefix' => '',
        'foreign_key_constraints' => true,
    ],
],
```

### 2. Buat Model untuk Tabel Wilayah (Opsional)

#### Model Province

```php
// app/Models/Wilayah/Province.php
namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $connection = 'wilayah';
    protected $table = 'provinces';
    protected $primaryKey = 'province_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['province_code', 'province_name'];
}
```

#### Model City

```php
// app/Models/Wilayah/City.php
namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $connection = 'wilayah';
    protected $table = 'cities';
    protected $primaryKey = 'city_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['city_code', 'city_name', 'city_province_code'];

    public function province()
    {
        return $this->belongsTo(Province::class, 'city_province_code', 'province_code');
    }
}
```

#### Model SubDistrict

```php
// app/Models/Wilayah/SubDistrict.php
namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Model;

class SubDistrict extends Model
{
    protected $connection = 'wilayah';
    protected $table = 'sub_districts';
    protected $primaryKey = 'sub_district_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['sub_district_code', 'sub_district_name', 'sub_district_city_code'];

    public function city()
    {
        return $this->belongsTo(City::class, 'sub_district_city_code', 'city_code');
    }
}
```

#### Model Village

```php
// app/Models/Wilayah/Village.php
namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    protected $connection = 'wilayah';
    protected $table = 'villages';
    protected $primaryKey = 'village_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['village_code', 'village_name', 'village_sub_district_code'];

    public function subDistrict()
    {
        return $this->belongsTo(SubDistrict::class, 'village_sub_district_code', 'sub_district_code');
    }
}
```

### 3. Query Data Wilayah

#### Mengambil Semua Provinsi

```php
use App\Models\Wilayah\Province;

$provinces = Province::orderBy('province_name')->get();
// atau menggunakan DB facade
$provinces = DB::connection('wilayah')
    ->table('provinces')
    ->orderBy('province_name')
    ->get();
```

#### Mengambil Kab/Kota berdasarkan Provinsi

```php
use App\Models\Wilayah\City;

$cities = City::where('city_province_code', '31')
    ->orderBy('city_name')
    ->get();
```

#### Mengambil Kecamatan berdasarkan Kab/Kota

```php
use App\Models\Wilayah\SubDistrict;

$subDistricts = SubDistrict::where('sub_district_city_code', '3171')
    ->orderBy('sub_district_name')
    ->get();
```

#### Mengambil Desa/Kelurahan berdasarkan Kecamatan

```php
use App\Models\Wilayah\Village;

$villages = Village::where('village_sub_district_code', '3171020')
    ->orderBy('village_name')
    ->get();
```

### 4. Menyimpan Data Wilayah ke Household

Saat menyimpan data household, simpan code dan nama dari package SQLite:

```php
use App\Models\Household;
use App\Models\Wilayah\Province;
use App\Models\Wilayah\City;
use App\Models\Wilayah\SubDistrict;
use App\Models\Wilayah\Village;

// Ambil data dari package SQLite
$province = Province::find('31');
$city = City::find('3171');
$subDistrict = SubDistrict::find('3171020');
$village = Village::find('3171020001');

// Simpan ke household
Household::create([
    'province_id' => $province->province_code,
    'province_name' => $province->province_name,
    'regency_id' => $city->city_code,
    'regency_name' => $city->city_name,
    'district_id' => $subDistrict->sub_district_code,
    'district_name' => $subDistrict->sub_district_name,
    'village_id' => $village->village_code,
    'village_name' => $village->village_name,
    // ... field lainnya
]);
```

### 5. Validasi Data Wilayah

Pastikan data wilayah yang dipilih valid dengan memeriksa relasi hierarkis:

```php
use App\Models\Wilayah\City;
use App\Models\Wilayah\SubDistrict;
use App\Models\Wilayah\Village;

// Validasi: pastikan city_code sesuai dengan province_code
$city = City::where('city_code', $regencyId)
    ->where('city_province_code', $provinceId)
    ->first();

if (!$city) {
    throw new \Exception('Kota/Kabupaten tidak sesuai dengan Provinsi yang dipilih');
}

// Validasi: pastikan sub_district_code sesuai dengan city_code
$subDistrict = SubDistrict::where('sub_district_code', $districtId)
    ->where('sub_district_city_code', $regencyId)
    ->first();

if (!$subDistrict) {
    throw new \Exception('Kecamatan tidak sesuai dengan Kota/Kabupaten yang dipilih');
}

// Validasi: pastikan village_code sesuai dengan sub_district_code
$village = Village::where('village_code', $villageId)
    ->where('village_sub_district_code', $districtId)
    ->first();

if (!$village) {
    throw new \Exception('Desa/Kelurahan tidak sesuai dengan Kecamatan yang dipilih');
}
```

## Mapping Field di Household

| Field Household | Field Package SQLite | Tabel           |
| --------------- | -------------------- | --------------- |
| `province_id`   | `province_code`      | `provinces`     |
| `province_name` | `province_name`      | `provinces`     |
| `regency_id`    | `city_code`          | `cities`        |
| `regency_name`  | `city_name`          | `cities`        |
| `district_id`   | `sub_district_code`  | `sub_districts` |
| `district_name` | `sub_district_name`  | `sub_districts` |
| `village_id`    | `village_code`       | `villages`      |
| `village_name`  | `village_name`       | `villages`      |

## Catatan Penting

1. **Primary Key**: Semua tabel menggunakan string code sebagai primary key, bukan auto-increment integer
2. **Connection Terpisah**: Database wilayah menggunakan connection terpisah (`wilayah`) dari database utama aplikasi
3. **Read-Only**: Database package bersifat read-only, jangan melakukan insert/update/delete
4. **Update Package**: Update package secara berkala untuk mendapatkan data wilayah terbaru
5. **Ukuran Database**: Database SQLite relatif kecil dan cepat untuk query

## Referensi

- Package: https://packagist.org/packages/maftuhichsan/sqlite-wilayah-indonesia
- GitHub: https://github.com/maftuhichsan/sqlite-wilayah-indonesia
- Docker Hub: https://hub.docker.com/r/maftuh23/sqlite-wilayah-indonesia
- NPM: https://www.npmjs.com/package/sqlite-wilayah-indonesia
