# Arsitektur SWMS Dashboard

## Batas aplikasi

Dashboard adalah frontend mandiri. Laravel tetap menjadi sumber kebenaran untuk autentikasi, otorisasi, validasi, workflow status, dan penyimpanan data. Next.js tidak mengakses database atau bucket R2 secara langsung.

## Struktur yang dituju

```text
app/                             # Next.js App Router, matching current starter location
components/
└── global/
    ├── layout/                  # Sidebar, top bar, page shell
    ├── ui/                      # Button, input, badge, table primitives
    └── feedback/                # Loading, empty, error, notification
features/
    ├── auth/
    │   ├── components/
    │   ├── application/         # Use cases
    │   ├── domain/              # Auth/session types and rules
    │   └── infrastructure/      # Login endpoint adapter
    ├── dashboard/
    ├── reports/
    └── users/
```

Tambahkan subdirektori saat ada implementasi yang membutuhkannya; jangan membuat lapisan atau folder kosong sekadar mengikuti diagram.

## Komponen global dan dedicated

- **Global component**: reusable di banyak modul/route dan bebas dari aturan bisnis satu fitur. Contoh: sidebar, page header, button, status badge yang menerima label/variant, data table primitive, loading/empty/error panel.
- **Dedicated component**: khusus satu fitur atau route. Contoh: report filters, report status editor, report detail summary, user role form, dashboard KPI card jika isi dan perilakunya khusus ringkasan dashboard.
- Promosikan komponen menjadi global setelah ada kebutuhan nyata dari lebih dari satu fitur. Hindari shared component yang bergantung pada DTO atau endpoint spesifik fitur.
- Route di `app/` menyusun halaman dan layout; UI/data logic milik fitur berada di `features/`.

## Alur dependensi

`app route → feature presentation → application/use case → domain contract ← infrastructure adapter → Admin API`

Domain dan application layer tidak mengimpor React, Next.js, atau detail transport HTTP. Infrastructure memetakan response API menjadi tipe yang dipakai fitur. Komponen menampilkan state dan mengirim intent; keputusan otorisasi tetap di backend.

## Route admin yang direncanakan

- `/login`
- `/dashboard`
- `/reports` dan `/reports/[id]`
- `/users` dan `/users/[id]`

Route aktual mengikuti keputusan navigasi produk dan kontrak endpoint backend.

## Autentikasi dan konfigurasi

`SWMS_API_BASE_URL` adalah alamat API untuk server Next.js, bukan secret. Browser hanya berbicara ke route handler/BFF di origin yang sama. Admin token disimpan di cookie `HttpOnly`, `Secure` pada production, dan `SameSite=Lax`; jangan pernah menyimpan token di `localStorage` atau mengirimkannya ke client components.
