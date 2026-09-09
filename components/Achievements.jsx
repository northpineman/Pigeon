"use client";

export default function Achievements({ catalog, unlockedKeys }) {
  const unlockedSet = new Set(unlockedKeys);
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Baloo 2'", fontSize: 20 }}>🏆 Achievements</div>
        <div style={{ fontSize: 12, color: "#8a7a72" }}>
          {unlockedKeys.length} / {catalog.length} unlocked
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {catalog.map((a) => {
          const got = unlockedSet.has(a.key);
          return (
            <div
              key={a.key}
              style={{
                background: got ? "#FFF3DC" : "#EFE7DA",
                borderRadius: 14,
                padding: "10px 8px",
                textAlign: "center",
                opacity: got ? 1 : 0.55,
                border: got ? "2px solid #FFB100" : "2px solid transparent",
              }}
            >
              <div style={{ fontSize: 26 }}>{a.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 12, marginTop: 4 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: "#8a7a72", marginTop: 2 }}>{a.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
