// Consumable toy collection for Iggy Meadow.
// Toys are intentionally separate from wardrobe items: buy -> use once -> happiness/bond moment.
export const TOYS = [
  { key: "yarn-ball", name: "Meadow Yarn Ball", emoji: "🧶", cost: 12, happiness: 8, rarity: "common", description: "A soft little ball that is impossible to resist chasing." },
  { key: "squeaky-bone", name: "Squeaky Bone", emoji: "🦴", cost: 16, happiness: 10, rarity: "common", description: "One squeak and every Iggy is suddenly ready to play." },
  { key: "feather-wand", name: "Feather Wand", emoji: "🪶", cost: 22, happiness: 12, rarity: "uncommon", description: "A fluttery toy for pounces, zoomies, and happy little hops." },
  { key: "meadow-ball", name: "Meadow Ball", emoji: "🎾", cost: 25, happiness: 14, rarity: "uncommon", description: "Perfect for a proper run across the grass." },
  { key: "plush-squirrel", name: "Plush Squirrel", emoji: "🐿️", cost: 30, happiness: 15, rarity: "uncommon", description: "A cuddly woodland friend for gentle playtime." },
  { key: "butterfly-ribbon", name: "Butterfly Ribbon", emoji: "🦋", cost: 38, happiness: 18, rarity: "rare", description: "A fluttering ribbon toy that turns playtime into a tiny adventure." },
  { key: "moon-bear", name: "Moonlit Bear", emoji: "🧸", cost: 48, happiness: 20, rarity: "rare", description: "A velvety bedtime companion with a stitched moon." },
  { key: "peppermint-jingle", name: "Peppermint Jingle Toy", emoji: "🔔", cost: 55, happiness: 22, rarity: "seasonal", season: "winter", description: "A festive bell toy that jingles all the way through the Meadow." },
  { key: "snowflake-tug", name: "Snowflake Tug", emoji: "❄️", cost: 60, happiness: 24, rarity: "seasonal", season: "winter", description: "A frosty tug toy for winter zoomies." },
  { key: "pumpkin-chew", name: "Pumpkin Chew", emoji: "🎃", cost: 52, happiness: 23, rarity: "seasonal", season: "fall", description: "A harvest-season chew toy with a satisfying little bounce." },
];

export const TOY_RARITY_LABELS = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  seasonal: "Seasonal",
};

export function toyInventoryDefaults() {
  return { "yarn-ball": 2, "squeaky-bone": 1 };
}

export function toyCount(inventory, key) {
  return Math.max(0, Number(inventory?.[key] || 0));
}

export function getToy(key) {
  return TOYS.find((toy) => toy.key === key) || null;
}


export function toyCategory(toy) {
  if (!toy) return "general";
  if (toy.season) return "seasonal";
  if (toy.rarity === "rare" || toy.rarity === "epic") return "special";
  return "everyday";
}

export function toyPlayMemory(pet, toy) {
  return {
    id: `play-${pet?.id || "iggy"}-${toy?.key || "toy"}-${Date.now()}`,
    kind: "play",
    title: `${pet?.name || "Your Iggy"} played with ${toy?.name || "a toy"}`,
    text: `${toy?.description || "A little Meadow playtime."} Happiness +${toy?.happiness || 0}.`,
    toyKey: toy?.key || null,
    at: Date.now(),
  };
}
