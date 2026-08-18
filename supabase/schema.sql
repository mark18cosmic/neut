-- ============================================================================
-- Neut — Supabase schema (run once in the SQL editor of a fresh project)
--
-- Everything the storefront renders that an admin can change lives here.
-- Public traffic gets read-only access through RLS; every write requires an
-- authenticated user listed in public.admins.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admins — the allowlist. A Supabase Auth user is only an admin if their id
-- appears here, so creating an auth user alone grants nothing.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text,
  role        text not null default 'editor' check (role in ('owner', 'editor')),
  created_at  timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Site content — one row per editable block, value is jsonb so a block can
-- grow new fields without a migration. See lib/site.js for the shapes.
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  category     text not null check (category in ('necklaces', 'bracelets', 'charms')),
  price        integer not null check (price >= 0),   -- MVR, whole rufiyaa
  metals       text[] not null default '{gold,silver}',
  materials    text[] not null default '{}',
  drop_name    text,
  sold_out     boolean not null default false,
  stock        integer not null default 0 check (stock >= 0),
  charm_ready  boolean not null default false,
  featured     boolean not null default false,
  position     integer not null default 0,
  blurb        text not null default '',
  description  text not null default '',
  care         text not null default '',
  tone         text[] not null default '{#5A6642,#B79B75}',
  image_url    text,
  gallery      text[] not null default '{}',
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_position_idx on public.products (position, created_at desc);

-- ---------------------------------------------------------------------------
-- Journal / drops
-- ---------------------------------------------------------------------------
create table if not exists public.journal_posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  tag         text not null default 'Note',
  dateline    text not null default '',
  body        text not null default '',
  tone        text[] not null default '{#5A6642,#B79B75}',
  image_url   text,
  position    integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orders — the cart checkout writes here; the admin panel works them through
-- their statuses. Items are denormalised so an order stays readable even if a
-- product is later renamed or deleted.
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  customer_name text not null,
  instagram     text not null default '',
  island        text not null default '',
  note          text not null default '',
  items         jsonb not null default '[]'::jsonb,
  subtotal      integer not null default 0,
  status        text not null default 'awaiting_transfer'
                check (status in ('awaiting_transfer', 'paid', 'packing', 'delivered', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);

-- Human-readable order reference: NE-1042 style, monotonic.
create sequence if not exists public.order_reference_seq start 1040;

create or replace function public.next_order_reference()
returns text
language sql
volatile
as $$
  select 'NE-' || nextval('public.order_reference_seq')::text;
$$;

-- ---------------------------------------------------------------------------
-- Audit log — every admin write records who did what.
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id          bigserial primary key,
  actor_id    uuid references auth.users (id) on delete set null,
  actor_email text,
  action      text not null,
  entity      text not null,
  entity_id   text,
  detail      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists journal_touch on public.journal_posts;
create trigger journal_touch before update on public.journal_posts
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admins        enable row level security;
alter table public.site_content  enable row level security;
alter table public.products      enable row level security;
alter table public.journal_posts enable row level security;
alter table public.orders        enable row level security;
alter table public.audit_log     enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read" on public.site_content
  for select using (true);

drop policy if exists "site_content admin write" on public.site_content;
create policy "site_content admin write" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (published or public.is_admin());

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "journal public read" on public.journal_posts;
create policy "journal public read" on public.journal_posts
  for select using (published or public.is_admin());

drop policy if exists "journal admin write" on public.journal_posts;
create policy "journal admin write" on public.journal_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- Anyone may place an order; only admins may read or change them.
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders
  for insert with check (true);

drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read" on public.orders
  for select using (public.is_admin());

drop policy if exists "orders admin write" on public.orders;
create policy "orders admin write" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders
  for delete using (public.is_admin());

drop policy if exists "audit admin read" on public.audit_log;
create policy "audit admin read" on public.audit_log
  for select using (public.is_admin());

drop policy if exists "audit admin insert" on public.audit_log;
create policy "audit admin insert" on public.audit_log
  for insert with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage — public bucket for hero / product / journal photography.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
