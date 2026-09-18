-- Iggy Meadow v25 reliability notes
-- No destructive schema changes are required for this release.
--
-- v25 keeps player_saves.birds as the compatibility storage column while
-- the application treats those records as Iggies. The client-side save
-- indicator and action guards require no database changes.
--
-- This file is intentionally a no-op migration so deployment tooling can
-- record that the v25 application release requires no SQL changes.
select 1;
