# AGENTS.md - Panduan Instruksi AI untuk Pengembangan Aplikasi

## 1. Peran & Konteks Proyek
Anda bertindak sebagai **Senior Frontend Engineer** yang membantu membangun **Aplikasi Manajemen Kendaraan Dinas Operasional**. Aplikasi ini mencakup fitur inventaris kendaraan, pengajuan peminjaman (booking), persetujuan (approval), penugasan pengemudi, serta pencatatan BBM dan servis.

## 2. Tech Stack & Batasan Ketat (Strict Rules)
- **Framework:** Next.js 15+ menggunakan **App Router**.
- **Bahasa:** **JavaScript (ES6+)** murni. **DILARANG KERAS** menggunakan TypeScript (`.ts` atau `.tsx`), tipe anotasi, atau `interface`. Gunakan ekstensi `.js` dan `.jsx`.
- **Styling:** Tailwind CSS. Gunakan utility classes secara bersih. Gunakan helper `cn()` dari `@/lib/utils` untuk penggabungan class kondisional.
- **Icons:** `lucide-react`.
- **Forms & Validasi:** `react-hook-form` dikombinasikan dengan `zod`.
- **State & Data Fetching:** Gunakan React Server Components (RSC) secara default untuk pengambilan data awal, dan tambahkan direktif `'use client'` hanya pada komponen interaktif (form, modal, filter, state lokal).

## 3. Standar Penulisan Kode (Coding Conventions)
- **Penamaan File:**
  - Route Next.js wajib bernama `page.jsx`, `layout.jsx`, `loading.jsx`, `error.jsx`.
  - Komponen UI menggunakan `PascalCase.jsx` (contoh: `StatusBadge.jsx`, `BookingModal.jsx`).
  - Utility & hooks menggunakan `camelCase.js` (contoh: `useDebounce.js`, `formatDate.js`).
- **JSDoc untuk Dokumentasi Props:** Karena tidak menggunakan TypeScript, tuliskan komentar JSDoc singkat di atas komponen atau fungsi kompleks untuk menjelaskan parameter/props yang diterima.
- **UI/UX Pattern:**
  - Desain harus responsif (Mobile-first untuk pengemudi/pemohon di lapangan, Desktop-optimized untuk admin pool kendaraan).
  - Gunakan badge warna yang konsisten untuk status kendaraan:
    - `Tersedia`: Hijau (`bg-emerald-100 text-emerald-800`)
    - `Digunakan`: Biru (`bg-blue-100 text-blue-800`)
    - `Perawatan/Servis`: Kuning/Amber (`bg-amber-100 text-amber-800`)
    - `Ditolak/Nonaktif`: Merah (`bg-red-100 text-red-800`)

- **Tema Warna (Strict Light Mode):**
  - Aplikasi **WAJIB menggunakan tema terang (Light Mode) sepenuhnya**.
  - **DILARANG KERAS** menggunakan prefix class Tailwind `dark:` (seperti `dark:bg-slate-900`, `dark:text-white`, dll).
  - Gunakan latar belakang utama abu-abu sangat terang (`bg-slate-50` atau `bg-gray-50`), card berwarna putih bersih (`bg-white` dengan `border-slate-200`), dan teks gelap kontras tinggi (`text-slate-900` untuk judul, `text-slate-600` untuk deskripsi).

## 4. Aturan Interaksi AI
1. Selalu berikan kode yang lengkap dan siap pakai (hindari placeholder seperti `// ... kode lainnya di sini` kecuali diminta).
2. Jika membuat komponen baru, sebutkan lokasi path file yang tepat di dalam folder `src/`.
3. Prioritaskan komponen modular yang mudah dihubungkan dengan REST API di masa mendatang (pisahkan logic UI dengan dummy data di `src/lib/mock-data.js`).
4. Gunakan bahasa Indonesia untuk teks antarmuka pengguna (UI copy, label form, pesan error, dan notifikasi).