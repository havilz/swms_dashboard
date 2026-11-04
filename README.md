# SWMS Dashboard

SWMS Dashboard adalah aplikasi web administrator untuk Smart Waste Management System. Dashboard digunakan untuk memantau laporan, memperbarui status penanganan, melihat ringkasan operasional, dan mengelola akun pengguna.

Aplikasi ini dibangun sebagai frontend Next.js dan berkomunikasi dengan backend melalui HTTP API. Data aplikasi tidak disimpan langsung di database oleh dashboard.

## Fitur

- Login administrator.
- Sesi login berbasis cookie HttpOnly.
- Dashboard ringkasan operasional.
- Statistik total laporan dan pengguna.
- Daftar laporan terbaru.
- Daftar seluruh laporan dengan pencarian, filter status, dan pagination.
- Halaman detail laporan.
- Pembaruan status laporan dan catatan admin.
- Daftar pengguna dengan pencarian, filter role, dan pagination.
- Penanganan sesi kedaluwarsa dan error koneksi backend.
- Tampilan responsif untuk desktop dan perangkat dengan layar kecil.

## Teknologi

- Next.js 16 dengan App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Node.js dan npm

## Persyaratan

Sebelum menjalankan project, pastikan tersedia:

- Node.js yang kompatibel dengan Next.js 16
- npm
- Backend API SWMS yang dapat diakses dari server Next.js

Verifikasi instalasi:

```bash
node --version
npm --version
```

## Instalasi

Install dependency dari root project:

```bash
npm install
```

## Konfigurasi Environment

Buat `.env.local` berdasarkan `.env.example`:

```env
SWMS_API_BASE_URL=http://localhost:8000/api/v1
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=swms
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://<public-bucket-domain>
```

`SWMS_API_BASE_URL` adalah base URL backend API dan harus menggunakan protokol `http` atau `https`.
Kredensial R2 digunakan hanya oleh server Next.js untuk mengambil preview foto laporan dan tidak boleh menggunakan prefix `NEXT_PUBLIC_`. Di Vercel, atur kelima variabel R2 di Project Settings → Environment Variables. `R2_PUBLIC_URL` harus sama dengan base URL yang dipakai backend untuk membentuk URL foto pada laporan.

Contoh di atas hanya menunjukkan format konfigurasi. Gunakan URL environment masing-masing saat menjalankan aplikasi.

Jangan memasukkan password, token, API key, cookie, credential database, atau secret lain ke README, source code, maupun repository. File environment lokal juga tidak boleh dibagikan.

## Menjalankan Development Server

Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000` pada browser.

Jika backend berjalan pada alamat berbeda, ubah `SWMS_API_BASE_URL` di `.env.local`, lalu restart development server.

## Script Project

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server Next.js |
| `npm run lint` | Menjalankan ESLint |
| `npm run build` | Membuat production build |
| `npm run start` | Menjalankan hasil production build |

## Alur Autentikasi

1. Administrator mengirim email dan password melalui halaman login.
2. Route server Next.js meneruskan request login ke backend API.
3. Backend memvalidasi credential dan hak akses administrator.
4. Token sesi disimpan pada cookie HttpOnly oleh server Next.js.
5. Profil admin untuk shell disimpan dalam cookie HttpOnly yang ditandatangani dengan token, sehingga tidak memerlukan request validasi sesi terpisah pada setiap navigasi. Endpoint data tetap memvalidasi token di backend.
6. Saat logout, sesi dicabut melalui backend dan cookie dihapus.

Token sesi tidak dibaca langsung oleh JavaScript browser. Request halaman admin menggunakan route server Next.js sebagai perantara ke backend.

## Integrasi Backend

Dashboard menggunakan base URL dari `SWMS_API_BASE_URL` dan mengakses resource berikut:

- `auth/login` untuk autentikasi administrator.
- `auth/logout` untuk mengakhiri sesi.
- `admin/dashboard` untuk ringkasan dashboard.
- `admin/reports` untuk daftar dan filter laporan.
- `admin/reports/{id}` untuk detail laporan.
- `admin/reports/{id}/status` untuk memperbarui status dan catatan admin.
- `admin/users` untuk daftar dan filter pengguna.
- `/api/admin/reports/{id}/image` untuk mengambil foto laporan melalui server dashboard setelah memvalidasi sesi admin dan akses laporan di backend.

Semua request admin dikirim dari server dengan header `Authorization` yang berasal dari sesi aktif. Browser berkomunikasi dengan route aplikasi pada origin dashboard.

## Status Laporan

Dashboard mengenali status laporan berikut:

| Status | Makna |
| --- | --- |
| `pending` | Laporan menunggu penanganan |
| `in_progress` | Laporan sedang ditangani |
| `completed` | Penanganan selesai |
| `rejected` | Laporan ditolak |

Perubahan status mengikuti aturan transisi yang disediakan backend. Dashboard hanya menampilkan pilihan status yang diizinkan untuk status laporan saat ini.

## Struktur Project

```text
app/
├── (auth)/                 # Halaman autentikasi
├── (admin)/                # Halaman yang membutuhkan sesi admin
├── api/                    # Route server untuk login, logout, dan proxy admin
├── layout.tsx              # Layout dan metadata aplikasi
└── page.tsx                # Redirect halaman awal

components/
└── global/                 # Layout admin dan komponen UI bersama

features/
├── auth/                   # Domain dan integrasi autentikasi
├── dashboard/              # Ringkasan dashboard
├── reports/                # Laporan dan perubahan status
└── users/                  # Manajemen pengguna

public/                     # Asset statis
```

Pembagian tanggung jawab utama:

- `app/` mengatur routing, halaman, dan server route.
- `features/*/domain/` berisi tipe serta parser data dari backend.
- `features/*/infrastructure/` berisi request dan integrasi API.
- `features/*/components/` berisi UI khusus fitur.
- `components/global/` berisi UI dan layout yang digunakan lintas fitur.

## Pemeriksaan Kualitas

Sebelum membuat perubahan, jalankan lint:

```bash
npm run lint
```

Validasi production build:

```bash
npm run build
```

Untuk mencoba hasil build secara lokal:

```bash
npm run build
npm run start
```

## Troubleshooting

### Backend tidak dapat dihubungi

- Pastikan backend sedang berjalan.
- Periksa nilai `SWMS_API_BASE_URL` di `.env.local`.
- Pastikan URL tidak memiliki typo dan menggunakan `http` atau `https`.
- Jika menggunakan emulator atau container, pastikan alamat host dapat diakses dari lingkungan tersebut.

### Sering kembali ke halaman login

- Sesi mungkin sudah kedaluwarsa.
- Pastikan backend menerima token sesi dan endpoint validasi sesi tersedia.
- Login kembali setelah memastikan backend dapat diakses.

### Build gagal

- Hapus dependency lokal lalu jalankan `npm install` kembali.
- Jalankan `npm run lint` untuk melihat error kode.
- Pastikan versi Node.js sesuai dengan kebutuhan Next.js yang digunakan.

## Keamanan

- Gunakan HTTPS untuk environment non-lokal.
- Simpan konfigurasi environment hanya pada sistem yang menjalankan aplikasi.
- Batasi akses akun administrator sesuai kebutuhan.
- Jangan mencatat password atau token ke log aplikasi.
- Jangan menonaktifkan validasi autentikasi pada route server.
