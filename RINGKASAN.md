# 📋 RINGKASAN DEPLOYMENT — SMA Annajah ke Niagahoster

> **Website:** https://smaannajah.sch.id
> **Domain:** smaannajah.sch.id
> **Hosting:** Niagahoster (cPanel + CloudLinux)
> **Tanggal:** Juni 2026

---

## ✅ Status Deployment

| Komponen | Status | Keterangan |
|----------|--------|------------|
| **Website Publik** | ✅ Online | https://smaannajah.sch.id |
| **Panel Admin** | ✅ Online | https://smaannajah.sch.id/login |
| **Database** | ✅ Terkoneksi | MySQL via phpMyAdmin |
| **SSL/HTTPS** | ⬜ Belum aktif | Jalankan AutoSSL di cPanel |

---

## 🗂️ Struktur File di Server

```
/home/u1108612/public_html/
├── nextjs/                    # ← Root aplikasi Next.js
│   ├── server.js              # Custom entry point (Passenger)
│   ├── .next/                 # Build output (jangan dihapus!)
│   ├── node_modules/          # Symlink (dikelola CloudLinux)
│   ├── package.json
│   ├── prisma/
│   ├── public/
│   ├── src/
│   └── ...
├── web_lama.bak/              # Backup WordPress (nonaktif)
├── .htaccess.bak              # Backup .htaccess (nonaktif)
└── .env                       # (Bisa dihapus, sudah via env vars)
```

---

## ⚙️ Konfigurasi Node.js di cPanel

| Setting | Value |
|---------|-------|
| **Node.js version** | 20.20.2 |
| **Application mode** | Production |
| **Application root** | `public_html/nextjs` |
| **Application URL** | `smaannajah.sch.id` |
| **Application startup file** | `server.js` |

### Environment Variables

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `mysql://u1108612_annajah_user:%404dminSejak1981@localhost:3306/u1108612_webannajah` |
| `NEXTAUTH_SECRET` | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` (ganti jika perlu) |
| `NEXTAUTH_URL` | `https://smaannajah.sch.id` |
| `NODE_ENV` | `production` |

---

## 🔑 Akun Admin

| Field | Value |
|-------|-------|
| **URL Login** | https://smaannajah.sch.id/login |
| **Email** | `admin@smaannajah.sch.id` |
| **Password** | `admin123` |

> ⚠️ **WAJIB ganti password admin** setelah login pertama!

---

## 📝 Catatan Penting

### Setup Node.js di cPanel (CloudLinux)
- CloudLinux menggunakan **symlink** untuk `node_modules`, bukan folder biasa
- Jangan upload folder `node_modules` — biarkan cPanel yang install via **Run NPM Install**
- Jika ada error "demands to store node modules in separate folder", hapus folder `node_modules` lalu klik **Run NPM Install**

### Custom Server (server.js)
File `server.js` dibuat karena Passenger di cPanel memerlukan custom entry point untuk Next.js:

```javascript
const http = require('http');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(3000);
});
```

### Update Website
1. **Build di lokal**: `npm run build`
2. Upload folder `.next` ke `public_html/nextjs/` (timpa)
3. **Restart** di Setup Node.js App

---

## ✅ Checklist Pasca-Deployment

- [ ] **SSL/HTTPS** — Aktifkan AutoSSL di cPanel
- [ ] **Ganti password admin** — Login → Users → Edit Admin
- [ ] **Isi Settings** — `/admin/settings` (WA, PPDB, logo, dll)
- [ ] **Google reCAPTCHA** — Daftarkan domain di https://www.google.com/recaptcha/admin
- [ ] **Bersihkan** — Hapus file `sma-annajah-full.sql`, `sma-annajah-min.sql`, folder `web_lama.bak` dari server
