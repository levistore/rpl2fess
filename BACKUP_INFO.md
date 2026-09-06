# RPLTwoFess Backup

**Backup type:**  
Stable pre-motion checkpoint  

**Project:**  
RPLTwoFess  

**Production URL:**  
https://rpltwofess.zone.id/  

**Backup date:**  
2026-09-06  

**Git commit:**  
`3424dbd` (or subsequent commit hash)  

**Git tag:**  
`backup/pre-motion-update`  

**Framework:**  
Next.js 16.3.4 (App Router, Turbopack)  

**Node version:**  
v24.15.0  

**Package manager:**  
npm 11.12.1  

**Build command:**  
`npm run build`  

**Lint command:**  
`npm run lint`  

---

## 1. Struktur Project
```
mfess/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication routes (login, forgot-password, reset-password)
│   ├── dashboard/              # Protected owner dashboard
│   │   ├── documentation/      # Documentation gallery manager
│   │   ├── inbox/              # Anonymous message inbox & detail view
│   │   └── settings/           # Site settings, PWA install, notification settings
│   ├── privacy/                # Privacy policy page
│   ├── send/                   # Public anonymous message submission page
│   ├── globals.css             # Tailwind v4 theme, fonts, custom styles
│   ├── layout.tsx              # Root layout with theme provider & font config
│   ├── page.tsx                # Public homepage with cinematic editorial hero
│   └── manifest.webmanifest/   # Dynamic PWA manifest route
├── components/                 # UI components
│   ├── auth/                   # Authentication forms
│   ├── dashboard/              # Dashboard overview cards & inbox UI
│   ├── documentation/          # Photographic scrapbook & gallery
│   ├── layout/                 # Header, footer, navigation
│   ├── pwa/                    # PWA installation banner, button & service worker register
│   ├── send/                   # Anonymous message form & Turnstile integration
│   ├── share/                  # QR Code share modal & canvas poster renderer
│   └── ui/                     # Base UI elements (button, card, modal, toast, etc.)
├── lib/                        # Core utilities & server actions
│   ├── actions/                # Next.js Server Actions (auth, message send, settings, reports)
│   ├── notifications/          # Web Push VAPID notification triggers
│   ├── queries/                # Supabase database query helpers
│   ├── security/               # Rate limiter, sender hashing, Turnstile bot check
│   ├── supabase/               # Supabase browser, server, admin & middleware clients
│   └── utils.ts                # Classnames utility (clsx + tailwind-merge)
├── public/                     # Static assets
│   ├── icons/                  # PWA app icons (192x192, 512x512, maskable)
│   ├── images/                 # Class documentation photos & placeholders
│   ├── manifest.json           # Static PWA manifest fallback
│   └── sw.js                   # Service Worker for offline caching & push notifications
├── scripts/                    # Helper scripts
│   ├── generate-photos.js      # Placeholder photo generator
│   └── seed-docs.js            # Initial documentation seed script
├── supabase/                   # Database configurations
│   └── schema.sql              # Complete PostgreSQL schema, tables, indexes & RLS
├── types/                      # TypeScript definitions
│   ├── database.ts             # Supabase database schema types
│   └── pwa.ts                  # PWA beforeinstallprompt event types
├── .env.example.backup         # Environment variable template without secrets
├── BACKUP_INFO.md              # Current state documentation
├── RESTORE_BACKUP.md           # Restore instructions
└── next.config.ts              # Next.js configuration
```

---

## 2. Dependency Utama
- **Framework & Runtime:** Next.js `16.3.4`, React `19.2.8`, React-DOM `19.2.8`
- **Styling:** Tailwind CSS `4.0`, `@tailwindcss/postcss`
- **Database & Auth:** `@supabase/supabase-js` `^2.115.0`, `@supabase/ssr` `^0.12.5`, `pg` `^8.23.0`
- **Motion & UI Effects:** `motion` `^13.2.0`, `canvas-confetti` `^1.9.4`, `lucide-react` `^1.40.0`
- **QR Code & Poster Generator:** `qrcode` `^1.5.4` (HTML5 Canvas high-resolution rendering)
- **Notifications & PWA:** `web-push` `^3.6.7`, Service Worker API
- **Validation:** `zod` `^4.5.4`

---

## 3. Environment Variables yang Dibutuhkan
Lihat [`.env.example.backup`](file:///d:/Vs%20Project/mfess/.env.example.backup) untuk template lengkap:
- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon / public key Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key untuk server actions yang butuh elevated access (admin)
- `SENDER_HASH_SALT`: Salt rahasia untuk hashing anonim IP & User-Agent pengirim pesan
- `NEXT_PUBLIC_APP_URL`: Base domain aplikasi (`https://rpltwofess.zone.id`)
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`: Site key bot protection Cloudflare Turnstile
- `CLOUDFLARE_TURNSTILE_SECRET_KEY`: Secret key Cloudflare Turnstile
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: VAPID public key untuk Web Push
- `VAPID_PRIVATE_KEY`: VAPID private key untuk Web Push
- `VAPID_SUBJECT`: Mailto atau URL subjek push notifications

---

## 4. Database / Schema yang Digunakan
Tersimpan lengkap di [`supabase/schema.sql`](file:///d:/Vs%20Project/mfess/supabase/schema.sql):
1. `public.messages` — Menyimpan pesan anonim, sender_hash, status read/deleted.
2. `public.reports` — Laporan pesan bermasalah dengan status pending/reviewed/dismissed.
3. `public.blocks` — Daftar sender_hash yang diblokir oleh owner.
4. `public.site_settings` — Konfigurasi penerimaan pesan, batas karakter, judul, tagline.
5. `public.rate_limits` — Rate limiter serverless per sender_hash.
6. `public.documentation` — Dokumentasi foto kelas (gallery & featured hero).
7. `public.push_subscriptions` — Langganan push notification per user.

Semua tabel memiliki **Row Level Security (RLS)** aktif dan teruji ketat.

---

## 5. Supabase Configuration
- **Authentication:** Supabase Auth dengan email & password untuk Owner RPL 2.
- **Storage Bucket:** Bucket publik `documentation` untuk menyimpan foto dokumentasi kelas yang diunggah dari dashboard.
- **Client Init:** Terisolasi rapi di `lib/supabase/client.ts` (browser), `server.ts` (server actions & RSC), `admin.ts` (service role), dan `middleware.ts` (session refresh).

---

## 6. PWA Configuration
- **Manifest:** Menyediakan metadata nama "RPLTwoFess", orientation portrait, standalone display, theme color `#08090B`, dan icon lengkap (192x192, 512x512, maskable).
- **Service Worker (`public/sw.js`):** Menangani lifecycle install, immediate activation, cache management, push event listener, dan notification click routing ke `/dashboard/inbox`.
- **In-App Install Button:** Hook `usePwaInstall` menangkap event `beforeinstallprompt` dan menyediakan trigger native install di menu navigasi mobile dan settings dashboard.

---

## 7. Deployment Configuration
- **Platform:** Vercel Production
- **Custom Domain:** `https://rpltwofess.zone.id/`
- **CI/CD:** Otomatis deploy saat push ke branch `main` di GitHub repo `levistore/rpl2fess`.

---

## 8. Cara Install Dependency
```bash
npm install
```

## 9. Cara Menjalankan Development
```bash
npm run dev
```
Akses di `http://localhost:3000`.

## 10. Cara Build Production
```bash
npm run build
npm run start
```

## 11. Cara Restore Backup
Lihat panduan lengkap di [`RESTORE_BACKUP.md`](file:///d:/Vs%20Project/mfess/RESTORE_BACKUP.md).

---

## Pre-Existing Issues
**NONE.** Linting dan build berhasil 100% tanpa error maupun warning.
