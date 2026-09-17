"use client";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";
import GameResult from "./GameResult";

const BANK = [
  { q: "What is another common nickname for the Italian Greyhound?", a: ["Iggy", "Grey", "Sighty", "Slim"], correct: 0 },
  { q: "What group of dogs do Italian Greyhounds belong to?", a: ["Herding dogs", "Sighthounds", "Terriers", "Working dogs"], correct: 1 },
  { q: "About how much does an adult Italian Greyhound typically weigh?", a: ["2-3 lbs", "8-18 lbs", "40-50 lbs", "70+ lbs"], correct: 1 },
  { q: "Why do Italian Greyhounds often wear sweaters or coats?", a: ["Fashion only", "They have very little body fat and a thin coat, so they get cold easily", "They dislike their own fur", "To protect other dogs from them"], correct: 1 },
  { q: "What is a distinctive trait of a sighthound like the Italian Greyhound?", a: ["They hunt primarily by scent", "They hunt primarily by sight and speed", "They cannot run", "They are nocturnal"], correct: 1 },
  { q: "What are Italian Greyhound ears typically like?", a: ["Large and upright", "Small and folded back (rose ears)", "Cropped short", "Floppy and very long"], correct: 1 },
  { q: "Italian Greyhounds are closely related to which larger breed?", a: ["The Greyhound", "The Beagle", "The Poodle", "The Bulldog"], correct: 0 },
  { q: "What kind of tail does an Italian Greyhound have?", a: ["A short bobbed tail", "A long, thin, curved 'whip' tail", "No tail at all", "A thick bushy tail"], correct: 1 },
  { q: "Historically, Italian Greyhounds were bred mainly to be what?", a: ["Farm guard dogs", "Companion and lap dogs", "Sled dogs", "Water rescue dogs"], correct: 1 },
  { q: "What body shape is typical of an Italian Greyhound?", a: ["Deep chest with a tucked, narrow waist", "Long and low like a dachshund", "Stocky and barrel-chested", "Short-legged and round"], correct: 0 },
  { q: "About how long can Italian Greyhounds live?", a: ["3-5 years", "12-15 years", "25-30 years", "Under 2 years"], correct: 1 },
  { q: "What coat colors are common in Italian Greyhounds?", a: ["Only solid black", "Blue, fawn, red, cream, black, and pied patterns", "Only spotted like a Dalmatian", "Only white"], correct: 1 },
];

function pickQuestions(n) {
  const shuffled = [...BANK].sort(() => Math.random() - 0.5).slice(0, n);
  return shuffled.map((item) => {
    const order = item.a.map((text, i) => ({ text, isCorrect: i === item.correct }));
    order.sort(() => Math.random() - 0.5);
    return { q: item.q, options: order };
  });
}

export default function IggyTriviaGame({ onFinish, onClose, onPlayAgain }) {
  const [questions] = useState(() => pickQuestions(8));
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState(null);
  const [status, setStatus] = useState("playing");

  const current = questions[idx];

  const handlePick = (optIdx) => {
    if (picked !== null) return;
    setPicked(optIdx);
    if (current.options[optIdx].isCorrect) {
      setCorrectCount((c) => c + 1);
      sfx.collect();
    } else {
      sfx.hit();
    }
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
      if (correctCount === questions.length) sfx.success();
      else if (correctCount >= questions.length / 2) sfx.pop();
      else sfx.fail();
    }
  }, [status]); // eslint-disable-line

  const stars = correctCount === questions.length ? 3 : correctCount >= questions.length * 0.6 ? 2 : correctCount >= 2 ? 1 : 0;

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
        <GameResult
          stars={stars}
          title={correctCount === questions.length ? "Perfect score! 🎉" : `${correctCount}/${questions.length} correct`}
          onPlayAgain={onPlayAgain}
          onClose={onClose}
        />
      )}
    </div>
  );
}
