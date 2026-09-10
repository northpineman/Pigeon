"use client";
import { useEffect, useRef, useState } from "react";

const MATCH_SYMBOLS = ["🥚", "🕊️", "🌾", "🪺", "⭐", "🍬", "🌻", "🐦"];

export default function NestMatchGame({ onFinish, onClose }) {
  const [cards, setCards] = useState(() => {
    const pairs = [...MATCH_SYMBOLS, ...MATCH_SYMBOLS];
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs.map((sym, i) => ({ id: i, sym, flipped: false, matched: false }));
  });
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const lockRef = useRef(false);

  const handleFlip = (id) => {
    if (lockRef.current || done) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const nextFlipped = [...flippedIds, id];
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setFlippedIds(nextFlipped);
    if (nextFlipped.length === 2) {
      lockRef.current = true;
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      setTimeout(() => {
        setCards((prev) => {
          const ca = prev.find((c) => c.id === a);
          const cb = prev.find((c) => c.id === b);
          const isMatch = ca.sym === cb.sym;
          const next = prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: isMatch, matched: isMatch } : c));
          if (next.every((c) => c.matched)) setDone(true);
          return next;
        });
        setFlippedIds([]);
        lockRef.current = false;
      }, 600);
    }
  };

  useEffect(() => {
    if (done) {
      const seeds = Math.max(8, 40 - moves * 2);
      onFinish(seeds, true);
    }
  }, [done]); // eslint-disable-line

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Moves: {moves}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, maxWidth: 280, margin: "0 auto" }}>
        {cards.map((c) => (
          <div
            key={c.id}
            onClick={() => handleFlip(c.id)}
            style={{
              aspectRatio: "1",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              cursor: "pointer",
              background: c.flipped || c.matched ? "#FFF3DC" : "#8C6FE0",
              border: c.matched ? "2px solid #4CAF7D" : "2px solid transparent",
            }}
          >
            {c.flipped || c.matched ? c.sym : ""}
          </div>
        ))}
      </div>
      {done && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8 }}>All paired! 🎉</div>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
