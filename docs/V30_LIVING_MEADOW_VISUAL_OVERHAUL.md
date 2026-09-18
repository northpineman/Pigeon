# Iggy Meadow v30 — Living Meadow Visual Overhaul

This release is a broad presentation pass on the verified v28/v29 game foundation. It intentionally prioritizes what the player sees rather than adding another invisible progression system.

## Major visual changes
- Rebuilt login and signup as an illustrated storybook garden-gate experience using existing Iggy art.
- Added reusable illustrated chapter banners for Kennel, Adoption/Breeding, Explore, Arcade Lane, Market Lane, and Collection.
- Turned the kennel grid into a warm room-like presentation with individual kennel stalls and larger pet cards.
- Reworked adoption cards into visual pet displays with larger Iggy art and a dedicated adoption-house feel.
- Restyled breeding rows as a softer lineage salon.
- Rebuilt the Explore screen into a large layered meadow trail scene with moving explorer, path sign, flowers, hills, trees, encounters, and story cards.
- Restyled Arcade Lane as a cabinet-like game hall with distinct illustrated color treatments for every game.
- Restyled Market Lane, Toy Chest, general shop, and Wardrobe as cohesive boutiques/stalls.
- Deepened the Great Meadow map into a framed illustrated atlas.
- Deepened Whispering Woods atmosphere and Bramblewick's kingdom presentation.
- Added distinct Frostpeak and Fall Grove seasonal district treatments.
- Restyled pet profile modals like scrapbook pages.
- Added a more polished loading scene and overall parchment/grain/lighting treatment.

## Safety / game philosophy
- Explore copy now frames depleted energy as needing a cozy break instead of injury or punishment.
- Encounters explicitly allow taking another path without penalty.
- Meadow Promise philosophy remains intact.

## Data / backend
- No database schema changes.
- No changes to Supabase save format.
- Existing `player_saves.birds` compatibility is preserved.
- Existing systems remain wired to the same handlers.

## Build note
The release was syntax-parsed successfully with the local TypeScript parser for all newly edited JSX files. The isolated build container could not complete `npm install` before timeout, so the full Next.js production build should still be run on the user's already-working Windows environment.
