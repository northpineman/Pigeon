-- Iggy Meadow v26 reliability + identity cleanup
-- Safe/additive migration. Run after the existing schema/migrations.

-- Keep the legacy player_saves.birds JSONB column for save compatibility.
-- The application now consistently treats its contents as Iggies/pets.

update public.achievements
set description = replace(description, 'bird', 'Iggy')
where description ilike '%bird%';

update public.achievements
set name = case
  when key = 'five_birds' then 'Growing Kennel'
  when key = 'ten_birds' then 'Full Kennel'
  when key = 'rare_bird' then 'Shimmer Spotted'
  when key = 'seasonal_bird' then 'Limited Edition'
  else name
end;
