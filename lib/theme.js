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
    name: "Everyday Meadow",
    sky: ["#E9D9F2", "#F3DCE8", "#FBEBD6"],
    hills: "#CDE3D0",
    accent: "#D9A441",
    motifs: ["🌊", "☁️", "🌿", "✨", "🐾"],
  },
  spring: {
    name: "Spring Bloom",
    sky: ["#F7E6F2", "#E6F4E0", "#FDF3D6"],
    hills: "#D7EAC8",
    accent: "#E37FA0",
    motifs: ["🌸", "🌷", "🐣", "🌿", "🦋"],
  },
  autumn: {
    name: "Harvest Meadow",
    sky: ["#F3D9C2", "#EFC9B0", "#E3B98F"],
    hills: "#C9A46A",
    accent: "#B96A34",
    motifs: ["🍂", "🍁", "🌰", "🐾", "🎃"],
  },
  winter: {
    name: "Frosted Meadow",
    sky: ["#DCE6F5", "#EAEAF5", "#DDEDE6"],
    hills: "#E6EEF2",
    accent: "#6E93BE",
    motifs: ["❄️", "🐾", "✨", "🌊", "⛄"],
  },
};

export const theme = THEMES[ACTIVE_THEME] || THEMES.default;
