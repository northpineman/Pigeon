"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PetArt from "@/components/PetArt";

export default function ProfilePage() {
  const params = useParams();
  const username = decodeURIComponent(params.username || "");

  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [{ data: p, error: pErr }, { data: a }] = await Promise.all([
        supabase.from("public_profiles").select("*").eq("username", username).maybeSingle(),
        supabase.from("public_achievements").select("*").eq("username", username).order("earned_at", { ascending: false }),
      ]);
      if (!active) return;
      if (pErr || !p) {
        setError("Couldn't find a kennel for that username.");
        return;
      }
      setProfile(p);
      setAchievements(a || []);
    })();
    return () => {
      active = false;
    };
  }, [username]);

  return (
    <div className="site">
      <header className="site-header">
        <div className="brand">
          <h1>🐕 Iggy Meadow</h1>
        </div>
        <a href="/" className="btn btn-ghost" style={{ fontSize: 12, padding: "7px 12px" }}>
          ← Back to the game
        </a>
      </header>

      <main className="content" style={{ marginTop: 24 }}>
        {error && <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>{error}</div>}

        {!error && !profile && <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>Loading…</div>}

        {profile && (
          <>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26 }}>{profile.username}'s Kennel</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>
                Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </div>
            </div>

            <div className="item-grid" style={{ marginBottom: 26 }}>
              <div className="market-item">
                <div style={{ fontSize: 20 }}>🔥</div>
                <div className="info">
                  <div className="nm">{profile.streak}-day streak</div>
                  <div className="sub">Consecutive login days</div>
                </div>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 20 }}>🐹</div>
                <div className="info">
                  <div className="nm">{(profile.birds || []).length} Iggies</div>
                  <div className="sub">Kennel capacity: {profile.loft_capacity}</div>
                </div>
              </div>
              {profile.bloombreaker_best > 0 && (
                <div className="market-item">
                  <div style={{ fontSize: 20 }}>🌸</div>
                  <div className="info">
                    <div className="nm">Best score: {profile.bloombreaker_best}</div>
                    <div className="sub">Bloom Breaker personal best</div>
                  </div>
                </div>
              )}
            </div>

            <div className="section-title">The Iggies</div>
            {(profile.birds || []).length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>No Iggies here yet.</div>
            ) : (
              <div className="loft-grid" style={{ marginBottom: 26 }}>
                {profile.birds.map((b) => (
                  <div className="bird-card" key={b.id}>
                    <PetArt speciesKey={b.speciesKey} colorKey={b.colorKey} stage={b.stage === "egg" ? "egg" : "adult"} size={58} />
                    <div className="bname">{b.name || "Unnamed"}</div>
                    <div className="bspecies">{b.gender === "m" ? "♂" : "♀"}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="section-title">Achievements ({achievements ? achievements.length : 0})</div>
            {achievements && achievements.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>No achievements earned yet.</div>
            )}
            {achievements && achievements.length > 0 && (
              <div className="item-grid">
                {achievements.map((a) => (
                  <div className="market-item" key={a.key}>
                    <div style={{ fontSize: 22 }}>{a.emoji}</div>
                    <div className="info">
                      <div className="nm">{a.name}</div>
                      <div className="sub">{a.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
