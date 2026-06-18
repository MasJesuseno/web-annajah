# 🚀 Panduan Deployment — SMA Annajah ke NiagaHoster

> **Panduan langkah demi langkah untuk deploy Website + CMS SMA Annajah ke NiagaHoster (cPanel) atau Hostinger (hPanel)**

---

## 📋 Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Persiapan Environment Variables](#2-persiapan-environment-variables)
3. [Persiapan Database di NiagaHoster (cPanel)](#3-persiapan-database-di-niagahoster-cpanel)
4. [Upload Kode ke NiagaHoster (cPanel)](#4-upload-kode-ke-niagahoster-cpanel)
5. [Setup Node.js App di cPanel](#5-setup-nodejs-app-di-cpanel)
6. [Setup Domain & SSL](#6-setup-domain--ssl)
7. [Migrasi Database Production](#7-migrasi-database-production)
8. [Pengaturan Awal (Pertama Kali)](#8-pengaturan-awal-pertama-kali)
9. [Update Konten Berkala](#9-update-konten-berkala)
10. [Troubleshooting](#10-troubleshooting)
11. [Lampiran: Hostinger (hPanel)](#11-lampiran-hostinger-hpanel)

---

## 1. Prasyarat

### ✅ Akun NiagaHoster

Pastikan Anda sudah memiliki paket hosting yang **mendukung Node.js** di NiagaHoster:

| Paket | Node.js Support | Keterangan |
|-------|----------------|------------|
| **Personal / Pelajar** | ❌ Tidak | Hanya PHP |
| **Professional / Bisnis** | ✅ Ya | Ada fitur **Setup Node.js App** |
| **Cloud / Premium** | ✅ Ya | Performa lebih baik |

> 💡 **Rekomendasi**: Minimal paket **Bisnis** atau **Professional** yang mendukung Node.js App.

### ✅ Domain

- Domain sudah terdaftar (misal: `smaannajah.sch.id`)
- DNS sudah mengarah ke NiagaHoster (nameserver NiagaHoster)
- Cek di **cPanel > Domains**

### ✅ Persiapan Lokal

```bash
# Pastikan project bisa build di lokal
npm run build

# Pastikan typecheck lulus
npx tsc --noEmit
```

### ✅ Git Repository (Opsional, tapi direkomendasikan)

```bash
# Di direktori project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/sma-annajah.git
git push -u origin main
```

---

## 2. Persiapan Environment Variables

Buat file `.env.production` di project lokal sebagai referensi. **Jangan commit file ini ke git!**

```env
# ============================================
# DATABASE — MySQL NiagaHoster
# ============================================
# Ganti dengan credential MySQL dari cPanel (lihat step 3)
DATABASE_URL="mysql://username:password@localhost:3306/db_webannajah"

# ============================================
# GOOGLE reCAPTCHA v2
# ============================================
# Buat di https://www.google.com/recaptcha/admin
# Pilih reCAPTCHA v2 > "I'm not a robot" Checkbox
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ld...
RECAPTCHA_SECRET=6Ld...

# ============================================
# NEXTAUTH — Security untuk session admin
# ============================================
# Generate random string:
NEXTAUTH_SECRET=your-random-secret-key-minimum-32-chars
# Ganti dengan URL domain production
NEXTAUTH_URL=https://smaannajah.sch.id
```

### 🔑 Cara Generate `NEXTAUTH_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a1b2c3d4e5f6... (64 karakter hex)
```

---

## 3. Persiapan Database di NiagaHoster (cPanel)

### 3.1 Buat Database MySQL

1. Login ke **cPanel** NiagaHoster (`https://domainanda.com/cpanel` atau `https://ip-server/cpanel`)
2. Cari menu **MySQL® Databases** (di bagian **Databases**)
3. Di bawah **Create New Database**, isi:
   - **Database Name**: `webannajah` (akan otomatis jadi `user_webannajah`)
4. Klik **Create Database**

### 3.2 Buat Database User

1. Scroll ke bawah ke **Add New User**
2. Isi:
   - **Username**: `annajah_user` (akan jadi `user_annajah_user`)
   - **Password**: Klik **Generate** atau isi manual (min 8 karakter, kombinasi huruf & angka)
   - Simpan password di catatan!
3. Klik **Create User**

### 3.3 Berikan Hak Akses User ke Database

1. Di **Add User To Database**, pilih:
   - **User**: `user_annajah_user`
   - **Database**: `user_webannajah`
2. Klik **Add**
3. Centang **ALL PRIVILEGES** (semua hak akses)
4. Klik **Make Changes**

### 3.4 Catat Credential Database

| Field | Contoh Value |
|-------|-------------|
| **Host** | `localhost` (selalu `localhost` di cPanel) |
| **Port** | `3306` |
| **Database** | `user_webannajah` |
| **Username** | `user_annajah_user` |
| **Password** | `P@ssw0rd123!` |

### 3.5 DATABASE_URL Final

```
DATABASE_URL="mysql://user_annajah_user:P@ssw0rd123!@localhost:3306/user_webannajah"
```

> ⚠️ **URL-encode Password**: Jika password mengandung karakter spesial (`@`, `:`, `/`, `%`, `#`, dll), URL-encode dulu:
> - `@` → `%40` | `:` → `%3A` | `/` → `%2F` | `#` → `%23` | `%` → `%25`
>
> Contoh: Password `P@ssw0rd!` → `P%40ssw0rd%21`

---

## 4. Upload Kode ke NiagaHoster (cPanel)

Ada **2 cara** upload kode ke NiagaHoster:

### 🔶 Cara A: Git Version Control (Rekomendasi)

1. Di **cPanel**, cari **Git Version Control** (di bagian **Files**)
2. Klik **Create** atau **Clone a Repository**
3. Isi:
   - **Clone URL**: `https://github.com/username/sma-annajah.git`
   - **Repository Path**: `public_html/sma-annajah` (atau langsung `public_html` jika untuk domain utama)
   - **Branch**: `main`
4. Klik **Create**
5. Setiap kali push ke GitHub, login ke cPanel dan klik **Update** untuk menarik perubahan terbaru

### 🔶 Cara B: Upload ZIP (Manual)

#### Langkah 1: Build & ZIP di Lokal

```bash
# Build project
npm run build

# Buat ZIP (PowerShell Windows):
Compress-Archive -Path .\* -DestinationPath ..\sma-annajah.zip -Exclude node_modules,.next,.env.local,.env.production

# Atau command line:
# 7z a -tzip ../sma-annajah.zip . -xr!node_modules -xr!.next -xr!.env*
```

> ⚠️ **PENTING**: Pastikan ZIP tidak menyertakan:
> - `node_modules/`
> - `.next/`
> - `.env.local` / `.env.production`
> - `.git/`

#### Langkah 2: Upload via cPanel File Manager

1. Login ke **cPanel**
2. Buka **File Manager** (di bagian **Files**)
3. Masuk ke folder `public_html/` (atau subdomain folder jika pakai subdomain)
4. Klik **Upload** → pilih file ZIP Anda
5. Setelah upload selesai, **Close** jendela upload
6. Klik kanan file ZIP → **Extract**
7. Hapus file ZIP setelah extract

#### Langkah 3: Install Dependencies di cPanel

Setelah file ter-extract, kita perlu install dependencies via SSH atau terminal cPanel:

**Via Terminal (jika tersedia):**
1. Di cPanel, cari **Terminal** (di bagian **Advanced**)
2. Jalankan:
```bash
cd public_html
npm install
npx prisma generate
```

**Via SSH:**
```bash
ssh user@ip-server-niagahoster
cd public_html
npm install
npx prisma generate
```

> Jika tidak ada akses terminal/SSH, install dependencies via **Setup Node.js App** di step 5.

---

## 5. Setup Node.js App di cPanel

Ini adalah langkah **paling penting**. cPanel memerlukan konfigurasi khusus untuk menjalankan aplikasi Node.js.

### 5.1 Buka Setup Node.js App

1. Di **cPanel**, cari **Setup Node.js App** (di bagian **Software**)
2. Klik **Create Application**
3. Atau jika sudah ada aplikasi, klik **Edit**

### 5.2 Pengaturan Aplikasi

| Setting | Value |
|---------|-------|
| **Node.js version** | Pilih **20.x.x** atau **22.x.x** (versi LTS terbaru) |
| **Application mode** | `Production` |
| **Application root** | `public_html` (atau `public_html/nama-folder` jika di subfolder) |
| **Application URL** | Domain Anda (misal: `smaannajah.sch.id`) |
| **Application startup file** | `node_modules/next/dist/bin/next` |
| **Passenger log file** | Biarkan default |
| **Environment variables** | Tambahkan variabel di bawah ini |

### 5.3 Environment Variables

Tambahkan environment variables satu per satu dengan klik **Add Variable**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `mysql://user_annajah_user:P%40ssw0rd%21@localhost:3306/user_webannajah` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `6Ld...` |
| `RECAPTCHA_SECRET` | `6Ld...` |
| `NEXTAUTH_SECRET` | `a1b2c3d4...` |
| `NEXTAUTH_URL` | `https://smaannajah.sch.id` |
| `NODE_ENV` | `production` |

### 5.4 Start Aplikasi

Setelah semua setting:
1. Klik **Create** atau **Save**
2. cPanel akan otomatis menjalankan `npm install` lalu `npm start`
3. Tunggu 1-3 menit hingga status berubah menjadi **Running**

> 💡 **Tips**: Jika aplikasi tidak langsung running, cek **Error Log** di cPanel untuk melihat pesan error.

### 5.5 Restart Aplikasi

Setiap kali Anda mengupdate kode, restart aplikasi:
1. Buka **Setup Node.js App**
2. Klik **Stop** → **Start** (atau **Restart**)

---

## 6. Setup Domain & SSL

### 6.1 Pastikan DNS Mengarah ke NiagaHoster

Nameserver NiagaHoster:
```
ns1.niagahoster.com
ns2.niagahoster.com
```

Cek di **cPanel > Domains** pastikan domain Anda terdaftar.

Jika belum pointing:
1. Login ke **panel NiagaHoster** → **Domains**
2. Klik **Kelola** pada domain Anda
3. Pastikan nameserver sudah diarahkan ke NiagaHoster

### 6.2 Aktifkan SSL (HTTPS)

1. Di **cPanel**, cari **SSL/TLS** atau **SSL/TLS Status**
2. Klik **Run AutoSSL** (biasanya sudah otomatis aktif)
3. Atau install manual lewat **SSL Certificates** → **Generate, view, upload, or delete SSL certificates**
4. Pastikan **Force HTTPS** aktif (redirect HTTP → HTTPS)

SSL aktif dalam 1-5 menit.

### 6.3 Setup Subdomain (Opsional)

Jika ingin aplikasi di subdomain (misal: `app.smaannajah.sch.id`):

1. Di **cPanel**, cari **Subdomains**
2. Isi **Subdomain**: `app`
3. **Document Root**: `public_html/sma-annajah` (folder tempat file project)
4. Klik **Create**
5. Lalu setup Node.js App dengan URL `app.smaannajah.sch.id`

---

## 7. Migrasi Database Production

Setelah Node.js app berjalan dan database sudah dibuat, jalan migrasi & seed:

### 7.1 Melalui Terminal cPanel

```bash
# Masuk ke direktori project
cd public_html

# Jalankan migrasi
npx prisma migrate deploy

# Seed data awal (admin user, dll)
npx prisma db seed
```

### 7.2 Melalui SSH (Jika Terminal Tidak Tersedia)

```bash
ssh user@ip-niagahoster
cd public_html
npx prisma migrate deploy
npx prisma db seed
```

### 7.3 Melalui phpMyAdmin (Metode Manual)

Jika tidak ada terminal/SSH:

**Langkah 1: Export schema & data dari lokal**

```bash
# Export schema + data (tanpa node_modules)
# Buka command prompt sebagai Administrator
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump" -u root webannajah > schema-data.sql
```

**Langkah 2: Import via phpMyAdmin**

1. Di **cPanel**, cari **phpMyAdmin**
2. Pilih database `user_webannajah` di sidebar kiri
3. Klik tab **SQL**
4. Klik **Choose File** → pilih file `schema-data.sql`
5. Klik **Go**

**Langkah 3: Update Prisma Client**

Setelah import, pastikan Prisma client sudah digenerate:
```bash
cd public_html
npx prisma generate
```

---

## 8. Pengaturan Awal (Pertama Kali)

### 🌐 Website Publik

```
https://smaannajah.sch.id
```

### 🔐 Panel Admin

```
https://smaannajah.sch.id/login
```

Login dengan akun default:

| Field | Value |
|-------|-------|
| **Email** | `admin@smaannajah.sch.id` |
| **Password** | `admin123` |

### ⚠️ WAJIB: Ganti Password Admin!

1. Login ke admin panel
2. Buka menu **Users**
3. Ganti password admin segera
4. Juga ganti `NEXTAUTH_SECRET` di environment variables

### ✅ Cek Halaman Publik

- [ ] `/` — Beranda (cek WhatsApp button di kanan bawah)
- [ ] `/profil` — Profil
- [ ] `/berita` — Berita
- [ ] `/galeri` — Galeri
- [ ] `/kontak` — Kontak & form
- [ ] Halaman statis (Ekstrakurikuler, Dewan Guru)

### ✅ Cek Panel Admin

- [ ] `/admin` — Dashboard
- [ ] `/admin/posts` — Postingan
- [ ] `/admin/settings` — Pengaturan (isi nomor WhatsApp!)
- [ ] Upload gambar berfungsi

---

## 9. Update Konten Berkala

### 🔄 Update Konten Admin

Cukup login ke panel admin seperti biasa. Semua perubahan langsung tersimpan di database.

### 🚀 Update Kode Aplikasi

**Via Git Version Control (cPanel):**

```bash
# Update di lokal
git add .
git commit -m "Update fitur X"
git push origin main
```

Lalu di cPanel:
1. Buka **Git Version Control**
2. Klik **Update** pada repository
3. Buka **Setup Node.js App**
4. Klik **Restart**

**Via ZIP (manual):**

1. Build ulang di lokal: `npm run build`
2. Buat ZIP (tanpa node_modules, .next, .env)
3. Upload via **File Manager** dan extract (timpa file lama)
4. Buka **Setup Node.js App** → **Restart**

> ⚠️ Hati-hati: Jangan timpa folder `public/uploads/` (gambar yang sudah diupload)!

### 📦 Backup Database Berkala

**Via cPanel:**
1. Buka **phpMyAdmin**
2. Pilih database → **Export** → **Go** (download .sql)

**Otomatis via Cron Job:**
1. Di **cPanel**, cari **Cron Jobs**
2. Buat cron job harian:
```bash
mysqldump -u user_annajah_user -p'P@ssw0rd!' user_webannajah | gzip > /home/user/backups/annajah-$(date +\%Y-\%m-\%d).sql.gz
```

Atau pakai fitur **Backup Database** di Pengaturan Admin (menu Settings > Backup Database).

---

## 10. Troubleshooting

### ❌ Aplikasi Error 500 / Blank Page

| Masalah | Solusi |
|---------|--------|
| **Database tidak terkoneksi** | Cek `DATABASE_URL` di environment variables cPanel |
| **Prisma client belum generate** | `cd public_html && npx prisma generate` via terminal |
| **Migrasi belum jalan** | `npx prisma migrate deploy` |
| **Node.js versi salah** | Ganti ke 20.x di **Setup Node.js App** |
| **File upload tidak muncul** | Folder `public/uploads` harus ada (755 permission) |

### ❌ Cannot find module '@prisma/client'

```bash
cd public_html
npx prisma generate
```

### ❌ Form Kontak Tidak Terkirim

- Cek Google reCAPTCHA key: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` dan `RECAPTCHA_SECRET`
- Pastikan domain sudah terdaftar di [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)

### ❌ Login Gagal / Redirect Loop

1. Cek `NEXTAUTH_URL` — harus URL persis (dengan https://)
2. Cek `NEXTAUTH_SECRET` — harus string random yang konsisten
3. Cek database: apakah user admin ada?

### ❌ Gambar Tidak Muncul

- Cek folder `public/uploads` — pastikan ada dan berisi
- Cek permission: `755` untuk folder, `644` untuk file
- URL gambar di database mungkin masih menggunakan path lokal

### ❌ Build Gagal / Out of Memory

cPanel shared hosting punya resource terbatas. Solusi:

1. Tambahkan environment variable:
```
NODE_OPTIONS=--max-old-space-size=512
```

2. Atau build di lokal dan upload hasil build:
```bash
# Build di lokal (sudah dilakukan sebelumnya)
npm run build

# Upload folder .next beserta file project lainnya (tanpa node_modules)
# Lalu di cPanel jalankan hanya: npm install --production
```

### 📖 Melihat Log Aplikasi

Di **cPanel**:
1. Buka **Setup Node.js App**
2. Klik **Manage** pada aplikasi Anda
3. Scroll ke bawah → **Error Log** atau **Passenger Log**

Atau via **File Manager** → lihat file `error_log` atau `logs/` di folder project.

---

## 11. Lampiran: Hostinger (hPanel)

Jika Anda menggunakan **Hostinger** (bukan NiagaHoster), Hostinger menggunakan **hPanel** (bukan cPanel).

### Perbedaan Utama

| Fitur | NiagaHoster (cPanel) | Hostinger (hPanel) |
|-------|---------------------|-------------------|
| Panel | cPanel | hPanel |
| Node.js | Setup Node.js App | Websites → Pilih site → Node.js |
| File Manager | File Manager | Websites → Pilih site → Files |
| Database | MySQL Databases | Websites → Pilih site → Database |
| Git | Git Version Control | Websites → Pilih site → Add Website → Import Git Repository |

### Panduan Hostinger

Ikuti panduan di [dokumentasi Hostinger Node.js](https://support.hostinger.com/en/articles/9497155-how-to-set-up-a-node-js-web-application) atau lihat ringkasan di bawah:

1. Login ke **hPanel** (`https://hpanel.hostinger.com`)
2. **Websites** → Pilih website Anda
3. Sidebar kiri → **Node.js**
4. **Create Node.js App** → isi:
   - **Node.js Version**: 20.x
   - **Application Root**: `/`
   - **Entry file**: `node_modules/next/dist/bin/next`
5. Setup **Environment Variables** (sama seperti di atas)
6. Klik **Save & Deploy**
7. Setup **MySQL Database** via menu **Database** di hPanel
8. Jalankan migrasi via terminal hPanel jika tersedia

---

## ✅ Ringkasan Checklist

### Sebelum Deployment
- [ ] `npm run build` sukses di lokal
- [ ] `npx tsc --noEmit` lulus (tidak ada type error)
- [ ] Database MySQL production sudah dibuat di cPanel
- [ ] Environment variables sudah disiapkan
- [ ] Nomor WhatsApp sudah diisi di pengaturan (jika perlu)

### Saat Deployment
- [ ] Kode terupload (via Git atau ZIP)
- [ ] Node.js app dikonfigurasi (versi 20.x, env vars)
- [ ] Database migration berjalan (`npx prisma migrate deploy`)
- [ ] Seed data dijalankan (`npx prisma db seed`)
- [ ] SSL/HTTPS aktif
- [ ] Domain terhubung

### Setelah Deployment
- [ ] Website publik bisa diakses (cek WhatsApp button)
- [ ] Admin login berfungsi
- [ ] Password admin sudah diganti
- [ ] Upload gambar berfungsi
- [ ] Form kontak berfungsi (reCAPTCHA)
- [ ] Isi nomor WhatsApp di Settings
- [ ] Backup database sudah dijadwalkan

---

## 🔗 Referensi

- [Dokumentasi Node.js cPanel](https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node-js-application/)
- [NiagaHoster Knowledge Base](https://www.niagahoster.co.id/blog/tag/cpanel/)
- [Hostinger Node.js Web App](https://support.hostinger.com/en/articles/9497155-how-to-set-up-a-node-js-web-application)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [NextAuth Production Guide](https://next-auth.js.org/deployment)

---

> **Terakhir diupdate:** Juni 2026  
> **Project:** SMA Annajah Website & CMS  
> **Dibuat dengan:** Next.js 16 · TypeScript · Tailwind CSS v4 · Prisma 6 (MySQL) · NextAuth v5  
> Butuh bantuan? Buka issue di repository GitHub atau hubungi developer.
