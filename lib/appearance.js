// Iggy appearance collection. Outfits stay complete and themed; facial traits
// provide the deeper personalization layer and can be inherited through breeding.

export const EYE_COLORS = [
  { key: "hazel", name: "Hazel", color: "#6B4B32", rarity: "common", cost: 0, emoji: "🤎" },
  { key: "amber", name: "Amber", color: "#C47A24", rarity: "common", cost: 0, emoji: "🧡" },
  { key: "brown", name: "Chestnut", color: "#7B3F24", rarity: "common", cost: 0, emoji: "🤎" },
  { key: "blue", name: "Meadow Blue", color: "#5A8FC7", rarity: "uncommon", cost: 90, emoji: "💙" },
  { key: "green", name: "Willow Green", color: "#5C8B61", rarity: "uncommon", cost: 90, emoji: "💚" },
  { key: "violet", name: "Violet", color: "#8C6FE0", rarity: "rare", cost: 160, emoji: "💜" },
  { key: "silver", name: "Moon Silver", color: "#A9C6D9", rarity: "rare", cost: 160, emoji: "🩵" },
  { key: "gold", name: "Sunlit Gold", color: "#D9AF42", rarity: "special", cost: 280, emoji: "💛" },
];

export const EYE_STYLES = [
  { key: "classic", name: "Classic", emoji: "●", rarity: "common", cost: 0, description: "Soft, natural round eyes." },
  { key: "almond", name: "Almond", emoji: "◒", rarity: "common", cost: 0, description: "A graceful, slightly tapered eye shape." },
  { key: "sparkle", name: "Sparkle", emoji: "✦", rarity: "uncommon", cost: 100, description: "Bright eyes with an extra little star of light." },
  { key: "dreamy", name: "Dreamy", emoji: "◌", rarity: "uncommon", cost: 100, description: "Gentle eyes with a soft, sleepy expression." },
  { key: "starlit", name: "Starlit", emoji: "✧", rarity: "rare", cost: 180, description: "A tiny celestial glimmer lives in each eye." },
  { key: "mystic", name: "Mystic", emoji: "✺", rarity: "rare", cost: 220, description: "A luminous fantasy gaze for special Iggies." },
  { key: "heart", name: "Heartlight", emoji: "♥", rarity: "special", cost: 300, description: "A warm heart-shaped highlight appears in the gaze." },
];

export const APPEARANCE_ITEMS = [
  ...EYE_COLORS.map((item) => ({ ...item, category: "eye-color" })),
  ...EYE_STYLES.map((item) => ({ ...item, category: "eye-style" })),
];

export function normalizeAppearance(pet) {
  const a = pet?.appearance && typeof pet.appearance === "object" ? pet.appearance : {};
  return {
    eyeColor: a.eyeColor || "hazel",
    eyeStyle: a.eyeStyle || "classic",
  };
}

export function getEyeColor(key) {
  return EYE_COLORS.find((x) => x.key === key) || EYE_COLORS[0];
}

export function getEyeStyle(key) {
  return EYE_STYLES.find((x) => x.key === key) || EYE_STYLES[0];
}

export function createAppearance(parentA, parentB) {
  const a = normalizeAppearance(parentA);
  const b = normalizeAppearance(parentB);
  let eyeColor = Math.random() < 0.58 ? a.eyeColor : (Math.random() < 0.78 ? b.eyeColor : "hazel");
  let eyeStyle = Math.random() < 0.58 ? a.eyeStyle : (Math.random() < 0.78 ? b.eyeStyle : "classic");

  // Small mutation chance keeps breeding capable of discovering appearances
  // that weren't visibly present on either parent.
  if (Math.random() < 0.045) eyeColor = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].key;
  if (Math.random() < 0.035) eyeStyle = EYE_STYLES[Math.floor(Math.random() * EYE_STYLES.length)].key;
  return { eyeColor, eyeStyle };
}

export function appearanceInventoryDefaults() {
  return ["eye-color:hazel", "eye-color:amber", "eye-color:brown", "eye-style:classic", "eye-style:almond"];
}

export function appearanceItemKey(category, key) {
  return `${category}:${key}`;
}
