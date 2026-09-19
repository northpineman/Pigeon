// Iggy Meadow v27 — persistent guardian bond progression.
// Stored directly on each pet so old saves remain compatible and new saves need no schema change.
export const BOND_LEVELS = [
  { level: 1, name: "New Friend", minXp: 0, emoji: "🐾" },
  { level: 2, name: "Meadow Pal", minXp: 20, emoji: "🌿" },
  { level: 3, name: "Trusted Companion", minXp: 55, emoji: "💗" },
  { level: 4, name: "Heartbound", minXp: 110, emoji: "✨" },
  { level: 5, name: "Kindred Spirit", minXp: 190, emoji: "🌙" },
  { level: 6, name: "Meadow Legend", minXp: 300, emoji: "👑" },
];

export function bondXp(pet) { return Math.max(0, Number(pet?.bondXp || 0)); }
export function bondLevel(pet) {
  const xp = bondXp(pet);
  return [...BOND_LEVELS].reverse().find((entry) => xp >= entry.minXp) || BOND_LEVELS[0];
}
export function nextBondLevel(pet) {
  const current = bondLevel(pet);
  return BOND_LEVELS.find((entry) => entry.level === current.level + 1) || null;
}
export function bondProgress(pet) {
  const xp = bondXp(pet);
  const current = bondLevel(pet);
  const next = nextBondLevel(pet);
  if (!next) return { percent: 100, current, next: null, xp, remaining: 0 };
  const span = Math.max(1, next.minXp - current.minXp);
  return { percent: Math.max(0, Math.min(100, ((xp - current.minXp) / span) * 100)), current, next, xp, remaining: Math.max(0, next.minXp - xp) };
}
export function addBondExperience(pet, amount, reason = "Spent time together") {
  const before = bondLevel(pet);
  const nextPet = { ...pet, bondXp: bondXp(pet) + Math.max(0, Number(amount || 0)), lastBondAt: Date.now() };
  const after = bondLevel(nextPet);
  const journal = Array.isArray(pet?.journal) ? pet.journal : [];
  if (after.level > before.level) {
    nextPet.journal = [...journal, {
      id: `bond-${pet?.id || "iggy"}-${Date.now()}`,
      kind: "bond",
      title: `${after.emoji} Bond reached: ${after.name}`,
      text: `${reason}. Your friendship grew to bond level ${after.level}.`,
      at: Date.now(),
    }].slice(-30);
  }
  return nextPet;
}
