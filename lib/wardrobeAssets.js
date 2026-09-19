// Asset manifest for the seasonal wardrobe artwork supplied to Iggy Meadow.
// Component order follows the source sheet: head, body, neck, then leg/trim pieces.

export const WARDROBE_ASSET_SETS = [
  { key: "peppermint_holly", name: "Peppermint Holly", season: "winter", rarity: "rare", fullArt: "/art/wardrobe/full/peppermint_holly.png", collectionArt: "/art/wardrobe/collections/peppermint_holly.png", componentCount: 7 },
  { key: "icy_snowflake", name: "Icy Snowflake", season: "winter", rarity: "rare", fullArt: "/art/wardrobe/full/icy_snowflake.png", collectionArt: "/art/wardrobe/collections/icy_snowflake.png", componentCount: 7 },
  { key: "apple_harvest", name: "Apple Harvest", season: "autumn", rarity: "uncommon", fullArt: "/art/wardrobe/full/apple_harvest.png", collectionArt: "/art/wardrobe/collections/apple_harvest.png", componentCount: 7 },
  { key: "golden_harvest", name: "Golden Harvest", season: "autumn", rarity: "uncommon", fullArt: "/art/wardrobe/full/golden_harvest.png", collectionArt: "/art/wardrobe/collections/golden_harvest.png", componentCount: 7 },
  { key: "spring_blossom", name: "Spring Blossom", season: "spring", rarity: "uncommon", fullArt: "/art/wardrobe/full/spring_blossom.png", collectionArt: "/art/wardrobe/collections/spring_blossom.png", componentCount: 6 },
  { key: "dogwood_charm", name: "Dogwood Charm", season: "spring", rarity: "uncommon", fullArt: "/art/wardrobe/full/dogwood_charm.png", collectionArt: "/art/wardrobe/collections/dogwood_charm.png", componentCount: 7 },
];

export const COMPONENT_SLOT_LABELS = ["Head", "Body", "Neck", "Legs", "Legs", "Legs", "Legs"];

export function getWardrobeComponentPath(setKey, index) {
  return `/art/wardrobe/components/${setKey}_${String(index + 1).padStart(2, "0")}.png`;
}
