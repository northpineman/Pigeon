"use client";
import { useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

// Weighted prize wheel. Visual segments are equal-sized; the actual odds
// come from `weight` and are used to pick the outcome first — the wheel
// then animates to land on whichever segment matches that pick.
export default function HarvestWheel({ prizes, cost, seeds, onResult }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);

  const seg = 360 / prizes.length;
  const colors = ["#F0A98D", "#E8B563", "#8FC7AC", "#A9BFE8", "#E8A9C4", "#C9A2E0", "#8a6a4a"];

  const pickWeighted = () => {
    const total = prizes.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (let i = 0; i < prizes.length; i++) {
      r -= prizes[i].weight;
      if (r <= 0) return i;
    }
    return prizes.length - 1;
  };

  const spin = () => {
    if (spinning || seeds < cost) return;
    setSpinning(true);
    setResult(null);
    const idx = pickWeighted();
    const segCenter = idx * seg + seg / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const jitter = (Math.random() - 0.5) * (seg * 0.6);
    const target = rotation + extraSpins * 360 + ((360 - segCenter) % 360) + jitter - (rotation % 360);
    setRotation(rotation + target);

    setTimeout(() => {
      setSpinning(false);
      setResult(prizes[idx]);
      if (prizes[idx].rarity === "rare") sfx.success();
      else sfx.pop();
      onResult(prizes[idx], cost);
    }, 4200);
  };

  return (
    <div className="compact-harvest-wheel" style={{ textAlign: "center" }}>
      <div className="compact-wheel-face" style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "16px solid var(--frame)",
            zIndex: 3,
          }}
        />
        <div
          ref={wheelRef}
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "4px solid var(--frame)",
            boxShadow: "3px 3px 0 rgba(91,70,54,0.2)",
            position: "relative",
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4.2s cubic-bezier(0.12, 0.75, 0.12, 1)" : "none",
            background: `conic-gradient(${prizes
              .map((p, i) => `${colors[i % colors.length]} ${i * seg}deg ${(i + 1) * seg}deg`)
              .join(", ")})`,
          }}
        >
          {prizes.map((p, i) => {
            const center = i * seg + seg / 2;
            return (
              <div
                key={p.key}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotate(${center}deg)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: "50%",
                    transform: `translateX(-50%) rotate(${-center}deg)`,
                    fontSize: 20,
                  }}
                >
                  {p.emoji}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={spin} disabled={spinning || seeds < cost}>
        {spinning ? "Spinning…" : `Spin (${cost} seeds)`}
      </button>

      {result && !spinning && (
        <div style={{ marginTop: 12, fontFamily: "'Fraunces', serif", fontSize: 15 }}>
          {result.rarity === "rare" ? "✨ " : ""}
          You won: {result.label}
          {result.rarity === "rare" ? " ✨" : ""}
        </div>
      )}

      <div className="item-grid" style={{ marginTop: 16, textAlign: "left" }}>
        {prizes.map((p) => (
          <div className="market-item" key={p.key} style={{ opacity: p.rarity === "rare" ? 1 : 0.85 }}>
            <div style={{ fontSize: 20 }}>{p.emoji}</div>
            <div className="info">
              <div className="nm">{p.label}</div>
              <div className="sub">{p.rarity === "rare" ? "Very rare ✨" : p.rarity === "uncommon" ? "Uncommon" : "Common"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
