# RPLTwoFess — Panduan Restore Backup

Dokumen ini menjelaskan langkah-langkah memulihkan (restore) project RPLTwoFess ke kondisi stabil sebelum motion update (`backup/pre-motion-update`).

---

## Opsi 1: Restore Menggunakan Git (Direkomendasikan Jika Menggunakan Repository)

Jika Anda ingin kembali ke kondisi saat checkpoint ini dibuat pada Git repository:

### 1. Buat Branch Baru dari Tag Checkpoint
```bash
git fetch --all --tags
git switch -c restore/pre-motion-update backup/pre-motion-update
```

### 2. Verifikasi Commit & Status
```bash
git log -1
git status
```

### 3. Install Ulang Dependency & Validasi Build
```bash
npm install
npm run lint
npm run build
```

---

## Opsi 2: Restore Menggunakan File Archive ZIP

Jika Anda memulihkan dari file archive `RPLTwoFess-backup-pre-motion-2026-09-06.zip`:

### Langkah 1: Ekstrak Archive
Ekstrak file ZIP ke folder project baru:
```bash
# Contoh PowerShell:
Expand-Archive -Path "backup/RPLTwoFess-backup-pre-motion-2026-09-06.zip" -DestinationPath "./RPLTwoFess-Restored"
```

### Langkah 2: Setup Environment Variables
Salin template [`.env.example.backup`](file:///d:/Vs%20Project/mfess/.env.example.backup) menjadi `.env.local`:
```bash
cp .env.example.backup .env.local
```
Buka `.env.local` dan masukkan kembali kunci rahasia asli dari dashboard Supabase & Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENDER_HASH_SALT`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` (opsional)
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` (opsional)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (opsional jika menggunakan push notification)
- `VAPID_PRIVATE_KEY` (opsional)
- `VAPID_SUBJECT` (opsional)

### Langkah 3: Install Dependency
Jalankan instalasi package menggunakan npm:
```bash
npm install
```

### Langkah 4: Verifikasi Database Supabase
Jika database baru dibuat atau perlu disinkronkan, jalankan query SQL yang ada di:
[`supabase/schema.sql`](file:///d:/Vs%20Project/mfess/supabase/schema.sql)
di dalam SQL Editor pada Dashboard Supabase Anda.

Pastikan tabel berikut tersedia dan RLS aktif:
- `messages`
- `reports`
- `blocks`
- `site_settings`
- `rate_limits`
- `documentation`
- `push_subscriptions`

Serta bucket Storage:
- `documentation` (Public)

### Langkah 5: Linting & Build Verification
Jalankan pengecekan kode:
```bash
npm run lint
```
Pastikan menghasilkan `0 errors, 0 warnings`.

Kemudian jalankan build produksi:
```bash
npm run build
```
Pastikan kompilasi Next.js Turbopack selesai dengan status sukses (`Compiled successfully`).

### Langkah 6: Jalankan Aplikasi
Untuk mode pengembangan:
```bash
npm run dev
```
Buka browser pada `http://localhost:3000`.

Untuk mode produksi:
```bash
npm run start
```

---

## Verifikasi Fitur Utama Setelah Restore
Setelah restore selesai, pastikan fitur-fitur berikut berjalan normal:
1. **Beranda / Hero Section:** Tampilan judul, tagline, badge privasi, dan hero dokumentasi kelas.
2. **Kirim Pesan Anonim (`/send`):** Form pengiriman pesan dapat mengirim pesan anonim ke database.
3. **Owner Login & Inbox (`/dashboard/inbox`):** Owner dapat login, membaca pesan masuk, menandai pesan dibaca, dan menghapus pesan.
4. **Galeri Dokumentasi (`/dashboard/documentation`):** Foto dokumentasi kelas dapat dilihat dan diunggah.
5. **QR Code & Poster Generator:** Modal "Bagikan RPLTwoFess" dapat dibuka, live canvas poster merender template dengan benar, serta tombol "Download Poster PNG", "Bagikan", dan "Salin Link" berfungsi.
6. **PWA:** Tombol Install RPLTwoFess dapat memicu dialog native install pada browser yang mendukung.
