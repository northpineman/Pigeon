"use client";

import { LAUNCH_ART } from "@/lib/launchArt";

const COPY = {
  kennel: { eyebrow: "WILLOW KENNELS", title: "A little home for every Iggy", text: "Sun-warmed beds, ribbon hooks, garden windows, and familiar paws waiting just beyond the gate.", badge: "Your companions", art: LAUNCH_ART.kennel, pos: "center 44%" },
  nests: { eyebrow: "MEADOW ADOPTION HOUSE", title: "New stories begin here", text: "Meet a new Italian Greyhound or grow a family line with traits, memories, and history all their own.", badge: "Adoption & lineage", art: LAUNCH_ART.adoption, pos: "center 48%" },
  explore: { eyebrow: "THE WANDERING PATH", title: "Adventure beyond the garden gate", text: "Choose an explorer and follow the trail through tall grass, old pawprints, curious encounters, and gentle surprises.", badge: "Trail adventure", art: LAUNCH_ART.meadow, pos: "center 64%" },
  games: { eyebrow: "ARCADE LANE", title: "The Lantern Game Hall", text: "A cheerful corner of the Meadow filled with little challenges, high scores, seed prizes, and rainy-day fun.", badge: "Eight meadow games", art: LAUNCH_ART.market, pos: "center 45%" },
  shop: { eyebrow: "MARKET LANE", title: "A row of tiny shops and treasures", text: "Browse outfits, toys, decorations, training supplies, and seasonal keepsakes for your Iggies and kennel.", badge: "Boutiques & stalls", art: LAUNCH_ART.market, pos: "center 48%" },
  collection: { eyebrow: "THE MEADOW ARCHIVE", title: "Every discovery has a page", text: "Keep a record of your Iggies, traits, wardrobe finds, world discoveries, toys, and hard-earned milestones.", badge: "Your living collection", art: LAUNCH_ART.collection, pos: "center 45%" },
  events: { eyebrow: "THE GREAT MEADOW", title: "A world beyond the plaza", text: "Maps, kingdoms, woods, seasons, and little mysteries wait along the paths outside town.", badge: "World & seasons", art: LAUNCH_ART.meadow, pos: "center 63%" },
};

export default function StorybookBanner({ type = "kennel" }) {
  const copy = COPY[type] || COPY.kennel;
  return (
    <section className={`storybook-banner storybook-banner-${type} storybook-banner-v94`}>
      <img className="storybook-banner-photo" src={copy.art} alt="" aria-hidden="true" style={{ objectPosition: copy.pos }} />
      <div className="storybook-banner-vignette" aria-hidden="true" />
      <div className="storybook-banner-ornament" aria-hidden="true"><span>❀</span><i>🐾</i><span>❀</span></div>
      <div className="storybook-banner-copy">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
        <span className="storybook-banner-badge">✦ {copy.badge}</span>
      </div>
    </section>
  );
}
