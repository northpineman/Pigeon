// ============================================================
// THEME CONFIG — the one file to touch for a visual refresh.
//
// To reskin the site for a season or event, duplicate an entry in
// THEMES below (or add a new one) and point ACTIVE_THEME at its key.
// Nothing else in the app needs to change: the hero banner, its
// floating motifs, and the accent color all read from here.
//
// Later this can be wired to a date range or to the admin panel so
// it switches automatically — for now, flip ACTIVE_THEME by hand.
// ============================================================

export const ACTIVE_THEME = "default";

export const THEMES = {
  default: {
    name: "Everyday Dovecote",
    // Soft pastel wash behind the hero banner
    heroGradient: ["#F5D9EA", "#E3E3F7", "#DCEFE4"],
    // Small floating decorations drifting across the hero band.
    // Swap these for seasonal icons (snowflakes, leaves, hearts, etc.)
    motifs: ["🪶", "☁️", "🌿", "✨", "🪶"],
    accent: "#E8B563",
  },
  spring: {
    name: "Spring Bloom",
    heroGradient: ["#F7E6F2", "#E6F4E0", "#FDF3D6"],
    motifs: ["🌸", "🌷", "🐣", "🌿", "🦋"],
    accent: "#F2A6C2",
  },
  autumn: {
    name: "Harvest Roost",
    heroGradient: ["#F6E3D2", "#F2D6C9", "#E8C9A8"],
    motifs: ["🍂", "🍁", "🌰", "🪶", "🎃"],
    accent: "#D98E5A",
  },
  winter: {
    name: "Frosted Loft",
    heroGradient: ["#E3ECF7", "#F0F0FA", "#DCEFE4"],
    motifs: ["❄️", "🕊️", "✨", "🪶", "⛄"],
    accent: "#8FB6D9",
  },
};

export const theme = THEMES[ACTIVE_THEME] || THEMES.default;
