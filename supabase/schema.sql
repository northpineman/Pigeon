-- ============================================================
-- Iggy Meadow database schema
-- Run this once in Supabase: Project -> SQL Editor -> New query
-- -> paste this whole file -> Run.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Profiles (one row per user, public username + admin flag)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------
-- 2. Player saves (one row per user, the live game state)
-- ------------------------------------------------------------
create table if not exists public.player_saves (
  user_id uuid references auth.users(id) on delete cascade primary key,
  seeds integer not null default 30,
  birds jsonb not null default '[]',
  loft_capacity integer not null default 4,
  upgrades_bought integer not null default 0,
  decorations jsonb not null default '[]',
  last_collect_at bigint not null default 0,
  last_login_date text,
  streak integer not null default 0,
  flags jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.player_saves enable row level security;

create policy "users can view their own save"
  on public.player_saves for select
  using (auth.uid() = user_id);

create policy "users can insert their own save"
  on public.player_saves for insert
  with check (auth.uid() = user_id);

create policy "users can update their own save"
  on public.player_saves for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3. Game config (single shared row, editable only by admins)
-- ------------------------------------------------------------
create table if not exists public.game_config (
  id integer primary key default 1,
  config jsonb not null,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

alter table public.game_config enable row level security;

create policy "everyone can read game config"
  on public.game_config for select
  using (true);

create policy "only admins can update game config"
  on public.game_config for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

insert into public.game_config (id, config)
values (1, '{
  "feedCost": 2,
  "breedCost": 15,
  "upgradeBaseCost": 60,
  "hungerHours": 8,
  "cleanHours": 14,
  "eggHatchHours": 3,
  "babyGrowHours": 6,
  "adoptGrowHours": 2,
  "incomeBaseRate": 2,
  "maxBankHours": 8,
  "adoptCosts": { "rock": 20, "king": 40, "fantail": 32, "ringneck": 22, "diamond": 18, "nun": 26 },
  "decorations": [
    { "key": "mats", "name": "Straw Nesting Mats", "cost": 40, "bonus": 4, "emoji": "🌾" },
    { "key": "bath", "name": "Terracotta Bath Bowl", "cost": 70, "bonus": 6, "emoji": "🫙" },
    { "key": "perches", "name": "Carved Wooden Perches", "cost": 90, "bonus": 7, "emoji": "🪵" },
    { "key": "vine", "name": "Climbing Jasmine Vine", "cost": 120, "bonus": 8, "emoji": "🌿" },
    { "key": "chimes", "name": "Little Bell Chimes", "cost": 150, "bonus": 10, "emoji": "🔔" },
    { "key": "rainbow", "name": "Rainbow Windsock", "cost": 55, "bonus": 5, "emoji": "🌈" }
  ],
  "christmasItems": [
    { "key": "xmas-tree", "name": "Christmas Tree", "cost": 100, "bonus": 9, "emoji": "🎄" },
    { "key": "xmas-lights", "name": "Twinkle Lights", "cost": 60, "bonus": 5, "emoji": "✨" },
    { "key": "xmas-stockings", "name": "Cozy Stockings", "cost": 45, "bonus": 4, "emoji": "🧦" },
    { "key": "xmas-snowman", "name": "Snowman Friend", "cost": 65, "bonus": 6, "emoji": "⛄" },
    { "key": "xmas-gifts", "name": "Pile of Gifts", "cost": 80, "bonus": 7, "emoji": "🎁" },
    { "key": "xmas-cookies", "name": "Gingerbread Cookies", "cost": 50, "bonus": 4, "emoji": "🍪" },
    { "key": "xmas-candy", "name": "Candy Canes", "cost": 35, "bonus": 3, "emoji": "🍬" },
    { "key": "xmas-snowflake", "name": "Snowflake Garland", "cost": 55, "bonus": 5, "emoji": "❄️" }
  ],
  "halloweenItems": [
    { "key": "hw-pumpkin", "name": "Jack-o''-Lantern", "cost": 70, "bonus": 6, "emoji": "🎃" },
    { "key": "hw-cobweb", "name": "Spooky Cobwebs", "cost": 40, "bonus": 4, "emoji": "🕸️" },
    { "key": "hw-bats", "name": "Bat Swarm Banner", "cost": 60, "bonus": 5, "emoji": "🦇" },
    { "key": "hw-cauldron", "name": "Bubbling Cauldron", "cost": 85, "bonus": 7, "emoji": "⚗️" },
    { "key": "hw-tombstone", "name": "Tombstone Corner", "cost": 55, "bonus": 5, "emoji": "🪦" },
    { "key": "hw-candy", "name": "Trick-or-Treat Bowl", "cost": 35, "bonus": 3, "emoji": "🍭" },
    { "key": "hw-cat", "name": "Black Cat Statue", "cost": 65, "bonus": 6, "emoji": "🐈‍⬛" },
    { "key": "hw-lanterns", "name": "Spooky Lantern String", "cost": 90, "bonus": 8, "emoji": "🏮" }
  ],
  "seasonalIggies": [
    { "key": "sb-holly", "name": "Holly Dove", "speciesKey": "diamond", "colorKey": "holly", "cost": 70, "season": "christmas" },
    { "key": "sb-robin", "name": "Robin Redbreast Pigeon", "speciesKey": "rock", "colorKey": "robin", "cost": 80, "season": "christmas" },
    { "key": "sb-peppermint", "name": "Peppermint Fantail", "speciesKey": "fantail", "colorKey": "santa", "cost": 110, "season": "christmas" },
    { "key": "sb-raven", "name": "Raven-winged Dove", "speciesKey": "ringneck", "colorKey": "raven", "cost": 80, "season": "halloween" },
    { "key": "sb-jack", "name": "Jack-o-Pigeon", "speciesKey": "king", "colorKey": "pumpkin", "cost": 100, "season": "halloween" },
    { "key": "sb-candycorn", "name": "Candy Corn Dove", "speciesKey": "diamond", "colorKey": "candycorn", "cost": 65, "season": "halloween" },
    { "key": "sb-ghost", "name": "Ghost Fantail", "speciesKey": "fantail", "colorKey": "ghost", "cost": 90, "season": "halloween" }
  ],
  "seedPacks": [
    { "key": "pack-small", "name": "Handful of Seeds", "seeds": 100, "priceCents": 99, "emoji": "🌾" },
    { "key": "pack-medium", "name": "Sack of Seeds", "seeds": 550, "priceCents": 399, "emoji": "🌻" },
    { "key": "pack-large", "name": "Barrel of Seeds", "seeds": 1500, "priceCents": 799, "emoji": "🎁" }
  ]
}'::jsonb)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 4. Achievements catalog + per-player unlocks
-- ------------------------------------------------------------
create table if not exists public.achievements (
  key text primary key,
  name text not null,
  description text not null,
  emoji text not null
);

alter table public.achievements enable row level security;

create policy "everyone can read achievements"
  on public.achievements for select
  using (true);

insert into public.achievements (key, name, description, emoji) values
  ('first_bird', 'First Iggy', 'Welcome your first Iggy to the kennel', '🥚'),
  ('five_birds', 'Growing Kennel', 'Own 5 Iggies at once', '🕊️'),
  ('ten_birds', 'Full Kennel', 'Own 10 Iggies at once', '🏠'),
  ('first_breed', 'Matchmaker', 'Successfully pair two Iggies', '💕'),
  ('rare_bird', 'Shimmer Spotted', 'Hatch an iridescent bird', '✨'),
  ('streak_7', 'Week of Devotion', 'Reach a 7-day login streak', '🔥'),
  ('streak_30', 'Kennel Keeper', 'Reach a 30-day login streak', '🏆'),
  ('all_decor', 'Fully Decorated', 'Own every everyday decoration', '🎀'),
  ('christmas_collector', 'Holiday Spirit', 'Own 3 Christmas decorations', '🎄'),
  ('halloween_collector', 'Spooky Season', 'Own 3 Halloween decorations', '🎃'),
  ('seasonal_bird', 'Limited Edition', 'Adopt an exclusive seasonal bird', '🌟'),
  ('breaker_win', 'Brick Buster', 'Clear a full Seed Breaker board', '🧱'),
  ('match_win', 'Sharp Memory', 'Complete a Nest Match game', '🧠'),
  ('rich_500', 'Seed Baron', 'Save up 500 seeds at once', '💰'),
  ('upgrade_master', 'Master Builder', 'Upgrade the kennel 5 times', '⭐')
on conflict (key) do nothing;

create table if not exists public.player_achievements (
  user_id uuid references auth.users(id) on delete cascade,
  achievement_key text references public.achievements(key) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_key)
);

alter table public.player_achievements enable row level security;

create policy "users can view their own achievements"
  on public.player_achievements for select
  using (auth.uid() = user_id);

create policy "users can insert their own achievements"
  on public.player_achievements for insert
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4b. Push notification subscriptions (Web Push)
-- ------------------------------------------------------------
create table if not exists public.push_subscriptions (
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "users manage their own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Note: the daily reminder cron job reads this table using the service role
-- key (see lib/supabaseAdmin.js), which bypasses RLS by design.

-- ------------------------------------------------------------
-- 4c. Purchases (real-money seed packs via Stripe)
-- ------------------------------------------------------------
create extension if not exists pgcrypto;

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

create policy "users can view their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- No insert/update policy for regular users on purpose: purchases are only
-- ever written by the Stripe webhook handler using the service role key,
-- after verifying Stripe's signature.

-- ------------------------------------------------------------
-- 5. Auto-create a profile + starter save when someone signs up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.player_saves (user_id, seeds, birds, loft_capacity, decorations, last_collect_at, streak, flags)
  values (
    new.id,
    30,
    jsonb_build_array(jsonb_build_object(
      'id', 'starter-' || new.id,
      'name', 'Pebble',
      'speciesKey', 'rock',
      'colorKey', 'slate',
      'gender', 'f',
      'stage', 'adult',
      'bornAt', extract(epoch from now()) * 1000,
      'hatchAt', null,
      'growAt', null,
      'lastFedAt', extract(epoch from now()) * 1000,
      'lastCleanedAt', extract(epoch from now()) * 1000,
      'breedingUntil', null
    )),
    4,
    '[]'::jsonb,
    (extract(epoch from now()) * 1000)::bigint,
    0,
    '{}'::jsonb
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 5b. Safe public profile views
-- ------------------------------------------------------------
-- These views intentionally expose only presentation-safe pet fields.
-- Internal timers, life, economy flags, lineage internals, and save metadata
-- remain private. The views are SECURITY DEFINER and expose only the selected
-- columns below; do not add sensitive save fields to them.
-- ------------------------------------------------------------
create or replace view public.public_profiles as
select
  p.id,
  p.username,
  p.created_at,
  s.streak,
  s.loft_capacity,
  coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', pet->>'id',
      'name', pet->>'name',
      'speciesKey', pet->>'speciesKey',
      'colorKey', pet->>'colorKey',
      'gender', pet->>'gender',
      'stage', pet->>'stage',
      'appearance', pet->'appearance',
      'wardrobeSlots', pet->'wardrobeSlots',
      'outfitKey', pet->>'outfitKey'
    ) order by pet->>'name')
    from jsonb_array_elements(s.birds) as pet
  ), '[]'::jsonb) as birds,
  coalesce((s.flags->>'bloombreakerBest')::integer, 0) as bloombreaker_best
from public.profiles p
join public.player_saves s on s.user_id = p.id;

create or replace view public.public_achievements as
select
  p.username,
  a.key,
  a.name,
  a.description,
  a.emoji,
  pa.earned_at
from public.player_achievements pa
join public.profiles p on p.id = pa.user_id
join public.achievements a on a.key = pa.achievement_key;

grant select on public.public_profiles to anon, authenticated;
grant select on public.public_achievements to anon, authenticated;

-- ------------------------------------------------------------
-- 6. Public leaderboard view (limited, read-only columns)
-- ------------------------------------------------------------
create or replace view public.leaderboard as
select
  p.username,
  s.seeds,
  jsonb_array_length(s.birds) as bird_count
from public.player_saves s
join public.profiles p on p.id = s.user_id
order by s.seeds desc;

grant select on public.leaderboard to anon, authenticated;

-- ------------------------------------------------------------
-- 7. Make yourself an admin (run this AFTER you've signed up once)
-- ------------------------------------------------------------
-- update public.profiles set is_admin = true where username = 'YOUR_USERNAME_HERE';

-- ============================================================
-- Iggy Meadow v35 premium + kennel cap
-- Keep this schema aligned with migration-iggy-meadow-v35.sql.
-- ============================================================
-- ============================================================
-- Iggy Meadow v35
-- 14-Iggy hard cap + server-owned Special Dog Bones
-- Safe, additive migration for existing projects.
-- ============================================================

-- Keep kennel capacity inside the new permanent 14-Iggy maximum.
update public.player_saves
set loft_capacity = least(loft_capacity, 14)
where loft_capacity > 14;

-- Enforce the pet count at the database boundary too. NOT VALID means an
-- unexpected legacy save would not block the migration, while all new writes
-- are still checked immediately.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'player_saves_max_14_iggies'
  ) then
    alter table public.player_saves
      add constraint player_saves_max_14_iggies
      check (jsonb_array_length(birds) <= 14) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'player_saves_max_14_capacity'
  ) then
    alter table public.player_saves
      add constraint player_saves_max_14_capacity
      check (loft_capacity <= 14) not valid;
  end if;
end $$;

-- Premium currency is intentionally isolated from player_saves. Players may
-- read their own balance but cannot insert/update it from the browser.
create table if not exists public.premium_wallets (
  user_id uuid references auth.users(id) on delete cascade primary key,
  bones integer not null default 0 check (bones >= 0),
  updated_at timestamptz not null default now()
);

alter table public.premium_wallets enable row level security;

drop policy if exists "users can view their own premium wallet" on public.premium_wallets;
create policy "users can view their own premium wallet"
  on public.premium_wallets for select
  using (auth.uid() = user_id);

-- Backfill a zero-balance wallet for every existing save.
insert into public.premium_wallets (user_id, bones)
select user_id, 0 from public.player_saves
on conflict (user_id) do nothing;

-- Auto-create a wallet for future signups without giving the browser write access.
create or replace function public.handle_new_user_premium_wallet()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.premium_wallets (user_id, bones)
  values (new.id, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_premium_wallet on auth.users;
create trigger on_auth_user_created_premium_wallet
  after insert on auth.users
  for each row execute function public.handle_new_user_premium_wallet();

-- Extend purchase audit records without breaking existing seed purchases.
alter table public.purchases
  add column if not exists purchase_type text not null default 'seeds',
  add column if not exists bones_granted integer not null default 0;

-- Atomic service-role-only grant used by the verified Stripe webhook.
create or replace function public.grant_special_dog_bones(p_user_id uuid, p_amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'Bone grant must be positive';
  end if;

  insert into public.premium_wallets (user_id, bones, updated_at)
  values (p_user_id, p_amount, now())
  on conflict (user_id) do update
    set bones = public.premium_wallets.bones + excluded.bones,
        updated_at = now()
  returning bones into new_balance;

  return new_balance;
end;
$$;

revoke all on function public.grant_special_dog_bones(uuid, integer) from public, anon, authenticated;
grant execute on function public.grant_special_dog_bones(uuid, integer) to service_role;

-- Atomic service-role-only speed-up. One bone performs exactly one deterministic
-- timer action: hatch egg -> puppy, puppy -> adult, or end breeding rest.
create or replace function public.use_special_dog_bone(p_user_id uuid, p_pet_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_bones integer;
  current_birds jsonb;
  new_birds jsonb := '[]'::jsonb;
  pet jsonb;
  found_pet boolean := false;
  changed boolean := false;
  action_name text := null;
  now_ms bigint := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
  baby_grow_hours numeric := 6;
begin
  select bones into current_bones
  from public.premium_wallets
  where user_id = p_user_id
  for update;

  if current_bones is null or current_bones < 1 then
    return jsonb_build_object('ok', false, 'error', 'no_bones');
  end if;

  select birds into current_birds
  from public.player_saves
  where user_id = p_user_id
  for update;

  if current_birds is null then
    return jsonb_build_object('ok', false, 'error', 'save_not_found');
  end if;

  select coalesce((config->>'babyGrowHours')::numeric, 6)
    into baby_grow_hours
  from public.game_config
  where id = 1;
  baby_grow_hours := coalesce(baby_grow_hours, 6);

  for pet in select value from jsonb_array_elements(current_birds)
  loop
    if pet->>'id' = p_pet_id then
      found_pet := true;

      if pet->>'stage' = 'egg' then
        pet := jsonb_set(pet, '{stage}', '"baby"'::jsonb, true);
        pet := jsonb_set(pet, '{hatchAt}', to_jsonb(now_ms), true);
        pet := jsonb_set(pet, '{growAt}', to_jsonb(now_ms + round(baby_grow_hours * 3600000)::bigint), true);
        pet := jsonb_set(pet, '{lastFedAt}', to_jsonb(now_ms), true);
        pet := jsonb_set(pet, '{lastCleanedAt}', to_jsonb(now_ms), true);
        changed := true;
        action_name := 'hatch';
      elsif pet->>'stage' = 'baby' then
        pet := jsonb_set(pet, '{stage}', '"adult"'::jsonb, true);
        pet := jsonb_set(pet, '{growAt}', 'null'::jsonb, true);
        changed := true;
        action_name := 'grow';
      elsif coalesce((pet->>'breedingUntil')::bigint, 0) > now_ms then
        pet := jsonb_set(pet, '{breedingUntil}', 'null'::jsonb, true);
        changed := true;
        action_name := 'breeding_rest';
      end if;
    end if;

    new_birds := new_birds || jsonb_build_array(pet);
  end loop;

  if not found_pet then
    return jsonb_build_object('ok', false, 'error', 'pet_not_found');
  end if;

  if not changed then
    return jsonb_build_object('ok', false, 'error', 'nothing_to_speed_up');
  end if;

  update public.premium_wallets
  set bones = bones - 1, updated_at = now()
  where user_id = p_user_id;

  update public.player_saves
  set birds = new_birds, updated_at = now()
  where user_id = p_user_id;

  return jsonb_build_object(
    'ok', true,
    'action', action_name,
    'bones', current_bones - 1,
    'birds', new_birds
  );
end;
$$;

revoke all on function public.use_special_dog_bone(uuid, text) from public, anon, authenticated;
grant execute on function public.use_special_dog_bone(uuid, text) to service_role;

-- Make the bone catalog visible to admins/config readers too. Existing configs
-- get it only if it is not already present.
update public.game_config
set config = jsonb_set(
  config,
  '{bonePacks}',
  '[
    {"key":"bones-small","name":"Pocketful of Special Bones","bones":5,"priceCents":199,"emoji":"🦴"},
    {"key":"bones-medium","name":"Keeper''s Bone Bag","bones":15,"priceCents":499,"emoji":"🎒"},
    {"key":"bones-large","name":"Meadow Bone Tin","bones":40,"priceCents":999,"emoji":"✨"}
  ]'::jsonb,
  true
), updated_at = now()
where id = 1 and not (config ? 'bonePacks');
