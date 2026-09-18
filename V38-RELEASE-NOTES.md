# Iggy Meadow v38 — Bespoke Art Pass

This release continues the visual overhaul without changing player-save or database structure.

## New original illustration assets
- Six town landmark illustrations: Willow Kennels, Adoption House, Market Lane, Arcade Lane, Meadow Archive, Garden Gate.
- Six world postcard scenes: Whispering Woods, Bramblewick, Frostpeak, Fall Grove, Market Lane, Arcade Lane.
- Five illustrated interiors/backdrops: Adoption Parlor, Meadow Goods, Velvet Ribbon boutique, Pippin's Toy Shop, private kennel room.
- New illustrated Meadow Plaza landscape.

## UI upgrades
- Town Center now uses illustrated destination artwork rather than generic CSS buildings.
- Meadow Portal destination tiles are fully image-backed.
- Great Meadow postcards now display original scenic artwork.
- Market Lane shop cards now show illustrated shop interiors.
- Adoption House uses a full illustrated parlor scene with resident Iggies layered into it.
- Each Iggy's private room now uses a bespoke illustrated room backdrop.
- Meadow Plaza now has a full illustrated background with Iggies wandering on top.
- Login and signup now use the new Meadow Plaza illustration as the full-screen environment.

## Preserved systems
- 14-Iggy ownership maximum remains unchanged.
- Special Dog Bones / premium currency remains unchanged.
- No new database migration is required for v38.
- v35 premium migration is still required when the premium system is tested/deployed.

## Validation performed in the build workspace
- All new SVG files parsed successfully as XML.
- Local source import resolution check found no missing relative/@ imports.
- globals.css brace structure is balanced.
- `.env.local` is not included.
- Secret-pattern scan found no embedded service-role/VAPID/Stripe live secrets.
- Full `npm install` / Next production build could not be completed in the isolated workspace because dependency installation timed out. Final production build verification should still be performed on the user's Windows setup.
