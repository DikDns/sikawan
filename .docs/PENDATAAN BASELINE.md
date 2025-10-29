Gw sedang membuat digitalisasi untuk dinas perumahan dan kawasan pemukiman kabupaten muara enim.
Berikut ini adalah daftar pertanyaan baseline data 100-0-100 update untuk 19 parameter kumuh.
Gw harus mengubah proses manual dari survei yang menggunakan spreadsheet menjadi menggunakan website aplikasi yang gw bikin.
Berikut ini catatan dari hasil analisis isi template form spreadsheet survei untuk 19 parameter kumuh.

# Sheet 1: Cover

Deskripsi:
Cover adalah sheet pertama yang berisi informasi tentang dokumen survei.
Cuman ada List doang seperti:

- Provinsi
- Kab/Kota
- Kecamatan
- Kelurahan/Desa
- RT/RW

Selain itu, ada juga judul dokumen "Daftar Pertanyaan Baseline Data 100-0-100 Update for 19 Parameter Kumuh" dan footer nama "Kementerian Pekerjaan Umum dan Perumahan Rakyat Direktorat Pengembangan Kawasan Permukiman"

# Sheet 2: DP-RT

Di paling atas dokumen ada judul "FORMAT A. DAFTAR PERTANYAAN RUMAH TANGGA UNTUK PENDATAAN 100-0-100"
Berikut ini adah form yang harus diisi di sheet 2:

## A. Informasi Umum

1. Provinsi
2. Kab/Kota
3. Kelurahan/Desa
4. Tanggal Pendataan
5. Nama Kepala Rumah Tangga: (Ada keterangan: Kosongkan saja tapi di sheet lain itu wajib diisi dan ada NIK-nya)
6. Jumlah Kepala Keluarga: (Per RT)
7. Status Rumah Tangga: (MBR/ NON MBR)
8. Jumlah Anggota Rumah Tangga: (Per jiwa)
   a. Laki-laki: ... (Per RT) ... (Jiwa)
   b. Perempuan: ... (Per RT) ... (Jiwa)
   c. Difabel : ... (Per RT) ... (Jiwa)

## A.1 KETERATURAN BANGUNAN HUNIAN

Deskripsi: Disini diisi informasi tentang keteraturan bangunan hunian. Berikut ini pertanyaan yang harus diisi:
NAMA KEPALA RUMAH TANGGA [KOLOM 2]
NIK [KOLOM 3]

1. Apakah bangunan hunian memiliki AKSES LANGSUNG ke jalan dan tidak terhalang oleh bangunan lain?
   a. Ya [KOLOM 4]
   b. Tidak [KOLOM 5]
2. Apakah POSISI MUKA bangunan hunian menghadap jalan ?
   a. lebar jalan <= 1,5 meter
   i. Ya [KOLOM 6]
   ii. Tidak [KOLOM 7]
   b. lebar jalan == 1,5 meter
   i. Ya [KOLOM 8]
   ii. Tidak [KOLOM 9]
   c. lebar jalan > 1,5 meter
   i. Ya [KOLOM 10]
   ii. Tidak [KOLOM 11]
3. Apakah posisi bangunan hunian langsung menghadap sungai/laut/rawa/danau dan/atau TIDAK berada di atas sungai/laut/rawa/danau?
   a. Tidak ada sungai/laut/rawa/danau [KOLOM 12]
   b. Ya [KOLOM 13]
   c. Tidak [KOLOM 14]
4. Apakah bangunan hunian berada di atas lahan sempadan sungai/laut/rawa/danau?
   a. Tidak ada sungai/laut/rawa/danau [KOLOM 15]
   b. Ya [KOLOM 16]
   c. Tidak [KOLOM 17]
5. Apakah bangunan hunian berada di daerah buangan limbah pabrik atau di bawah jalur listrik tegangan tinggi (sutet)?
   a. Ya [KOLOM 18]
   b. Tidak [KOLOM 19]

NOTE (Detail dari sheet lain):
Ketentuan Penilaian SKOR A.1 Keteraturan Bangunan Hunian:

- 1 = Jika semua Kolom [3], [5], [13], dijawab 1, DAN Jika Kolom [7] atau [8], dan Kolom [10] atau [11] dijawab 1
- 0 = Jika salah satu dari Kolom [4], [6], [9], [12], [14] dijawab 1
- Persentase Skor: Jumlah Sub-total dibagi Jumlah Total dikali 100
- Skor disimpan di variabel "SKOR A.1 KETERATURAN BANGUNAN"

## A.2 KELAYAKAN BANGUNAN HUNIAN

Deskripsi: Disini diisi informasi tentang kelayakan bangunan hunian. Berikut ini pertanyaan yang harus diisi:
NAMA KEPALA RUMAH TANGGA [KOLOM 2]

6. Berapa luas lantai bangunan hunian?
   a. Panjang: ... (Meter) [KOLOM 3]
   b. Lebar: ... (Meter) [KOLOM 4]
   c. Jumlah Lantai: ... (Lantai) [KOLOM 5]
   d. Luas bangunan hunian: ... (Panjang x Lebar x Jumlah Lantai) (m2) [KOLOM 6]
7. Berapa jumlah penghuni bangunan hunian?
   a. Jiwa [KOLOM 7]
   b. Jumlah penghuni bangunan hunian (m2/jiwa) [KOLOM 8]
8. Berapa luas lantai bangunan hunian/ jiwa?
   a. > 7,2 meter2/ jiwa [KOLOM 9]
   b. < 7,2 meter2/ jiwa [KOLOM 10]

SKOR KELAYAKAN LANTAI BANGUNAN [KOLOM 11]

Note:
Ketentuan Penilaian SKOR "Bangunan Hunian memiliki Luas Lantai ≥ 7,2m2/ Jiwa" (Kolom [11]):

- 1 = Jika Kolom [9] dijawab 1, dan 0= Jika kolom [10] dijawab 1.

9. Bagaimana kondisi atap terluas?
   a. Tidak Bocor [KOLOM 12]
   b. Bocor [KOLOM 13]
10. Bagaimana kondisi dinding terluas?
    a. Baik [KOLOM 14]
    b. Rusak [KOLOM 15]
11. Apakah jenis lantai terluas?
    a. Bukan Tanah [KOLOM 16]
    b. Tanah [KOLOM 17]

SKOR KONDISI ATAP. LANTAI DINDING BANGUNAN [KOLOM 18]

Note:
Ketentuan Penilaian SKOR "Kesesuaian kondisi Atap Lantai Dinding sesuai Teknis" (Kolom [18]):

- 1 = Jika semua Kolom [10] dan [12] dan [14] dijawab 1; 0= Jika salah satu dari Kolom [11] atau [13] atau [15] dijawab 1.

SKOR KONDISI KELAYAKAN BANGUNAN [KOLOM 19]

Note:

- Presentase Skor: Jumlah Skor dibagi Jumlah total Data Skor dikali 100

## A.3 AKSES AIR MINUM

NAMA KEPALA RUMAH TANGGA [KOLOM 2] 12. Darimana sumber utama AIR MINUM, MANDI, CUCI didapat? - pilih salah satu dari pilihan jawaban. (jika jawaban c, d, e, maka lanjut ke no. 13)
a. Ledeng Meteran/SR [KOLOM 3]
b. Ledeng Tanpa Meteran [KOLOM 4]
c. Sumur Bor/Pompa [KOLOM 5]
d. Sumur Terlindung [KOLOM 6]
e. Mata Air Terlindung [KOLOM 7]
f. Air Hujan [KOLOM 8]
g. Air Kemasan/ air isi ulang [KOLOM 9]
h. Sumur tak terlindungi [KOLOM 10]
i. Mata Air tak Terlindung [KOLOM 11]
j. Sungai/Danau/Kolam [KOLOM 12]
k. tangki/mobil/ gerobak air [KOLOM 13]

13. Bila jawaban No. 12 di atas sumur bor, sumur terlindung atau mata air terlindung, maka berapa jarak ke penampungan tinja/kotoran terdekat (termasuk milik tetangga)?
    a. ≥ 10 m [KOLOM 14]
    b. < 10 m [KOLOM 15]

SKOR AKSES AIR [KOLOM 16]

Note:
Ketentuan Penilaian SKOR "Akses Air Minum (12,13)" (Kolom [16]):

- 1 = Jika salah satu Kolom [3] atau [4] atau [8] dijawab 1, atau
- 1 = Jika Kolom [5] dan [14] masing-masing dijawab 1, atau
- 1 = Jika Kolom [6] dan [14] masing-masing dijawab 1, atau
- 1 = Jika Kolom [7] dan [14] masing-masing dijawab 1.
- 0 = Jika Kolom [5] dijawab 1 dan kolom [15] dijawab 1; atau
- 0 = Jika Kolom [6] dijawab 1 dan kolom [15] dijawab 1; atau
- 0 = Jika Kolom [7] dijawab 1 dan kolom [15] dijawab 1; atau
- 0 = Jika salah satu dari kolom [9], [10], [11], [12], [13] dijawab 1.

14. Apakah kebutuhan air minum, mandi, cuci terpenuhi sepanjang tahun?
    a. Tercukupi/terpenuhi sepanjang tahun [KOLOM 17]
    b. Tercukupi hanya pada bulan tertentu [KOLOM 18]
    c. Tidak pernah tercukupi [KOLOM 19]

SKOR PEMENUHAN KEBUTUHAN AIR [KOLOM 20]

Note:
Ketentuan Penilaian SKOR "Pemenuhan Kebutuhan Air Minum, Mandi, Cuci (14)" (Kolom [20]):

- 1 = Jika Kolom [17] dijawab 1; 0 = Jika salah satu dari Kolom [18] atau [19] dijawab 1.
- Presentase Skor: Jumlah Skor dibagi Jumlah total Data Skor dikali 100

## A.4 PENGELOLAAN SANITASI

NAMA KEPALA RUMAH TANGGA [KOLOM 2]

15. Dimana biasanya anggota rumah tangga Buang Air Besar? (jika jawaban c, maka lanjut ke nomor 18)
    a. Jamban sendiri/ bersama (maks 5 KK untuk 1 jamban bersama) [KOLOM 3]
    b. Jamban umum (jika digunakan >5 KK dan/atau membayar) [KOLOM 4]
    c. Tidak di jamban [KOLOM 5]

SKOR AKSES PENGELOMBAAN AIR LIMBAH [KOLOM 6]

Note:
Ketentuan Penilaian SKOR "Akses Pengelolaan Air Limbah" (Kolom [6]):
1 = Jika Kolom [3] dijawab 1;
0 = Jika salah satu dari Kolom Kolom [4] atau [5] dijawab 1.

16. Apakah jenis kloset yang digunakan?
    a. Leher angsa [KOLOM 7]
    b. Bukan leher angsa (plengsengan/ cemplung/ cubluk/dll) [KOLOM 8]
17. Dimana limbah tinja dibuang?
    a. Septictank pribadi/komunal/IPAL [KOLOM 9]
    b. Bukan septictank/IPAL [KOLOM 10]

SKOR KELAYAKAN TEKNIS SARANA BAB [KOLOM 11]

Note:
Ketentuan Penilaian SKOR "KELAYAKAN TEKNIS SARANA BAB" (Kolom [11]):

- 1 = Jika semua Kolom [7] dan Kolom [9] dijawab 1; 0 = Jika salah satu dari Kolom [8] atau [10] dijawab 1.
- Presentase Skor: Jumlah Skor dibagi Jumlah total Data Skor dikali 100

## A.5 PENGELOLAAN SAMPAH RUMAH TANGGA

NAMA KEPALA RUMAH TANGGA [KOLOM 2]

18. Dimana tempat pembuangan sampah rumah tangga? (jika jawaban c, d, e maka lanjut ke no. 20)
    a. Tempat sampah pribadi [KOLOM 3]
    b. Tempat sampah komunal/ TPS/TPS-3R [KOLOM 4]
    c. Dalam Lubang/dibakar [KOLOM 5]
    d. Ruang terbuka/ lahan kosong/ jalan [KOLOM 6]
    e. Sungai/Saluran Irigasi/Danau/Laut/ Drainase (Got/Selokan) [KOLOM 7]

19. Berapa kali pengangkutan sampah dari rumah ke TPS/TPA?
    a. ≥ 2x seminggu [KOLOM 8]
    b. < 1x seminggu [KOLOM 9]

SKOR A.5 Pengelolaan Sampah [KOLOM 10]

Note:
Ketentuan Penilaian SKOR A.5 Pengelolaan Sampah (Kolom [10]):

- 1 = Jika Kolom [8] dijawab 1;
- 0 = Jika Kolom [9] dijawab 1.
- Kolom [3], [4], [5], [6], [7] hanya menjadi data ditingkat basis/RT
- Presentase Skor: Jumlah Skor dibagi Jumlah total Data Skor dikali 100

## A.6 DATA NON-FISIK

### A.6.1 PENDAPATAN RUMAH TANGGA

NAMA KEPALA RUMAH TANGGA [KOLOM 2]

20. Apa mata pencaharian utama rumah tangga?
    a. Pertanian, perkebunan, kehutanan, peternakan [KOLOM 3]
    b. Perikanan/ nelayan [KOLOM 4]
    c. Pertambangan/ galian [KOLOM 5]
    d. Industri/ pabrik [KOLOM 6]
    e. Konstruksi/ bangunan [KOLOM 7]
    f. Perdagangan/ jasa (guru, tenaga kesehatan, hotel, dll) [KOLOM 8]
    g. Pegawai pemerintah [KOLOM 9]

21. Berapa daya Listrik yang digunakan dalam bangunan hunian (Watt)?
    a. <= 450 [KOLOM 10]
    b. 900 [KOLOM 11]
    c. 1300 [KOLOM 12]
    d. >= 2200 [KOLOM 13]
    e. menumpang ke tetangga/ tidak punya meteran sendiri/ dll [KOLOM 14]

- Jumlah Kepala Rumah Tangga [KOLOM 15]
- Status Rumah Tangga
  a. MBR [KOLOM 16]
  b. NON MBR [KOLOM 17]

- Jumlah Kepala Keluarga [KOLOM 18]
- Jumlah Anggota Rumah Tangga
  a. Laki-laki [KOLOM 19]
  b. Perempuan [KOLOM 20]
  c. Jumlah laki-laki dan perempuan [KOLOM 21]
  d. Difabel [KOLOM 22]

Note:
Bagian ini tidak ada skor tapi sebagai data, di aplikasi mungkin akan otomatis di bagian dashboard yang menampilkan data tersebut.
Keterangan Penilaian/Analisis:

- % Mata pencaharian utama Tertinggi diisi: Nilai prosentase tertinggi diantara alternatif pilihan mata pencaharian tingkat baisis (Nilai tertinggi diantara Kolom [3] s/d kolom [9])
- Jenis mata pencaharian utama Tertinggi diisi: sesuai nama jenis mata pencaharian tertinggi diantara alternatif pilihan mata pencaharian, (sesuai jenis mata pencaharian pada poin a)
- % Penggunaan Daya Listrik Tertinggi diisi: Nilai prosentase tertinggi diantara alternatif pilihan Daya listrik yang digunakan (Nilai tertinggi diantara Kolom [10] s/d kolom [14])
- Jenis Penggunaan Daya Listrik Tertinggi diisi: sesuai nama jenis Penggunaan Daya Listrik tertinggi, (sesuai jenis Penggunaan Daya Listrik pada poin c)

### A.6.2 PELAYANAN FASILITAS SOSIAL

NAMA KEPALA RUMAH TANGGA [KOLOM 2]

22. Apa jenis fasilitas kesehatan yang paling sering digunakan rumah tangga?
    a. Rumah Sakit [KOLOM 3]
    b. Prakter Dokter/ Poliklinik [KOLOM 4]
    c. Puskesmas/ Pustu [KOLOM 5]
    d. Dukun/ pengobatan tradisional [KOLOM 6]
    e. Bidan/mantri [KOLOM 7]
    f. Tidak Pernah [KOLOM 8]

23. Di mana lokasi/ letak fasilitas kesehatan yang sering digunakan rumah tangga?
    a. Di dalam kelurahan/ kecamatan yang sama [KOLOM 9]
    b. Di luar kecamatan [KOLOM 10]
    c. Di kota lain [KOLOM 11]

24. Jika ada anggota rumah tangga usia wajib belajar (9 tahun), di mana lokasi SD/ sederajat dan SMP / sederajat terdekat yang digunakan?
    a. Di dalam kelurahan/ kecamatan yang sama [KOLOM 12]
    b. Di luar kecamatan [KOLOM 13]
    c. Di kota lain [KOLOM 14]
    d. Tidak sekolah [KOLOM 15]
    e. Tidak ada anggota rumah tangga usia wajib belajar [KOLOM 16]

Note:
Bagian ini tidak ada skor tapi sebagai data, di aplikasi mungkin akan otomatis di bagian dashboard yang menampilkan data tersebut.
Keterangan Penilaian/Analisis:

- % Fasilitas kesehatan Tertinggi yang sering dipergunakan diisi: Nilai prosentase tertinggi diantara alternatif pilihan pelayanan kesehatan (Nilai tertinggi diantara Kolom [3] s/d kolom [8])
- Jenis Fasilitas kesehatan Tertinggi yang sering dipergunakan diisi: sesuai nama jenis fasilitas kesehatan yang memiliki nilai prosentase tertinggi (sesuai jenis faskes pada poin a)
- % Lokasi Akses Pendidikan Dasar terdekat yang digunakan "Tertinggi": diisi Nilai prosentase tertinggi diantara alternatif pilihan lokasi SD/SMP/Sderajat terdekat yang digunakan (Nilai tertinggi diantara Kolom [12] s/d kolom [16])
- Lokasi akses pendidikan dasar SD/SMP/Sederajat "Tertinggi" diisi: sesuai nama lokasi tertinggi tersebut.

### A.6.3 ASPEK PENGUASAAN BANGUNAN DAN LAHAN

NAMA KEPALA RUMAH TANGGA [KOLOM 2]

25. Apakah status bangunan hunian?
    a. Milik sendiri [KOLOM 3]
    b. Sewa/Kontrak [KOLOM 4]
    c. Numpang/milik pihak lain [KOLOM 5]

26. Apakah status legalitas bangunan hunian?
    a. Memiliki IMB [KOLOM 6]
    b. Tidak/belum memiliki IMB [KOLOM 7]

27. Apakah status lahan bangunan hunian?
    a. Milik sendiri [KOLOM 8]
    b. Sewa/Kontrak [KOLOM 9]
    c. Numpang/milik pihak lain [KOLOM 10]

28. Apakah status legalitas lahan bangunan hunian?
    a. SHM/ HGB/ Surat yang diakui pemerintah [KOLOM 11]
    b. Milik pihak lain/ surat perjanjian lainnya (termasuk surat adat) [KOLOM 12]
    c. Milik pihak lain tanpa surat perjanjian [KOLOM 13]
    d. Tidak ada / tidak tahu [KOLOM 14]

Note:
Bagian ini tidak ada skor tapi sebagai data, di aplikasi mungkin akan otomatis di bagian dashboard yang menampilkan data tersebut.
Keterangan Penilaian/Analisis:

- Presentase Skor: Jumlah Skor dibagi Jumlah total Data Skor dikali 100

# Sheet 3 Sampai Sheet 9: Keterangan lebih detail dari setiap parameter kumuh sudah dituliskan analisis detailnya di setiap bagiannya.

# Sheet DAFTAR PERTANYAAN PENDATAAN 100-0-100 BERBASIS WILAYAH

## B.1 INFORMASI UMUM

- Provinsi
- Kab/Kota
- RT/RW/Dusun
- Kecamatan
- Kelurahan/Desa
- Tanggal Pendataan

SATUAN PEMUKIMAN (RT/RW/Dusun)
[KOLOM 2]

# B.1 KEPADATAN BANGUNAN HUNIAN

1. Berapa luas wilayah RT/RW/dusun? (Ha) [KOLOM 3]
2. Berapa luas wilayah permukiman? (Ha) [KOLOM 4]
3. Berapa jumlah total bangunan di wilayah RT/RW/dusun? (Unit) [KOLOM 5]
4. Berapa persentase luas kawasan permukiman yang terletak di wilayah dengan kemiringan lebih dari 15%? (%) [KOLOM 6]

- Kepadatan Bangunan (Unit/Ha) [KOLOM 7]
  Kepadatan Bangunan Hunian (Kolom [7]) diisi: (Kolom [5]) dibagi (Kolom [4])

- Status Kepadatan Bangunan [KOLOM 8]
  Status Kepadatan Bangunan Hunian (Kolom [8]) diisi: salah satu status "Rendah/Sedang/Tinggi" sesuai hasil perbandingan nilai (Kolom [7]) dengan Ketentuan kepadatan bangunan yang ditetapkan menurut Kota Metro/Besar dan Kota Sedang/Kecil.

## B.2 JALAN LINGKUNGAN

5. Berapa panjang total jaringan jalan lingkungan yang telah ada/eksisting? (Meter) [KOLOM 9]
6. Berapa panjang jalan lingkungan eksisting dengan lebar ≥ 1,5 meter? (Meter) [KOLOM 10]
7. Berapa panjang jalan lingkungan eksisting dengan lebar ≥ 1.5 meter yang permukaannya diperkeras? (Meter) [KOLOM 11]
8. Berapa Panjang Kebutuhan Jalan baru diluar eksisting sehingga melayani permukiman seluruhnya? (Jawaban sesuai hasil perencanaan, bila ada) (Meter) [KOLOM 12]

- Panjang Jaringan Jalan Lingkungan Ideal (m) [KOLOM 13]
  diisi: (Kolom 9)+(Kolom 12)

- JANGKAUAN JARINGAN JALAN LINGKUNGAN (%) [KOLOM 14]
  diisi: (Kolom 9) dibagi (Kolom 13) dikali 100.

9. Berapa panjang jalan lingkungan dengan lebar ≥ 1,5 meter yang permukaannya diperkeras dan tidak rusak? (Meter) [KOLOM 15]
10. Berapa panjang jalan lingkungan dengan lebar ≥ 1,5 meter yang permukaannya tanah dan tidak rusak? (Meter) [KOLOM 16]
11. Berapa panjang jalan lingkungan dgn lebar <1,5 meter yang permukaannya diperkeras dan tidak rusak? (Meter) [KOLOM 17]
12. Panjang jalan lingkungan dgn lebar <1,5 meter yang permukaannya tanah (tidak diperkeras) dan tidak rusak? (Meter) [KOLOM 18]
13. Berapa panjang jalan lingkungan dengan lebar ≥ 1,5 meter yang dilengkapi saluran samping jalan? (Meter) [KOLOM 19]
14. Berapa panjang jalan lingkungan dengan lebar < 1,5 meter yang dilengkapi saluran samping jalan? (Meter) [KOLOM 20]

- Total panjang keseluruhan Jalan Lingkungan yang permukaannya tidak rusak (sesuai persyaratan teknis) [KOLOM 21]
  diisi: (Kolom 15)+(Kolom 16)+(Kolom 18)

- Persentase Panjang Jalan Lingkungan yang permukaannya tidak rusak (sesuai persyaratan teknis) [KOLOM 22]
  diisi: (Kolom 21) dibagi (Kolom 9) dikali 100%.

## B.3 DRAINASE LINGKUNGAN

15. Berapa tinggi genangan rata-rata (jika jawaban a, maka langsung ke no. 20)?
    a. Tidak pernah terjadi genangan [KOLOM 23]
    b. Tinggi genangan < 30 cm [KOLOM 24]
    c. Tinggi genangan >30 cm [KOLOM 25]

16. Berapa durasi genangan air/ banjir rata-rata?
    a. Lama genangan < 2 jam [KOLOM 26]
    b. Lama genangan >2 jam [KOLOM 27]

17. Berapa frekuensi genangan air/ banjir?
    a. Terjadi < 2 kali/tahun [KOLOM 28]
    b. Terjadi >2 kali/tahun [KOLOM 29]

18. Berapa luas area genangan air/ banjir dalam permukiman? (Ha) [KOLOM 30]

19. Apa sumber genangan air/ banjir?
    a. Rob/ pasang air laut [KOLOM 31]
    b. Air sungai/danau/rawa [KOLOM 32]
    c. Limpasan air hujan/ air buangan rumah tangga [KOLOM 33]

20. Berapa panjang total drainase yang telah ada (eksisting) dipermukiman? (Meter) [KOLOM 34]

21. Periksa Daftar Usulan/Siteplan Peningkatan Kualitas Drainase sd 2020. Apakah ada usulan drainase baru untuk melayani permukiman?
    a. Ya [KOLOM 35]
    b. Tidak [KOLOM 36]

22. Jika Ya, Berapa panjang kebutuhan drainase baru tersebut sehingga permukiman terlayani jaringan drainase seluruhnya. (Jawaban sesuai hasil perencanaan) (Meter) [KOLOM 37]

23. Periksa Daftar Usulan/Siteplan Peningkatan Kualitas Drainase sd 2020. Apakah ada Usulan Drainase penghubung dari drainase yang ada (eksisting) dengan sistem drainase kota.
    a. Ya [KOLOM 38]
    b. Tidak [KOLOM 39]

24. Jika Ya, Berapa Panjang penghubung drainase eksisting dengan sistem drainase kota. (Jawaban sesuai hasil perencanaan) (Meter) [KOLOM 40]

25. Apakah drainase eksisting bersih dan tidak bau (terpeliharan)?
    a. Ya [KOLOM 41]
    b. Tidak [KOLOM 42]

26. Jika ya, berapa panjang drainase eksisting yang bersih dan tidak bau (terpeliharan)? (Meter) [KOLOM 43]

27. Berapa panjang drainase eksisting dipermukiman dengan kondisi konstruksi tidak rusak/baik? (Meter) [KOLOM 44]

- Kejadian tidak ada Genangan [KOLOM 45]

- Persentase Luas tidak ada Genangan dalam permukiman [KOLOM 46]

- Panjang kebutuhan drainase baru, termasuk penghubung eksisting dengan sistem drainase Perkotaan [KOLOM 47]

- Panjang Jaringan drainase Ideal [KOLOM 48]

- Persentase Panjang drainase dengan kondisi fisik baik/tidak rusak [KOLOM 49]

Note:
1.Pertanyaan 15, 16, 17 disimpulkan "ada Kejadian Genangan sesuai persyaratan" jika dan hanya jika jawabannya 15=c, 16=b, 17=b, lalu diberi SKOR=1.
Selain pilihan jawaban tersebut nilainya adalah 0 (artinya tidak ada Kejadian Genangan sesuai persyaratan)
Lalu Profil Permukiman dibuat kedalam Pernyataan Positif sehingga diubah menjadi: 2. Awalnya : Kejadian Ada Genangan sesuai persyaratan (Skor=1), lalu dibalik ke pernyataan POSITIF menjadi : Kejadian Tidak Ada Genangan (Skor=0) 3. Awalnya Skor 0 (Artinya: Tidak Ada Kejadian Genangan sesuai persyaratan), lalu dibalik ke pernyataan POSITIF menjadi : Skor 1: Ada "Kejadian Tidak Ada Genangan"

## B.4 SANITASI LINGKUNGAN

28. Apakah buangan limbah cair rumah tangga terpisah dengan saluran drainase?
    a. Ya [KOLOM 50]
    b. Tidak [KOLOM 51]

## B.5 PENGELOLAAN SAMPAH

29. Apakah ada prasarana pengelolaan sampah yang melayani permukiman (TPS/TPS-3R/TPST)?
    a. Ya [KOLOM 52]
    b. Tidak [KOLOM 53]

30. Apakah ada sarana pengangkutan sampah yang melayani permukiman (Gerobak/Motor/Mobil)?
    a. Ya [KOLOM 54]
    b. Tidak [KOLOM 55]

- Persentase Prasarana dan Sarana Persampahan Sesuai dengan persyaratan Teknis (%) [KOLOM 56]

31. Apakah konstruksi prasarana persampahan (No.29) dan sarana (No.30), semua kondisinya baik/tidak rusak?
    a. Ya, (No 29 & 30 keduanya baik) [KOLOM 57]
    b. Tidak (keduanya atau salah satunya rusak) [KOLOM 58]

- Persentase sapras persampahan dengan kondisi konstruksinya baik/tidak rusak (terpelihara)? (%) [KOLOM 59]

## B.6 PENGAMANAN BAHAYA KEBAKARAN

32. Berapa frekuensi kejadian kebakaran di lingkungan permukiman?
    a. 1 Tidak pernah terjadi kebakaran dalam 5 tahun [KOLOM 60]
    b. 1 kali dalam 5 tahun [KOLOM 61]
    c. 2 kali dalam 5 tahun [KOLOM 62]
    d. > 2 kali dalam 5 tahun [KOLOM 63]

33. Apa penyebab kejadian bencana kebakaran?
    a. Tungku/kompor masak [KOLOM 64]
    b. Konsleting listrik [KOLOM 65]
    c. Kebakaran hutan/ilalang [KOLOM 66]
    d. Pembakaran sampah [KOLOM 67]
    e. Lainnya [KOLOM 68]

34. Apakah ada sarana pencegahan bahaya kebakaran?
    a. Pos/Stasiun pemadam kebakaran [KOLOM 69]
    b. Hidran air/Tangki Air/sumber air lain yang terbuka [KOLOM 70]
    c. Mobil/motor pemadam kebakaran/ APAR [KOLOM 71]
    d. Tidak ada [KOLOM 72]

35. Apakah tersedia jalan dengan lebar minimal 3,5 meter di lingkungan permukiman dengan radius rumah terjauh kurang dari 100 m?
    a. Ada [KOLOM 73]
    b. Tidak [KOLOM 74]

- KETERSEDIAAN PRASARANA PROTEKSI KEBAKARAN (%) [KOLOM 75]
  diisi:
  a. 100%, jika ada skor=1 pada (Kolom [70]) atau (Kolom [73])
  b. 0% jika selain poin a.

- KETERSEDIAAN SARANA PROTEKSI KEBAKARAN (%) [KOLOM 76]
  diisi:
  a. 100%, jika ada skor=1 pada (Kolom [69]) atau (Kolom [71]).
  b. 0% jika selain poin a.

## B.7 DATA NON FISIK (jawaban bisa lebih dari 1)

36. Apakah tersedia fasilitas kesehatan di dalam lingkungan RT?
    a. Rumah Sakit [KOLOM 77]
    b. Prakter Dokter/ Poliklinik [KOLOM 78]
    c. Puskesmas/ Pustu [KOLOM 79]
    d. Dukun/ pengobatan tradisional [KOLOM 80]
    e. Bidan/ mantri [KOLOM 81]
    f. Tidak ada [KOLOM 82]

37. Apakah tersedia fasilitas pendidikan di dalam lingkungan RT?
    a. TK/ PAUD [KOLOM 83]
    b. SD/sederajat [KOLOM 84]
    c. SMP/sederajat [KOLOM 85]
    d. SMA/SMK/sederajat [KOLOM 86]
    e. Perguruan tinggi [KOLOM 87]
    f. Tidak ada [KOLOM 88]

## B.8 PERTIMBANGAN LAIN (Pilih salah satu)

38. Apakah lokasi berada pada fungsi strategis Kab/Kota?
    a. Ya [KOLOM 89]
    b. Tidak [KOLOM 90]

39. Lokasi memiliki Potensi Sosial, ekonomi, budaya untuk dikembangkan
    a. Ya [KOLOM 91]
    b. Tidak [KOLOM 92]
