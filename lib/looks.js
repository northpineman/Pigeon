// Iggy Meadow wardrobe registry.
// Items are original, slot-based accessories/clothing that can be layered over
// the procedural Italian Greyhound renderer. The legacy outfitKey field remains
// supported for save compatibility while wardrobeSlots is the richer model.

export const LOOKS = {
  "king:tan": "/art/dogs/fawn-base.png",
  "ringneck:raven": "/art/dogs/raven-witch.png",
  "king:pumpkin": "/art/dogs/jack-o.png",
  "diamond:candycorn": "/art/dogs/candycorn.png",
};

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
  peppermint: { key: "peppermint", name: "Peppermint Holly", slot: "full", layer: "clothing", season: "winter", rarity: "rare", emoji: "🍬", description: "A festive peppermint-and-holly holiday set.", cost: 75 },
  blossom: { key: "blossom", name: "Blue Blossom Crown", slot: "head", layer: "accessory", season: "spring", rarity: "uncommon", emoji: "🌸", description: "A tiny crown of blue spring blossoms.", cost: 45 },
  pear: { key: "pear", name: "Pear Harvest Cape", slot: "body", layer: "clothing", season: "autumn", rarity: "rare", emoji: "🍐", description: "A warm pear-gold harvest cape with a leafy clasp.", cost: 65 },
  snowcap: { key: "snowcap", name: "Snowcap Bonnet", slot: "head", layer: "accessory", season: "winter", rarity: "uncommon", emoji: "❄️", description: "A soft winter bonnet dusted with snowflakes.", cost: 50 },
  firefly: { key: "firefly", name: "Firefly Glow", slot: "effects", layer: "effect", season: "summer", rarity: "rare", emoji: "✨", description: "Warm little lights that follow an Iggy through dusk.", cost: 80 },
  dogwood: { key: "dogwood", name: "Dogwood Charm", slot: "neck", layer: "accessory", season: "spring", rarity: "rare", emoji: "🌿", description: "A delicate dogwood charm for gentle Meadow days.", cost: 70 },
  starlight: { key: "starlight", name: "Starlight Mantle", slot: "body", layer: "effect", season: "always", rarity: "rare", emoji: "🌙", description: "A dreamy mantle sprinkled with tiny stars.", cost: 90 },
};

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
