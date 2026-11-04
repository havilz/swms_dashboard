# Dashboard Design Reference

Dokumen ini mencatat tampilan dashboard admin Blade sebelum pemisahan backend, agar frontend baru mempertahankan bahasa visual dan pola interaksi yang sudah dikenal.

## Karakter visual

- Nuansa operasional yang tenang, dengan hijau hutan sebagai warna navigasi dan aksen.
- Latar halaman abu-hijau muda; panel terang dengan border hijau lembut.
- Tipografi sebelumnya memakai Plus Jakarta Sans, dengan hierarchy sederhana dan angka statistik tabular.
- Panel/kartu memakai sudut membulat sedang (`rounded-xl`), border tipis, ruang lega, dan minim dekorasi.

## Warna referensi

| Peran | Warna lama |
| --- | --- |
| Sidebar | `#17392d` |
| Sidebar hover | `#244c38` |
| Sidebar active / avatar | `#c3d8b9` |
| Sidebar text muted | `#b8cdb7` |
| Canvas luar | `#f3f6f3` |
| Konten utama | `#f7f8f2` |
| Panel/table | `#f8fbf6` |
| Border panel | `#cbd8c8` |
| Pending | `#fff8e5` / `#c59028` |
| In progress | `#edf6f3` / `#397d73` |
| Completed | `#edf7ed` / `#3e8050` |
| Rejected | Rose status treatment |

Warna status berfungsi sebagai penanda; tetap sertakan teks status dan jangan mengandalkan warna saja.

## Layout dashboard lama

- Sidebar desktop hijau tua (sekitar 228 px) berisi identitas SWMS, navigasi Dashboard/Laporan/User, profil admin, dan logout.
- Pada layar sempit, navigasi berubah menjadi menu yang dapat dibuka dari header.
- Header menampilkan judul halaman dan identitas/status admin.
- Dashboard berisi panel pengantar, tombol menuju semua laporan, lima kartu statistik (semua, menunggu, diproses, selesai, pengguna), tabel laporan terbaru, serta panel tindakan berikutnya untuk antrean menunggu dan sedang diproses.
- Tabel laporan memuat pelapor, judul/lokasi, status, waktu masuk, dan aksi membuka detail.
- Ruang kerja menggunakan permukaan terang, padding konsisten, dan scroll konten di dalam shell pada desktop.

## Halaman autentikasi

- Pertahankan layout Blade lama: panel brand hijau tua di kiri dan form login di kanan pada layar lebar.
- Panel brand memuat identitas SWMS, pesan ringkas operasional, serta ringkasan laporan/status/tindakan.
- Pada layar sempit, panel brand berada di atas form dan kontennya tetap terbaca.
- Form memakai latar `#e8eee7`, kartu `#f8fbf6`, border `#cbd8c8`, dan field beraksen hijau.
- Hindari opsi ingat sesi yang belum didukung oleh sesi BFF.

## Perilaku dan aksesibilitas

- Pertahankan navigasi aktif yang jelas, fokus keyboard, label kontrol, semantic heading, dan target sentuh yang memadai.
- Gunakan layout responsif: sidebar desktop dan menu navigasi mobile tanpa menghilangkan aksi.
- Sediakan loading, error, dan empty state untuk data API; angka demo tidak boleh ditampilkan seolah data produksi.
- Detail visual ini direkonstruksi dari template Blade lama di riwayat backend, bukan dari screenshot lintas ukuran layar. Cocokkan dengan pengguna sebelum menyimpang besar dari layout tersebut.
