# RPLTwoFess — Satu Kelas. Banyak Cerita.

Platform pesan anonim dan confession resmi untuk **kelas RPL/PPLG 2**. Dibangun menggunakan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase PostgreSQL**, **Motion**, dan **Lucide Icons** dengan estetika **Modern Neo-Brutalism**.

---

## 🚀 Konsep Utama

* **Sederhana & Spesifik**: Bukan kloningan media sosial umum. Pengunjung langsung membuka link `/send`, menulis pesan anonim tanpa login, dan pesan langsung terkirim ke dashboard pemilik.
* **Single-Owner Model**: Hanya ada satu pemilik/admin (kamu). Tidak ada sistem registrasi publik.
* **Privasi & Keamanan Ketat**:
  * Pengirim tidak perlu mendaftar atau memasukkan identitas apa pun.
  * Alamat IP pengirim **tidak pernah disimpan mentah** (menggunakan pengacakan satu arah cryptographic salted HMAC-SHA256).
  * **Serverless Shared Rate Limiting**: Cooldown 20 detik dan batas 5 pesan per 10 menit yang aman untuk deployment serverless Vercel.
  * Fitur 1-klik pemblokiran spammer dan pelaporan pelecehan.
* **Desain Neo-Brutalism**:
  * Tipografi Space Grotesk yang berkarakter kuat.
  * Border tegas 3px hitam (`#111111`).
  * Hard offset shadow fisik (`5px 5px 0 #111111`, `3px 3px 0 #111111`).
  * Tombol taktil dengan micro-interaction translasi fisik saat ditekan.
  * 100% responsif mobile-first (nyaman di 360px hingga 1440px).

---

## 📱 Daftar Halaman

| Rute | Deskripsi | Akses |
|---|---|---|
| `/` | Landing page dengan Hero editorial, mock preview, cara kerja, dan jaminan keamanan | Publik |
| `/send` | Formulir pengiriman pesan anonim (counter 0/500, feedback live, confetti animasi) | Publik |
| `/privacy` | Penjelasan kebijakan privasi dan keamanan bahasa Indonesia | Publik |
| `/login` | Form login khusus pemilik/admin | Khusus Owner |
| `/dashboard` | Ringkasan inbox: total pesan, belum dibaca, pesan hari ini, recent preview | Khusus Owner |
| `/dashboard/inbox` | Manajemen kotak masuk: search, filter (Semua, Belum Dibaca, Sudah Dibaca), sort, delete, block | Khusus Owner |
| `/dashboard/inbox/[id]` | Kanvas fokus membaca pesan, mark read/unread, modal report, modal block | Khusus Owner |
| `/dashboard/settings` | Pengaturan penerimaan pesan, batas karakter, tagline, dan zona bahaya | Khusus Owner |

---

## 🛠️ Menghubungkan ke Supabase Asli

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Masuk ke menu **SQL Editor**, buka file [`supabase/schema.sql`](supabase/schema.sql) dari project ini, lalu salin dan jalankan (Run).
3. Masuk ke **Project Settings -> API** di Supabase, lalu salin URL dan Anon Key.
4. Perbarui file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1Ni..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1Ni..."
SENDER_HASH_SALT="ganti_dengan_kode_acak_rahasiamu"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Buat akun owner pertama kali melalui Supabase Auth Dashboard (**Authentication -> Users -> Add user**).
6. Login melalui halaman `/login` dengan akun tersebut untuk mengakses dashboard.

---

## 💻 Menjalankan Secara Lokal

```bash
# Menjalankan development server
npm run dev

# Memeriksa linting
npm run lint

# Build production
npm run build
```
