// Iggy Meadow v28 — child-friendly guidance and world promise.
// Guidance is intentionally advisory: it never blocks deeper systems for experienced players.
export const MEADOW_PROMISES = [
  { emoji: "🏡", title: "You can always come home", text: "Your Iggies wait for you. Taking a break never makes you a bad Guardian." },
  { emoji: "💗", title: "Mistakes can be fixed", text: "Care is an invitation, not a punishment. Iggies do not disappear because you were away." },
  { emoji: "🌱", title: "Kindness matters", text: "Caring, playing, exploring, and helping friends are how the Meadow grows." },
  { emoji: "✨", title: "Wonder is for everyone", text: "The Meadow stays gentle and family-friendly. Even its spookiest nights are cozy Halloween fun." },
];

export function meadowGuideStep({ pets = [], seeds = 0, pending = 0, questState = {}, config = {} }) {
  if (!pets.length) return { key: "adopt", emoji: "🐕", title: "Meet your first Iggy", text: "Visit Adoption and choose a new friend. There is no wrong choice.", action: "adopt", label: "Visit Adoption" };
  const active = pets.filter((p) => p.stage !== "egg");
  const hungry = active.find((p) => Date.now() - Number(p.lastFedAt || 0) > Number(config.hungerHours || 8) * 60 * 60 * 1000 * 0.55);
  if (hungry && seeds >= Number(config.feedCost || 2)) return { key: "care", emoji: "🥣", title: `${hungry.name || "An Iggy"} would enjoy a snack`, text: "A little care builds your Guardian Bond. Nothing bad happens if you need to do it later.", action: "pet", petId: hungry.id, label: "Go to Iggy" };
  if (pending > 0) return { key: "collect", emoji: "🌾", title: "Seeds are waiting", text: `Your kennel has ${pending} seeds ready to gather.`, action: "collect", label: "Gather Seeds" };
  const completed = questState.completed || [];
  const claimed = questState.claimed || [];
  if (completed.some((key) => !claimed.includes(key))) return { key: "quest", emoji: "⭐", title: "You finished a Meadow task", text: "A reward is waiting on Today's Meadow Board.", action: "home", label: "See My Reward" };
  return { key: "explore", emoji: "🗺️", title: "Ready for a little adventure?", text: "Explore when you feel like it, or simply spend time with your Iggies. The Meadow is never in a hurry.", action: "explore", label: "Explore Meadow" };
}
