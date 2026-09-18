"use client";
import { LAUNCH_ART } from "@/lib/launchArt";
import PetArt from "./PetArt";
import { normalizeAppearance } from "@/lib/appearance";

const portalTiles = [
  ["kennel", "🏡", "My Iggies", "Visit your companions", LAUNCH_ART.kennel],
  ["adopt", "🐕", "Adoption", "Meet a new Iggy", LAUNCH_ART.adoption],
  ["explore", "🗺️", "Explore", "Follow a winding trail", LAUNCH_ART.meadow],
  ["games", "🎮", "Arcade Lane", "Play for seeds", LAUNCH_ART.market],
  ["shop", "🛍️", "Market Lane", "Browse tiny shops", LAUNCH_ART.market],
  ["closet", "🎀", "Wardrobe", "Dress your Iggies", LAUNCH_ART.wardrobe],
  ["collection", "📚", "Compendium", "Fill your archive", LAUNCH_ART.collection],
  ["events", "✨", "World Map", "See what is happening", LAUNCH_ART.meadow],
];

export default function PortalDashboard({ pets = [], seeds = 0, streak = 0, questsReady = 0, news = [], onGo }) {
  const featured = pets.find((p) => p.stage !== "egg") || pets[0];
  return (
    <section className="v38-portal-dashboard" aria-label="Meadow portal">
      <aside className="v38-portal-sidebar">
        <div className="v38-portal-box v38-player-card">
          <div className="v38-box-ribbon">MY MEADOW CARD</div>
          <div className="v38-player-portrait">
            {featured ? <PetArt speciesKey={featured.speciesKey} colorKey={featured.colorKey} stage={featured.stage} outfitKey={featured.outfitKey || null} appearance={normalizeAppearance(featured)} size={134} /> : <span>🐕</span>}
          </div>
          <strong>{featured?.name || "Future best friend"}</strong>
          <small>{pets.length} / 14 Iggies live here</small>
          <div className="v38-wallet"><span>🌾 {seeds}</span><span>🔥 {streak}</span></div>
          <button onClick={() => onGo("kennel")}>Visit my kennel</button>
        </div>
        <div className="v38-portal-box v38-quick-box">
          <div className="v38-box-ribbon">QUICK PLACES</div>
          <button onClick={() => onGo("adopt")}>🐾 Adoption House</button>
          <button onClick={() => onGo("shop")}>🎁 Meadow Market</button>
          <button onClick={() => onGo("games")}>⭐ Game Hall</button>
          <button onClick={() => onGo("collection")}>📖 Archive</button>
        </div>
      </aside>

      <div className="v38-portal-center">
        <div className="v38-marquee"><span>✦</span><b>Welcome to the Meadow Portal!</b><em>Every picture is a doorway now.</em><span>✦</span></div>
        <div className="v38-portal-tile-grid">
          {portalTiles.map(([key, icon, name, blurb, art]) => (
            <button key={key} className="v38-portal-tile" onClick={() => onGo(key)}>
              <img src={art} alt="" loading="lazy" decoding="async" />
              <span className="v38-portal-tile-copy"><b>{icon}</b><strong>{name}</strong><small>{blurb}</small><i>GO →</i></span>
            </button>
          ))}
        </div>
        <div className="v38-feature-strip">
          <div><span>🌤️</span><small>TODAY IN THE MEADOW</small><strong>{questsReady ? `${questsReady} reward${questsReady === 1 ? "" : "s"} ready` : "A fresh little journey is waiting"}</strong></div>
          <div><span>🎃</span><small>SEASONAL CORNER</small><strong>Cozy events, costumes & keepsakes</strong></div>
          <div><span>🔮</span><small>MEADOW MYSTERY</small><strong>Some paths still aren't on the map</strong></div>
        </div>
      </div>

      <aside className="v38-portal-sidebar">
        <div className="v38-portal-box v38-news-box">
          <div className="v38-box-ribbon">MEADOW NEWS</div>
          {(news || []).slice(0, 4).map((n, i) => <div className="v38-news" key={`${n.title}-${i}`}><span>{n.icon || "✦"}</span><div><strong>{n.title}</strong><small>{n.text}</small></div></div>)}
        </div>
        <div className="v38-portal-box v38-postcard-box">
          <div className="v38-box-ribbon">WISH YOU WERE HERE</div>
          <img src={LAUNCH_ART.meadow} alt="The Great Meadow postcard" loading="lazy" decoding="async" />
          <p>Every road out of Meadow Plaza leads to another little story.</p>
          <button onClick={() => onGo("events")}>Open world map</button>
        </div>
      </aside>
    </section>
  );
}
