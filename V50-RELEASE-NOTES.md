# Iggy Meadow v50 — Ten-Step Polish Sprint

This release is a deliberate visual reset following the v40 reveal.

## Ten completed passes
1. Locked a new visual art bible and Italian Greyhound anatomy standard.
2. Built a transparent painted base-character system from the strongest existing Iggy artwork.
3. Added painted coat assets for every current standard and fantasy coat key.
4. Removed white-box backgrounds from specialty Iggies and full wardrobe renders.
5. Replaced the ordinary adult/puppy procedural renderer with painted character art.
6. Prevented partial wardrobe accessories from dropping pets back to the old procedural body.
7. Replaced flat Townfolk portraits with painted Iggy-based portraits.
8. Reworked the global palette away from heavy brown/parchment toward sky, mint, blush, lilac and cream.
9. Reworked Home, Kennel, Adoption, Wardrobe, profiles, private rooms, town and item framing to support the new art standard.
10. Added visual QA documentation and release validation so future graphics have a consistent benchmark.

## Compatibility
- no database schema change in v50
- 14-Iggy maximum remains intact
- Special Dog Bones system remains intact
- existing Supabase save shape remains intact
- `.env.local` is not included in release archives

## Transitional note
The painted base-body system is now the default. Some small accessory items are represented by polished accessory markers until they receive dedicated painted body-layer assets. This is intentional: visual quality of the Iggy takes priority over falling back to the old procedural renderer.
