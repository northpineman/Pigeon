# Iggy Meadow v24 — Stability & Cleanup Pass

## Purpose
This release is intentionally focused on strengthening the existing game rather than adding another large feature system.

## Changes
- Fixed the Admin Panel seasonal catalog mismatch (`seasonalBirds` vs `seasonalIggies`).
- Normalized the database migration path so an older `seasonalBirds` config is copied into `seasonalIggies` without destructive changes.
- Added safe public profile/achievement views used by the existing public profile page. Only presentation-safe pet fields are exposed.
- Updated player-facing branding and notification copy from the old PigeonsnDoves/loft/bird language to Iggy Meadow/kennel/Iggy language.
- Bumped the service-worker cache name so the renamed shell can replace stale cached branding.

## Compatibility
The `player_saves.birds` JSON column remains intentionally unchanged for backward compatibility. React/application state continues to use `pets`.

## Verification
- ZIP integrity: verified after packaging.
- Source-level searches and targeted inspections performed.
- Full `next build` is not claimed unless dependency installation and production build complete successfully.
