# Iggy Meadow — Wardrobe Art Pass v10

This pass turns the supplied seasonal Italian Greyhound outfit sheet into reusable Iggy Meadow wardrobe artwork.

## Collections
- Peppermint Holly — winter / rare
- Icy Snowflake — winter / rare
- Apple Harvest — autumn / uncommon
- Golden Harvest — autumn / uncommon
- Spring Blossom — spring / uncommon
- Dogwood Charm — spring / uncommon

## Asset structure
- `public/art/wardrobe/full/` — transparent full-look Iggy renders cropped from the supplied sheet.
- `public/art/wardrobe/collections/` — transparent collection sheets containing the source look and accessory presentation.
- `public/art/wardrobe/components/` — transparent individual component sprites extracted from the lower accessory rows of the supplied sheet.

The component manifest currently organizes each source set as:
1. Head
2. Body
3. Neck
4+. Legs / trim pieces

The extracted pieces are staged for the next deeper layering pass. The six complete looks are already wired into the wardrobe as `full` outfits and use the new painted renders in the dressing room and collection cards.

## Important art note
The source sheet provides beautiful full-body three-quarter/side-facing Iggies rather than a true front-facing neutral pose. This pass preserves those supplied renders instead of inventing a pose change that could distort the outfit. A dedicated front-facing illustration pass should be generated separately and can then replace the `full/` renders without changing the wardrobe data model.

## Implementation
- `lib/looks.js` now supports `fullArt` and `collectionArt` on wardrobe items.
- `components/PetArt.jsx` renders a supplied full-look image whenever a `full` wardrobe item is equipped; slot-based procedural layering remains the fallback.
- `components/Wardrobe.jsx` shows the supplied full-look art and adds a Seasonal Asset Library with component previews and slot labels.
- `lib/wardrobeAssets.js` is the reusable asset manifest.

No destructive database changes were introduced.
