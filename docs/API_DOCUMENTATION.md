# SWMS Dashboard API Documentation

## Base URL

Set `SWMS_API_BASE_URL` di `.env.local`, tanpa slash di akhir. Contoh:

```env
SWMS_API_BASE_URL=http://localhost:8000/api/v1
```

Endpoint di bawah relatif terhadap base URL tersebut. Kontrak lengkap ada di [dokumentasi API backend](../../swms_backend/docs/API_DOCUMENTATION.md).

## Endpoint Admin yang digunakan

| Kebutuhan | Method dan path |
| --- | --- |
| Login admin | `POST /auth/login` |
| Ringkasan dashboard | `GET /admin/dashboard` |
| Daftar laporan | `GET /admin/reports` |
| Detail laporan | `GET /admin/reports/{report}` |
| Saran klasifikasi foto laporan | `POST /admin/reports/{report}/classify` |
| Ubah status/catatan | `PATCH /admin/reports/{report}/status` |
| Hapus laporan | `DELETE /admin/reports/{report}` |
| Daftar/buat user | `GET/POST /admin/users` |
| Detail/edit/hapus user | `GET/PATCH/DELETE /admin/users/{user}` |

Admin API memerlukan Sanctum bearer token dari login admin. User non-admin menerima `403`; token tidak valid atau tidak ada menerima `401`. Filter laporan/user, pagination, field request/response, dan status workflow mengikuti dokumentasi backend.

Klasifikasi foto diminta secara eksplisit dari detail laporan. BFF dashboard
meneruskan request melalui Laravel; browser tidak menerima token service model
atau memanggil service model secara langsung. Hasil hanya ditampilkan sebagai
saran sementara untuk admin dan tidak mengubah data/status laporan.

## Persyaratan request

- Kirim `Accept: application/json`.
- Untuk operasi terautentikasi, kirim `Authorization: Bearer <token>` melalui mekanisme sesi runtime yang disepakati.
- Gunakan JSON untuk request biasa; multipart hanya bila endpoint memang menerima file.
- Tampilkan error validation `422` secara kontekstual dan tangani `401`, `403`, `429`, serta kegagalan jaringan.
- Status laporan hanya diubah melalui endpoint status Admin API dan alur transisi backend.

## BFF, cookie, dan token

Browser memanggil route handler Next.js pada origin yang sama; server Next.js meneruskan request ke Laravel. Karena itu, CORS browser-to-Laravel tidak dibutuhkan untuk alur ini.

`SWMS_API_BASE_URL` hanya dibaca server Next.js dan bukan secret. Password admin dan bearer token bukan konfigurasi build. Token disimpan dalam cookie `HttpOnly`, `Secure` di production, dan `SameSite=Lax`; jangan menyimpan token di `localStorage` atau mengirimnya ke client.
