## Urutan Prioritas (Termudah → Tersulit)

1) Sangat Mudah
- (15) Nonaktifkan register di login; tambah user via admin
- (1) Kartu/statistik dashboard bisa diklik ke halaman terkait
- (9) Backlog Kelayakan di dashboard = `jumlah rumah - RTLH`
- (8) Backlog Kepemilikan di dashboard = `jumlah KK - jumlah rumah`
- (11) Tampilkan data rumah per kawasan (list berdasarkan `area_id`)

2) Mudah
- (3) Filter Rumah per desa/kecamatan (UI + query)
- (4) Filter Kawasan per desa/kecamatan (UI + query)
- (5) Filter PSU per desa/kecamatan (UI + query)
- (12) Input koordinat rumah (pakai map-picker & validasi)
- (2) Perbaiki bug foto rumah tidak muncul (konfigurasi storage & render)

3) Sedang
- (6) Tambahkan total luasan kawasan kumuh di dashboard (agregasi area)
- (7) Tambahkan jumlah pemukiman dalam kawasan kumuh di dashboard (agregasi hitung)
- (16) Log activity ditulis dengan bahasa pengguna (templating event)
- (13) Tag Kawasan: tambah kolom titik koordinat (lat/lng)
- (14) Tag PSU: tambah kolom titik koordinat (lat/lng)

4) Sulit
- (17) Menu Settings untuk approval penambahan data (workflow, status, policy)
- (18) Poligon kawasan tergambar langsung dari koordinat yang diinput (render polygon + validasi)

5) Paling Sulit
- (10) Fitur Import + Preview sebelum submit (CSV/XLS, mapping, validasi, commit)

## Ketergantungan Teknis
- (11) bergantung pada relasi `households.area_id` (sudah ada migrasi 2025-11-28)
- (6) akurat bila (18) sudah menyimpan poligon; jika belum, sementara gunakan field luas manual
- (7) butuh penanda kaw. kumuh pada Area/AreaGroup/Level; asumsi: ada flag/level yang menandai "kumuh"
- (18) lebih baik setelah (13) tersedia struktur koordinat; untuk poligon, perlu menyimpan multi-koordinat (array) atau GeoJSON
- (2) kemungkinan terkait `storage:link`, disk `public`, path media di FE; tidak menghambat item lain

## Pendekatan Implementasi (Laravel + Inertia + React)
- Routing: hanya `routes/web.php`; semua navigasi via Inertia Link/visit
- Props: semua data page lewat Inertia::render + Resource/Collection (hindari API khusus)
- Validasi: Form Request untuk semua input/filter kompleks
- UI: gunakan komponen React yang sudah ada (map, table, filters) + Tailwind

## Batch Eksekusi
- Batch 1 (Quick Wins): 15, 1, 9, 8, 11
- Batch 2 (Filters + Koordinat + Foto): 3, 4, 5, 12, 2
- Batch 3 (Agregasi Dashboard + Log + Koordinat Tag): 6, 7, 16, 13, 14
- Batch 4 (Workflow & Geometri): 17, 18
- Batch 5 (Import + Preview): 10

## Kriteria Sukses & Verifikasi
- Dashboard: setiap kartu dapat diklik dan membuka halaman dengan filter tepat
- Foto Rumah: setelah upload, foto tampil di detail dan daftar, link publik valid
- Filter: perubahan desa/kecamatan menyaring tabel, URL menampung query (untuk berbagi tautan)
- Koordinat: form input koordinat tervalidasi, tersimpan, dan ditampilkan di peta
- Agregasi: angka dashboard konsisten dengan data sumber; tersedia unit test agregasi
- Log: deskripsi aksi terbaca awam (create/update/delete) dengan objek dan perubahan kunci
- Approval: status "pending/approved/rejected" berjalan dengan policy dan UI settings
- Polygon: koordinat membentuk poligon valid; peta merender tepat tanpa error
- Import: file diperiksa, preview menampilkan mapping dan error; commit hanya jika valid

## Asumsi
- Penanda kawasan kumuh tersedia via Level/AreaGroup atau flag di `areas`
- Komponen peta sudah ada (`map.tsx`, `map-location-step`) dan bisa diperluas
- Media disimpan di disk `public` dan diakses via symlink `storage`

Mohon konfirmasi apakah urutan prioritas dan batch eksekusi di atas sudah sesuai. Setelah konfirmasi, saya mulai dari Batch 1 dan melakukan perubahan terverifikasi satu per satu.