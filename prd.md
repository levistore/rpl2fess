# PRD - Anonymous Confession & Messaging Platform

## 1. Project Overview

### Project Name

Temporary working name: **LConfess**

### Product Type

Web-based anonymous messaging and confession platform.

### Product Concept

LConfess memungkinkan seseorang membuat personal anonymous inbox link yang dapat dibagikan melalui media sosial atau chat.

Orang lain dapat membuka link tersebut dan mengirim pesan secara anonim tanpa harus membuat akun.

Pemilik link dapat melihat pesan yang masuk melalui dashboard pribadi.

Contoh:

`https://lconfess.web.id/u/levi`

Visitor:

`Open link → Write anonymous message → Send`

Owner:

`Login → Inbox → Read / Delete / Report / Block`

---

# 2. Product Goals

## Primary Goals

1. Membuat platform anonymous messaging berbasis web yang cepat dan mudah digunakan.
2. Memungkinkan pengguna memiliki personal message link.
3. Memungkinkan visitor mengirim pesan tanpa login.
4. Menyediakan inbox modern untuk menerima pesan.
5. Menyediakan fitur keamanan dan moderation.
6. Membuat pengalaman mobile-first.
7. Memberikan UI Neo-Brutalism yang kuat, modern, dan memiliki identitas sendiri.
8. Website harus terasa seperti produk nyata, bukan template AI.

## Secondary Goals

* Social sharing.
* Anonymous interaction.
* Message management.
* User profile customization.
* Basic analytics.
* Abuse prevention.
* Admin moderation.

---

# 3. Target Users

### Sender

Orang yang ingin mengirim pesan anonim.

Sender tidak perlu membuat akun.

### Receiver

Pengguna yang memiliki personal confession link.

Receiver memiliki akun dan dashboard.

### Administrator

Mengelola laporan, user, abuse, spam, dan platform configuration.

---

# 4. Core User Flow

## Receiver Flow

```text
Landing Page
      ↓
Create Account
      ↓
Choose Username
      ↓
Profile Created
      ↓
Personal Link Generated
      ↓
Share Link
      ↓
Receive Messages
      ↓
Dashboard Inbox
      ↓
Read / Delete / Report / Block
```

## Sender Flow

```text
Personal Link
      ↓
Receiver Profile
      ↓
Message Composer
      ↓
Write Anonymous Message
      ↓
Optional Message Metadata
      ↓
Send
      ↓
Success Screen
```

Sender tidak boleh diwajibkan login.

---

# 5. Main Features

## 5.1 Landing Page

Landing page harus menjelaskan produk secara singkat.

Sections:

* Navigation
* Hero
* How It Works
* Feature highlights
* Safety / Privacy explanation
* CTA
* Footer

Hero CTA:

`Create Your Link`

Secondary CTA:

`Send Anonymous Message`

---

# 5.2 Authentication

Authentication menggunakan Supabase Auth.

Supported:

* Email/password
* Email verification
* Login
* Logout
* Forgot password
* Reset password
* Session persistence

Optional future authentication:

* Google OAuth

User tidak boleh dapat mengakses dashboard tanpa authenticated session.

---

# 5.3 Username

Setiap user memiliki username unik.

Requirements:

* 3-20 characters.
* Lowercase recommended.
* Letters, numbers, underscore.
* Cannot contain spaces.
* Reserved usernames must be blocked.

Examples:

```text
levi
andika
budi_07
raka123
```

Profile URL:

```text
/u/:username
```

Example:

```text
lconfess.web.id/u/levi
```

---

# 5.4 Public Profile

Public profile menampilkan:

* Avatar
* Display name
* Username
* Bio
* Message composer

Do not expose:

* Email
* User ID
* Private analytics
* Private messages
* Technical metadata

---

# 5.5 Anonymous Message

Sender dapat mengirim:

* Text message

MVP message limit:

`500 characters`

Message must be validated server-side.

Requirements:

* Empty message rejected.
* Maximum length enforced.
* Spam protection.
* Rate limiting.
* Abuse detection.
* Content moderation.
* Server-side sanitization.

Sender harus mendapatkan confirmation setelah pesan berhasil dikirim.

---

# 5.6 Message Inbox

Dashboard inbox menampilkan:

* Total messages
* Unread messages
* Message cards
* Timestamp
* Message status

Each message supports:

* Read
* Unread
* Delete
* Report
* Block sender

Inbox filters:

```text
All
Unread
Reported
```

Sorting:

```text
Newest
Oldest
```

---

# 5.7 Message Detail

Saat membuka pesan:

Display:

```text
Anonymous

Message content

Received:
2 minutes ago
```

Actions:

```text
Mark unread
Delete
Report
Block
```

Tidak boleh menampilkan identitas pribadi sender.

---

# 5.8 Delete Message

User dapat menghapus pesan.

Delete harus menggunakan soft delete pada database.

Deleted message tidak boleh tampil di inbox normal.

---

# 5.9 Report Message

User dapat melaporkan pesan.

Report reasons:

* Harassment
* Bullying
* Spam
* Hate
* Sexual content
* Threat
* Other

Report tidak otomatis menghapus pesan.

---

# 5.10 Block Sender

User dapat memblokir abusive sender.

Blocked sender tidak dapat mengirim pesan baru ke recipient tersebut selama sistem dapat mengidentifikasi sender secara privacy-preserving.

Jangan menyimpan IP address secara permanen hanya untuk tracking.

Jika abuse prevention membutuhkan technical identifier, gunakan pendekatan minimal, terbatas, dan sesuai privacy policy.

---

# 5.11 Anti-Spam

Implement:

* Rate limiting
* Cooldown
* Request validation
* Bot protection
* Duplicate message detection
* Suspicious traffic detection

Anonymous endpoint harus menjadi endpoint dengan protection paling ketat.

---

# 5.12 CAPTCHA / Bot Protection

Gunakan Cloudflare Turnstile atau solusi equivalent.

CAPTCHA tidak perlu muncul pada setiap message jika risk score rendah.

Untuk traffic mencurigakan:

```text
Message attempt
      ↓
Risk evaluation
      ↓
Normal → Send
Suspicious → Turnstile
      ↓
Verified → Send
```

---

# 5.13 Share System

User dapat:

* Copy link
* Native share
* Share profile URL

Share preview harus memiliki Open Graph metadata.

Example:

```text
Levi's anonymous inbox
Send me an anonymous message.
```

---

# 5.14 Personal Profile Customization

User dapat mengatur:

* Display name
* Username
* Bio
* Avatar
* Profile theme

Theme customization harus tetap mempertahankan design system.

Jangan memberikan color picker tanpa batas.

---

# 5.15 Analytics

Dashboard analytics:

* Total messages
* Messages today
* Messages this week
* Messages this month
* Unread count

Optional chart:

```text
Messages received
Mon ███
Tue █████
Wed ██
Thu ███████
Fri ████
```

Tidak perlu analytics yang berlebihan pada MVP.

---

# 5.16 Notifications

MVP:

* In-app unread indicator.

Future:

* Email notification.
* Push notification.

Do not send notifications for every anonymous message by default.

Provide user settings.

---

# 5.17 Admin Panel

Admin panel harus terpisah dari normal user dashboard.

Admin features:

### Users

* Search users
* View account status
* Suspend user
* Restore user

### Reports

* View reports
* Review message
* Resolve report
* Remove abusive content

### Messages

* Search flagged messages
* Review moderation status

### System

* Platform statistics
* Abuse statistics
* Rate-limit configuration

Admin role must be verified server-side.

Never rely only on frontend role checking.

---

# 6. Database

Use Supabase PostgreSQL.

## profiles

```sql
id uuid primary key
username text unique not null
display_name text
bio text
avatar_url text
is_active boolean default true
created_at timestamptz
updated_at timestamptz
```

## messages

```sql
id uuid primary key
recipient_id uuid not null
content text not null
is_read boolean default false
is_deleted boolean default false
created_at timestamptz
```

## reports

```sql
id uuid primary key
message_id uuid not null
reporter_id uuid not null
reason text not null
status text default 'pending'
created_at timestamptz
resolved_at timestamptz
```

## blocks

```sql
id uuid primary key
recipient_id uuid not null
sender_identifier_hash text
created_at timestamptz
```

## user_settings

```sql
user_id uuid primary key
email_notifications boolean default true
profile_visibility boolean default true
created_at timestamptz
updated_at timestamptz
```

---

# 7. Security Requirements

Security is a core requirement.

Implement:

* Supabase Row Level Security.
* Server-side authorization.
* Input validation.
* Output escaping.
* Rate limiting.
* Bot protection.
* Abuse prevention.
* CSRF protection where applicable.
* Secure cookies/session handling.
* Security headers.
* No sensitive information in client responses.
* No service-role key exposed to frontend.
* Environment variables for secrets.

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

to browser/client code.

---

# 8. Privacy

The platform should minimize collection of sender information.

Do not publicly expose:

* sender IP
* sender email
* sender account
* device information

Privacy policy must explain what technical information is collected for security and abuse prevention.

Do not claim that messages are "100% untraceable".

The platform should use wording such as:

`Messages are sent anonymously to the recipient.`

---

# 9. Technical Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* Modern React
* Framer Motion or Motion

Backend:

* Next.js server-side functionality / API routes
* Supabase

Database:

* PostgreSQL through Supabase

Authentication:

* Supabase Auth

Deployment:

* Vercel

Domain:

* `.web.id`

Bot protection:

* Cloudflare Turnstile

---

# 10. Responsive Requirements

Primary target:

Mobile.

Breakpoints:

```text
Mobile
Tablet
Desktop
```

The application must work properly at:

```text
360px
390px
430px
768px
1024px
1440px
```

No horizontal scrolling.

Touch targets should be comfortable.

---

# 11. Performance

Requirements:

* Fast initial load.
* Optimize images.
* Lazy load non-critical assets.
* Avoid huge JavaScript bundles.
* Avoid unnecessary animations on low-end devices.
* Use server components where appropriate.
* Use loading skeletons.
* Avoid layout shifts.

Target:

Lighthouse Performance ≥ 90 where practical.

---

# 12. Accessibility

Implement:

* Semantic HTML.
* Keyboard navigation.
* Visible focus state.
* Proper labels.
* Accessible contrast.
* Reduced motion support.
* Screen-reader-friendly controls.

Respect:

```css
prefers-reduced-motion
```

---

# 13. Error States

Every async operation must have states:

```text
Idle
Loading
Success
Error
Empty
```

Example:

```text
No messages yet.

Share your link to start receiving anonymous messages.
```

Error:

```text
Something went wrong.

Please try again.
```

Do not expose technical stack traces to users.

---

# 14. Empty States

Inbox:

```text
Your inbox is empty.

Share your link and start receiving anonymous messages.
```

Search:

```text
No messages found.
```

Reports:

```text
No reports yet.
```

---

# 15. Product Personality

The product should feel:

* Young
* Bold
* Playful
* Confident
* Slightly chaotic
* Modern
* Human

Avoid:

* Corporate SaaS feeling
* Generic AI startup aesthetic
* Excessive gradients
* Glassmorphism
* Neon cyberpunk
* Excessive rounded cards
* Stock illustrations
* Fake 3D AI graphics

---

# 16. MVP Definition

MVP is complete when:

* User can register.
* User can login.
* User can choose username.
* User receives public profile URL.
* Visitor can send anonymous message.
* Message is saved to Supabase.
* Recipient receives message.
* Recipient can read message.
* Recipient can delete message.
* Recipient can report message.
* Recipient can block abusive sender.
* Rate limiting works.
* Bot protection works.
* RLS is enabled.
* Website works on mobile.
* Website deploys successfully to Vercel.
* Custom `.web.id` domain works.
* No secrets are exposed client-side.

---

# 17. Future Features

Potential post-MVP:

* Anonymous replies.
* Message reactions.
* Question prompts.
* Profile themes.
* Scheduled prompts.
* Email notifications.
* Push notifications.
* QR code.
* Public confession wall.
* Advanced analytics.
* Moderation AI.
* Multiple inboxes.
* Custom profile pages.
* Creator/Pro features.

These must not delay MVP.

---

# 18. Development Rules for Gemini Antigravity

Do not generate the entire application blindly in one pass.

Work in stages:

### Phase 1

Project setup + design system.

### Phase 2

Supabase + authentication.

### Phase 3

Profiles + usernames.

### Phase 4

Anonymous messaging.

### Phase 5

Inbox.

### Phase 6

Moderation + security.

### Phase 7

Analytics.

### Phase 8

Admin panel.

### Phase 9

Responsive refinement.

### Phase 10

Performance + deployment.

After every phase:

1. Run the application.
2. Check console.
3. Check TypeScript.
4. Check database queries.
5. Check authentication.
6. Test mobile layout.
7. Fix errors before continuing.

Do not leave TODO placeholders for core functionality.

---

# 19. Definition of Done

The project is considered complete only when the entire primary user flow works:

```text
Create account
      ↓
Choose username
      ↓
Get profile link
      ↓
Open link in incognito
      ↓
Send anonymous message
      ↓
Message saved
      ↓
Login as recipient
      ↓
Message appears in inbox
      ↓
Open message
      ↓
Delete / report / block
```

No fake data.

No simulated functionality.

No fake buttons.

No unfinished pages.

No placeholder lorem ipsum.

No "coming soon" for MVP features.
