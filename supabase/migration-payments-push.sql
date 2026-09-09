-- ============================================================
-- Migration: adds real-money purchases + push notifications
-- to a PigeonsnDoves database that was already set up.
--
-- Safe to run even if you're not sure whether you've run it before.
-- Run this in Supabase: Project -> SQL Editor -> New query -> paste -> Run.
--
-- If you are setting up PigeonsnDoves for the very first time, you don't
-- need this file at all — just run supabase/schema.sql, which already
-- includes everything in here.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Push notification subscriptions
-- ------------------------------------------------------------
create table if not exists public.push_subscriptions (
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "users manage their own push subscriptions" on public.push_subscriptions;
create policy "users manage their own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Purchases (real-money seed packs via Stripe)
-- ------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_session_id text unique not null,
  pack_key text not null,
  seeds_granted integer not null,
  amount_cents integer not null,
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

drop policy if exists "users can view their own purchases" on public.purchases;
create policy "users can view their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Merge the new "seedPacks" field into your existing game_config row,
-- without touching any prices/items you've already customized in the
-- admin panel. If seedPacks already exists (e.g. you re-run this file),
-- it's left untouched.
-- ------------------------------------------------------------
update public.game_config
set config = config || jsonb_build_object(
  'seedPacks', jsonb_build_array(
    jsonb_build_object('key', 'pack-small', 'name', 'Handful of Seeds', 'seeds', 100, 'priceCents', 99, 'emoji', '🌾'),
    jsonb_build_object('key', 'pack-medium', 'name', 'Sack of Seeds', 'seeds', 550, 'priceCents', 399, 'emoji', '🌻'),
    jsonb_build_object('key', 'pack-large', 'name', 'Barrel of Seeds', 'seeds', 1500, 'priceCents', 799, 'emoji', '🎁')
  )
)
where id = 1
  and not (config ? 'seedPacks');
