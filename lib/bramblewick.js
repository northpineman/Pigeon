export const BRAMBLEWICK_NPCS = [
  { key: "sir-biscuit", name: "Sir Biscuit", role: "Royal Kennel Guardian", emoji: "🛡️", greeting: "Halt—then come closer! I can tell a true Meadow guardian by the way their Iggy looks at them." },
  { key: "lady-rosie", name: "Lady Rosie", role: "Keeper of the Royal Market", emoji: "🌹", greeting: "Welcome, traveler. The market changes with the seasons, but a good ribbon never goes out of fashion." },
  { key: "archivist-moon", name: "Archivist Moon", role: "Keeper of Lost Records", emoji: "📚", greeting: "Three doors beneath the castle have no keys in the royal archive. I suspect the keys were never meant to be metal." },
  { key: "captain-clover", name: "Captain Clover", role: "Master of the Training Grounds", emoji: "⚔️", greeting: "A kingdom needs brave hearts. Bring your Iggy to the grounds and let's see what they're made of." },
  { key: "mistress-thistle", name: "Mistress Thistle", role: "Royal Herbalist", emoji: "🌿", greeting: "Every old kingdom has plants with stories. Some stories are best discovered after sunset." },
];

export const BRAMBLEWICK_ITEMS = [
  { key: "royal-ribbon", name: "Bramblewick Royal Ribbon", emoji: "🎀", cost: 80, rarity: "rare", description: "A velvet ribbon bearing the old Meadow Crown." },
  { key: "knight-plush", name: "Tiny Knight Plush", emoji: "🧸", cost: 45, rarity: "uncommon", toyKey: "knight-plush", description: "A brave little companion for an Iggy who dreams of quests." },
  { key: "rose-charm", name: "Thorn Gate Charm", emoji: "🌹", cost: 120, rarity: "rare", description: "A warm rose-shaped charm said to respond to old family lines." },
  { key: "moon-quill", name: "Moonwatch Quill", emoji: "🪶", cost: 150, rarity: "rare", description: "Its ink appears silver under moonlight." },
  { key: "clover-medal", name: "Clover Knight Medal", emoji: "🏅", cost: 190, rarity: "epic", description: "A training-ground medal awarded to determined adventurers." },
  { key: "thorn-seed", name: "Ancient Thorn Seed", emoji: "🌱", cost: 110, rarity: "rare", description: "A dormant seed from the oldest rose garden." },
];

export const BRAMBLEWICK_QUESTS = [
  { key: "royal-introduction", name: "A Proper Introduction", text: "Speak with Sir Biscuit at the castle gates.", reward: 35, unlock: "village", favor: 1 },
  { key: "market-favor", name: "A Favor for the Market", text: "Visit Lady Rosie and learn what the kingdom is missing.", reward: 50, unlock: "library", favor: 1 },
  { key: "lost-records", name: "The Missing Journal", text: "Ask Archivist Moon about the vanished Moonwatch journal.", reward: 75, unlock: "tower", favor: 2 },
  { key: "thorn-gate", name: "The Thorn Gate", text: "Carry a Bramblewick family clue into the old rose gate.", reward: 100, unlock: "dungeon", favor: 2 },
  { key: "knight-trial", name: "The Knight's Trial", text: "Visit Captain Clover and complete a training-ground challenge.", reward: 125, unlock: "grounds", favor: 2 },
  { key: "herbalist-secret", name: "A Garden After Dark", text: "Find Mistress Thistle and uncover what grows beneath the castle walls.", reward: 160, unlock: "garden", favor: 3 },
];

export const BRAMBLEWICK_ENCOUNTERS = [
  { key: "lantern-fox", place: "village", title: "The Lantern Fox", text: "A tiny fox-shaped lantern flickers beside an empty cottage. Your Iggy notices a hidden key beneath it.", reward: 22, discovery: "lantern-fox" },
  { key: "rose-whisper", place: "castle", title: "The Whispering Rose", text: "One rose on the castle wall opens when your Iggy approaches. Something is written inside its petals.", reward: 28, discovery: "whispering-rose" },
  { key: "moonstone", place: "tower", title: "A Moonstone Falls", text: "A pale stone slips from the observatory's old mechanism and lands at your feet.", reward: 45, discovery: "moonstone" },
  { key: "training-ribbon", place: "grounds", title: "The Wind-Worn Ribbon", text: "A faded tournament ribbon catches on the practice fence. The crest matches an old family record.", reward: 34, discovery: "training-ribbon" },
  { key: "garden-spark", place: "garden", title: "The Midnight Sprout", text: "A silver-green sprout appears only for a moment beneath the castle ivy.", reward: 50, discovery: "midnight-sprout" },
  { key: "underkeep-door", place: "dungeon", title: "The Door Without a Keyhole", text: "Deep below the castle you find a door with no lock—only a paw-shaped impression.", reward: 65, discovery: "paw-door" },
];

export function defaultBramblewickState() {
  return { completed: [], claimed: [], discoveries: [], inventory: [], npcTalked: [], reputation: 0, encounters: [], journal: [], lastAdventureAt: null };
}
