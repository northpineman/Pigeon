export const SPECIES = {
  rock: { name: "Common Capybara", bodyScale: 1, tail: "plain", colors: ["slate", "pied", "white"], incomeMult: 1 },
  king: { name: "Giant Capybara", bodyScale: 1.28, tail: "belly-patch", colors: ["white", "pied", "cinnamon"], incomeMult: 1.3 },
  fantail: { name: "Fluffy Capybara", bodyScale: 0.95, tail: "tufted", colors: ["white", "black", "pied"], incomeMult: 1.15 },
  ringneck: { name: "Ring-marked Capybara", bodyScale: 0.86, tail: "neck-ring", colors: ["tan", "white", "iridescent"], incomeMult: 0.9 },
  diamond: { name: "Pygmy Capybara", bodyScale: 0.56, tail: "spotted", colors: ["slate", "white", "cinnamon"], incomeMult: 0.8 },
  nun: { name: "Masked Capybara", bodyScale: 0.92, tail: "face-mask", colors: ["white", "black", "pied"], incomeMult: 1.1 },
};

export const COLOR_HEX = {
  slate: { base: "#8B94A3", wing: "#6E7889", accent: "#D8DEE6" },
  white: { base: "#FBF8F1", wing: "#E9E0CF", accent: "#FFE9A8" },
  pied: { base: "#3D3A3E", wing: "#FBF8F1", accent: "#FF7A59" },
  black: { base: "#2B2730", wing: "#443E49", accent: "#8C6FE0" },
  cinnamon: { base: "#B4703F", wing: "#8F5530", accent: "#FFD37A" },
  tan: { base: "#C9A876", wing: "#AD8B5C", accent: "#FFE9A8" },
  iridescent: { base: "#6E8B8A", wing: "#4F7A82", accent: "#FF9FD1" },
  holly: { base: "#3F6B4A", wing: "#2C4E35", accent: "#FF6F6F" },
  robin: { base: "#D9752E", wing: "#8B4A1E", accent: "#FFE3C2" },
  raven: { base: "#221F26", wing: "#34303B", accent: "#8C6FE0" },
  candycorn: { base: "#F2A93B", wing: "#E0812A", accent: "#FBEFC6" },
  ghost: { base: "#E9F3F5", wing: "#C9DEE2", accent: "#BFE3EE" },
  pumpkin: { base: "#E07A2C", wing: "#B85A17", accent: "#3D2B4E" },
  santa: { base: "#D9433A", wing: "#9C2E27", accent: "#FBF8F1" },
};

export const SPECIAL_OVERLAY = {
  iridescent: { color: "#B98CC4", opacity: 0.55 },
  ghost: { color: "#BFE3EE", opacity: 0.5 },
  candycorn: { color: "#FBEFC6", opacity: 0.5 },
};

export const TABS = [
  { key: "loft", label: "Wallow", icon: "🐹", color: "#FF7A59" },
  { key: "nests", label: "Nursery", icon: "🍼", color: "#FF6FA5" },
  { key: "events", label: "Map", icon: "🗺️", color: "#8C6FE0" },
  { key: "games", label: "Games", icon: "🎮", color: "#6EC6FF" },
  { key: "shop", label: "Upgrade", icon: "⭐", color: "#4CAF7D" },
];

export const NAME_POOL = ["Pebble","Clementine","Basil","Marmalade","Juniper","Olive","Wisteria","Nutmeg","Sable","Frost","Clover","Sultan","Biscuit","Hazel","Rosemary","Plum","Saffron","Willow","Ash","Poppy","Cinder","Maple","Ginger","Bramble","Dusk","Honey","Fig","Cedar","Marigold","Storm"];

export const HOUR = 60 * 60 * 1000;
export const LOFT_BASE_CAPACITY = 4;
export const CAPACITY_PER_UPGRADE = 2;

export const DEFAULT_CONFIG = {
  feedCost: 2,
  breedCost: 15,
  upgradeBaseCost: 60,
  hungerHours: 8,
  cleanHours: 14,
  eggHatchHours: 3,
  babyGrowHours: 6,
  adoptGrowHours: 2,
  incomeBaseRate: 2,
  maxBankHours: 8,
  adoptCosts: { rock: 20, king: 40, fantail: 32, ringneck: 22, diamond: 18, nun: 26 },
  decorations: [
    { key: "mats", name: "Soft Wallow Mats", cost: 40, bonus: 4, emoji: "🌾" },
    { key: "bath", name: "Mud Wallow Pool", cost: 70, bonus: 6, emoji: "🫙" },
    { key: "perches", name: "Carved Basking Logs", cost: 90, bonus: 7, emoji: "🪵" },
    { key: "vine", name: "Jasmine Vine Patch", cost: 120, bonus: 8, emoji: "🌿" },
    { key: "chimes", name: "Little Bell Chimes", cost: 150, bonus: 10, emoji: "🔔" },
    { key: "rainbow", name: "Rainbow Windsock", cost: 55, bonus: 5, emoji: "🌈" },
  ],
  christmasItems: [
    { key: "xmas-tree", name: "Christmas Tree", cost: 100, bonus: 9, emoji: "🎄" },
    { key: "xmas-lights", name: "Twinkle Lights", cost: 60, bonus: 5, emoji: "✨" },
    { key: "xmas-stockings", name: "Cozy Stockings", cost: 45, bonus: 4, emoji: "🧦" },
    { key: "xmas-snowman", name: "Snowman Friend", cost: 65, bonus: 6, emoji: "⛄" },
    { key: "xmas-gifts", name: "Pile of Gifts", cost: 80, bonus: 7, emoji: "🎁" },
    { key: "xmas-cookies", name: "Gingerbread Cookies", cost: 50, bonus: 4, emoji: "🍪" },
    { key: "xmas-candy", name: "Candy Canes", cost: 35, bonus: 3, emoji: "🍬" },
    { key: "xmas-snowflake", name: "Snowflake Garland", cost: 55, bonus: 5, emoji: "❄️" },
  ],
  halloweenItems: [
    { key: "hw-pumpkin", name: "Jack-o'-Lantern", cost: 70, bonus: 6, emoji: "🎃" },
    { key: "hw-cobweb", name: "Spooky Cobwebs", cost: 40, bonus: 4, emoji: "🕸️" },
    { key: "hw-bats", name: "Bat Swarm Banner", cost: 60, bonus: 5, emoji: "🦇" },
    { key: "hw-cauldron", name: "Bubbling Cauldron", cost: 85, bonus: 7, emoji: "⚗️" },
    { key: "hw-tombstone", name: "Tombstone Corner", cost: 55, bonus: 5, emoji: "🪦" },
    { key: "hw-candy", name: "Trick-or-Treat Bowl", cost: 35, bonus: 3, emoji: "🍭" },
    { key: "hw-cat", name: "Black Cat Statue", cost: 65, bonus: 6, emoji: "🐈‍⬛" },
    { key: "hw-lanterns", name: "Spooky Lantern String", cost: 90, bonus: 8, emoji: "🏮" },
  ],
  seasonalBirds: [
    { key: "sb-holly", name: "Holly Capybara", speciesKey: "diamond", colorKey: "holly", cost: 70, season: "christmas" },
    { key: "sb-robin", name: "Robin Redbreast Capybara", speciesKey: "rock", colorKey: "robin", cost: 80, season: "christmas" },
    { key: "sb-peppermint", name: "Peppermint Capybara", speciesKey: "fantail", colorKey: "santa", cost: 110, season: "christmas" },
    { key: "sb-raven", name: "Raven Capybara", speciesKey: "ringneck", colorKey: "raven", cost: 80, season: "halloween" },
    { key: "sb-jack", name: "Jack-o'-Capybara", speciesKey: "king", colorKey: "pumpkin", cost: 100, season: "halloween" },
    { key: "sb-candycorn", name: "Candy Corn Capybara", speciesKey: "diamond", colorKey: "candycorn", cost: 65, season: "halloween" },
    { key: "sb-ghost", name: "Ghost Capybara", speciesKey: "fantail", colorKey: "ghost", cost: 90, season: "halloween" },
  ],
  seedPacks: [
    { key: "pack-small", name: "Handful of Seeds", seeds: 100, priceCents: 99, emoji: "🌾" },
    { key: "pack-medium", name: "Sack of Seeds", seeds: 550, priceCents: 399, emoji: "🌻" },
    { key: "pack-large", name: "Barrel of Seeds", seeds: 1500, priceCents: 799, emoji: "🎁" },
  ],
};

export const EVERYDAY_DECOR_KEYS = DEFAULT_CONFIG.decorations.map((d) => d.key);

/* ------------------------------ helpers ------------------------------ */

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export function pickRandomName(used) {
  const free = NAME_POOL.filter((n) => !used.includes(n));
  if (free.length) return pickRandom(free);
  return pickRandom(NAME_POOL) + Math.floor(Math.random() * 90 + 10);
}

export function computeHunger(bird, now, config) {
  if (bird.stage === "egg") return 100;
  const elapsed = now - bird.lastFedAt;
  return clamp(100 - (elapsed / (config.hungerHours * HOUR)) * 100, 0, 100);
}
export function computeClean(bird, now, config) {
  if (bird.stage === "egg") return 100;
  const elapsed = now - bird.lastCleanedAt;
  return clamp(100 - (elapsed / (config.cleanHours * HOUR)) * 100, 0, 100);
}
export function computeHappiness(bird, now, config, decorBonus) {
  if (bird.stage === "egg") return 100;
  const h = computeHunger(bird, now, config);
  const c = computeClean(bird, now, config);
  const babyBonus = bird.stage === "baby" ? 10 : 0;
  return clamp(Math.round(h * 0.55 + c * 0.25 + decorBonus + babyBonus), 0, 100);
}
export function pendingIncome(birds, lastCollectAt, now, config, decorBonus) {
  const maxBankMs = config.maxBankHours * HOUR;
  const elapsed = Math.min(now - lastCollectAt, maxBankMs);
  const hours = elapsed / HOUR;
  let total = 0;
  birds.forEach((b) => {
    if (b.stage !== "adult") return;
    const happiness = computeHappiness(b, now, config, decorBonus);
    const mult = SPECIES[b.speciesKey]?.incomeMult ?? 1;
    total += config.incomeBaseRate * mult * (happiness / 100) * hours;
  });
  return Math.floor(total);
}
export function adoptCost(config, speciesKey, birdCount) {
  return (config.adoptCosts[speciesKey] ?? 20) + 10 * birdCount;
}
export function upgradeCost(config, upgradesBought) {
  return Math.round(config.upgradeBaseCost * Math.pow(1.6, upgradesBought));
}
export function formatDuration(ms) {
  if (ms <= 0) return "ready";
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
export function makeBird({ speciesKey, colorKey, stage, now, growAt, hatchAt }) {
  return {
    id: uid(),
    name: null,
    speciesKey,
    colorKey,
    gender: Math.random() < 0.5 ? "m" : "f",
    stage,
    bornAt: now,
    hatchAt: hatchAt ?? null,
    growAt: growAt ?? null,
    lastFedAt: now,
    lastCleanedAt: now,
    breedingUntil: null,
  };
}
export function defaultBirds() {
  const now = Date.now();
  const b = makeBird({ speciesKey: "rock", colorKey: "slate", stage: "adult", now });
  b.name = "Pebble";
  return [b];
}

/* --------------------------- achievements --------------------------- */

// Bloom Breaker score tiers — a skilled player can unlock these repeatedly-
// escalating rewards purely by getting better at the game, no luck involved.
export const BLOOMBREAKER_TIERS = [
  { key: "bloombreaker_t1", threshold: 15, reward: 10, name: "First Petals", description: "Score 15+ in Bloom Breaker" },
  { key: "bloombreaker_t2", threshold: 40, reward: 18, name: "Getting the Hang of It", description: "Score 40+ in Bloom Breaker" },
  { key: "bloombreaker_t3", threshold: 80, reward: 28, name: "Bloom Chainer", description: "Score 80+ in Bloom Breaker" },
  { key: "bloombreaker_t4", threshold: 140, reward: 40, name: "Petal Pusher", description: "Score 140+ in Bloom Breaker" },
  { key: "bloombreaker_t5", threshold: 220, reward: 55, name: "Cluster Cracker", description: "Score 220+ in Bloom Breaker" },
  { key: "bloombreaker_t6", threshold: 320, reward: 75, name: "Garden Sweeper", description: "Score 320+ in Bloom Breaker" },
  { key: "bloombreaker_t7", threshold: 450, reward: 100, name: "Bloom Tactician", description: "Score 450+ in Bloom Breaker" },
  { key: "bloombreaker_t8", threshold: 600, reward: 135, name: "Master Matcher", description: "Score 600+ in Bloom Breaker" },
  { key: "bloombreaker_t9", threshold: 800, reward: 180, name: "Bloom Breaker Elite", description: "Score 800+ in Bloom Breaker" },
  { key: "bloombreaker_t10", threshold: 1000, reward: 250, name: "Full Bloom Legend", description: "Score 1000+ in Bloom Breaker" },
];

export const ACHIEVEMENT_REWARDS = Object.fromEntries(BLOOMBREAKER_TIERS.map((t) => [t.key, t.reward]));

// Mirrors the `achievements` table seeded in supabase/schema.sql.
// Used client-side to decide which keys the player currently qualifies for.
export function computeUnlockedKeys(save) {
  const keys = [];
  const birds = save.birds || [];
  const decorations = save.decorations || [];
  const flags = save.flags || {};

  if (birds.length >= 1) keys.push("first_bird");
  if (birds.length >= 5) keys.push("five_birds");
  if (birds.length >= 10) keys.push("ten_birds");
  if (birds.some((b) => b.colorKey === "iridescent")) keys.push("rare_bird");
  if ((save.streak || 0) >= 7) keys.push("streak_7");
  if ((save.streak || 0) >= 30) keys.push("streak_30");
  if ((save.seeds || 0) >= 500) keys.push("rich_500");
  if ((save.upgradesBought || 0) >= 5) keys.push("upgrade_master");
  if (flags.bred) keys.push("first_breed");
  if (flags.breakerWon) keys.push("breaker_win");
  if (flags.matchWon) keys.push("match_win");
  if (flags.skydashWon) keys.push("skydash_win");
  if (flags.windriderWon) keys.push("windrider_win");
  if (flags.stormchaseWon) keys.push("stormchase_win");
  if (flags.triviaWon) keys.push("trivia_win");
  if (flags.nestcatchWon) keys.push("nestcatch_win");
  if (flags.seasonalAdopted) keys.push("seasonal_bird");

  const bloombreakerBest = flags.bloombreakerBest || 0;
  BLOOMBREAKER_TIERS.forEach((t) => {
    if (bloombreakerBest >= t.threshold) keys.push(t.key);
  });

  const christmasOwned = decorations.filter((k) => k.startsWith("xmas-")).length;
  const halloweenOwned = decorations.filter((k) => k.startsWith("hw-")).length;
  if (christmasOwned >= 3) keys.push("christmas_collector");
  if (halloweenOwned >= 3) keys.push("halloween_collector");
  if (EVERYDAY_DECOR_KEYS.every((k) => decorations.includes(k))) keys.push("all_decor");

  return keys;
}
