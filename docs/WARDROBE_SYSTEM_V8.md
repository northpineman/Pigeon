# Iggy Meadow — Wardrobe System v8

This build turns the Meadow Closet from a single-outfit toggle into a slot-based collectible system.

## Data model

Each pet may now carry `wardrobeSlots`, an object keyed by wardrobe slot (`head`, `neck`, `body`, `full`, `effects`). Values are outfit keys. The older `outfitKey` field is retained as a compatibility pointer to the first equipped item so existing saves and UI remain readable.

## Catalog

The original Meadow Ribbon, Berry Knit Scarf, and Peppermint Holly remain available, with additional original pieces:

- Blue Blossom Crown
- Pear Harvest Cape
- Snowcap Bonnet
- Firefly Glow
- Dogwood Charm
- Starlight Mantle

Each item has a slot, season, rarity, description, and seed cost.

## Persistence

No schema migration is required. `wardrobeSlots` lives inside the existing pet JSON stored in `player_saves.birds`, so old saves remain compatible. Existing `outfitKey` saves are normalized into a slot automatically when the wardrobe is opened or rendered.

## Rendering

`PetArt` now accepts `wardrobeSlots` and passes it into `PetSVG`. The procedural renderer can layer multiple independent wardrobe pieces while the existing painted-art lookup remains available for pets with no custom wardrobe layers.

## Next expansion points

The registry is intentionally data-driven so future work can add inventory quantities, limited seasonal availability, trade/gift rules, dye/color variants, collection rewards, and true per-layer painted assets without replacing the save model.
