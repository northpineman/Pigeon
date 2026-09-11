"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Leaderboard({ myUsername }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("leaderboard")
        .select("*")
        .order("seeds", { ascending: false })
        .limit(20);
      if (!active) return;
      if (err) setError(err.message);
      else setRows(data);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20 }}>📊 Top Wallows</div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Ranked by seeds saved up</div>
      </div>
      {error && <div style={{ fontSize: 12, color: "#B23A3A", textAlign: "center" }}>Couldn't load leaderboard: {error}</div>}
      {!error && !rows && <div style={{ textAlign: "center", fontSize: 13 }}>Loading…</div>}
      {rows && rows.length === 0 && <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)" }}>No lofts yet — be the first!</div>}
      {rows &&
        rows.map((r, i) => (
          <a
            key={r.username + i}
            href={`/profile/${encodeURIComponent(r.username)}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: r.username === myUsername ? "#FFF3DC" : "var(--card)",
              borderRadius: 12,
              padding: "8px 12px",
              marginBottom: 6,
              fontWeight: r.username === myUsername ? 800 : 600,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ width: 24, textAlign: "center", fontSize: 13 }}>{i + 1}</div>
            <div style={{ flex: 1, fontSize: 13 }}>{r.username}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{r.bird_count} capybaras</div>
            <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 800 }}>🌾 {r.seeds}</div>
          </a>
        ))}
    </div>
  );
}
