// Iggy Meadow wardrobe registry.
// Items are original, slot-based accessories/clothing that can be layered over
// the procedural Italian Greyhound renderer. The legacy outfitKey field remains
// supported for save compatibility while wardrobeSlots is the richer model.

export const LOOKS = {
  "king:tan": "/art/dogs/premium/tan.webp",
  "ringneck:raven": "/art/dogs/premium/raven-witch.webp",
  "king:pumpkin": "/art/dogs/premium/jack-o.webp",
  "diamond:candycorn": "/art/dogs/premium/candycorn.webp",
};


export const PREMIUM_COAT_ART = {
  slate: "/art/dogs/premium/slate.webp",
  white: "/art/dogs/premium/white.webp",
  pied: "/art/dogs/premium/pied.webp",
  black: "/art/dogs/premium/black.webp",
  cinnamon: "/art/dogs/premium/cinnamon.webp",
  tan: "/art/dogs/premium/tan.webp",
  iridescent: "/art/dogs/premium/iridescent.webp",
  holly: "/art/dogs/premium/holly.webp",
  robin: "/art/dogs/premium/robin.webp",
  raven: "/art/dogs/premium/raven.webp",
  candycorn: "/art/dogs/premium/candycorn.webp",
  ghost: "/art/dogs/premium/ghost.webp",
  pumpkin: "/art/dogs/premium/pumpkin.webp",
  santa: "/art/dogs/premium/santa.webp",
};

export function getPremiumCoatImage(colorKey) {
  return PREMIUM_COAT_ART[colorKey] || PREMIUM_COAT_ART.slate;
}

export function getLookImage(speciesKey, colorKey, outfitKey = null) {
  if (outfitKey) {
    const layered = LOOKS[`${speciesKey}:${colorKey}:${outfitKey}`];
    if (layered) return layered;
  }
  return LOOKS[`${speciesKey}:${colorKey}`] || null;
}

export const OUTFITS = {
  none: { key: "none", name: "Everyday", slot: "body", layer: "base", season: "always", rarity: "common", emoji: "✦", description: "Your Iggy's natural look.", cost: 0 },
  ribbon: { key: "ribbon", name: "Meadow Ribbon", slot: "neck", layer: "accessory", season: "spring", rarity: "common", emoji: "🎀", description: "A little ribbon for an ordinary Meadow day.", cost: 0 },
  berry: { key: "berry", name: "Berry Knit Scarf", slot: "neck", layer: "clothing", season: "autumn", rarity: "uncommon", emoji: "🧣", description: "Soft and cozy for crisp Meadow walks.", cost: 35 },
  peppermint: { key: "peppermint", name: "Peppermint Holly", slot: "full", layer: "clothing", season: "winter", rarity: "rare", emoji: "🍬", description: "A festive peppermint-and-holly holiday set.", cost: 75, fullArt: "/art/wardrobe/premium/peppermint_holly.webp", collectionArt: "/art/wardrobe/collections/peppermint_holly.png" },
  blossom: { key: "blossom", name: "Blue Blossom Crown", slot: "head", layer: "accessory", season: "spring", rarity: "uncommon", emoji: "🌸", description: "A tiny crown of blue spring blossoms.", cost: 45 },
  pear: { key: "pear", name: "Pear Harvest Cape", slot: "body", layer: "clothing", season: "autumn", rarity: "rare", emoji: "🍐", description: "A warm pear-gold harvest cape with a leafy clasp.", cost: 65, fullArt: "/art/wardrobe/premium/golden_harvest.webp", collectionArt: "/art/wardrobe/collections/golden_harvest.png" },
  snowcap: { key: "snowcap", name: "Snowcap Bonnet", slot: "head", layer: "accessory", season: "winter", rarity: "uncommon", emoji: "❄️", description: "A soft winter bonnet dusted with snowflakes.", cost: 50 },
  firefly: { key: "firefly", name: "Firefly Glow", slot: "effects", layer: "effect", season: "summer", rarity: "rare", emoji: "✨", description: "Warm little lights that follow an Iggy through dusk.", cost: 80 },
  dogwood: { key: "dogwood", name: "Dogwood Charm", slot: "neck", layer: "accessory", season: "spring", rarity: "rare", emoji: "🌿", description: "A delicate dogwood charm for gentle Meadow days.", cost: 70 },
  starlight: { key: "starlight", name: "Starlight Mantle", slot: "body", layer: "effect", season: "always", rarity: "rare", emoji: "🌙", description: "A dreamy mantle sprinkled with tiny stars.", cost: 90 },

  icy_snowflake: { key: "icy_snowflake", name: "Icy Snowflake", slot: "full", layer: "clothing", season: "winter", rarity: "rare", emoji: "❄️", description: "A crystalline winter ensemble threaded with frosted blue blossoms and snowflake sparkle.", cost: 95, fullArt: "/art/wardrobe/premium/icy_snowflake.webp", collectionArt: "/art/wardrobe/collections/icy_snowflake.png" },
  apple_harvest: { key: "apple_harvest", name: "Apple Harvest", slot: "full", layer: "clothing", season: "autumn", rarity: "uncommon", emoji: "🍎", description: "A warm orchard look with tart-red apples, autumn leaves, plaid, and harvest ribbons.", cost: 70, fullArt: "/art/wardrobe/premium/apple_harvest.webp", collectionArt: "/art/wardrobe/collections/apple_harvest.png" },
  golden_harvest: { key: "golden_harvest", name: "Golden Harvest", slot: "full", layer: "clothing", season: "autumn", rarity: "uncommon", emoji: "🌾", description: "A pear-gold harvest ensemble filled with leaves, blossoms, and warm autumn ribbons.", cost: 70, fullArt: "/art/wardrobe/premium/golden_harvest.webp", collectionArt: "/art/wardrobe/collections/golden_harvest.png" },
  spring_blossom: { key: "spring_blossom", name: "Spring Blossom", slot: "full", layer: "clothing", season: "spring", rarity: "uncommon", emoji: "🌸", description: "A soft spring cape covered in fresh white blossoms and tender green leaves.", cost: 70, fullArt: "/art/wardrobe/premium/spring_blossom.webp", collectionArt: "/art/wardrobe/collections/spring_blossom.png" },
  dogwood_charm: { key: "dogwood_charm", name: "Dogwood Charm", slot: "full", layer: "clothing", season: "spring", rarity: "uncommon", emoji: "🌼", description: "A blue-and-white dogwood-inspired ensemble with delicate bows and floral sprays.", cost: 70, fullArt: "/art/wardrobe/premium/dogwood_charm.webp", collectionArt: "/art/wardrobe/collections/dogwood_charm.png" },
  peppermint_holly: { key: "peppermint_holly", name: "Peppermint Holly", slot: "full", layer: "clothing", season: "winter", rarity: "rare", emoji: "🍬", description: "A complete peppermint holiday look with candy bows, holly, lace, and snowy trim.", cost: 95, fullArt: "/art/wardrobe/premium/peppermint_holly.webp", collectionArt: "/art/wardrobe/collections/peppermint_holly.png" },
};

export const COMPLETE_OUTFIT_KEYS = ["peppermint_holly", "icy_snowflake", "apple_harvest", "golden_harvest", "spring_blossom", "dogwood_charm"];

export function isCompleteOutfit(key) { return COMPLETE_OUTFIT_KEYS.includes(key); }

export const WARDROBE_SLOTS = [
  { key: "head", name: "Head", icon: "🎩" },
  { key: "neck", name: "Neck", icon: "🎀" },
  { key: "body", name: "Body", icon: "🧥" },
  { key: "full", name: "Full outfit", icon: "✨" },
  { key: "effects", name: "Effects", icon: "💫" },
];

export function getOutfit(outfitKey) {
  return OUTFITS[outfitKey] || OUTFITS.none;
}

export function normalizeWardrobeSlots(pet) {
  if (pet?.wardrobeSlots && typeof pet.wardrobeSlots === "object") return { ...pet.wardrobeSlots };
  if (pet?.outfitKey) {
    const outfit = getOutfit(pet.outfitKey);
    return { [outfit.slot]: pet.outfitKey };
  }
  return {};
}

export function getEquippedWardrobeKeys(pet) {
  return Object.values(normalizeWardrobeSlots(pet)).filter(Boolean);
}
