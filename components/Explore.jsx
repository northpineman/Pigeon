"use client";
import { useState } from "react";
import PetArt from "./PetArt";
import { sfx } from "@/lib/sfx";
import { getLife, getMaxLife, getStrength, getWisdom } from "@/lib/gameData";

const FLAVOR = [
  "The path winds quietly ahead.",
  "Birds chirp somewhere in the branches.",
  "A gentle breeze rustles the tall grass.",
  "The trail forks, but you press onward.",
  "Sunlight filters through the leaves overhead.",
  "You spot old paw prints in the dirt.",
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

  const walkerPct = 10 + (step % 8) * 11;

  const exploreForward = () => {
    if (!canAct || encounter) return;
    setLastResult(null);
    const next = step + 1;
    setStep(next);
    const rollEncounter = !allDefeated && Math.random() < 0.55;
    if (rollEncounter) {
      sfx.tick();
      setFlavor(null);
      setEncounter(bot);
    } else {
      setFlavor(FLAVOR[Math.floor(Math.random() * FLAVOR.length)]);
      setEncounter(null);
    }
  };

  const fight = () => {
    if (!canAct || !encounter) return;
    setBattling(true);
    setTimeout(() => {
      const result = onBattle(pet.id);
      setLastResult(result);
      setEncounter(null);
      setBattling(false);
    }, 700);
  };

  const flee = () => {
    setEncounter(null);
    setFlavor("You slip quietly back into the tall grass, avoiding the fight.");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="section-title" style={{ margin: 0, border: "none", padding: 0 }}>Exploring</div>
        <button className="btn btn-ghost" style={{ fontSize: 11.5, padding: "6px 10px" }} onClick={() => setShowPicker((s) => !s)}>
          {pet ? `Exploring as ${pet.name}` : "Choose explorer"} ▾
        </button>
      </div>

      {showPicker && (
        <div className="loft-grid" style={{ marginBottom: 16 }}>
          {birds.filter((b) => b.stage !== "egg").map((b) => (
            <div
              key={b.id}
              className={`bird-card ${b.id === explorerId ? "busy" : ""}`}
              onClick={() => {
                onSelectExplorer(b.id);
                setShowPicker(false);
              }}
            >
              <PetArt speciesKey={b.speciesKey} colorKey={b.colorKey} stage={b.stage} size={50} />
              <div className="bname">{b.name}</div>
              <div className="statbar"><div className="statbar-fill" style={{ width: `${getLife(b)}%`, background: getLife(b) > 30 ? "#4CAF7D" : "#FF7A59" }} /></div>
            </div>
          ))}
        </div>
      )}

      {pet && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <div className="pill">❤️ {getLife(pet)}/{getMaxLife(pet)}</div>
          <div className="pill">💪 {getStrength(pet)}</div>
          <div className="pill">📖 {getWisdom(pet)}</div>
          <button className="pill" disabled={potions <= 0} onClick={() => onUseItem(pet.id, "strength")}>💪 Use ({potions})</button>
          <button className="pill" disabled={books <= 0} onClick={() => onUseItem(pet.id, "wisdom")}>📖 Use ({books})</button>
        </div>
      )}

      {/* the 2D scene */}
      <div
        style={{
          position: "relative",
          height: 220,
          borderRadius: 16,
          border: "3px solid var(--frame)",
          boxShadow: "4px 4px 0 rgba(91,70,54,0.15)",
          overflow: "hidden",
          background: "linear-gradient(180deg, #E9D9F2 0%, #DCEFE4 55%, #C9DEB0 100%)",
        }}
      >
        {/* distant trees */}
        {[8, 24, 62, 80, 92].map((x, i) => (
          <div key={i} style={{ position: "absolute", left: `${x}%`, bottom: 70, fontSize: 26, opacity: 0.55 }}>🌳</div>
        ))}
        {/* dirt path */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "#D8C09A", borderTop: "3px dashed #b89a6c" }} />

        {/* the walker */}
        {pet && (
          <div style={{ position: "absolute", left: `${walkerPct}%`, bottom: 20, transition: "left 0.5s ease", transform: "translateX(-50%)" }}>
            <PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} size={54} />
          </div>
        )}

        {/* encounter */}
        {encounter && (
          <div style={{ position: "absolute", right: "8%", bottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 46, animation: "bob 1s ease-in-out infinite" }}>{encounter.emoji}</div>
            <div style={{ fontSize: 10.5, fontWeight: 800, background: "#fff", borderRadius: 8, padding: "2px 6px" }}>{encounter.name}</div>
          </div>
        )}

        {!pet && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--ink-soft)", background: "rgba(255,255,255,0.6)" }}>
            Choose an explorer above to begin
          </div>
        )}
      </div>

      {/* status / controls */}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        {petLife <= 0 && pet && (
          <div style={{ fontSize: 12.5, color: "var(--warm)", fontWeight: 700, marginBottom: 10 }}>
            {pet.name} is out of life — feed them from the Kennel to keep exploring.
          </div>
        )}

        {encounter ? (
          <>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, marginBottom: 10 }}>A wild {encounter.name} appears!</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={fight} disabled={!canAct || battling}>
                {battling ? "Battling…" : "Fight!"}
              </button>
              <button className="btn btn-ghost" onClick={flee} disabled={battling}>
                Flee
              </button>
            </div>
          </>
        ) : (
          <>
            {flavor && <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>{flavor}</div>}
            <button className="btn btn-primary" onClick={exploreForward} disabled={!canAct}>
              {allDefeated ? "Wander further →" : "Explore forward →"}
            </button>
          </>
        )}

        {lastResult && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 12,
              background: lastResult.won ? "#4CAF7D22" : "#FF7A5922",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {lastResult.won ? "🎉 " : "💥 "}
            {lastResult.message}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 11.5, color: "var(--ink-soft)", textAlign: "center" }}>
        {allDefeated
          ? "You've cleared every challenger so far — more are on the way."
          : `Gauntlet progress: ${exploreStage}/${bots.length} defeated`}
      </div>

      <style>{`
        @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}
