"use client";
import { PagedGrid, PageTabs } from "./CompactPages";
import { useMemo, useState } from "react";
import PetArt from "./PetArt";
import { WOODS_LOCATIONS, WOODS_DISCOVERIES, defaultWoodsState } from "@/lib/whisperingWoods";

export default function WhisperingWoods({ pets = [], state, onStateChange, onReward, onBack, onNotify }) {
  const safe = { ...defaultWoodsState(), ...(state || {}) };
  const [page, setPage] = useState("paths");
  const [location, setLocation] = useState("moonlit-trail");
  const explorer = pets.find((p) => p.id === safe.explorerId) || pets.find((p) => p.stage !== "egg") || null;
  const [searching, setSearching] = useState(false);
  const current = WOODS_LOCATIONS.find((x) => x.key === location) || WOODS_LOCATIONS[0];
  const discovery = useMemo(() => WOODS_DISCOVERIES.find((d) => d.location === location), [location]);
  const found = discovery && safe.discoveries.includes(discovery.key);
  const foundCount = safe.discoveries.length;

  const explore = () => {
    if (!explorer || searching) return;
    setSearching(true);
    window.setTimeout(() => {
      const already = safe.discoveries.includes(discovery.key);
      const next = { ...safe, explorerId: explorer.id, steps: safe.steps + 1, lastExploreAt: Date.now(), visits: [...new Set([...safe.visits, location])] };
      if (!already) {
        next.discoveries = [...safe.discoveries, discovery.key];
        next.journal = [{ key: `${discovery.key}-${Date.now()}`, title: discovery.name, text: discovery.text, location: current.name, at: Date.now() }, ...safe.journal].slice(0, 40);
        onReward?.(discovery.reward);
        onNotify?.(`${discovery.emoji} ${discovery.name} discovered! +${discovery.reward} seeds`);
      } else {
        onNotify?.(`${explorer.name} explores the ${current.name.toLowerCase()} again. 🌿`);
      }
      onStateChange?.(next);
      setSearching(false);
    }, 650);
  };

  return <section className="woods-page">
    <div className="woods-hero">
      <button className="btn btn-ghost woods-back" onClick={onBack}>← World Map</button>
      <div className="woods-title"><div className="eyebrow">THE ENCHANTED WOODLAND</div><h2>🌲 Whispering Woods</h2><p>Follow old paths, listen for hidden things, and let your Iggy lead you toward discoveries that aren't marked on any ordinary map.</p></div>
      <div className="woods-stats"><span>✨ {foundCount}/{WOODS_DISCOVERIES.length} discoveries</span><span>🐾 {safe.steps} expeditions</span><span>🧭 {safe.visits.length}/{WOODS_LOCATIONS.length} places visited</span></div>
    </div>
    <PageTabs items={[["paths","Forest Paths"],["journal","Woodland Journal"]]} active={page} onChange={setPage} label="Woodland sections" />
    {page === "paths" && <div className="woods-layout">
      <aside className="woods-sidebar">
        <div className="section-title">The Forest Paths</div>
        {WOODS_LOCATIONS.map((l) => <button key={l.key} className={`woods-place ${location === l.key ? "active" : ""}`} onClick={() => setLocation(l.key)}><span>{l.emoji}</span><div><strong>{l.name}</strong><small>{safe.visits.includes(l.key) ? "Visited" : "Unvisited"}</small></div>{WOODS_DISCOVERIES.find((d) => d.location === l.key && safe.discoveries.includes(d.key)) ? <b>✓</b> : <b>›</b>}</button>)}
      </aside>
      <main className="woods-main">
        <div className="woods-scene">
          <div className="woods-canopy">🌲 🌲 🌳 🌲 🌳 🌲</div>
          <div className="woods-moon">☾</div>
          <div className="woods-path">╱╲╱╲╱╲╱╲╱╲</div>
          <div className="woods-fireflies">✦　·　✧　·　✦　·　✧</div>
          {explorer && <div className="woods-explorer"><PetArt speciesKey={explorer.speciesKey} colorKey={explorer.colorKey} stage={explorer.stage} outfitKey={explorer.outfitKey || null} appearance={explorer.appearance} size={92} /><strong>{explorer.name}</strong></div>}
        </div>
        <div className="woods-location-card"><div className="woods-location-icon">{current.emoji}</div><div><div className="eyebrow">WOODLAND LOCATION</div><h3>{current.name}</h3><p>{current.desc}</p></div></div>
        <div className="woods-discovery-card"><div className="discovery-art">{found ? discovery.emoji : "?"}</div><div className="discovery-copy"><div className="eyebrow">{found ? "DISCOVERY RECORDED" : "SOMETHING MAY BE HIDING HERE"}</div><h3>{found ? discovery.name : "Search the path"}</h3><p>{found ? discovery.text : "Your Iggy can investigate this part of the woods. Some discoveries are waiting in plain sight; others may require returning at a different time."}</p></div><button className="btn btn-primary" onClick={explore} disabled={!explorer || searching}>{searching ? "Searching…" : found ? "Explore Again" : "Investigate"}</button></div>
        {!explorer && <div className="bramble-empty">Adopt an Iggy before entering the woods. Your first explorer will become the keeper of this forest journal.</div>}
      </main>
    </div>}
    {page === "journal" && <div className="compact-noticeboard">{safe.journal.length > 0 && <div className="woods-journal"><div className="section-title">📖 Woodland Journal</div><PagedGrid className="journal-list" pageSize={3} label="Records">{safe.journal.map((j) => <div className="journal-entry" key={j.key}><div className="journal-seal">✦</div><div><strong>{j.title}</strong><small>{j.location}</small><p>{j.text}</p></div></div>)}</PagedGrid></div>}{safe.journal.length === 0 && <p>Your woodland story is just beginning.</p>}</div>}
  </section>;
}
