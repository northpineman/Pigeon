# Iggy Meadow v24 — Stability & Identity Pass

## What changed

### Fixed
- Admin Panel now uses the current `seasonalIggies` config key instead of the obsolete `seasonalBirds` key.
- Added a safe compatibility migration that copies `seasonalBirds` to `seasonalIggies` only when the new key is absent.
- Added `public_profiles` and `public_achievements` database views required by the existing public profile page.
- Public profile views expose only presentation-safe pet fields rather than the full private save payload.
- Added short client-side economy-action guards to reduce accidental double-click purchases/rewards while React state is updating.
- Added validation for invalid adoption/seasonal Iggy catalog entries.

### Identity cleanup
- Updated manifest branding to Iggy Meadow.
- Updated service-worker cache/notification branding.
- Updated login/signup copy from loft language to kennel language.
- Updated Stripe checkout product branding.
- Updated push notification copy.
- Updated the database schema's player-facing catalog/achievement wording while intentionally preserving `player_saves.birds` for compatibility.

## Intentional compatibility
The database column `player_saves.birds` is NOT renamed. It remains the persistence compatibility column used by existing saves and migrations. Application state continues to use `pets`.

## Database migration
Run `supabase/migration-iggy-meadow-v24.sql` against an existing Supabase project. It is additive and safe to re-run.

## Verification
- ZIP integrity verified after packaging.
- Targeted source inspection completed.
- Delimiter/balance smoke check completed for the edited GameApp JSX source.
- `npm install` was attempted but timed out in the build environment, so a full Next.js production build is not claimed.
