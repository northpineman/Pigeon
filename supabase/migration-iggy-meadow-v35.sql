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
