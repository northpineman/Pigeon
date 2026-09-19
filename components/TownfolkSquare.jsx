"use client";
import NpcPortrait from "./NpcPortrait";

const TOWNFOLK = [
  { key: "adopt", name: "Miss Marigold", role: "Adoption House Keeper", speciesKey: "king", colorKey: "tan", quote: "There is no hurry. The right little face usually feels familiar before you know why.", badge: "🐾" },
  { key: "wardrobe", name: "Velvet", role: "Ribbon Boutique Stylist", speciesKey: "ringneck", colorKey: "white", quote: "A good outfit should still look like the Iggy wearing it. Come see what suits them.", badge: "🎀" },
  { key: "games", name: "Captain Button", role: "Arcade Lane Host", speciesKey: "diamond", colorKey: "candycorn", quote: "No pressure, no perfect scores—just games, seeds, and another try whenever you want one.", badge: "🎮" },
  { key: "collection", name: "Archivist Moon", role: "Keeper of Meadow Records", speciesKey: "ringneck", colorKey: "raven", quote: "Every discovery becomes a page. One day your archive will read like a history of the whole Meadow.", badge: "📚" },
];

export default function TownfolkSquare({ onGo }) {
  return (
    <section className="v37-townfolk">
      <div className="v37-townfolk-head">
        <div><div className="eyebrow">MEET THE TOWNFOLK</div><h3>Familiar faces make the Meadow feel alive</h3><p>These residents are your signposts, shopkeepers, storytellers, and friendly guides around town.</p></div>
        <span className="v37-townfolk-postmark">MEADOW MAIL · LOCAL FACES</span>
      </div>
      <div className="v37-townfolk-grid">
        {TOWNFOLK.map((npc, index) => (
          <button key={npc.name} className={`v37-npc-card npc-${index + 1}`} onClick={() => onGo?.(npc.key)}>
            <span className="v37-npc-badge">{npc.badge}</span>
            <span className="v37-npc-portrait"><NpcPortrait name={npc.name} size={116} /></span>
            <span className="v37-npc-copy"><small>{npc.role}</small><strong>{npc.name}</strong><q>{npc.quote}</q><em>Visit →</em></span>
          </button>
        ))}
      </div>
    </section>
  );
}
