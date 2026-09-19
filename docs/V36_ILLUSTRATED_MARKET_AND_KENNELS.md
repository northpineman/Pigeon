# Iggy Meadow v36 — Illustrated Market & Kennel Rooms

This release is a presentation-focused continuation of the Living Meadow overhaul. It does not change the Supabase schema or player save format.

## Major visual additions
- Illustrated Market Lane with three clickable storefronts and resident shopkeepers.
- New reusable vector item-art system for everyday supplies, toys, seed packs, Special Dog Bones, and seasonal decorations.
- Toy Chest, training goods, decorations, seasonal shops, seed packs, and premium bone packs now use illustrated item displays rather than relying on emoji alone.
- Willow Kennels now opens with an illustrated hallway showing resident rooms, beds, windows, wall details, and collected decor.
- Adoption House gained an illustrated parlor scene with several Iggies waiting in a cozy interior.
- Home page gained a Meadow Curio Cabinet that visually surfaces collected decorations, toys, and outfits.
- Meadow Compendium now shows actual Iggy art, toy illustrations, and collected wardrobe art in its archive cards.
- Responsive fallbacks keep these scenes usable on smaller screens.

## Scale and safety
- The hard maximum remains 14 owned Iggies.
- Existing pagination/lazy-loading work remains in place.
- No new database migration is required for v36.
- Special Dog Bones remain server-owned premium currency introduced in v35.

## Validation performed
- Parsed every JS/JSX source file using the TypeScript parser: 0 parse-error files.
- Checked local module imports: 0 missing local imports.
- CSS brace count verified balanced.
- ZIP integrity is checked during packaging.

A full `next build` is intentionally left for the user's Windows build environment when the visual reveal is ready.
