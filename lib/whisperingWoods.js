export const WOODS_LOCATIONS = [
  { key: "moonlit-trail", name: "Moonlit Trail", emoji: "🌙", desc: "A silver path that seems to rearrange itself after dusk." },
  { key: "mossy-hollow", name: "Mossy Hollow", emoji: "🍄", desc: "Soft moss, tiny mushrooms, and warm little paw prints." },
  { key: "old-oak", name: "The Old Oak", emoji: "🌳", desc: "A massive tree with a door-sized hollow and no visible door." },
  { key: "faerie-ring", name: "Faerie Ring", emoji: "✨", desc: "A circle of pale mushrooms where the air hums softly." },
  { key: "brookside", name: "Whisperbrook", emoji: "💧", desc: "A clear stream carrying leaves from somewhere far beyond the woods." },
  { key: "forgotten-path", name: "Forgotten Path", emoji: "🗝️", desc: "An overgrown road leading toward a destination that is not on the map." },
];

export const WOODS_DISCOVERIES = [
  { key: "glowcap", location: "mossy-hollow", name: "A Glowcap Mushroom", emoji: "🍄", reward: 18, text: "A tiny mushroom glows beneath the ferns. Your Iggy waits patiently beside it." },
  { key: "silver-leaf", location: "moonlit-trail", name: "Silverleaf", emoji: "🍃", reward: 22, text: "A silver-edged leaf catches moonlight even though the canopy is closed." },
  { key: "oak-pawprint", location: "old-oak", name: "The Ancient Pawprint", emoji: "🐾", reward: 30, text: "A pawprint is pressed into the old oak as if it has been waiting for you." },
  { key: "fairy-bell", location: "faerie-ring", name: "Fairy Bell", emoji: "🔔", reward: 35, text: "A flower rings once when your Iggy steps into the mushroom circle." },
  { key: "brook-stone", location: "brookside", name: "Whisperbrook Stone", emoji: "💎", reward: 28, text: "A smooth blue stone hums faintly in the stream." },
  { key: "lost-key", location: "forgotten-path", name: "The Unmarked Key", emoji: "🗝️", reward: 45, text: "You find a key with no lock—and a crest you've never seen before." },
];

export function defaultWoodsState() {
  return { discoveries: [], journal: [], visits: [], steps: 0, lastExploreAt: null };
}
