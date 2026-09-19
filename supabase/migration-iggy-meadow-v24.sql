-- Iggy Meadow v24 compatibility + public profile migration
-- Safe/additive migration. Run after the existing schema/migrations.

-- Normalize the legacy seasonal catalog key into the current Iggy-facing key.
update public.game_config
set config = config || jsonb_build_object('seasonalIggies', config->'seasonalBirds')
where id = 1
  and not (config ? 'seasonalIggies')
  and (config ? 'seasonalBirds');

-- Safe public profile views. Only presentation fields are exposed.
create or replace view public.public_profiles as
select
  p.id, p.username, p.created_at, s.streak, s.loft_capacity,
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
select p.username, a.key, a.name, a.description, a.emoji, pa.earned_at
from public.player_achievements pa
join public.profiles p on p.id = pa.user_id
join public.achievements a on a.key = pa.achievement_key;

grant select on public.public_profiles to anon, authenticated;
grant select on public.public_achievements to anon, authenticated;
