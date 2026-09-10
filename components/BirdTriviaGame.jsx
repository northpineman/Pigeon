"use client";
import { useEffect, useState } from "react";

const BANK = [
  { q: "What do pigeons and doves both belong to?", a: ["Family Columbidae", "Family Corvidae", "Order Passerine", "Family Psittacidae"], correct: 0 },
  { q: "How do pigeons drink water?", a: ["They can't drink water", "By sucking without tilting their head back", "Only from puddles", "By catching raindrops"], correct: 1 },
  { q: "What is a baby pigeon called?", a: ["Chick", "Squab", "Fledgling only", "Pup"], correct: 1 },
  { q: "What do pigeon parents feed their newly hatched young?", a: ["Worms", "Crop milk", "Seeds only", "Nothing for a week"], correct: 1 },
  { q: "Which sense do pigeons use to navigate long distances?", a: ["Smell only", "Magnetic fields, sun position, and landmarks", "Taste", "Echolocation"], correct: 1 },
  { q: "What is a group of doves called?", a: ["A pack", "A dole or flight", "A murder", "A gaggle"], correct: 1 },
  { q: "Which pigeon breed has an unusually large fanned tail?", a: ["King Pigeon", "Fantail Pigeon", "Ring-necked Dove", "Diamond Dove"], correct: 1 },
  { q: "About how fast can a racing pigeon fly?", a: ["5-10 mph", "20-30 mph", "50-60 mph", "100+ mph always"], correct: 2 },
  { q: "What is the smallest dove species featured in most lofts?", a: ["King Pigeon", "Diamond Dove", "Rock Pigeon", "Nun Pigeon"], correct: 1 },
  { q: "Pigeons were historically used for what practical purpose?", a: ["Pulling carts", "Carrying messages", "Guarding homes", "Herding sheep"], correct: 1 },
  { q: "What color is a 'pied' bird's pattern generally described as?", a: ["Solid single color", "Patchy mix of two colors", "Always all-white", "Always all-black"], correct: 1 },
  { q: "How many eggs does a dove or pigeon typically lay per clutch?", a: ["1", "2", "6", "12"], correct: 1 },
];

function pickQuestions(n) {
  const shuffled = [...BANK].sort(() => Math.random() - 0.5).slice(0, n);
  return shuffled.map((item) => {
    const order = item.a.map((text, i) => ({ text, isCorrect: i === item.correct }));
    order.sort(() => Math.random() - 0.5);
    return { q: item.q, options: order };
  });
}

export default function BirdTriviaGame({ onFinish, onClose }) {
  const [questions] = useState(() => pickQuestions(8));
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState(null);
  const [status, setStatus] = useState("playing");

  const current = questions[idx];

  const handlePick = (optIdx) => {
    if (picked !== null) return;
    setPicked(optIdx);
    if (current.options[optIdx].isCorrect) setCorrectCount((c) => c + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setStatus("done");
      } else {
        setIdx((i) => i + 1);
        setPicked(null);
      }
    }, 800);
  };

  useEffect(() => {
    if (status === "done") {
      const seeds = correctCount * 6 + (correctCount === questions.length ? 15 : 0);
      onFinish(Math.max(6, seeds), correctCount === questions.length);
    }
  }, [status]); // eslint-disable-line

  return (
    <div style={{ textAlign: "center" }}>
      {status === "playing" && current && (
        <>
          <div style={{ fontWeight: 800, fontSize: 12.5, marginBottom: 10, color: "#8a7a72" }}>
            Question {idx + 1} of {questions.length} · Correct: {correctCount}
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, marginBottom: 14, minHeight: 44 }}>{current.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 280, margin: "0 auto" }}>
            {current.options.map((opt, i) => {
              let bg = "#FFF3DC";
              if (picked !== null) {
                if (opt.isCorrect) bg = "#4CAF7D";
                else if (i === picked) bg = "#FF7A59";
              }
              return (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  disabled={picked !== null}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: bg,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: picked === null ? "pointer" : "default",
                    textAlign: "left",
                  }}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </>
      )}
      {status !== "playing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8 }}>
            {correctCount === questions.length ? "Perfect score! 🎉" : `${correctCount}/${questions.length} correct`}
          </div>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
