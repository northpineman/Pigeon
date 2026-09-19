"use client";
import { WORLD_REGIONS } from "@/lib/world";

const FEATURED = ["whispering-woods", "bramblewick", "frostpeak", "fall-grove", "market", "arcade"];
const ART = {
  "whispering-woods": "/art/scenes/whispering-woods.svg",
  bramblewick: "/art/scenes/bramblewick.svg",
  frostpeak: "/art/scenes/frostpeak.svg",
  "fall-grove": "/art/scenes/fall-grove.svg",
  market: "/art/scenes/market-postcard.svg",
  arcade: "/art/scenes/arcade-postcard.svg",
};

export default function WorldPostcards({ onGoRegion }) {
  const regions = FEATURED.map((key) => WORLD_REGIONS.find((r) => r.key === key)).filter(Boolean);
  return (
    <section className="v38-world-postcards">
      <div className="v38-postcards-head">
        <div><div className="eyebrow">POSTCARDS FROM THE GREAT MEADOW</div><h3>Every road gets its own little piece of art</h3><p>These destinations now have original scenic illustrations instead of icon-only placeholders.</p></div>
        <span>✉ WISH YOU WERE HERE</span>
      </div>
      <div className="v38-postcard-grid">
        {regions.map((region, index) => (
          <button key={region.key} className={`v38-postcard card-${index + 1}`} onClick={() => onGoRegion?.(region)} disabled={region.status === "coming"}>
            <div className="v38-postcard-art"><img src={ART[region.key]} alt="" loading="lazy" decoding="async" /></div>
            <div className="v38-postcard-copy">
              <small>{region.status === "seasonal" ? "SEASONAL DESTINATION" : region.status === "foundation" ? "STORY DISTRICT" : "OPEN DESTINATION"}</small>
              <strong>{region.name}</strong>
              <p>{region.blurb}</p>
              <em>{region.status === "coming" ? "Rumored for later" : "Visit this place →"}</em>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
