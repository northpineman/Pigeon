"use client";
import { PagedGrid } from "./CompactPages";
import { useMemo, useState } from "react";
import { LAUNCH_ART } from "@/lib/launchArt";
import { WORLD_REGIONS } from "@/lib/world";

const fill = { home: "#D9EFDD", forest: "#CFE4C5", medieval: "#E8D6B7", winter: "#DDECF5", fall: "#E6C28D", market: "#F4DCEB", arcade: "#DCE6F9", future: "#E8E3F3" };
const stroke = { home: "#6A9C78", forest: "#62805F", medieval: "#8C6A45", winter: "#7D97AB", fall: "#8A6A3F", market: "#B08398", arcade: "#7D8FB0", future: "#9B91AD" };

const ATLAS = {
  meadow: ["Kennel Gardens", "Meadow House", "Daily Board", "Quiet Pond"],
  "whispering-woods": ["Moonlit Trail", "Mossy Hollow", "The Old Oak", "Faerie Ring", "Whisperbrook", "Forgotten Path"],
  bramblewick: ["Castle", "Village", "Royal Market", "Velvet Paw Inn", "Training Grounds", "Royal Library", "Moonwatch Tower", "Underkeep"],
  frostpeak: ["Crystal Pines", "Snowcap Trail", "Frostbound Village", "Aurora Lookout"],
  "fall-grove": ["Pumpkin Hollow", "Harvest Lane", "Maple Orchard", "Old Mill"],
  market: ["Toy Chest", "Wardrobe Boutique", "General Store", "Rotating Stalls"],
  arcade: ["Game Hall", "Prize Counter", "High Score Board"],
  moonwater: ["Lantern Harbor", "Tide Pools", "Moonlit Pier"],
  sunmeadow: ["Sunpetal Gardens", "Butterfly Meadow", "Flower Market"],
};

export default function WorldMap({ onGoRegion, woodsState, bramblewickState }) {
  const [selected, setSelected] = useState("bramblewick");
  const [view, setView] = useState("map");
  const region = WORLD_REGIONS.find((r) => r.key === selected) || WORLD_REGIONS[0];
  const discovered = useMemo(() => ({
    "whispering-woods": woodsState?.discoveries?.length || 0,
    bramblewick: bramblewickState?.discoveries?.length || 0,
  }), [woodsState, bramblewickState]);
  const select = (key) => { setSelected(key); setView("map"); };
  const statusLabel = region.status === "foundation" ? "Story district" : region.status === "coming" ? "Rumored land" : region.status === "seasonal" ? "Seasonal" : "Open destination";

  return <div className="world-map-shell atlas-world">
    <div className="world-map-titlebar">
      <div><div className="eyebrow">THE MEADOW WORLD · EXPLORER'S ATLAS</div><h2>🗺️ The Great Meadow Map</h2><p>Choose a destination, study its paths, and uncover the places that make the Meadow feel like a world of its own.</p></div>
      <div className="atlas-compass">N<br/><span>✦</span><br/>S</div>
    </div>
    <div className="atlas-tabs"><button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>🗺️ World Map</button><button className={view === "atlas" ? "active" : ""} onClick={() => setView("atlas")}>📖 Atlas</button><button className={view === "routes" ? "active" : ""} onClick={() => setView("routes")}>🧭 Routes</button></div>

    {view === "map" && <>
      <div className="compact-world-destinations">{WORLD_REGIONS.map((r) => <button key={r.key} type="button" className={selected === r.key ? "active" : ""} aria-pressed={selected === r.key} onClick={() => select(r.key)}><img src={r.key === "market" ? LAUNCH_ART.market : r.key === "bramblewick" ? LAUNCH_ART.adoption : LAUNCH_ART.meadow} alt="" loading="lazy" decoding="async" /><span><strong>{r.name}</strong><small>{r.status === "coming" ? "Rumored" : r.status === "seasonal" ? "Seasonal" : "Open destination"}</small></span></button>)}</div>
      <div className={`region-detail region-detail-${region.tone}`}>
        <div className="region-detail-art"><span>{region.emoji}</span><small>{statusLabel}</small></div>
        <div className="region-detail-copy"><div className="eyebrow">DESTINATION DOSSIER</div><h3>{region.name}</h3><p>{region.blurb}</p><div className="region-activities">{region.activities.map((a) => <span key={a}>✦ {a}</span>)}</div></div>
        <div className="region-detail-side"><div className="atlas-mini-stat"><strong>{ATLAS[region.key]?.length || 0}</strong><span>mapped places</span></div>{discovered[region.key] > 0 && <div className="atlas-mini-stat"><strong>{discovered[region.key]}</strong><span>discoveries</span></div>}<button className="btn btn-primary" disabled={region.status === "coming"} onClick={() => onGoRegion?.(region)}>{region.status === "coming" ? "Rumored for later" : "Enter destination →"}</button></div>
      </div>
    </>}

    {view === "atlas" && <div className="atlas-directory"><div className="section-title">The Explorer's Atlas</div><p className="atlas-intro">Every region is a chapter. Places begin as names on a map and become real as their stories are written.</p><PagedGrid className="atlas-region-grid" pageSize={4} label="Records">{WORLD_REGIONS.map(r => <button key={r.key} className={`atlas-region-card ${selected === r.key ? "active" : ""}`} onClick={() => { setSelected(r.key); setView("map"); }}><span className="atlas-region-icon">{r.emoji}</span><div><strong>{r.name}</strong><small>{ATLAS[r.key]?.length || 0} mapped places · {r.status === "coming" ? "Rumored" : "Exploreable"}</small><p>{r.blurb}</p></div><b>→</b></button>)}</PagedGrid></div>}

    {view === "routes" && <div className="atlas-routes"><div className="section-title">Known Routes</div><div className="route-intro">The roads between regions are part of the adventure. Future travel can add random encounters, weather, traveling merchants, and rare roadside discoveries.</div><PagedGrid className="route-list" pageSize={4} label="Records">{[["Meadow Heart","Whispering Woods","🌿","🌲"],["Meadow Heart","Kingdom of Bramblewick","🌿","🏰"],["Whispering Woods","Kingdom of Bramblewick","🌲","🏰"],["Bramblewick","Frostpeak","🏰","❄️"],["Whispering Woods","Moonwater Coast","🌲","🌙"],["Meadow Heart","Sunpetal Fields","🌿","🌼"]].map(([a,b,ai,bi],i)=><div className="route-card" key={i}><span>{ai}</span><div><strong>{a} <i>↝</i> {b}</strong><small>{i < 3 ? "Known trail · safe passage" : "Unmapped beyond the visible road"}</small></div><span>{bi}</span></div>)}</PagedGrid></div>}
  </div>;
}
