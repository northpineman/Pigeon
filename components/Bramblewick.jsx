"use client";
import { PagedGrid } from "./CompactPages";
import { useState } from "react";
import { BRAMBLEWICK_NPCS, BRAMBLEWICK_ITEMS, BRAMBLEWICK_QUESTS, BRAMBLEWICK_ENCOUNTERS, defaultBramblewickState } from "@/lib/bramblewick";

const PLACES = [
  { key:"castle", icon:"🏰", name:"Bramblewick Castle", desc:"The ancient seat of the Meadow Crown. Royal kennels, echoing halls, and sealed doors fill its oldest wing." },
  { key:"village", icon:"🏘️", name:"Bramblewick Village", desc:"Stone cottages, lanterns, tiny gardens, and the busiest little square in the kingdom." },
  { key:"market", icon:"🛍️", name:"Royal Market", desc:"A specialty market for medieval treasures, toys, ribbons, charms, and rotating curiosities." },
  { key:"inn", icon:"🍵", name:"The Velvet Paw Inn", desc:"A cozy gathering place where travelers trade rumors, stories, maps, and overheard secrets." },
  { key:"grounds", icon:"⚔️", name:"Training Grounds", desc:"Practice agility, bravery, and old-fashioned knightly games with your Iggy." },
  { key:"garden", icon:"🌿", name:"Royal Rose Garden", desc:"A walled garden behind the castle where old roses bloom around forgotten family stones." },
  { key:"library", icon:"📚", name:"Royal Library", desc:"Ancient volumes record dynasties, discoveries, and the mysterious origins of Meadow families." },
  { key:"tower", icon:"🔭", name:"Moonwatch Tower", desc:"A sealed observatory said to reveal hidden constellations on certain nights." },
  { key:"dungeon", icon:"🗝️", name:"Bramblewick Underkeep", desc:"A forgotten maze beneath the castle. Something old is still waiting below." },
];

const LORE = [
  ["The First Crown","Legend says the first Bramblewick guardian was chosen not for strength, but for a remarkable sense of direction."],
  ["The Thorn Gate","The oldest gate in the kingdom is covered in living roses that bloom only for visitors carrying a family heirloom."],
  ["The Moonwatchers","For generations, royal astronomers recorded lights beyond the meadow sky. Their final journal is missing."],
];

export default function Bramblewick({ onBack, onNotify, state, onStateChange, onReward, seeds = 0 }) {
  const [place, setPlace] = useState("castle");
  const [section, setSection] = useState("explore");
  const [dialogue, setDialogue] = useState(null);
  const saved = { ...defaultBramblewickState(), ...(state || {}) };
  const active = PLACES.find(p=>p.key===place) || PLACES[0];
  const completed = new Set(saved.completed);
  const discovered = new Set(saved.discoveries);
  const QUEST_NPCS = {
    "royal-introduction": "sir-biscuit",
    "market-favor": "lady-rosie",
    "lost-records": "archivist-moon",
    "knight-trial": "captain-clover",
    "herbalist-secret": "mistress-thistle",
  };
  const currentQuest = BRAMBLEWICK_QUESTS.find(q => !completed.has(q.key));
  const update = (patch) => onStateChange?.({ ...saved, ...patch });
  const discover = (encounter) => {
    if (!encounter || saved.encounters.includes(encounter.key)) return;
    const next = { ...saved, encounters: [...saved.encounters, encounter.key], discoveries: saved.discoveries.includes(encounter.discovery) ? saved.discoveries : [...saved.discoveries, encounter.discovery], reputation: saved.reputation + 1, journal: [...saved.journal, { id: `${encounter.key}-${Date.now()}`, title: encounter.title, text: encounter.text, at: Date.now() }], lastAdventureAt: Date.now() };
    onStateChange?.(next);
    onReward?.(encounter.reward);
    onNotify?.(`Discovery found: ${encounter.title} · +${encounter.reward} seeds ✨`);
  };
  const adventure = () => {
    if (isLocked(place)) return onNotify?.("This part of Bramblewick is still sealed. Follow the royal quests to open it.");
    const options = BRAMBLEWICK_ENCOUNTERS.filter(e => e.place === place && !saved.encounters.includes(e.key));
    if (!options.length) return onNotify?.("You've uncovered every current secret in this location. Try another place.");
    const encounter = options[Math.floor(Math.random() * options.length)];
    discover(encounter);
  };
  const finishQuest = (q) => {
    if (!q || completed.has(q.key)) return;
    const prior = BRAMBLEWICK_QUESTS.find((candidate) => candidate.key === q.key);
    const prerequisite = BRAMBLEWICK_QUESTS.find((candidate) => candidate.unlock === q.key);
    if (prerequisite && !completed.has(prerequisite.key)) return onNotify?.("That chapter is still sealed by an earlier royal quest.");
    const nextCompleted = [...saved.completed, q.key];
    const nextDiscoveries = q.unlock && !discovered.has(q.unlock) ? [...saved.discoveries, q.unlock] : saved.discoveries;
    const nextJournal = [...saved.journal, { id: `quest-${q.key}-${Date.now()}`, title: q.name, text: q.text, at: Date.now(), kind: "quest" }];
    update({ completed: nextCompleted, discoveries: nextDiscoveries, reputation: saved.reputation + (q.favor || 1), journal: nextJournal });
    onReward?.(q.reward);
    onNotify?.(`Quest complete: ${q.name} · +${q.reward} seeds · +${q.favor || 1} favor 👑`);
  };
  const buy = (item) => {
    if (saved.inventory.includes(item.key)) return onNotify?.("You already own this Bramblewick treasure.");
    if (seeds < item.cost) return onNotify?.("You need more seeds for that royal treasure.");
    onReward?.(-item.cost);
    update({ inventory: [...saved.inventory, item.key] });
    onNotify?.(`${item.name} joined your Bramblewick collection ${item.emoji}`);
  };
  const talk = (npc) => {
    setDialogue(npc);
    if (!saved.npcTalked.includes(npc.key)) update({ npcTalked: [...saved.npcTalked, npc.key] });
    const quest = BRAMBLEWICK_QUESTS.find(q => !completed.has(q.key) && QUEST_NPCS[q.key] === npc.key);
    if (quest) finishQuest(quest);
  };
  const isLocked = (key) => key === "library" ? !completed.has("market-favor") : key === "tower" ? !completed.has("lost-records") : key === "dungeon" ? !completed.has("thorn-gate") : false;

  return <div className="bramblewick-page">
    <div className="bramblewick-hero">
      <button className="btn btn-ghost" onClick={onBack}>← World Map</button>
      <div className="bramblewick-crown">✦ KINGDOM OF BRAMBLEWICK ✦</div>
      <h2>Where old stories still have room to grow</h2>
      <p>A living medieval district of Iggy characters, quests, treasures, rumors, family legends, and places that reveal themselves over time.</p>
      <div className="bramblewick-stats"><span>🏰 {PLACES.length} locations</span><span>🧙 {BRAMBLEWICK_NPCS.length} characters</span><span>📜 {completed.size}/{BRAMBLEWICK_QUESTS.length} quests</span><span>✨ {saved.discoveries.length}/{BRAMBLEWICK_ENCOUNTERS.length} discoveries</span><span>👑 {saved.reputation} royal favor</span></div>
    </div>
    <div className="bramblewick-tabs">
      {[['explore','🗺️ Kingdom'],['quests','📜 Quest Board'],['characters','🧙 Characters'],['market','🛍️ Royal Market'],['adventure','✨ Adventure'],['journal','📖 Journal'],['lore','📚 Royal Archive']].map(([k,l])=><button key={k} className={section===k?'active':''} onClick={()=>setSection(k)}>{l}</button>)}
    </div>
    {section === "explore" && <div className="bramblewick-layout">
      <aside className="bramblewick-sidebar"><div className="section-title">Explore the Kingdom</div>{PLACES.map(p=>{const locked=isLocked(p.key); return <button key={p.key} className={`bramble-place ${place===p.key?'active':''}${locked?' locked':''}`} onClick={()=>!locked&&setPlace(p.key)} disabled={locked}><span className="bramble-place-icon">{locked?'🔒':p.icon}</span><span><strong>{p.name}</strong><small>{locked?'Locked by the royal archive':'Open to visitors'}</small></span></button>})}</aside>
      <main className="bramblewick-main">
        <div className="bramble-location-card"><div className="bramble-location-icon">{active.icon}</div><div><div className="eyebrow">BRAMBLEWICK · DESTINATION</div><h3>{active.name}</h3><p>{active.desc}</p></div></div>
        <div className="bramble-scene"><div className="castle-art"><span>☾</span><div className="tower t1">🏰</div><div className="tower t2">🏰</div><div className="bridge">🌹 ───────── 🌹</div></div><div className="bramble-scene-copy"><div className="eyebrow">THE KINGDOM IS WAKING</div><h3>{currentQuest ? currentQuest.name : "The royal chapter continues"}</h3><p>{currentQuest ? currentQuest.text : "You have completed the first royal quest chain. More chapters can be added without replacing the kingdom you've already explored."}</p>{currentQuest && <button className="btn btn-primary" onClick={()=>setSection('characters')}>Meet the right character →</button>}</div></div>
        <div className="bramble-mini-grid"><div><strong>🧭 Discoveries</strong><span>{saved.discoveries.length}/{BRAMBLEWICK_ENCOUNTERS.length} secrets uncovered</span></div><div><strong>🧳 Treasures</strong><span>{saved.inventory.length}/{BRAMBLEWICK_ITEMS.length} royal items collected</span></div><div><strong>🗣️ Conversations</strong><span>{saved.npcTalked.length}/{BRAMBLEWICK_NPCS.length} royal characters met</span></div></div>
      </main>
    </div>}
    {section === "quests" && <div className="bramble-section"><div className="bramble-section-head"><div><div className="eyebrow">ROYAL QUEST BOARD</div><h3>Stories begin with small errands.</h3></div><span className="quest-progress">{completed.size}/{BRAMBLEWICK_QUESTS.length}</span></div><PagedGrid className="quest-list" pageSize={2} label="Records">{BRAMBLEWICK_QUESTS.map(q=><article className={`royal-quest ${completed.has(q.key)?'done':''}`} key={q.key}><div className="quest-seal">{completed.has(q.key)?'✓':'📜'}</div><div><strong>{q.name}</strong><p>{q.text}</p><small>Reward: +{q.reward} seeds · Unlocks: {PLACES.find(p=>p.key===q.unlock)?.name || 'story progress'}</small></div>{completed.has(q.key)?<span className="quest-done">Complete</span>:<span className="quest-open">Open</span>}</article>)}</PagedGrid></div>}
    {section === "characters" && <div className="bramble-section"><div className="bramble-section-head"><div><div className="eyebrow">PEOPLE OF BRAMBLEWICK</div><h3>Everyone has a piece of the story.</h3></div></div><PagedGrid className="npc-grid" pageSize={2} label="Records">{BRAMBLEWICK_NPCS.map(n=><article className="npc-card" key={n.key}><div className="npc-avatar">{n.emoji}</div><div className="npc-role">{n.role}</div><h4>{n.name}</h4><p>{n.greeting}</p><button className="btn btn-primary" onClick={()=>talk(n)}>{saved.npcTalked.includes(n.key)?'Speak again':'Talk'}</button>{(() => { const q = BRAMBLEWICK_QUESTS.find(x => QUEST_NPCS[x.key] === n.key && !completed.has(x.key)); return q ? <button className="btn btn-ghost" onClick={()=>finishQuest(q)}>Complete quest</button> : null; })()}</article>)}</PagedGrid></div>}
    {section === "market" && <div className="bramble-section"><div className="bramble-section-head"><div><div className="eyebrow">ROYAL MARKET</div><h3>Small treasures from a very old kingdom.</h3></div></div><PagedGrid className="royal-market-grid" pageSize={2} label="Records">{BRAMBLEWICK_ITEMS.map(item=>{const owned=saved.inventory.includes(item.key);return <article className="royal-item" key={item.key}><div className="royal-item-art">{item.emoji}</div><div className="item-rarity">{item.rarity}</div><h4>{item.name}</h4><p>{item.description}</p><button className="btn btn-primary" disabled={owned || seeds < item.cost} onClick={()=>buy(item)}>{owned?'Collected ✓':`${item.cost} 🌾`}</button></article>})}</PagedGrid></div>}
    {section === "adventure" && <div className="bramble-section"><div className="bramble-section-head"><div><div className="eyebrow">BRAMBLEWICK ADVENTURE</div><h3>There is always something hidden nearby.</h3><p className="bramble-muted">Choose a location, then send your Iggy exploring. Discoveries are one-time finds and become part of your permanent royal journal.</p></div><span className="quest-progress">👑 {saved.reputation} favor</span></div><div className="adventure-banner"><div className="adventure-compass">✦</div><div><strong>Explore {active.name}</strong><p>{BRAMBLEWICK_ENCOUNTERS.filter(e=>e.place===place && !saved.encounters.includes(e.key)).length} undiscovered encounter(s) remain here.</p></div><button className="btn btn-primary" onClick={adventure}>Send Iggy exploring ✨</button></div><PagedGrid className="encounter-grid" pageSize={2} label="Records">{BRAMBLEWICK_ENCOUNTERS.map(e=>{const found=saved.encounters.includes(e.key); return <article className={`encounter-card ${found?'found':''}`} key={e.key}><div>{found?'✓':'?'}</div><strong>{found?e.title:'Unknown Discovery'}</strong><p>{found?e.text:'Explore the location to reveal this entry.'}</p>{found&&<small>+{e.reward} seeds · +1 favor</small>}</article>})}</PagedGrid></div>}
    {section === "journal" && <div className="bramble-section"><div className="bramble-section-head"><div><div className="eyebrow">ROYAL JOURNAL</div><h3>Your Bramblewick story so far</h3><p className="bramble-muted">Every discovery becomes a permanent page in your adventure journal.</p></div></div>{saved.journal.length ? <PagedGrid className="journal-list" pageSize={2} label="Records">{[...saved.journal].reverse().map(entry=><article className="journal-entry" key={entry.id}><div className="journal-seal">✦</div><div><strong>{entry.title}</strong><small>{new Date(entry.at).toLocaleString()}</small><p>{entry.text}</p></div></article>)}</PagedGrid> : <div className="bramble-empty">📖 Your journal is waiting for its first discovery.</div>}</div>}
    {section === "lore" && <div className="bramble-section"><div className="bramble-section-head"><div><div className="eyebrow">ROYAL ARCHIVE</div><h3>Some stories are older than the kingdom.</h3></div></div><PagedGrid className="lore-grid" pageSize={2} label="Records">{LORE.map(([title,text])=><article className="lore-card" key={title}><div>📜</div><h4>{title}</h4><p>{text}</p></article>)}</PagedGrid><div className="bramble-future"><span>🔐</span><div><strong>The locked rooms are part of the story.</strong><p>As quests progress, the Library, Moonwatch Tower, and Underkeep open in sequence. Later chapters can connect them to genetics, rare discoveries, seasonal events, and deeper exploration.</p></div></div></div>}
    {dialogue && <div className="bramble-dialogue"><div className="npc-avatar">{dialogue.emoji}</div><div><strong>{dialogue.name}</strong><small>{dialogue.role}</small><p>{dialogue.greeting}</p></div><button className="btn btn-ghost" onClick={()=>setDialogue(null)}>Close</button></div>}
  </div>;
}
