# Panduan Pengguna Aplikasi Si-Kawan

**Versi Dokumen:** 1.0
**Tanggal:** 26 November 2024
**Ditujukan untuk:** Staff Mitra & Pengguna Non-Teknis

---

## Daftar Isi

1. [Pengantar](#pengantar)
2. [Fitur Utama Aplikasi](#fitur-utama-aplikasi)
3. [Panduan Visual Alur Kerja](#panduan-visual-alur-kerja)
4. [Troubleshooting Dasar](#troubleshooting-dasar)
5. [Tips & Best Practices](#tips--best-practices)
6. [FAQ (Tanya Jawab)](#faq-tanya-jawab)

---

## Pengantar

Selamat datang di **Si-Kawan** (Sistem Informasi Perumahan & Kawasan Pemukiman). Aplikasi ini dirancang untuk memudahkan pendataan, pemantauan, dan pelaporan kondisi perumahan serta prasarana, sarana, dan utilitas (PSU).

Tujuan utama aplikasi ini adalah:

- **Digitalisasi Data:** Mengubah catatan manual menjadi data digital yang aman dan mudah diakses.
- **Pemetaan Wilayah:** Memvisualisasikan sebaran rumah layak huni dan tidak layak huni dalam peta interaktif.
- **Pelaporan Cepat:** Menghasilkan laporan otomatis untuk kebutuhan administrasi dan pengambilan keputusan.

Panduan ini disusun khusus untuk pengguna agar dapat menggunakan aplikasi Si-Kawan dengan lancar dan efektif.

---

## Fitur Utama Aplikasi

Berikut adalah fitur-fitur utama yang akan sering digunakan:

### 1. Dashboard (Beranda)

Halaman pertama yang muncul setelah login. Dashboard memberikan gambaran cepat mengenai situasi terkini.

- **Kartu Statistik:** Menampilkan angka total rumah, rumah layak huni (RLH), dan tidak layak huni (RTLH).
- **Grafik Analisis:** Visualisasi tren data perumahan dan kondisi ekonomi warga.
- **Ringkasan Wilayah:** Tabel ringkas yang menunjukkan data per kecamatan atau desa.

### 2. Data Rumah (Households)

Pusat pengelolaan data rumah tangga.

- **Daftar Rumah:** Melihat seluruh data rumah yang telah diinput.
- **Input Data Bertahap:** Formulir pengisian data yang dibagi menjadi 5 langkah mudah (Foto, Info Umum, Data Teknis, Peta, Bantuan) agar tidak membingungkan.
- **Status Kelayakan:** Sistem otomatis menandai apakah rumah termasuk RLH atau RTLH berdasarkan data teknis yang diinput.

### 3. Peta Sebaran (Distribution Map)

Fitur visualisasi geografis.

- **Peta Interaktif:** Melihat lokasi rumah di atas peta digital.
- **Kode Warna:**
    - 🟢 **Hijau:** Rumah Layak Huni (RLH)
    - 🔴 **Merah:** Rumah Tidak Layak Huni (RTLH)
- **Detail Cepat:** Klik pada ikon rumah di peta untuk melihat info singkat pemilik dan alamat.

### 11. Halaman Landing Publik (Welcome)

Halaman publik tanpa login yang menjadi pintu masuk utama aplikasi.

- **Navigasi Cepat:** Tersedia menu `Home`, `Peta Sebaran`, dan `Login` di header.
- **Aksi Utama:** Tombol "Jelajahi Peta" mengarahkan ke halaman peta sebaran publik.
- **Konten Visual:** Bagian hero dengan logo dan gambar kawasan untuk memperkenalkan aplikasi.
- **Form Pesan:** Pengunjung dapat mengirim masukan melalui form kontak (Nama, Email, Subjek, Pesan).
- **Akses:** Buka alamat utama aplikasi (`/`) untuk mengakses landing page.

### 12. Peta Sebaran Publik

Halaman peta yang dapat diakses tanpa login untuk melihat sebaran data.

- **Navigasi:** Header menyediakan link `Home` dan `Login` agar pengguna bisa kembali atau masuk.
- **Filter & Pencarian:** Panel di kanan atas berisi:
    - **Cari:** Menyaring berdasarkan nama/alamat rumah atau nama kawasan/PSU.
    - **Toggle Layer:** Menyalakan/mematikan tampilan `Rumah`, `Kawasan`, dan `PSU`.
- **Warna & Ikon:**
    - **Rumah:** RLH (Hijau), RTLH (Merah) dengan ikon `Home`.
    - **Kawasan:** Warna mengikuti `Warna Legenda` yang ditetapkan pada Kelompok Kawasan.
    - **PSU:** Ikon sesuai kategori (mis. `Hospital`, `GraduationCap`, `Zap`, `Droplet`, `Trash2`, `Building2`) dengan warna legenda.
- **Interaksi Peta:** Klik area atau marker untuk melihat popup informasi singkat.
- **Penyegaran Data:** Data diperbarui otomatis setiap ±60 detik.

### 4. Data PSU (Infrastruktur)

Manajemen data Prasarana, Sarana, dan Utilitas umum.

- **Kategori Lengkap:** Mencakup Kesehatan, Pendidikan, Listrik, Air Bersih, Drainase, Sampah, dan lainnya.
- **Tipe Data:** Mendukung titik lokasi (seperti bangunan sekolah) maupun jaringan (seperti jalur pipa air atau jalan).

### 5. Manajemen Kawasan (Area Management)

Menu untuk mengelola data kawasan atau zona khusus (misalnya: Kawasan Kumuh, Kawasan Rawan Bencana, dll).

- **Daftar Kawasan:** Menampilkan daftar kelompok kawasan yang ada dengan fitur pencarian dan filter.
- **Tambah Kelompok Kawasan:** Membuat kategori kawasan baru dengan mengisi Nama, Kode, Deskripsi, dan Warna Legenda.
- **Detail & Peta Kawasan:**
    - **Peta Interaktif:** Menggambar area (polygon) langsung di peta untuk menandai wilayah yang masuk dalam kategori tersebut.
    - **Daftar Area:** Melihat dan mengelola daftar area spesifik yang telah digambar.

### 6. Laporan (Reports)

Fitur untuk mencetak dan mengunduh data.

- **Pembuatan Laporan:** Buat laporan baru berdasarkan kategori (Rumah, Kawasan, PSU).
- **Format:** Unduh laporan dalam format PDF atau Excel.
- **Arsip:** Riwayat laporan yang pernah dibuat tersimpan rapi dan bisa diunduh ulang kapan saja.

### 7. Pesan (Messages)

Kotak masuk untuk komunikasi.

- Menerima pesan atau masukan dari masyarakat atau formulir kontak publik.
- Fitur pencarian dan filter untuk memudahkan pengelolaan pesan.

### 8. Pengguna (Users)

Menu untuk mengelola pengguna yang memiliki akses ke aplikasi.

- **Daftar Pengguna:** Melihat seluruh pengguna terdaftar, termasuk peran mereka (Admin, Operator, dll).
- **Tambah Pengguna:** Mendaftarkan pengguna baru dengan mengisi Nama, Email, dan menetapkan Peran (Role).
- **Edit & Hapus:** Mengubah informasi pengguna atau menghapus akun jika sudah tidak aktif.

### 9. Level (Roles & Permissions)

Menu untuk mengatur peran dan hak akses secara mendetail.

- **Manajemen Peran:** Membuat level akses baru (misal: "Surveyor Lapangan", "Koordinator Kecamatan").
- **Pengaturan Hak Akses:** Menentukan fitur apa saja yang bisa diakses oleh setiap level (misal: "Surveyor" hanya bisa input data, tidak bisa menghapus).
- **Fleksibilitas:** Memudahkan pembagian tugas sesuai wewenang masing-masing staff.

### 10. Log Aktivitas (Audit Logs)

Fitur khusus administrator untuk memantau keamanan dan aktivitas sistem.

- **Rekam Jejak:** Mencatat setiap tindakan penting (login, tambah data, hapus laporan) beserta waktu dan pelakunya.
- **Transparansi:** Membantu menelusuri jika terjadi kesalahan input atau perubahan data yang tidak disengaja.
- **Filter:** Mencari riwayat aktivitas berdasarkan nama user, jenis aktivitas, atau rentang tanggal tertentu.

---

## Panduan Visual Alur Kerja

### A. Proses Login

1. Buka alamat website Si-Kawan.
2. Masukkan **Email** dan **Password** Anda.
3. Klik tombol **Login**.
4. _(Jika lupa password)_: Klik "Lupa Password?" untuk mereset kata sandi melalui email.

### B. Menambah Data Rumah Baru

Ini adalah aktivitas yang paling sering dilakukan. Ikuti langkah ini:

1. Masuk ke menu **Rumah** di sidebar kiri.
2. Klik tombol **+ Tambah Rumah** di pojok kanan atas.
3. **Langkah 1: Foto**
    - Upload foto kondisi rumah (Depan, Samping, Dalam).
    - Pastikan foto jelas dan tidak buram.
4. **Langkah 2: Informasi Umum**
    - Isi Nama Kepala Keluarga, NIK, dan Alamat lengkap.
    - Pilih Provinsi, Kabupaten, Kecamatan, dan Desa dari daftar.
5. **Langkah 3: Data Teknis**
    - Isi kondisi atap, dinding, dan lantai.
    - Jawab pertanyaan terkait fasilitas sanitasi dan air.
6. **Langkah 4: Lokasi Peta**
    - Geser pin di peta untuk menandai lokasi rumah yang tepat.
    - Koordinat akan terisi otomatis.
7. **Langkah 5: Bantuan**
    - Catat bantuan yang pernah diterima atau yang dibutuhkan.
8. Klik **Simpan** untuk menyelesaikan.

### C. Membuat Laporan

1. Masuk ke menu **Laporan**.
2. Klik **Buat Laporan**.
3. Isi Judul Laporan dan Deskripsi singkat.
4. Pilih **Tipe Laporan** (misal: Laporan RTLH).
5. Klik **Generate**. Tunggu sebentar hingga status berubah menjadi "Generated".
6. Klik ikon **Download** untuk mengunduh file ke komputer Anda.

---

## Troubleshooting Dasar

Masalah yang sering dihadapi dan cara mengatasinya:

| Masalah                      | Kemungkinan Penyebab           | Solusi                                                                                                   |
| :--------------------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Gagal Login**              | Email/Password salah           | Cek kembali penulisan huruf besar/kecil. Gunakan fitur "Lupa Password" jika perlu.                       |
| **Peta Tidak Muncul**        | Koneksi internet lambat        | Refresh halaman. Pastikan koneksi internet stabil.                                                       |
| **Foto Gagal Upload**        | Ukuran file terlalu besar      | Pastikan ukuran foto di bawah 2MB. Kompres foto jika perlu sebelum upload.                               |
| **Data Tidak Tersimpan**     | Ada kolom wajib yang kosong    | Periksa kembali formulir, biasanya kolom yang belum diisi akan berwarna merah atau ada pesan peringatan. |
| **Tombol Tidak Bisa Diklik** | Proses loading sedang berjalan | Tunggu beberapa detik. Jangan klik tombol berulang-ulang dengan cepat.                                   |

---

## Tips & Best Practices

1. **Simpan Berkala:** Saat mengisi data rumah yang panjang, sistem memiliki fitur _auto-save_ (simpan otomatis) sebagai draft, namun tetap disarankan untuk menyelesaikan input dalam satu sesi agar data tidak tercecer.
2. **Kualitas Foto:** Ambil foto rumah dalam posisi landscape (mendatar) agar tampilan di aplikasi lebih proporsional.
3. **Akurasi Peta:** Saat menandai lokasi rumah, perbesar (zoom) peta semaksimal mungkin untuk mendapatkan titik koordinat yang paling akurat.
4. **Keamanan Akun:** Jangan berikan password Anda kepada orang lain. Selalu **Logout** (Keluar) jika menggunakan komputer umum.
5. **Penamaan Laporan:** Berikan judul laporan yang spesifik, contoh: _"Laporan RTLH Desa Mekarjaya - November 2024"_ agar mudah dicari kembali.

---

## FAQ (Tanya Jawab)

**Q: Apakah saya bisa mengedit data rumah yang sudah disimpan?**
A: Ya, masuk ke menu Rumah, cari nama kepala keluarga, klik tombol Edit (ikon pensil), lakukan perubahan, lalu Simpan.

**Q: Apakah aplikasi ini bisa digunakan di HP?**
A: Si-Kawan berbasis web dan responsif, sehingga bisa dibuka melalui browser di HP atau Tablet. Namun, untuk input data yang banyak, disarankan menggunakan Laptop/PC demi kenyamanan.

**Q: Bagaimana jika saya salah memasukkan lokasi di peta?**
A: Anda bisa mengedit data rumah tersebut, masuk ke langkah "Lokasi Peta", dan geser kembali pin ke lokasi yang benar.

**Q: Siapa yang bisa melihat data yang saya input?**
A: Data hanya bisa dilihat oleh pengguna terdaftar dengan hak akses yang sesuai (Admin dan Surveyor). Data tidak dipublikasikan secara terbuka ke umum kecuali halaman statistik publik (jika ada).
