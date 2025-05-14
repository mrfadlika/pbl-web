# Aplikasi Lost & Found

Aplikasi Lost & Found adalah platform untuk membantu menemukan dan melaporkan barang hilang atau ditemukan di lingkungan kampus.

## Struktur Folder

Struktur folder dalam aplikasi ini telah diorganisir dengan baik untuk memudahkan pengembangan dan maintenance:

```
fe-pbl/
├── src/
│   ├── components/
│   │   ├── Footer/           # Komponen Footer global
│   │   ├── Form/             # Komponen formulir untuk pelaporan
│   │   ├── Home/             # Komponen halaman utama
│   │   ├── Katalog/          # Komponen katalog barang
│   │   │   ├── Ditemukan/    # Halaman barang ditemukan
│   │   │   ├── Hilang/       # Halaman barang hilang
│   │   │   ├── Katalog.hooks.jsx # Data dummy untuk katalog
│   │   │   └── index.jsx     # Komponen utama katalog
│   │   └── Modal/            # Komponen modal detail barang
│   │       ├── Modal.hooks.jsx # Data terkait modal
│   │       └── index.jsx     # Komponen modal
│   ├── routes/               # Konfigurasi routing aplikasi
│   └── assets/               # Asset statis seperti gambar dan ikon
```

## Komponen Utama

### Modal

Komponen `Modal` menampilkan detail barang yang dipilih dari katalog. Komponen ini bersifat reusable dan dapat digunakan di berbagai bagian aplikasi.

### Katalog

Komponen `Katalog` menampilkan daftar barang hilang atau ditemukan. Terdiri dari dua bagian utama:
- `KatalogHilang`: Menampilkan daftar barang hilang
- `KatalogDitemukan`: Menampilkan daftar barang ditemukan

### Form

Aplikasi menyediakan beberapa formulir untuk pelaporan:
- `ClaimForm`: Formulir untuk melaporkan penemuan barang hilang
- `ReportForm`: Formulir untuk melaporkan pemilik barang yang ditemukan
- `FormuliBarangHilang`: Formulir untuk melaporkan barang hilang
- `FormuliBarangDitemukan`: Formulir untuk melaporkan barang ditemukan

## Fitur Utama

1. **Pencarian Barang**: Pengguna dapat mencari barang berdasarkan nama, kategori, dll.
2. **Filter Kategori**: Pengguna dapat memfilter barang berdasarkan kategori
3. **Detail Barang**: Pengguna dapat melihat detail barang dan laporan terkait
4. **Pelaporan**: Pengguna dapat melaporkan barang hilang, barang ditemukan, atau mengklaim kepemilikan
5. **Berbagi Informasi**: Pengguna dapat membagikan informasi barang melalui berbagai platform sosial media

## Alur Pengguna

### Barang Hilang
1. Pengguna melihat daftar barang hilang di `/lost-items`
2. Jika pengguna menemukan barang di katalog, pengguna dapat mengklik item dan menekan tombol "Laporan Penemuan"
3. Pengguna diarahkan ke `ClaimForm` untuk melaporkan penemuan

### Barang Ditemukan
1. Pengguna melihat daftar barang ditemukan di `/found-items`
2. Jika pengguna melihat barangnya, pengguna dapat mengklik item dan menekan tombol "Laporan Pemilik"
3. Pengguna diarahkan ke `ReportForm` untuk melaporkan kepemilikan

## Pengembangan

### Teknologi yang Digunakan
- React
- Tailwind CSS
- React Router

### Struktur Data

Data dummy untuk aplikasi disimpan dalam file hooks terpisah untuk memisahkan logika dan data, seperti `Katalog.hooks.jsx` yang berisi data untuk komponen Katalog.
