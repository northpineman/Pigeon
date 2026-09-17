"use client";

export default function GameResult({ stars, title, subtitle, onPlayAgain, onClose }) {
  return (
    <div style={{ marginTop: 14, textAlign: "center", animation: "resultPop 0.35s ease" }}>
      <div style={{ fontSize: 30, letterSpacing: 4, marginBottom: 4 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: i < stars ? "var(--gold)" : "#e4ddc9",
              transform: i < stars ? "scale(1)" : "scale(0.85)",
              transition: "transform 0.25s ease",
              transitionDelay: `${i * 0.1}s`,
            }}
          >
            ★
          </span>
        ))}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 2 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 12 }}>{subtitle}</div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
        {onPlayAgain && (
          <button className="btn btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>
        )}
        <button className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
      <style>{`
        @keyframes resultPop {
          0% { opacity: 0; transform: translateY(6px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
