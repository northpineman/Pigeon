import { WORLD_REGIONS } from "./world";
import { WOODS_DISCOVERIES } from "./whisperingWoods";
import { BRAMBLEWICK_ENCOUNTERS } from "./bramblewick";
import { TOYS } from "./toys";
import { GENETIC_TRAITS } from "./genetics";
import { EYE_COLORS, EYE_STYLES } from "./appearance";
import { OUTFITS } from "./looks";

export const COMPENDIUM_SECTIONS = [
  ["iggies", "Iggies"],
  ["world", "World"],
  ["genetics", "Genetics"],
  ["wardrobe", "Wardrobe"],
  ["toys", "Toys"],
  ["appearance", "Appearance"],
  ["achievements", "Achievements"],
];

export function uniqueDiscoveryKeys(woodsState = {}, bramblewickState = {}) {
  return new Set([
    ...(woodsState.discoveries || []),
    ...(bramblewickState.discoveries || []),
  ]);
}

export function getCompendiumStats({ pets = [], flags = {}, woodsState = {}, bramblewickState = {}, unlockedKeys = [], achievementCatalog = [] }) {
  const discoveryKeys = uniqueDiscoveryKeys(woodsState, bramblewickState);
  const discoveredTraits = new Set(pets.flatMap((p) => p?.genetics?.traits || []));
  const ownedOutfits = new Set(flags.wardrobeInventory || []);
  const ownedAppearance = new Set(flags.appearanceInventory || []);
  const ownedToys = new Set(Object.entries(flags.toyInventory || {}).filter(([, n]) => Number(n) > 0).map(([k]) => k));
  const mappableRegions = WORLD_REGIONS.filter((r) => r.status !== "coming");
  const worldTotal = mappableRegions.length + WOODS_DISCOVERIES.length + BRAMBLEWICK_ENCOUNTERS.length;
  const validDiscoveryKeys = new Set([
    ...WOODS_DISCOVERIES.map((d) => d.key || d.discovery),
    ...BRAMBLEWICK_ENCOUNTERS.map((d) => d.key || d.discovery),
  ]);
  const worldFound = mappableRegions.length + [...discoveryKeys].filter((key) => validDiscoveryKeys.has(key)).length;
  const geneticsTotal = GENETIC_TRAITS.length;
  const geneticsFound = GENETIC_TRAITS.filter((t) => discoveredTraits.has(t.key)).length;
  const wardrobeTotal = Object.keys(OUTFITS).filter((k) => k !== "none").length;
  const wardrobeFound = [...ownedOutfits].filter((k) => k !== "none" && OUTFITS[k]).length;
  const toysTotal = TOYS.length;
  const toysFound = TOYS.filter((t) => ownedToys.has(t.key)).length;
  const appearanceTotal = EYE_COLORS.length + EYE_STYLES.length;
  const appearanceFound = [...ownedAppearance].filter((k) => k.startsWith("eye-color:") || k.startsWith("eye-style:")).length;
  return {
    iggies: { found: pets.length, total: Math.max(pets.length, 1), label: "Iggies" },
    world: { found: worldFound, total: worldTotal, label: "World" },
    genetics: { found: geneticsFound, total: geneticsTotal, label: "Genetic traits" },
    wardrobe: { found: wardrobeFound, total: wardrobeTotal, label: "Outfits" },
    toys: { found: toysFound, total: toysTotal, label: "Toys" },
    appearance: { found: appearanceFound, total: appearanceTotal, label: "Appearance" },
    achievements: { found: unlockedKeys.length, total: achievementCatalog.length, label: "Achievements" },
  };
}
