"use client";
import { PagedGrid } from "./CompactPages";
import { useEffect, useMemo, useState } from "react";
import { WORLD_REGIONS } from "@/lib/world";
import { WOODS_DISCOVERIES } from "@/lib/whisperingWoods";
import { BRAMBLEWICK_ENCOUNTERS } from "@/lib/bramblewick";
import { TOYS, toyCount, TOY_RARITY_LABELS } from "@/lib/toys";
import { GENETIC_TRAITS, geneticRarity, normalizeGenetics } from "@/lib/genetics";
import { EYE_COLORS, EYE_STYLES, appearanceItemKey } from "@/lib/appearance";
import { OUTFITS } from "@/lib/looks";
import { COMPENDIUM_SECTIONS, getCompendiumStats, uniqueDiscoveryKeys } from "@/lib/compendium";
import PetArt from "./PetArt";
import ItemArt from "./ItemArt";
import { normalizeAppearance } from "@/lib/appearance";

const PAGE_SIZE = 4;

function Progress({ found, total }) {
  const pct = total ? Math.min(100, Math.round((found / total) * 100)) : 0;
  return <div className="compendium-progress"><div><strong>{found}</strong><span> / {total}</span></div><div className="compendium-track"><i style={{ width: `${pct}%` }} /></div><small>{pct}% recorded</small></div>;
}

function CatalogPager({ page, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) return null;
  return <div className="catalog-pager"><button className="btn btn-ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>← Previous</button><span>Page <strong>{page}</strong> of {pages}<small>{total} archive records · {PAGE_SIZE} shown at once</small></span><button className="btn btn-ghost" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next →</button></div>;
}

function pageSlice(items, page) {
  const safePage = Math.max(1, Math.min(page, Math.max(1, Math.ceil(items.length / PAGE_SIZE))));
  return { safePage, rows: items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE) };
}

export default function Compendium({ section, setSection, pets, flags, woodsState, bramblewickState, unlockedKeys, achievementCatalog, onSelectPet, onClaimReward }) {
  const [page, setPage] = useState(1);
  const stats = getCompendiumStats({ pets, flags, woodsState, bramblewickState, unlockedKeys, achievementCatalog });
  const discoveries = uniqueDiscoveryKeys(woodsState, bramblewickState);
  const worldDiscoveries = useMemo(() => [...WOODS_DISCOVERIES.map((d) => ({...d, group:"Whispering Woods"})), ...BRAMBLEWICK_ENCOUNTERS.map((d) => ({...d, group:"Bramblewick", name:d.title}))], []);
  const wardrobeEntries = useMemo(() => Object.entries(OUTFITS).filter(([k]) => k !== "none"), []);

  useEffect(() => setPage(1), [section]);

  const iggyPage = pageSlice(pets, page);
  const worldPage = pageSlice(worldDiscoveries, page);
  const wardrobePage = pageSlice(wardrobeEntries, page);
  const toyPage = pageSlice(TOYS, page);
  const achievementPage = pageSlice(achievementCatalog, page);

  const rewards = { iggies: 100, world: 150, genetics: 200, wardrobe: 180, toys: 120, appearance: 160, achievements: 250 };
  const current = stats[section];
  const claimed = (flags.compendiumRewards || []).includes(section);
  const complete = current && current.total > 0 && current.found >= current.total;

  return <section className="compendium">
    <div className="collection-header">
      <div><div className="eyebrow">THE MEADOW COMPENDIUM</div><h2>📚 The Meadow Archive</h2><p>A living record of the Iggies, places, traits, treasures, and milestones you have uncovered.</p></div>
      <div className="compendium-total"><strong>{Object.values(stats).reduce((sum, x) => sum + x.found, 0)}</strong><span>records discovered</span></div>
    </div>
    <div className="collection-tabs">{COMPENDIUM_SECTIONS.map(([k, label]) => <button key={k} className={`btn ${section === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setSection(k)}>{label}<small>{stats[k]?.found ?? 0}/{stats[k]?.total ?? 0}</small></button>)}</div>
    <div className={`compendium-reward ${complete ? "ready" : ""}`}><div><strong>{complete ? "Archive chapter complete!" : "Archive chapter"}</strong><small>{complete ? `You recorded every ${current.label.toLowerCase()} entry.` : `${current?.found ?? 0} of ${current?.total ?? 0} entries recorded.`}</small></div><button className="btn btn-primary" disabled={!complete || claimed} onClick={() => onClaimReward?.(section)}>{claimed ? "Reward claimed ✓" : `Claim +${rewards[section] || 0} 🌾`}</button></div>

    {section === "iggies" && <div className="compendium-panel"><div className="section-title">Your Iggy Lineage</div><PagedGrid className="collection-grid" pageSize={4} label="Records">{iggyPage.rows.map((p) => <button className="collection-card compendium-iggy-card" key={p.id} onClick={() => onSelectPet(p.id)}><div className="compendium-pet-art"><PetArt speciesKey={p.speciesKey} colorKey={p.colorKey} stage={p.stage} outfitKey={p.outfitKey || null} appearance={normalizeAppearance(p)} size={92} /></div><strong>{p.name || "Unnamed Iggy"}</strong><small>Generation {normalizeGenetics(p).generation} · {geneticRarity(p)}</small><small>{(p.genetics?.traits || []).length} known traits</small></button>)}</PagedGrid><CatalogPager page={iggyPage.safePage} total={pets.length} onPage={setPage} /></div>}

    {section === "world" && <div className="compendium-panel compact-archive-columns"><div><div className="section-title">Mapped Regions</div><PagedGrid className="compendium-list" pageSize={4} label="Records">{WORLD_REGIONS.map((r) => <div className={`compendium-row ${r.status === "coming" ? "locked" : ""}`} key={r.key}><span className="compendium-icon">{r.emoji}</span><div><strong>{r.name}</strong><p>{r.blurb}</p></div><span className="compendium-state">{r.status === "coming" ? "Rumored" : "Mapped"}</span></div>)}</PagedGrid></div><div><div className="section-title" style={{marginTop:20}}>Discoveries</div><PagedGrid className="collection-grid text-cards" pageSize={4} label="Records">{worldPage.rows.map((d) => { const found = discoveries.has(d.key) || discoveries.has(d.discovery); const key = d.key || d.discovery; return <div className={`collection-card item-card ${found ? "owned" : "locked"}`} key={key}><div className="collection-swatch">{found ? d.emoji : "?"}</div><strong>{found ? d.name : "Undiscovered"}</strong><small>{d.group} · {found ? "Recorded" : "Explore to reveal"}</small></div>})}</PagedGrid><CatalogPager page={worldPage.safePage} total={worldDiscoveries.length} onPage={setPage} /></div></div>}

    {section === "genetics" && <div className="compendium-panel compact-archive-columns"><div><div className="section-title">Trait Discoveries</div><PagedGrid className="collection-grid text-cards" pageSize={4} label="Records">{GENETIC_TRAITS.map((t) => { const found = pets.some((p) => (p.genetics?.traits || []).includes(t.key)); return <div className={`collection-card item-card ${found ? "owned" : "locked"}`} key={t.key}><div className="collection-swatch">{found ? t.emoji : "🧬"}</div><strong>{found ? t.name : "Unknown Trait"}</strong><small>{t.rarity} · {found ? "Seen in your lineage" : "Discover through breeding"}</small></div>})}</PagedGrid></div><div><div className="section-title" style={{marginTop:20}}>Lineage Summary</div><div className="compendium-stat-grid"><div><strong>{pets.filter(p => normalizeGenetics(p).generation > 0).length}</strong><span>bred Iggies</span></div><div><strong>{new Set(pets.flatMap(p => p.genetics?.traits || [])).size}</strong><span>traits seen</span></div><div><strong>{Math.max(0, ...pets.map(p => normalizeGenetics(p).generation))}</strong><span>highest generation</span></div></div></div></div>}

    {section === "wardrobe" && <div className="compendium-panel"><div className="section-title">Complete Outfit Collection</div><PagedGrid className="collection-grid text-cards" pageSize={4} label="Records">{wardrobePage.rows.map(([k,o]) => { const found = (flags.wardrobeInventory || []).includes(k); return <div className={`collection-card item-card compendium-outfit-card ${found ? "owned" : "locked"}`} key={k}><div className="collection-art-window">{found && o.fullArt ? <img loading="lazy" decoding="async" src={o.fullArt} alt="" /> : <span>{found ? (o.emoji || "🎀") : "?"}</span>}</div><strong>{found ? o.name : "Uncollected Outfit"}</strong><small>{o.season || "Meadow"} · {o.rarity || "Common"}</small></div>})}</PagedGrid><CatalogPager page={wardrobePage.safePage} total={wardrobeEntries.length} onPage={setPage} /></div>}

    {section === "appearance" && <div className="compendium-panel compact-archive-columns"><div><div className="section-title">Eye Studio Collection</div><PagedGrid className="collection-grid text-cards" pageSize={4} label="Records">{EYE_COLORS.map((item) => { const key = appearanceItemKey("eye-color", item.key); const found = (flags.appearanceInventory || []).includes(key); return <div className={`collection-card item-card ${found ? "owned" : "locked"}`} key={key}><div className="collection-swatch">{found ? item.emoji : "👁️"}</div><strong>{found ? item.name : "Unknown Eye Color"}</strong><small>{item.rarity} · {found ? "Recorded" : item.cost ? `${item.cost} seeds to unlock` : "Starter"}</small></div>})}</PagedGrid></div><div><div className="section-title" style={{marginTop:20}}>Eye Styles</div><PagedGrid className="collection-grid text-cards" pageSize={4} label="Records">{EYE_STYLES.map((item) => { const key = appearanceItemKey("eye-style", item.key); const found = (flags.appearanceInventory || []).includes(key); return <div className={`collection-card item-card ${found ? "owned" : "locked"}`} key={key}><div className="collection-swatch">{found ? item.emoji : "👁️"}</div><strong>{found ? item.name : "Unknown Eye Style"}</strong><small>{item.rarity} · {found ? "Recorded" : item.cost ? `${item.cost} seeds to unlock` : "Starter"}</small></div>})}</PagedGrid></div></div>}

    {section === "toys" && <div className="compendium-panel"><div className="section-title">Toy Chest Records</div><PagedGrid className="collection-grid text-cards" pageSize={4} label="Records">{toyPage.rows.map((t) => { const count = toyCount(flags.toyInventory, t.key); const found = count > 0 || (flags.playedToys || []).includes(t.key); return <div className={`collection-card item-card compendium-toy-card ${found ? "owned" : "locked"}`} key={t.key}><div className="collection-art-window">{found ? <ItemArt itemKey={t.key} emoji={t.emoji} size={84} /> : <span>?</span>}</div><strong>{found ? t.name : "Unknown Toy"}</strong><small>{TOY_RARITY_LABELS[t.rarity]} · {count ? `×${count} in chest` : "Not in chest"}</small></div>})}</PagedGrid><CatalogPager page={toyPage.safePage} total={TOYS.length} onPage={setPage} /></div>}

    {section === "achievements" && <div className="compendium-panel"><div className="section-title">Milestones</div><Progress found={unlockedKeys.length} total={achievementCatalog.length} /><PagedGrid className="compendium-list" pageSize={4} label="Records">{achievementPage.rows.map((a) => { const found = unlockedKeys.includes(a.key); return <div className={`compendium-row ${found ? "" : "locked"}`} key={a.key}><span className="compendium-icon">{found ? "🏆" : "▫️"}</span><div><strong>{found ? a.name : "Hidden milestone"}</strong><p>{found ? a.description : "Keep exploring the Meadow to reveal this record."}</p></div><span className="compendium-state">{found ? "Earned" : "Locked"}</span></div>})}</PagedGrid><CatalogPager page={achievementPage.safePage} total={achievementCatalog.length} onPage={setPage} /></div>}
  </section>;
}
