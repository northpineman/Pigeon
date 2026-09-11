"use client";
import { useEffect, useState } from "react";

const BANK = [
  { q: "What is the world's largest living rodent?", a: ["The beaver", "The capybara", "The porcupine", "The muskrat"], correct: 1 },
  { q: "Where do capybaras naturally live?", a: ["Deserts of Africa", "Wetlands of South America", "Mountains of Asia", "Arctic tundra"], correct: 1 },
  { q: "What is a baby capybara called?", a: ["Kit", "Pup", "Calf", "Joey"], correct: 1 },
  { q: "Capybaras are closely related to which other rodent?", a: ["Guinea pigs", "Squirrels", "Hamsters", "Chinchillas"], correct: 0 },
  { q: "Why do capybaras have eyes, ears, and nose set high on their head?", a: ["To see over tall grass", "So they can stay mostly submerged in water", "To scare off predators", "Pure coincidence"], correct: 1 },
  { q: "What are a capybara's feet adapted for?", a: ["Climbing trees", "Swimming, with partial webbing", "Digging deep burrows", "Running at high speed"], correct: 1 },
  { q: "About how long can a capybara hold its breath underwater?", a: ["A few seconds", "About 5 minutes", "Over an hour", "They can't submerge"], correct: 1 },
  { q: "What is a group of capybaras called?", a: ["A herd", "A pack", "A shiver", "A murder"], correct: 0 },
  { q: "What do capybaras mainly eat?", a: ["Insects and small fish", "Grasses and aquatic plants", "Other rodents", "Tree bark only"], correct: 1 },
  { q: "Capybaras are known for being unusually friendly toward which kind of animals?", a: ["Only their own species", "Almost any other species, including birds and cats", "No other animals at all", "Only larger predators"], correct: 1 },
  { q: "How much can an adult capybara weigh?", a: ["2-5 lbs", "10-20 lbs", "Up to about 150 lbs", "Over 500 lbs"], correct: 2 },
  { q: "What is unique about a capybara's teeth?", a: ["They have none", "Their teeth grow continuously through their life", "They only have baby teeth", "They have retractable teeth"], correct: 1 },
];

function pickQuestions(n) {
  const shuffled = [...BANK].sort(() => Math.random() - 0.5).slice(0, n);
  return shuffled.map((item) => {
    const order = item.a.map((text, i) => ({ text, isCorrect: i === item.correct }));
    order.sort(() => Math.random() - 0.5);
    return { q: item.q, options: order };
  });
}

export default function CapybaraTriviaGame({ onFinish, onClose }) {
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
          <div style={{ fontWeight: 800, fontSize: 12.5, marginBottom: 10, color: "var(--ink-soft)" }}>
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
