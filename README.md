# Sistem Manajemen Kendaraan Dinas

Aplikasi web untuk mengelola kendaraan dinas operasional, data pegawai negeri
sipil (PNS), perangkat daerah, dan informasi peminjaman kendaraan.

## Fitur

- Halaman login.
- Dashboard super admin untuk melihat kendaraan tersedia dan dipinjam beserta
  informasi PNS dan perangkat daerah peminjam.
- Pencatatan peminjaman dan pengembalian kendaraan dari dashboard.
- CRUD kendaraan, PNS, dan perangkat daerah pada halaman Kelola Data Master.
- Lima data contoh untuk setiap entitas agar aplikasi mudah dicoba.
- Pintasan masuk demo ke super admin yang hanya tampil dalam mode development.

## Screenshot aplikasi

### Dashboard super admin

![Dashboard super admin](./src/lib/screenshot/Screenshot%202026-11-12%20125223.png)

### Halaman kelola data master

![Halaman kelola data master](./src/lib/screenshot/Screenshot%202026-11-12%20125249.png)

### Daftar kendaraan

![Daftar kendaraan](./src/lib/screenshot/Screenshot%202026-11-12%20125313.png)

### Data pegawai negeri sipil

![Data pegawai negeri sipil](./src/lib/screenshot/Screenshot%202026-11-12%20125336.png)

### Data perangkat daerah

![Data perangkat daerah](./src/lib/screenshot/Screenshot%202026-11-12%20125406.png)

### Halaman login

![Halaman login](./src/lib/screenshot/Screenshot%202026-11-12%20125918.png)

## Teknologi

- Next.js 16 dengan App Router
- React 19 dan JavaScript
- Tailwind CSS 4
- React Hook Form dan Zod untuk formulir dan validasi
- Lucide React untuk ikon

## Menjalankan aplikasi

Pastikan Node.js dan npm sudah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Route utama

| Route | Keterangan |
| --- | --- |
| `/login` | Halaman login dan pintasan demo saat development |
| `/super-admin` | Dashboard kendaraan dan peminjaman |
| `/super-admin/kelola-data-master` | Kelola kendaraan, PNS, dan perangkat daerah |

## Perintah

```bash
npm run dev    # Jalankan server development
npm run lint   # Jalankan ESLint
npm run build  # Buat production build
npm run start  # Jalankan production build
```

## AI yang digunakan

Pengembangan aplikasi dibantu oleh **GitHub Copilot**, melalui AI assistant
menggunakan **Copilot SDK di VS Code**. Model AI tertentu tidak ditetapkan
dalam konfigurasi proyek ini. Aplikasi belum memiliki fitur AI yang berjalan
di dalam produk.

## Catatan

Data kendaraan, PNS, perangkat daerah, dan peminjaman saat ini menggunakan data
contoh serta state sementara di aplikasi. Data tidak tersimpan ke database dan
akan hilang setelah halaman dimuat ulang.

Route super admin belum dilindungi autentikasi. Sebelum aplikasi digunakan di
lingkungan produksi, tambahkan autentikasi dan otorisasi pada route tersebut.
