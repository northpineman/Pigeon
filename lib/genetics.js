// Iggy Meadow genetics + lineage helpers.
// Additive only: legacy Iggies without genetics still render and can breed.

export const GENETIC_TRAITS = [
  { key: "silky", name: "Silky Coat", emoji: "✨", rarity: "uncommon" },
  { key: "longtail", name: "Featherlight Tail", emoji: "🌿", rarity: "uncommon" },
  { key: "starlit", name: "Starlit Flecks", emoji: "🌟", rarity: "rare" },
  { key: "moonmark", name: "Moon Mark", emoji: "🌙", rarity: "rare" },
  { key: "meadowkiss", name: "Meadow Kiss", emoji: "🌸", rarity: "special" },
];

const TRAIT_WEIGHTS = { silky: 0.22, longtail: 0.18, starlit: 0.08, moonmark: 0.05, meadowkiss: 0.025 };

export function normalizeGenetics(pet) {
  const g = pet?.genetics && typeof pet.genetics === "object" ? pet.genetics : {};
  return {
    generation: Number.isFinite(g.generation) ? g.generation : 0,
    traits: Array.isArray(g.traits) ? [...new Set(g.traits)] : [],
    mutation: g.mutation || null,
  };
}

export function createGenetics({ parentA, parentB, speciesKey, colorKey }) {
  const a = normalizeGenetics(parentA);
  const b = normalizeGenetics(parentB);
  const inherited = [...a.traits, ...b.traits];
  const unique = [...new Set(inherited)].filter(Boolean);
  const traits = unique.filter((trait) => {
    const fromBoth = a.traits.includes(trait) && b.traits.includes(trait);
    return fromBoth ? Math.random() < 0.72 : Math.random() < 0.34;
  });

  let mutation = null;
  const mutationRoll = Math.random();
  if (mutationRoll < 0.035) mutation = "meadowkiss";
  else if (mutationRoll < 0.075) mutation = "moonmark";
  else if (mutationRoll < 0.13) mutation = "starlit";
  if (mutation && !traits.includes(mutation)) traits.push(mutation);

  // A small independent trait chance gives adoption/breeding lines room to diversify.
  Object.entries(TRAIT_WEIGHTS).forEach(([trait, weight]) => {
    if (!traits.includes(trait) && Math.random() < weight * 0.12) traits.push(trait);
  });

  return {
    generation: Math.max(a.generation, b.generation) + 1,
    traits,
    mutation,
    speciesKey,
    colorKey,
  };
}

export function geneticRarity(pet) {
  const traits = normalizeGenetics(pet).traits;
  if (traits.includes("meadowkiss")) return "special";
  if (traits.includes("moonmark") || traits.includes("starlit")) return "rare";
  if (traits.length >= 2) return "uncommon";
  return "common";
}

export function traitLabel(key) {
  return GENETIC_TRAITS.find((t) => t.key === key)?.name || key;
}

export function traitEmoji(key) {
  return GENETIC_TRAITS.find((t) => t.key === key)?.emoji || "🧬";
}

export function parentIds(pet) {
  const g = pet?.lineage || {};
  return [g.motherId, g.fatherId].filter(Boolean);
}

export function lineageDepth(pet, pets, seen = new Set()) {
  if (!pet || seen.has(pet.id)) return 0;
  seen.add(pet.id);
  const ids = parentIds(pet);
  if (!ids.length) return 0;
  return 1 + Math.max(...ids.map((id) => lineageDepth(pets.find((p) => p.id === id), pets, seen)));
}
