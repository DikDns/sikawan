Perhatikan konteks aplikasi yang akan gw bangun.
Aplikasi berbasis website ini merupakan ajuan penelitian dari Dosen gw dia bermitra bersama dinas perumahan dan kawasan pemukiman kabupaten muara enim. Berikut ini adalah daftar pertanyaan baseline data 100-0-100 update untuk 19 parameter kumuh. Gw harus mengubah proses manual dari survei yang menggunakan spreadsheet menjadi menggunakan website aplikasi yang gw bikin. Berikut ini catatan dari hasil analisis isi template form spreadsheet survei untuk 19 parameter kumuh.
Lakukan analisis terhadap dokumennya @PENDATAAN BASELINE.md

Setelah itu, ini tambahan konteks dari dosen gw:

- Aplikasinya hanya berbentuk dashboard untuk admin
- Ada fitur penting untuk kawasan menggunakan GIS tech stacknya leaflet dan open street map
- Data datanya dipisah saja (Sesuai intruksi dari dosen dan dia sudah membuat kan UI Admin dashboard dengan pembagian halaman untuk CRUD data berikut ini):
  a. Data Rumah
  Disini data yang penting adalah:
  Nama Kepala Keluarga
  Alamat
  Kelayakan
  Status Kepemilikan
  Disini lengkap sema data tentang rumah dari survei ada disini
- Data teknis
- Lokasi Peta
- Riwayat (Riwayat Bantuan Relokasi Rumah)
  Disini bisa dilihat detail bantuannya juga @FORM RELOKASI RUMAH.md
  b. Data Kawasan
  Untuk detail kawasan kumuh, kawasan pemukiman, kawasan rawan bencana, lokasi prioritas pembangunan
  Disini menggunaan GIS dan polygon untuk CRUD data kawasannya
  c. Data PSU
  Detail psu seperti jalur pipa air, listrik pln, SMA, Rumah sakit,
  Disini untuk detail PIPA air ada GIS nya juga untuk garis" pipanya di CRUD
  d. Data Pesan
  Ini pesan dari pengguna di landing page
  c. Generate Laporan
  gw gatau ini laporan dari mana? kayanya memang pengen ada fitur generate laporan di dashboardnya
  d. Data Pengguna
  CRUD Admin dan Superadmin

Hal pertama yang harus lo lakukan adalah analisis terhadap dokumennya @PENDATAAN BASELINE.md
dan buat hasilnya di @ANALYSIS REPORT.md

Setelah itu, gw akan memberikan intruksi untuk setiap desain UI per halamannya untuk konteks data yang fixnya!
