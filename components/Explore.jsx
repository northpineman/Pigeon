"use client";
import { useState } from "react";
import PetArt from "./PetArt";
import { sfx } from "@/lib/sfx";
import { getLife, getMaxLife, getStrength, getWisdom } from "@/lib/gameData";

const FLAVOR = [
  "The path winds quietly ahead.",
  "A pair of butterflies bob over the clover.",
  "A gentle breeze rustles the tall grass.",
  "The trail forks beside an old mossy signpost.",
  "Sunlight filters through the leaves overhead.",
  "You spot old paw prints in the soft dirt.",
];

export default function Explore({ birds, bots, exploreStage, explorerId, onSelectExplorer, onBattle, potions, books, onUseItem }) {
  const [step, setStep] = useState(0);
  const [encounter, setEncounter] = useState(null);
  const [flavor, setFlavor] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [battling, setBattling] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const pet = birds.find((b) => b.id === explorerId) || birds.find((b) => b.stage === "adult") || null;
  const allDefeated = exploreStage >= bots.length;
  const bot = bots[Math.min(exploreStage, bots.length - 1)];
  const petLife = pet ? getLife(pet) : 0;
  const canAct = pet && petLife > 0 && !battling;
  const walkerPct = 12 + (step % 7) * 12;

  const exploreForward = () => {
    if (!canAct || encounter) return;
    setLastResult(null); const next = step + 1; setStep(next);
    const rollEncounter = !allDefeated && Math.random() < 0.55;
    if (rollEncounter) { sfx.tick(); setFlavor(null); setEncounter(bot); }
    else { setFlavor(FLAVOR[Math.floor(Math.random() * FLAVOR.length)]); setEncounter(null); }
  };

  const fight = () => {
    if (!canAct || !encounter) return;
    setBattling(true);
    setTimeout(() => { const result = onBattle(pet.id); setLastResult(result); setEncounter(null); setBattling(false); }, 700);
  };
  const flee = () => { setEncounter(null); setFlavor("You tuck back behind the wildflowers and continue by a quieter path."); };

  return <div className="explore-page-v30">
    <div className="explore-toolbar-v30">
      <div><div className="eyebrow">TRAIL JOURNAL · STOP {step + 1}</div><div className="section-title">The Wandering Path</div></div>
      <label className="compact-explorer-select">Your explorer <select aria-label="Choose explorer" value={pet?.id || ""} onChange={(e) => onSelectExplorer(e.target.value)}>{birds.filter((b) => b.stage !== "egg").map((b) => <option key={b.id} value={b.id}>{b.name || "Unnamed Iggy"}</option>)}</select></label>
    </div>

    <div className="explore-status-row">
      {pet && <><span>💗 Energy {getLife(pet)}/{getMaxLife(pet)}</span><span>💪 Courage {getStrength(pet)}</span><span>📖 Wisdom {getWisdom(pet)}</span><button disabled={potions <= 0} onClick={() => onUseItem(pet.id, "strength")}>🍯 Treat ×{potions}</button><button disabled={books <= 0} onClick={() => onUseItem(pet.id, "wisdom")}>📚 Storybook ×{books}</button></>}
    </div>

    <section className="wandering-scene-v30">
      <div className="trail-sky"/><div className="trail-sun"/><div className="trail-hill trail-hill-a"/><div className="trail-hill trail-hill-b"/>
      <div className="trail-tree tr1">♣</div><div className="trail-tree tr2">♣</div><div className="trail-tree tr3">♣</div><div className="trail-tree tr4">♣</div>
      <div className="trail-path"/><div className="trail-flowers f1">❀ ✿ ❀</div><div className="trail-flowers f2">✿ ❀ ✿</div><div className="trail-sign">WHISPERING WOODS<br/>← &nbsp; MEADOW &nbsp; →</div>
      {pet && <div className="trail-walker" style={{ left: `${walkerPct}%` }}><div className="walker-shadow"/><PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} outfitKey={pet.outfitKey || null} appearance={pet.appearance} size={88}/><span>{pet.name}</span></div>}
      {encounter && <div className="trail-encounter"><div className="encounter-glow"/><div className="encounter-emoji">{encounter.emoji}</div><strong>{encounter.name}</strong><small>A curious trail challenge</small></div>}
      {!pet && <div className="trail-empty">🐕<strong>Choose an Iggy to walk the path.</strong><span>No rush — the trail will wait.</span></div>}
    </section>

    <section className="trail-story-card">
      <div className="trail-story-seal">✦</div>
      <div className="trail-story-copy">
        {petLife <= 0 && pet ? <><strong>{pet.name} is ready for a cozy break.</strong><p>A snack and a little care back at the kennel will have them eager for another walk.</p></> : encounter ? <><strong>A {encounter.name} blocks the path!</strong><p>You can try a friendly challenge or simply choose another route. Either choice is okay.</p></> : <><strong>{flavor || "The meadow road is open."}</strong><p>{allDefeated ? "You've met every trail challenger for now. Wander as long as you like." : "Take another step when you're ready. There is always another little detail to notice."}</p></>}
      </div>
      <div className="trail-actions">{encounter ? <><button className="btn btn-primary" onClick={fight} disabled={!canAct || battling}>{battling ? "Trying…" : "Try the challenge"}</button><button className="btn btn-ghost" onClick={flee} disabled={battling}>Take another path</button></> : <button className="btn btn-primary" onClick={exploreForward} disabled={!canAct}>{allDefeated ? "Wander farther →" : "Follow the path →"}</button>}</div>
    </section>

    {lastResult && <div className={`trail-result ${lastResult.won ? "won" : "rest"}`}>{lastResult.won ? "✨ " : "🌿 "}{lastResult.message}</div>}
    <div className="trail-progress"><span style={{ width: `${Math.min(100, (exploreStage / Math.max(1,bots.length)) * 100)}%` }}/></div><small className="trail-progress-label">Trail challenge journal · {exploreStage}/{bots.length} discovered</small>
  </div>;
}
