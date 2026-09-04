# RPLTwoFess Design System

## 1. Design Direction

RPLTwoFess menggunakan visual direction:

**Cinematic Editorial + Digital Scrapbook + Modern Dark UI**

Website harus terasa seperti website eksklusif milik sebuah kelas, bukan aplikasi confession generik dan bukan clone NGL.

Visual utama menggunakan:

* Foto kelas sebagai elemen visual utama.
* Dark cinematic background.
* Typography besar dan kuat.
* Aksen biru elektrik.
* Foto landscape dengan frame seperti foto dokumentasi.
* Sedikit elemen scrapbook seperti tape, handwritten text, paper labels, dan stamp.
* Grain/film texture yang sangat halus.
* Layout editorial yang tidak terlalu simetris.
* Animasi modern dan subtle.

Desain harus terlihat dibuat oleh designer manusia, bukan hasil template AI.

---

# 2. Brand

Nama:

**RPLTwoFess**

Tagline:

**Satu Kelas. Banyak Cerita.**

Brand personality:

* muda
* modern
* sedikit nostalgic
* personal
* misterius
* friendly
* confident
* tidak terlalu formal

RPLTwoFess harus terasa seperti tempat untuk meninggalkan pesan kepada sebuah kelas, bukan social media.

---

# 3. Color System

### Primary

```text
Background:
#08090B

Surface:
#111318

Surface Secondary:
#181B21

White:
#F5F5F2

Muted:
#9A9DA5

Border:
#2A2D34
```

### Accent

```text
Electric Blue:
#3D5CFF

Bright Blue:
#536DFF

Soft Blue:
#7B8DFF
```

### Status

```text
Success:
#42D392

Danger:
#FF4D4D

Warning:
#FFB84D
```

Gunakan biru sebagai warna identitas utama.

Jangan menggunakan gradient warna yang berlebihan.

Jika menggunakan gradient, hanya gunakan gradient sangat subtle untuk lighting/background decoration.

---

# 4. Typography

Gunakan kombinasi:

### Primary UI Font

**Inter**

Untuk:

* navigation
* body
* buttons
* forms
* dashboard
* labels

### Display Font

Gunakan font display yang condensed/strong seperti:
**Bebas Neue / Archivo Black / Anton**

Untuk:

* hero heading
* section heading
* angka besar
* statement text

### Handwritten Accent

Gunakan font handwritten hanya untuk elemen kecil seperti:

* annotation
* caption foto
* label
* decorative text

Jangan menggunakan handwritten font untuk body text.

---

# 5. Overall Visual Style

Gunakan dark interface dengan kontras tinggi.

Karakter:

```text
Dark
+
Photography
+
Editorial Typography
+
Scrapbook Details
+
Electric Blue Accent
```

Jangan membuat semua elemen menjadi card.

Gunakan:

* whitespace
* typography
* foto
* garis
* negative space

sebagai bagian dari layout.

---

# 6. Photography

Foto kelas adalah bagian penting dari identitas RPLTwoFess.

Gunakan foto landscape dengan rasio:

* 16:9
* 4:3
* 3:2

Foto utama dapat menggunakan ukuran besar.

Contoh struktur:

```text
        ┌───────────────────────────────┐
        │                               │
        │          FOTO KELAS           │
        │                               │
        └───────────────────────────────┘
```

Foto dapat menggunakan:

* sedikit rounded corners
* thin border
* subtle shadow
* tape decoration
* handwritten caption
* date/location label

Jangan menggunakan semua dekorasi sekaligus.

Satu foto cukup memiliki 1-2 decorative elements.

### Photo Treatment

Foto boleh diberi:

* subtle grain
* slight contrast
* subtle dark overlay jika dibutuhkan untuk text

Jangan:

* membuat foto terlalu gelap
* menggunakan filter ekstrem
* membuat foto terlihat AI-generated
* mengubah wajah orang di foto

Gunakan placeholder lokal jika foto asli belum tersedia.

Contoh:

```text
/public/images/class/
├── class-main.jpg
├── class-01.jpg
├── class-02.jpg
├── class-03.jpg
└── class-04.jpg
```

---

# 7. Landing Page

Landing page harus menjadi visual utama website.

## Header

Desktop:

```text
RPLTwoFess                         Beranda   Tentang   Privasi   [Kirim Pesan]
```

Header:

* minimal
* transparent/dark
* sticky jika diperlukan
* tidak menggunakan glassmorphism berlebihan

Mobile:

* logo
* menu button

---

# 8. Hero

Hero harus menggunakan layout editorial.

Contoh:

```text
UNTUK KELAS KITA

SATU KELAS.
BANYAK CERITA.

Tempat buat menyampaikan pesan,
cerita, pertanyaan, atau sesuatu
yang ingin kamu katakan kepada kami.

[KIRIM PESAN ANONIM]

                 ┌───────────────────────┐
                 │                       │
                 │      FOTO KELAS       │
                 │                       │
                 └───────────────────────┘
```

Foto utama harus menjadi focal point.

Tambahkan beberapa foto kecil sebagai collage di sekitar foto utama jika layout memungkinkan.

Jangan membuat hero terlalu penuh.

---

# 9. Photo Collage

Gunakan 2-4 foto tambahan.

Foto dapat memiliki sedikit perbedaan:

* rotation
* size
* position

Contoh:

```text
             MAIN PHOTO
        ┌──────────────────┐
        │                  │
        │   CLASS PHOTO    │
        │                  │
        └──────────────────┘

   ┌─────────┐       ┌─────────┐
   │ PHOTO 1 │       │ PHOTO 2 │
   └─────────┘       └─────────┘
```

Rotation harus sangat kecil.

Maksimal sekitar:
`-3deg sampai +3deg`

Tujuannya terasa natural, bukan berantakan.

---

# 10. Scrapbook Elements

Gunakan elemen seperti:

* masking tape
* small labels
* handwritten annotation
* date stamp
* paper note
* tiny arrows
* circle marker

Gunakan secara restrained.

Contoh:

```text
X PPLG 2
2026

BEST CLASS.

[photo]
```

Elemen scrapbook hanya menjadi aksen.

Jangan membuat seluruh website seperti papan mading.

---

# 11. Send Message Page

Halaman kirim pesan harus fokus pada form.

Layout:

```text
KIRIM
sesuatu.

Sampaikan apa yang ingin kamu katakan
kepada kami.

┌────────────────────────────────┐
│                                │
│ Tulis pesanmu di sini...       │
│                                │
│                                │
│                         0/500  │
└────────────────────────────────┘

[ CAPTCHA ]

[KIRIM PESAN  →]
```

Tambahkan satu foto kelas di sisi kanan desktop.

Pada mobile:

* form terlebih dahulu
* foto di bawah atau sebagai decorative element

---

# 12. Success State

Setelah pesan berhasil:

```text
MESSAGE SENT.

Pesanmu sudah sampai
secara anonim.

[ KIRIM PESAN LAGI ]
```

Gunakan animasi kecil:

* checkmark
* message card movement
* subtle scale
* fade

Jangan membuat animasi berlebihan.

---

# 13. Dashboard

Dashboard menggunakan dark UI yang lebih functional.

Tetap menggunakan visual identity RPLTwoFess.

Layout:

```text
RPLTwoFess

Dashboard
Inbox
Settings
Logout
```

Dashboard overview:

```text
24
TOTAL PESAN

8
BELUM DIBACA

5
HARI INI

1
DILAPORKAN
```

Gunakan statistic cards sederhana.

Jangan membuat dashboard terlihat seperti enterprise SaaS.

---

# 14. Inbox

Inbox harus menjadi fokus dashboard.

Contoh:

```text
INBOX

[ Search messages... ]

Semua   Belum Dibaca   Dibaca

●  Bro, mau nanya sesuatu...
   2 menit lalu

○  Semangat buat lombanya!
   18 menit lalu

○  Ada yang mau disampaikan...
   1 jam lalu
```

Unread message:

* accent blue
* indicator dot
* stronger typography

Read message:

* muted

---

# 15. Message Detail

Detail message:

```text
MESSAGE

"Bro, mau nanya sesuatu..."

2 menit lalu

[ Tandai Dibaca ]

[ Hapus ]

[ Laporkan ]
```

Jangan menampilkan:

* IP
* User-Agent
* informasi pribadi pengirim

---

# 16. Navigation

Desktop:

* top navigation untuk public pages
* sidebar untuk dashboard

Mobile:

* compact header
* bottom navigation untuk dashboard jika diperlukan

Navigation harus minimal.

---

# 17. Buttons

Primary button:

Dark/blue high contrast.

Karakter:

* medium radius
* strong typography
* subtle border
* hover brightness
* press animation

Contoh:

```text
[ KIRIM PESAN ANONIM  → ]
```

Interaction:

Hover:

* sedikit translate
* accent glow sangat subtle

Active:

* scale `0.97`

Jangan menggunakan giant pill buttons.

---

# 18. Cards

Card tidak boleh terlalu rounded.

Gunakan:

* radius 10-16px
* thin border
* dark surface
* subtle shadow

Tidak semua section harus menggunakan card.

---

# 19. Motion

Gunakan Motion.

Animation principles:

### Page entrance

Fade + translate kecil.

### Photo

Subtle scale on hover.

### Button

Small press feedback.

### Message sent

Short success animation.

### Scroll

Subtle reveal.

Durasi umum:
`200-500ms`

Gunakan easing natural.

Hormati:

`prefers-reduced-motion`

---

# 20. Background

Background utama:

Dark near-black.

Boleh menggunakan:

* subtle noise
* film grain
* radial lighting
* very subtle blue glow

Tetapi jangan menggunakan:

* neon background
* giant gradient
* animated gradient
* excessive blur
* aurora background

---

# 21. Mobile Design

Mobile harus menjadi prioritas.

Target:

```text
360px
390px
430px
768px
1024px
1440px
```

Foto tetap menjadi bagian penting.

Hero mobile:

```text
RPLTwoFess

SATU KELAS.
BANYAK CERITA.

[description]

[KIRIM PESAN]

┌─────────────────┐
│                 │
│   FOTO KELAS    │
│                 │
└─────────────────┘
```

Jangan mengecilkan desktop secara mentah.

Buat layout mobile secara intentional.

---

# 22. Accessibility

Pastikan:

* contrast tinggi
* focus state jelas
* keyboard accessible
* semantic HTML
* alt text untuk foto
* tombol memiliki label jelas
* reduced motion support

---

# 23. AI-SLOP PREVENTION

Jangan menghasilkan desain yang terlihat seperti template AI.

DILARANG:

* purple AI gradient
* glassmorphism berlebihan
* floating blobs
* random 3D objects
* stock illustration
* excessive rounded cards
* excessive shadows
* excessive gradients
* excessive animations
* dashboard template generik
* terlalu banyak badge
* terlalu banyak icon
* terlalu banyak decorative elements

RPLTwoFess harus terlihat seperti produk yang sengaja didesain untuk satu kelas.

---

# 24. Design Principle

Prioritas visual:

```text
1. FOTO KELAS
2. TYPOGRAPHY
3. MESSAGE EXPERIENCE
4. BRAND
5. DECORATION
```

Decoration tidak boleh mengalahkan content.

Prinsip utama:

**Less UI, More Personality.**

RPLTwoFess harus terasa:
**personal, cinematic, modern, memorable.**
