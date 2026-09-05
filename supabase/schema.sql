-- =========================================================
-- RPLTwoFess - Supabase Database Schema & RLS Policies
-- "Satu Kelas. Banyak Cerita."
-- =========================================================

create extension if not exists "pgcrypto";

-- 1. MESSAGES TABLE
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  sender_name text,
  is_read boolean default false not null,
  is_deleted boolean default false not null,
  sender_hash text,
  created_at timestamptz default now() not null,
  constraint content_length check (char_length(content) between 1 and 500)
);

-- 2. REPORTS TABLE
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  reason text not null,
  details text,
  status text default 'pending' not null check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz default now() not null
);

-- 3. BLOCKS TABLE
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  sender_hash text unique not null,
  created_at timestamptz default now() not null
);

-- 4. SITE SETTINGS TABLE (Single-Row Config)
create table if not exists public.site_settings (
  id text primary key default 'default',
  accepting_messages boolean default true not null,
  max_length integer default 500 not null,
  site_title text default 'RPLTwoFess' not null,
  tagline text default 'Satu Kelas. Banyak Cerita.' not null,
  recipient_name text default 'Owner RPL 2' not null,
  updated_at timestamptz default now() not null
);

-- Seed default site settings if not exists
insert into public.site_settings (id, accepting_messages, max_length, site_title, tagline)
values ('default', true, 500, 'RPLTwoFess', 'Satu Kelas. Banyak Cerita.')
on conflict (id) do nothing;

-- 5. SERVERLESS RATE LIMITS TABLE
create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  sender_hash text unique not null,
  action_count integer default 1 not null,
  window_start timestamptz default now() not null,
  last_attempt timestamptz default now() not null
);

-- INDEXES
create index if not exists idx_messages_inbox on public.messages(created_at desc) where is_deleted = false;
create index if not exists idx_messages_unread on public.messages(is_read) where is_read = false and is_deleted = false;
create index if not exists idx_blocks_hash on public.blocks(sender_hash);
create index if not exists idx_rate_limits_hash on public.rate_limits(sender_hash);

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================

alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.site_settings enable row level security;
alter table public.rate_limits enable row level security;

-- 1. MESSAGES POLICIES
-- Owner can view non-deleted messages
create policy "Owner can view non-deleted messages"
  on public.messages
  for select
  using (auth.role() = 'authenticated' and is_deleted = false);

-- Owner can update messages (read/unread, soft delete)
create policy "Owner can update messages"
  on public.messages
  for update
  using (auth.role() = 'authenticated');

-- Public can insert anonymous message if site is accepting messages
create policy "Public can insert message when accepting"
  on public.messages
  for insert
  with check (
    exists (
      select 1 from public.site_settings
      where id = 'default' and accepting_messages = true
    )
  );

-- 2. REPORTS POLICIES
create policy "Owner can view and manage reports"
  on public.reports
  for all
  using (auth.role() = 'authenticated');

-- 3. BLOCKS POLICIES
create policy "Owner can view and manage blocked senders"
  on public.blocks
  for all
  using (auth.role() = 'authenticated');

-- 4. SITE SETTINGS POLICIES
create policy "Public can read site settings"
  on public.site_settings
  for select
  using (true);

create policy "Owner can update site settings"
  on public.site_settings
  for update
  using (auth.role() = 'authenticated');

-- 6. DOCUMENTATION TABLE
create table if not exists public.documentation (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'gallery',
  title text not null default '',
  caption text not null default '',
  category_label text not null default 'DOCUMENTATION',
  meta_text text not null default 'XI RPL 2 / 2026',
  overlay_text text default '',
  footer_text text default 'ARSIP DOKUMENTER KELAS',
  tagline_text text default 'SATU KELAS. BANYAK CERITA.',
  image_url text not null,
  storage_path text,
  display_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documentation_type_active_order on public.documentation (type, is_active, display_order asc);
create index if not exists idx_documentation_active_order on public.documentation (is_active, display_order asc);

alter table public.documentation enable row level security;

-- DOCUMENTATION POLICIES
create policy "Public can view active documentation"
  on public.documentation for select
  using (is_active = true);

create policy "Authenticated users can manage documentation"
  on public.documentation for all
  using (auth.role() = 'authenticated');
