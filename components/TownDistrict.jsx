"use client";
import PetArt from "./PetArt";

const LANDMARKS = [
  { key: "kennel", icon: "🏡", label: "Willow Kennels", sub: "Your Iggies live here", art: "/art/buildings/willow-kennels.svg", className: "v38-landmark-kennel" },
  { key: "adopt", icon: "🐾", label: "Adoption House", sub: "Meet a new companion", art: "/art/buildings/adoption-house.svg", className: "v38-landmark-adopt" },
  { key: "shop", icon: "🎀", label: "Market Lane", sub: "Shops, toys & wardrobe", art: "/art/buildings/market-lane.svg", className: "v38-landmark-market" },
  { key: "games", icon: "🎮", label: "Arcade Lane", sub: "Play for seeds", art: "/art/buildings/arcade-lane.svg", className: "v38-landmark-games" },
  { key: "collection", icon: "📚", label: "Meadow Archive", sub: "Your discoveries", art: "/art/buildings/meadow-archive.svg", className: "v38-landmark-archive" },
  { key: "events", icon: "🗺️", label: "Garden Gate", sub: "Roads beyond town", art: "/art/buildings/garden-gate.svg", className: "v38-landmark-gate" },
];

export default function TownDistrict({ onGo }) {
  return (
    <section className="v38-town" aria-label="Illustrated Meadow Town center">
      <div className="v38-town-head">
        <div>
          <div className="eyebrow">MEADOW TOWN CENTER</div>
          <h3>A tiny town packed with places to wander</h3>
          <p>Every landmark has its own illustrated façade now. Pick a doorway and step into another corner of Iggy Meadow.</p>
        </div>
        <div className="v38-town-seal"><span>🐾</span><strong>IGGY MEADOW</strong><small>TOWN MAP</small></div>
      </div>

      <div className="v38-town-map">
        <div className="v38-town-sky" />
        <div className="v38-town-hill hill-back" />
        <div className="v38-town-hill hill-front" />
        <div className="v38-town-path path-one" />
        <div className="v38-town-path path-two" />
        <div className="v38-fountain" aria-hidden="true"><span>✦</span><i/><b/></div>

        <div className="v38-town-resident resident-a"><PetArt speciesKey="king" colorKey="tan" stage="adult" size={86} /><span>Miss Marigold</span></div>
        <div className="v38-town-resident resident-b"><PetArt speciesKey="rock" colorKey="slate" stage="adult" size={78} /><span>Rowan</span></div>

        {LANDMARKS.map((spot) => (
          <button key={spot.key} type="button" className={`v38-landmark ${spot.className}`} onClick={() => onGo?.(spot.key)}>
            <img src={spot.art} alt="" loading="lazy" decoding="async" />
            <span className="v38-landmark-copy">
              <b>{spot.icon}</b>
              <strong>{spot.label}</strong>
              <small>{spot.sub}</small>
              <em>ENTER →</em>
            </span>
          </button>
        ))}

        <div className="v38-town-flower f1">✿</div><div className="v38-town-flower f2">❀</div><div className="v38-town-flower f3">✿</div><div className="v38-town-flower f4">❀</div>
        <div className="v38-town-lantern l1">✦</div><div className="v38-town-lantern l2">✦</div>
      </div>

      <div className="v38-town-footer">
        <span>🌼 Meadow Plaza is always open</span><span>🎀 Shop windows change with the seasons</span><span>🗺️ The Garden Gate leads beyond town</span>
      </div>
    </section>
  );
}
