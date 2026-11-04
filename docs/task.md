# SWMS Dashboard — Task and Acceptance Criteria

## Scope

Membangun frontend admin Next.js terpisah yang menggunakan Laravel Admin API, dengan clean architecture dan pemisahan komponen global/dedicated.

## Foundation — completed

- [x] Next.js App Router starter tersedia.
- [x] Environment template hanya memuat public API base URL.
- [x] `.gitignore` mengabaikan environment lokal tetapi mengizinkan `.env.example`.
- [x] Panduan arsitektur, design reference Blade lama, API integration, dan agent skills disiapkan.

## Dashboard implementation

- [x] Implementasikan BFF login/logout dengan cookie HttpOnly dan validasi role admin.
- [x] Bangun login dan proteksi route yang sesuai sesi.
- [x] Bangun shell navigasi responsif dan halaman dashboard berdasarkan Design Reference.
- [x] Hubungkan statistik dan laporan terbaru ke Admin API, lengkap dengan loading/error/empty states.
- [x] Bangun daftar/filter laporan, detail laporan, dan alur perubahan status/catatan melalui Admin API.
- [x] Bangun daftar dan filter user dari Admin API.
- [x] Hindari request validasi sesi `auth/me` berulang pada navigasi; verifikasi profil bertanda tangan secara lokal dan biarkan endpoint admin memvalidasi token.
- [x] Tambahkan loading state navigasi untuk halaman admin dan redirect saat token ditolak backend.
- [ ] Lengkapi CRUD user jika endpoint dan kebutuhan produk sudah ditetapkan.
- [ ] Tambahkan test untuk use case, API mapping/error, dan alur UI.
- [ ] Verifikasi login dan alur Admin API dengan backend nyata setelah deploy optimasi sesi.
- [ ] Verifikasi responsive layout dan alur dashboard pada browser.
- [x] Verifikasi `npx tsc --noEmit` dan `npm run build`.
- [x] Verifikasi `npm run lint`.
