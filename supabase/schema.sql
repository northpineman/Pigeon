-- ============================================================
-- PigeonsnDoves database schema
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
  "seasonalBirds": [
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
  ('first_bird', 'Nest Egg', 'Have your first bird in the loft', '🥚'),
  ('five_birds', 'Growing Flock', 'Own 5 birds at once', '🕊️'),
  ('ten_birds', 'Loft Full', 'Own 10 birds at once', '🏠'),
  ('first_breed', 'Matchmaker', 'Successfully pair two birds to nest', '💕'),
  ('rare_bird', 'Shimmer Spotted', 'Hatch an iridescent bird', '✨'),
  ('streak_7', 'Week of Devotion', 'Reach a 7-day login streak', '🔥'),
  ('streak_30', 'Loft Keeper', 'Reach a 30-day login streak', '🏆'),
  ('all_decor', 'Fully Decorated', 'Own every everyday decoration', '🎀'),
  ('christmas_collector', 'Holiday Spirit', 'Own 3 Christmas decorations', '🎄'),
  ('halloween_collector', 'Spooky Season', 'Own 3 Halloween decorations', '🎃'),
  ('seasonal_bird', 'Limited Edition', 'Adopt an exclusive seasonal bird', '🌟'),
  ('breaker_win', 'Brick Buster', 'Clear a full Seed Breaker board', '🧱'),
  ('match_win', 'Sharp Memory', 'Complete a Nest Match game', '🧠'),
  ('rich_500', 'Seed Baron', 'Save up 500 seeds at once', '💰'),
  ('upgrade_master', 'Master Builder', 'Upgrade the loft 5 times', '⭐')
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
