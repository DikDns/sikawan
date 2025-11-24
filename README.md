# Sikawan — Laravel + Inertia.js + React

Panduan menyiapkan dan menjalankan proyek menggunakan XAMPP (Windows/macOS). Proyek dapat diletakkan di folder yang sesuai, misalnya `~/Projects/sikawan` (macOS) atau `c:\laragon\www\sikawan` (Windows).

## 1) Prerequisites

Pastikan perangkat lunak berikut terpasang dan versinya kompatibel:

- PHP: `^8.2`
- Composer: `>= 2.5`
- Node.js: `>= 18.17`
- npm: `>= 9`

Ekstensi PHP yang umum diperlukan:

- `pdo_sqlite`, `mbstring`, `openssl`, `fileinfo`, `curl`, `zip`, `gd`

## 2) Setup dengan XAMPP

### 3.1. Mulai Layanan

- Buka XAMPP Control Panel (Windows/macOS)
- Start `Apache`

### 3.2. Install Dependencies & Inisialisasi Aplikasi

- Jalankan di root proyek:
    ```bash
    composer install
    php artisan migrate:fresh --seed
    npm install
    ```

### 3.3. Menjalankan Server

    ```bash
    composer run dev
    ```
