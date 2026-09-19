# Iggy Meadow v31 — Living Storybook

This release continues the v30 visual overhaul before the next user build check. It deliberately adds a second large presentation pass rather than new backend mechanics.

## Major visible changes
- Added a new **Meadow Plaza** home-world scene with layered hills, cottage, boutique, pond, garden path, lanterns, flowers, and up to three of the player's own Iggies visibly present in the scene.
- Iggies in Meadow Plaza are clickable and open their existing profile view.
- Added an illustrated **daily stepping-stone trail** that shows quest progress as a visual journey instead of only a list.
- Added subtle animated atmospheric layers across the entire game: drifting clouds, petals, and meadow sparkles.
- Rebuilt the site identity with a small Iggy Meadow crest, storybook masthead, warmer header materials, and destination-plaque navigation.
- Added page-specific background moods for Meadow, Kennel, Adoption, Market, World/Explore, Games, and Collection.
- Deepened **Willow Kennels** with hover/lift room-card behavior and richer stall styling.
- Deepened the **Adoption House** cards so they behave more like pet-display portraits.
- Turned the **Wardrobe dressing room** into a visual vanity scene with curtains, a framed mirror, glowing vanity details, and richer appearance-studio surfaces.
- Gave **Bramblewick** a stronger castle/kingdom skyline, royal color treatment, and parchment quest/NPC presentation.
- Gave **Whispering Woods** a darker enchanted-forest identity with moonlight, twinkles, stronger canopy depth, and journal-card styling.
- Reframed **Arcade Lane** as an actual lantern game hall with cabinet-like game cards and marquee lighting.
- Reframed **Market Lane** as a striped-awning shopping street with warmer shop cards and display-window styling.
- Reworked the **Meadow Compendium** into a bound-book/archive treatment with a visible center binding and parchment pages.
- Added a more ornate hand-painted-board treatment to the Great Meadow Explorer's Atlas.
- Added scrapbook edging to Iggy profile modals.
- Polished the procedural Italian Greyhound renderer used for most everyday Iggies: softer contact shadows, paws, coat sheen, chest shading, inner-ear detail, muzzle highlights, and a subtle mouth line so non-painted pets feel less placeholder-like.

## Gameplay / data safety
- No database schema changes.
- No Supabase save-format changes.
- No economy values changed.
- No breeding/genetics behavior changed.
- No account/authentication behavior changed.
- The existing `player_saves.birds` compatibility remains untouched.
- `.env.local` is not included in the release archive.

## Validation before packaging
- New JSX imports were checked for valid project paths.
- Braces, parentheses, and brackets in the edited JSX files are balanced.
- CSS brace structure is balanced.
- No local `.env.local` file is present in the package.
- Final archive integrity is checked after creation.

A full Next.js production build is intentionally deferred until the user is ready for the next visual milestone check on their already-working Windows setup.
