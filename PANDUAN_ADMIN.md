# 📘 Panduan Admin — SMA Annajah Website

> **Website:** https://smaannajah.sch.id
> **Login:** https://smaannajah.sch.id/login

---

## 📋 Daftar Isi

1. [Cara Login](#-cara-login)
2. [Dashboard](#-dashboard)
3. [Mengelola Postingan/Berita](#-mengelola-postinganberita)
4. [Mengelola Kategori & Tag](#-mengelola-kategori--tag)
5. [Mengelola Halaman Statis](#-mengelola-halaman-statis)
6. [Mengelola Menu Navigasi](#-mengelola-menu-navigasi)
7. [Mengelola Galeri & Album](#-mengelola-galeri--album)
8. [Mengelola Testimoni Alumni](#-mengelola-testimoni-alumni)
9. [Mengelola Pesan Masuk](#-mengelola-pesan-masuk)
10. [Mengelola Pengguna](#-mengelola-pengguna)
11. [Pengaturan Website](#-pengaturan-website)
12. [Tips & Trik](#-tips--trik)
13. [Troubleshooting](#-troubleshooting)

---

## 🔐 Cara Login

1. Buka **https://smaannajah.sch.id/login**
2. Masukkan **Email** dan **Password**
3. Klik tombol **Masuk**

### Akun Tersedia

| Akun | Email | Password | Role |
|------|-------|----------|------|
| **Super Admin** | `4dminSejak1981@smaannajah.sch.id` | `@4dminSejak1981` | Full akses |
| **Editor** | `nurul@smaannajah.sch.id` | `@4dminSejak1981` | Kelola konten |
| **Penulis** | `nok@smaannajah.sch.id` | `@4dminSejak1981` | Tulis postingan |

> ⚠️ **Segera ganti password** setelah login pertama! Menu **Pengguna > Edit**.
> Jika lupa password, hubungi Super Admin untuk reset.

---

## 📊 Dashboard

Setelah login, Anda akan masuk ke halaman **Dashboard**. Di sini ditampilkan:

- **Total Postingan** — Jumlah artikel/berita yang sudah dipublikasikan
- **Total Pesan** — Jumlah pesan dari form kontak
- **Total Pengguna** — Jumlah admin/editor/penulis
- **Total Galeri** — Jumlah foto di galeri

---

## 📝 Mengelola Postingan/Berita

### Membuat Berita Baru

1. Klik menu **Postingan** di sidebar kiri
2. Klik tombol **+ Buat Postingan**
3. Isi form:
   - **Judul** — Judul berita (akan otomatis dibuatkan slug/link)
   - **Konten** — Gunakan editor teks untuk menulis berita
   - **Kategori** — Pilih kategori (Akademik, Kegiatan, Prestasi, dll.)
   - **Tags** — Pilih tag yang sesuai
   - **Gambar Utama** — Klik untuk upload gambar dari komputer
   - **Status** — Pilih **Published** jika ingin langsung tampil
   - **Unggulan** — Centang jika ingin tampil di slider berita unggulan halaman depan
4. Klik **Simpan**

### Mengedit Berita

1. Klik judul berita yang ingin diedit
2. Ubah konten sesuai kebutuhan
3. Klik **Simpan**

### Menghapus Berita

1. Arahkan mouse ke berita yang ingin dihapus
2. Klik ikon **tong sampah** (🗑️)
3. Konfirmasi penghapusan

> 💡 **Tips:** Gunakan status **Draft** untuk menyimpan berita yang belum selesai.
> Berita dengan status **Archived** tidak akan tampil di halaman publik.

### Editor Teks (Rich Text Editor)

Saat menulis konten, Anda akan melihat toolbar dengan tombol:

| Tombol | Fungsi |
|--------|--------|
| **B** | Tebalkan teks |
| *I* | Miringkan teks |
| <u>U</u> | Garis bawah |
| **H2** | Heading level 2 (sub judul) |
| **H3** | Heading level 3 (sub-sub judul) |
| ••• | List bullet |
| 1.2.3 | List nomor |
| 🔗 | Tambahkan link |
| 🖼️ | Sisipkan gambar (upload dari komputer) |
| — | Garis horizontal (pemisah) |
| `</>` | Kode/source code |

---

## 🏷️ Mengelola Kategori & Tag

### Kategori

Kategori digunakan untuk mengelompokkan berita.

**Cara mengelola:**
1. Klik menu **Kategori**
2. Untuk menambah: klik **+ Tambah Kategori**
3. Isi **Nama** dan pilih **Warna** (setiap kategori punya warna berbeda)
4. Klik **Simpan**

### Tag

Tag adalah kata kunci untuk berita (lebih spesifik dari kategori).

**Cara mengelola:**
1. Klik menu **Tags**
2. Untuk menambah: klik **+ Tambah Tag**
3. Isi **Nama Tag**
4. Klik **Simpan**

---

## 📄 Mengelola Halaman Statis

Halaman statis adalah halaman seperti **Ekstrakurikuler**, **Dewan Guru**, **PPDB**, dll.

**Cara mengelola:**
1. Klik menu **Halaman**
2. Klik **+ Buat Halaman Baru**
3. Isi:
   - **Judul** — Contoh: "Ekstrakurikuler"
   - **Konten** — Tulis konten halaman (bisa panjang, bisa pakai gambar)
   - **Slug** — Link halaman (otomatis, contoh: `ekstrakurikuler`)
   - **Status** — **Published** agar tampil
4. Klik **Simpan**

Halaman otomatis bisa diakses di: `https://smaannajah.sch.id/[slug]`
Contoh: `https://smaannajah.sch.id/ekstrakurikuler`

> 💡 Untuk menampilkan halaman di menu navigasi, atur di **Menu**.

---

## 🧭 Mengelola Menu Navigasi

Menu navigasi adalah menu yang tampil di bagian atas website.

**Cara mengelola:**
1. Klik menu **Menu**
2. Pilih grup menu (misal: **Menu Utama**)
3. Untuk menambah item:
   - Klik **+ Tambah Item**
   - Isi **Label** (teks yang tampil, contoh: "Tentang Kami")
   - Pilih **Tipe**:
     - **Link** — URL bebas (contoh: `https://...`)
     - **Halaman** — Pilih dari halaman statis yang sudah dibuat
   - Klik **Simpan**

### Menu Bertingkat (Dropdown)

Untuk membuat menu dropdown:
1. Buat item menu utama terlebih dahulu
2. Saat membuat item baru, pilih **Induk** dari item yang sudah ada
3. Item baru akan menjadi sub-menu

> 💡 **Tips:** Menu bisa di-drag & drop untuk mengubah urutan.

---

## 🖼️ Mengelola Galeri & Album

### Album

Album adalah kumpulan foto berdasarkan tema/kegiatan.

**Cara membuat album:**
1. Klik menu **Album**
2. Klik **+ Tambah Album**
3. Isi **Judul** dan upload **Gambar Sampul** (opsional)
4. Klik **Simpan**

### Galeri (Foto)

**Cara upload foto:**
1. Klik menu **Galeri**
2. Klik **+ Tambah Gambar**
3. Pilih file gambar dari komputer
4. Isi **Judul** (opsional)
5. Pilih **Album** tempat foto disimpan
6. Centang **Tampilkan di Halaman Utama** jika ingin foto tampil di slider beranda
7. Klik **Simpan**

### Edit Mode Galeri

Untuk mengedit foto yang sudah ada:
1. Klik tombol **Edit Mode** di pojok kanan atas halaman Galeri
2. Foto akan menampilkan form edit di bawahnya
3. Ubah judul, ganti gambar, atau atur album
4. Klik **Simpan**

---

## 🎓 Mengelola Testimoni Alumni

**Cara menambah testimoni:**
1. Klik menu **Alumni**
2. Klik **+ Tambah Alumni**
3. Upload **Foto** alumni
4. Isi **Nama**, **Tahun Lulus**, dan **Testimoni**
5. Centang **Aktif** agar tampil di halaman utama
6. Klik **Simpan**

Testimoni akan tampil di halaman utama (homepage) sebagai **carousel** (sliding).
Urutan tampil bisa diatur dengan field **Urutan**.

---

## ✉️ Mengelola Pesan Masuk

Pesan dari form kontak di halaman publik masuk ke menu **Pesan Masuk**.

**Fitur:**
- Lihat daftar pesan (nama, subjek, tanggal)
- Klik pesan untuk melihat detail
- Pesan baru ditandai **belum dibaca** (bold)
- Klik **Tandai sudah dibaca** setelah membaca
- Hapus pesan yang tidak diperlukan

---

## 👥 Mengelola Pengguna

**Cara menambah pengguna baru:**
1. Klik menu **Pengguna**
2. Klik **+ Tambah Pengguna**
3. Isi **Nama**, **Email**, **Password**
4. Pilih **Role** (Super Admin / Editor / Penulis)
5. Centang **Aktif**
6. Klik **Simpan**

### Role & Hak Akses

| Role | Hak Akses |
|------|-----------|
| **Super Admin** | Segala akses (termasuk pengaturan, pengguna, backup) |
| **Editor** | Kelola postingan, halaman, galeri, menu, alumni, pesan |
| **Penulis** | Hanya menulis & mengelola postingan sendiri |

### Menonaktifkan Pengguna

Untuk menonaktifkan akun (tanpa menghapus):
1. Edit pengguna
2. Hilangkan centang **Aktif**
3. Simpan

Pengguna nonaktif tidak bisa login.

---

## ⚙️ Pengaturan Website

Menu **Pengaturan** memiliki 4 tab:

### 1️⃣ Informasi Umum

Berisi data sekolah yang tampil di website:

| Field | Fungsi | Contoh |
|-------|--------|--------|
| **Nama Sekolah** | Nama resmi | SMA Annajah |
| **Nama Singkat** | Tampil di header/footer | SMA Annajah |
| **Slogan** | Slogan di halaman utama | `Mewujudkan Generasi\|Berprestasi & Berakhlak Mulia` |
| **Deskripsi** | Teks hero di homepage | ... |
| **Alamat** | Alamat lengkap sekolah | ... |
| **Telepon** | Nomor telepon | ... |
| **Email** | Email sekolah | ... |
| **Website** | URL website | https://smaannajah.sch.id |
| **Jam Operasional** | Jam kerja sekolah | Senin - Jumat: 07:00 - 16:00 |
| **WhatsApp** | No. WA (kode negara, tanpa +) | 6281234567890 |
| **URL PPDB** | Link daftar PPDB | https://... |
| **Visi** | Visi sekolah | ... |
| **Misi** | Misi sekolah | ... |
| **Tentang** | Tentang sekolah | ... |
| **Sejarah** | Sejarah sekolah | ... |
| **Statistik** | Jumlah guru, siswa, prestasi | ... |
| **3 Poin Unggulan** | Judul & deskripsi 3 poin | ... |
| **Media Sosial** | Link YouTube, IG, FB, Twitter | ... |
| **Logo & Favicon** | Upload logo & favicon | PNG/JPG/SVG |
| **Banner Home** | Gambar banner homepage | 1920x800px |

> 💡 **Slogan dengan format khusus:** Gunakan karakter `|` (pipe) untuk memisahkan baris pertama dan kedua. Contoh: `Mewujudkan Generasi|Berprestasi & Berakhlak Mulia` akan tampil sebagai:
> 
> **Mewujudkan Generasi**
> **Berprestasi & Berakhlak Mulia** (warna berbeda)

### 2️⃣ Tampilan & Warna

- **Warna Utama** — Pilih warna tema website
- **Pilihan Warna** — 11 preset warna tersedia
- **Warna Kustom** — Bisa pilih warna bebas via color picker
- **Pratinjau** — Lihat contoh tampilan dengan warna yang dipilih

### 3️⃣ Font & Tipografi

- **Font Judul** — Font untuk heading (6 pilihan)
- **Font Teks** — Font untuk body text (6 pilihan)
- **Ukuran Font** — 14px - 18px
- **Ketebalan Judul** — 600 (semibold) - 900 (black)
- **Pratinjau** — Contoh teks dengan pengaturan font

### 4️⃣ Backup Database

- **Buat Backup** — Klik untuk membuat backup database (file .sql)
- **Riwayat Backup** — Daftar file backup yang tersedia
- **Download** — Unduh file backup
- **Hapus** — Hapus backup yang tidak diperlukan

> ⚠️ **Backup rutin** dianjurkan dilakukan seminggu sekali atau sebelum perubahan besar.

---

## 💡 Tips & Trik

### Menulis Berita yang Baik
- Gunakan **judul yang menarik** dan informatif
- Tambahkan **gambar utama** agar berita lebih menarik
- Gunakan **sub-judul (H2/H3)** untuk memecah konten panjang
- Pilih **kategori dan tag** yang sesuai agar berita mudah ditemukan
- Centang **Unggulan** untuk berita penting yang ingin ditonjolkan di homepage

### Ukuran Gambar yang Disarankan
| Jenis | Ukuran | Format |
|-------|--------|--------|
| Banner Homepage | 1920 x 800 px | JPG, PNG, WebP |
| Foto Berita | 1200 x 750 px (16:10) | JPG, PNG, WebP |
| Foto Galeri | 1200 x 1200 px (1:1) | JPG, PNG, WebP |
| Foto Alumni | 400 x 400 px (1:1) | JPG, PNG |
| Logo | 200 x 200 px | PNG, SVG |
| Favicon | 32 x 32 px | PNG, ICO |

### Urutan Menu
Item menu bisa di-drag & drop untuk mengubah urutan. Menu paling atas akan tampil paling kiri di navigasi.

### Gambar Tidak Tampil?
Jika gambar tidak muncul di website:
1. Pastikan file sudah terupload (cek di Galeri/Pengaturan)
2. Refresh halaman (CTRL + F5)
3. Jika menggunakan gambar dari URL eksternal, pastikan URL-nya benar

---

## 🔧 Troubleshooting

### Tidak Bisa Login
- Pastikan email dan password benar
- Pastikan akun masih **Aktif** (cek di menu Pengguna)
- Coba reset password oleh Super Admin
- Hapus cache browser

### Perubahan Tidak Tampil
- Setelah menyimpan perubahan, refresh halaman publik (CTRL + F5)
- Beberapa perubahan mungkin perlu beberapa detik untuk tampil
- Untuk perubahan pengaturan, pastikan sudah klik **Simpan Pengaturan**

### Error 500 / Server Error
- Coba refresh halaman
- Jika terus terjadi, hubungi pengembang/teknis
- Cek koneksi internet

### Lupa Password
Hubungi Super Admin untuk mereset password. Super Admin bisa mengubah password dari menu **Pengguna > Edit**.

---

## 📞 Kontak Pengembang

Jika ada masalah teknis atau perlu bantuan:

- **Email:** (isi email pengembang)
- **WA:** (isi nomor WA pengembang)

---

> **SMA Annajah Website & CMS**
> Dibangun dengan Next.js · Prisma · MySQL
> Versi 1.0 — Juni 2026
