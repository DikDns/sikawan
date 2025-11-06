Ini semua di bahasa indonesia tapi di model dan db nanti ke bahasa inggris!
dan hasil meet itu untuk data admin_areas gak akan di simpen di db, hanya akan di ambil dari api open source

household

- have multiple photos

# Tab Umum

## Informasi Umum

- id
- alamat
- tanggal pendataan
- provinsi
- kota/kabupaten
- desa/kelurahan
- kecamatan

## Penguasaan Bangunan & Lahan

- status hunian bangunan
- status lahan hunian
- legalitas bangunan
- legalitas lahan

## Data penghuni (ini nanti menjadi tabel terpisah)

- nama kepala keluarga (name aja kalau dipisah)
- nik
- pekerjaan utama
- penghasilan
- status rumah tangga (MBR/NON_MBR)
- jumlah kk
- anggota laki-laki
- anggota perempuan
- anggota difabel
- total jiwa
- fasilitas kesehatan yang digunakan
- lokasi fasilitas kesehatan (string)
- lokasi fasilitas pendidikan (string)

# Tab Data Teknis

## Keteraturan Bangunan

Akses jalan <1,5 m (boolean)
Hadap jalan <1,5 m (boolean)
Akses Jalan >1,5 m (boolean)
Hadap Jalan >1,5 m (boolean)
Menghadap Sempadan (boolean)
Diatas Sempadan (boolean)
Daerah Limbah/ Dibawah jalur Listrik Tegangan Tinggi (boolean)

## Teknis Bangunan

Panjang Bangunan (numeric)
Lebar Bangunan (numeric)
Jumlah Lantai (numeric)
Ketinggian perlantai (numeric)
Luas Bangunan (numeric)
Luas Lantai Bangunan/ jiwa (numeric)
Pondasi (boolean)
Sloof (boolean)
Ring Balok (boolean)
Struktur Atap (boolean)
Tiang Kolom (boolean)
Material Atap (string)
Kondisi Atap (string)
Material Dinding (string)
Kondisi Dinding (string)
Material Lantai (string)
Kondisi Lantai (string)

## Sumber Air

Sumber Utama (string?)
Jarak sumber air ke penampung tinja/kotoran terdekat (numeric?)
kecukupan air pertahun (boolean? tercukupi/tidak tercukupi)

## Sumber Listrik

Sumber Utama (string?)
Daya Listrik (numeric?)

## Limbah/Sanitasi

Tempat Buang Air Besar (string?)
Jenis Kloset (string?)
Pembuangan Limbah (string?)

## Pengelolaan Sampah

Pembuangan Sampah (string?)
Pengangkutan Sampah (string?)

# Tab Lokasi Peta

- latitude
- longitude

# Tab Bantuan

Tanggal Penanganan
Tanggal selesai
program (string)
sumber dana (string)
status (string)
biaya (numeric)
deskripsi (string)
dokumen (string)
