// Iggy Meadow world map: additive destination catalog.
export const WORLD_REGIONS = [
  { key: "meadow", name: "Meadow Heart", emoji: "🌿", x: 400, y: 320, tone: "home", status: "open", blurb: "Your home meadow, the kennel, gardens, and the quiet paths where everyday Iggy life begins.", activities: ["Care for your Iggies", "Check daily quests", "Visit the Kennel"] },
  { key: "whispering-woods", name: "Whispering Woods", emoji: "🌲", x: 275, y: 135, tone: "forest", status: "open", blurb: "An old woodland full of hidden paths, curious creatures, and things that only appear when you wander.", activities: ["Explore", "Find woodland items", "Meet forest NPCs"] },
  { key: "bramblewick", name: "Kingdom of Bramblewick", emoji: "🏰", x: 400, y: 120, tone: "medieval", status: "foundation", blurb: "A storybook kingdom of stone towers, market stalls, knightly Iggies, and old quests waiting to be written.", activities: ["Visit the castle", "Browse the village market", "Take knightly quests"] },
  { key: "frostpeak", name: "Frostpeak", emoji: "❄️", x: 650, y: 125, tone: "winter", status: "seasonal", blurb: "Snowy trails and crystal pines. Frostpeak becomes especially lively during winter celebrations.", activities: ["Winter shop", "Snowy exploration", "Seasonal discoveries"] },
  { key: "fall-grove", name: "Fall Grove", emoji: "🍂", x: 150, y: 125, tone: "fall", status: "seasonal", blurb: "A warm autumn grove filled with harvest decorations, pumpkin toys, and mysterious October nights.", activities: ["Harvest Wheel", "Halloween shop", "Autumn discoveries"] },
  { key: "market", name: "Meadow Market", emoji: "🛍️", x: 650, y: 365, tone: "market", status: "open", blurb: "The growing marketplace for toys, supplies, wardrobe treasures, and future specialty shops.", activities: ["Buy toys", "Browse wardrobe", "Find rotating stock"] },
  { key: "arcade", name: "Arcade Lane", emoji: "🎮", x: 150, y: 365, tone: "arcade", status: "open", blurb: "A cheerful little game district where skill, luck, and high scores earn seeds and bragging rights.", activities: ["Play games", "Earn seeds", "Chase achievements"] },
  { key: "moonwater", name: "Moonwater Coast", emoji: "🌙", x: 760, y: 275, tone: "future", status: "coming", blurb: "A future seaside region of tide pools, lantern boats, and nocturnal discoveries.", activities: ["Explore tide pools", "Collect shells", "Night events"] },
  { key: "sunmeadow", name: "Sunpetal Fields", emoji: "🌼", x: 85, y: 255, tone: "future", status: "coming", blurb: "A bright flower country planned for gardening, gathering, and springtime activities.", activities: ["Grow flowers", "Gather ingredients", "Seasonal festivals"] },
];

export function getWorldRegion(key) {
  return WORLD_REGIONS.find((r) => r.key === key) || WORLD_REGIONS[0];
}
