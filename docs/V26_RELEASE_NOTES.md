# Iggy Meadow v26 — Reliability + Identity

## Purpose
This release hardens persistence and continues the migration from the original PigeonsnDoves vocabulary without risking existing saves.

## Changes
- Renamed the npm package from `pigeonsndoves` to `iggy-meadow`.
- Serialized Supabase save writes so slow network responses cannot race and overwrite newer snapshots.
- Added save revision tracking so only the newest save controls the visible save indicator.
- Added `woodsState` to the save effect dependency list so exploration changes are persisted.
- Renamed local canvas-game actor variables from `bird` to `iggy` in Sky Dash and Wind Rider; gameplay behavior is unchanged.
- Updated public profile rendering variables to use Iggy-native terminology while preserving the existing `birds` API/database compatibility field.
- Added `supabase/migration-iggy-meadow-v26.sql` for safe achievement wording cleanup.

## Compatibility
The legacy `player_saves.birds` column is intentionally retained. Do not rename it without a dedicated database migration and save-backfill plan.

## Verification
- Source delimiter/balance smoke checks should be run before release.
- Full Next.js production build remains environment-dependent until dependencies can be installed successfully.
