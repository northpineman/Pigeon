"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import BirdSVG from "./BirdSVG";
import { StatBar, Modal } from "./ui";
import SeedBreakerGame from "./SeedBreakerGame";
import NestMatchGame from "./NestMatchGame";
import SkyDashGame from "./SkyDashGame";
import WindRiderGame from "./WindRiderGame";
import StormChaseGame from "./StormChaseGame";
import BloomBreakerGame from "./BloomBreakerGame";
import BirdTriviaGame from "./BirdTriviaGame";
import NestCatchGame from "./NestCatchGame";
import AdminPanel from "./AdminPanel";
import Achievements from "./Achievements";
import Leaderboard from "./Leaderboard";
import PushOptIn from "./PushOptIn";
import { SPECIES, TABS, DEFAULT_CONFIG, HOUR, LOFT_BASE_CAPACITY, CAPACITY_PER_UPGRADE, pickRandom, todayStr, yesterdayStr, pickRandomName, computeHunger, computeClean, computeHappiness, pendingIncome, adoptCost, upgradeCost, formatDuration, makeBird, defaultBirds, computeUnlockedKeys } from "@/lib/gameData";
import { theme } from "@/lib/theme";
import HeroScene from "./HeroScene";

export default function GameApp({ user, profile, onSignOut }) {
  const [loaded, setLoaded] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [now, setNow] = useState(Date.now());

  const [seeds, setSeeds] = useState(30);
  const [birds, setBirds] = useState([]);
  const [loftCapacity, setLoftCapacity] = useState(LOFT_BASE_CAPACITY);
  const [upgradesBought, setUpgradesBought] = useState(0);
  const [decorations, setDecorations] = useState([]);
  const [lastCollectAt, setLastCollectAt] = useState(Date.now());
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [streak, setStreak] = useState(0);
  const [flags, setFlags] = useState({});

  const [achievementCatalog, setAchievementCatalog] = useState([]);
  const [unlockedKeys, setUnlockedKeys] = useState([]);

  const [tab, setTab] = useState("loft");
  const [nestsSubtab, setNestsSubtab] = useState("adopt");
  const [eventsSubtab, setEventsSubtab] = useState("christmas");
  const [selectedBirdId, setSelectedBirdId] = useState(null);
  const [breedSelection, setBreedSelection] = useState([]);
  const [dailyReward, setDailyReward] = useState(null);
  const [toast, setToast] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [activeGame, setActiveGame] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);

  const dailyCheckedRef = useRef(false);
  const toastTimer = useRef(null);
  const saveTimer = useRef(null);

  const notify = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const allDecorItems = [...config.decorations, ...config.christmasItems, ...config.halloweenItems];
  const decorBonus = decorations.reduce((sum, key) => {
    const d = allDecorItems.find((x) => x.key === key);
    return sum + (d ? d.bonus : 0);
  }, 0);

  /* ---- initial load ---- */
  useEffect(() => {
    (async () => {
      const { data: cfgRow } = await supabase.from("game_config").select("config").eq("id", 1).single();
      setConfig(cfgRow?.config ? { ...DEFAULT_CONFIG, ...cfgRow.config } : DEFAULT_CONFIG);

      const { data: catalog } = await supabase.from("achievements").select("*").order("key");
      setAchievementCatalog(catalog || []);

      const { data: earned } = await supabase.from("player_achievements").select("achievement_key").eq("user_id", user.id);
      setUnlockedKeys((earned || []).map((r) => r.achievement_key));

      let { data: save, error: saveErr } = await supabase.from("player_saves").select("*").eq("user_id", user.id).single();
      if (saveErr || !save) {
        const t = Date.now();
        const starter = defaultBirds();
        const { data: inserted } = await supabase
          .from("player_saves")
          .insert({
            user_id: user.id,
            seeds: 30,
            birds: starter,
            loft_capacity: LOFT_BASE_CAPACITY,
            upgrades_bought: 0,
            decorations: [],
            last_collect_at: t,
            last_login_date: null,
            streak: 0,
            flags: {},
          })
          .select()
          .single();
        save = inserted;
      }
      if (save) {
        setSeeds(save.seeds ?? 30);
        setBirds(save.birds && save.birds.length ? save.birds : defaultBirds());
        setLoftCapacity(save.loft_capacity ?? LOFT_BASE_CAPACITY);
        setUpgradesBought(save.upgrades_bought ?? 0);
        setDecorations(save.decorations ?? []);
        setLastCollectAt(save.last_collect_at ?? Date.now());
        setLastLoginDate(save.last_login_date ?? null);
        setStreak(save.streak ?? 0);
        setFlags(save.flags ?? {});
      }
      setLoaded(true);
    })();
  }, [user.id]);

  /* ---- daily login check ---- */
  useEffect(() => {
    if (!loaded || dailyCheckedRef.current) return;
    dailyCheckedRef.current = true;
    const today = todayStr();
    if (lastLoginDate === today) return;
    const newStreak = lastLoginDate === yesterdayStr() ? streak + 1 : 1;
    const amount = 10 + newStreak * 5;
    setDailyReward({ amount, streak: newStreak });
  }, [loaded]); // eslint-disable-line

  const claimDaily = () => {
    if (!dailyReward) return;
    setSeeds((s) => s + dailyReward.amount);
    setStreak(dailyReward.streak);
    setLastLoginDate(todayStr());
    setDailyReward(null);
    notify(`+${dailyReward.amount} seeds for stopping by 🌾`);
  };

  /* ---- ticking clock + growth transitions ---- */
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      setBirds((prev) => {
        let changed = false;
        const next = prev.map((b) => {
          if (b.stage === "egg" && b.hatchAt && t >= b.hatchAt) {
            changed = true;
            return { ...b, stage: "baby", growAt: t + config.babyGrowHours * HOUR, lastFedAt: t, lastCleanedAt: t };
          }
          if (b.stage === "baby" && b.growAt && t >= b.growAt) {
            changed = true;
            return { ...b, stage: "adult" };
          }
          return b;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [config.babyGrowHours]);

  /* ---- debounced save to supabase ---- */
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from("player_saves")
        .update({
          seeds,
          birds,
          loft_capacity: loftCapacity,
          upgrades_bought: upgradesBought,
          decorations,
          last_collect_at: lastCollectAt,
          last_login_date: lastLoginDate,
          streak,
          flags,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .then(({ error }) => {
          if (error) console.error("save failed", error);
        });
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [seeds, birds, loftCapacity, upgradesBought, decorations, lastCollectAt, lastLoginDate, streak, flags, loaded, user.id]);

  /* ---- achievement checking ---- */
  useEffect(() => {
    if (!loaded || achievementCatalog.length === 0) return;
    const currentKeys = computeUnlockedKeys({ birds, decorations, seeds, streak, upgradesBought, flags });
    const newKeys = currentKeys.filter((k) => !unlockedKeys.includes(k));
    if (newKeys.length === 0) return;
    (async () => {
      const rows = newKeys.map((k) => ({ user_id: user.id, achievement_key: k }));
      const { error } = await supabase.from("player_achievements").insert(rows);
      if (!error) {
        setUnlockedKeys((prev) => [...prev, ...newKeys]);
        newKeys.forEach((k) => {
          const a = achievementCatalog.find((x) => x.key === k);
          if (a) notify(`🏆 Earned: ${a.name}`);
        });
      }
    })();
  }, [birds, decorations, seeds, streak, upgradesBought, flags, loaded, achievementCatalog]); // eslint-disable-line

  /* ---- handle return from Stripe checkout ---- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const purchase = params.get("purchase");
    if (!purchase) return;
    window.history.replaceState({}, "", window.location.pathname);
    if (purchase === "success") {
      notify("Payment received — seeds incoming 🌾");
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts += 1;
        const { data } = await supabase.from("player_saves").select("seeds").eq("user_id", user.id).single();
        if (data) setSeeds(data.seeds);
        if (attempts >= 5) clearInterval(poll);
      }, 1500);
    } else if (purchase === "cancelled") {
      notify("No charge — checkout cancelled");
    }
  }, []); // eslint-disable-line

  const usedNames = birds.map((b) => b.name).filter(Boolean);
  const pending = pendingIncome(birds, lastCollectAt, now, config, decorBonus);

  /* ---- actions ---- */
  const handleCollect = () => {
    if (pending <= 0) return;
    setSeeds((s) => s + pending);
    setLastCollectAt(now);
    notify(`+${pending} seeds gathered from the loft`);
  };

  const handleFeed = (id) => {
    if (seeds < config.feedCost) return notify("You're a bit short on seeds for feed");
    setBirds((prev) => prev.map((b) => (b.id === id ? { ...b, lastFedAt: Date.now() } : b)));
    setSeeds((s) => s - config.feedCost);
  };

  const handleClean = (id) => {
    setBirds((prev) => prev.map((b) => (b.id === id ? { ...b, lastCleanedAt: Date.now() } : b)));
  };

  const handleAdopt = (speciesKey) => {
    const cost = adoptCost(config, speciesKey, birds.length);
    if (birds.length >= loftCapacity) return notify("Your loft is full — upgrade for more room");
    if (seeds < cost) return notify("You're a bit short on seeds");
    const colorKey = pickRandom(SPECIES[speciesKey].colors);
    const t = Date.now();
    const bird = makeBird({ speciesKey, colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
    bird.name = pickRandomName(usedNames);
    setBirds((prev) => [...prev, bird]);
    setSeeds((s) => s - cost);
    notify(`${bird.name} has joined the loft! 🕊️`);
  };

  const handleAdoptSeasonal = (sb) => {
    if (birds.length >= loftCapacity) return notify("Your loft is full — upgrade for more room");
    if (seeds < sb.cost) return notify("You're a bit short on seeds");
    const t = Date.now();
    const bird = makeBird({ speciesKey: sb.speciesKey, colorKey: sb.colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
    bird.name = pickRandomName(usedNames);
    setBirds((prev) => [...prev, bird]);
    setSeeds((s) => s - sb.cost);
    setFlags((prev) => ({ ...prev, seasonalAdopted: true }));
    notify(`${bird.name} has joined the loft! 🕊️`);
  };

  const toggleBreedSelect = (id) => {
    setBreedSelection((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const canBreed = (() => {
    if (breedSelection.length !== 2) return false;
    const [a, b] = breedSelection.map((id) => birds.find((x) => x.id === id));
    if (!a || !b) return false;
    return a.gender !== b.gender;
  })();

  const handleBreed = () => {
    if (!canBreed) return;
    if (birds.length >= loftCapacity) return notify("Your loft is full — upgrade for more room");
    if (seeds < config.breedCost) return notify("You're a bit short on seeds");
    const t = Date.now();
    const [idA, idB] = breedSelection;
    const parentA = birds.find((b) => b.id === idA);
    const parentB = birds.find((b) => b.id === idB);
    const speciesKey = Math.random() < 0.5 ? parentA.speciesKey : parentB.speciesKey;
    let colorKey = Math.random() < 0.5 ? parentA.colorKey : parentB.colorKey;
    if (Math.random() < 0.08) colorKey = "iridescent";
    const egg = makeBird({ speciesKey, colorKey, stage: "egg", now: t, hatchAt: t + config.eggHatchHours * HOUR });
    egg.name = pickRandomName(usedNames);
    setBirds((prev) => prev.map((b) => (b.id === idA || b.id === idB ? { ...b, breedingUntil: t + config.eggHatchHours * HOUR } : b)).concat(egg));
    setSeeds((s) => s - config.breedCost);
    setBreedSelection([]);
    setFlags((prev) => ({ ...prev, bred: true }));
    notify("An egg is nesting in the loft 🥚");
  };

  const handleUpgradeLoft = () => {
    const cost = upgradeCost(config, upgradesBought);
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setLoftCapacity((c) => c + CAPACITY_PER_UPGRADE);
    setUpgradesBought((n) => n + 1);
    notify("Loft expanded — more room to nest");
  };

  const handleBuyDecor = (key, cost) => {
    if (decorations.includes(key)) return;
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setDecorations((prev) => [...prev, key]);
    notify("Placed in your loft");
  };

  const handleRename = (id) => {
    const name = renameDraft.trim().slice(0, 16);
    if (!name) return;
    setBirds((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
    setRenameDraft("");
  };

  const handleGameFinish = (amount, won, gameKey) => {
    if (amount > 0) {
      setSeeds((s) => s + amount);
      notify(`+${amount} seeds — nice playing!`);
    }
    if (won && gameKey) {
      setFlags((prev) => ({ ...prev, [`${gameKey}Won`]: true }));
    }
  };

  const handleBuyPack = async (packKey) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return notify("Please sign back in to continue");
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ packKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        notify(data.error || "Checkout couldn't start — try again");
      }
    } catch (e) {
      notify("Checkout couldn't start — try again");
    }
  };

  const handleAdminSave = async (newConfig) => {
    setAdminSaving(true);
    const { error } = await supabase.from("game_config").update({ config: newConfig, updated_at: new Date().toISOString() }).eq("id", 1);
    setAdminSaving(false);
    if (error) {
      notify("Couldn't save settings: " + error.message);
      return;
    }
    setConfig(newConfig);
    setAdminOpen(false);
    notify("Settings saved — live for everyone now");
  };

  const resetGame = () => {
    const t = Date.now();
    setSeeds(30);
    setBirds(defaultBirds());
    setLoftCapacity(LOFT_BASE_CAPACITY);
    setUpgradesBought(0);
    setDecorations([]);
    setLastCollectAt(t);
    setSelectedBirdId(null);
    setBreedSelection([]);
    notify("Fresh start — welcome back to day one");
  };

  const selectedBird = birds.find((b) => b.id === selectedBirdId) || null;

  if (!loaded) {
    return (
      <div className="site">
        <div className="loading-screen">
          <div className="em">🕊️</div>
          <div className="display" style={{ fontWeight: 700 }}>Waking the pigeons…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="brand">
          <h1>🕊️ PigeonsnDoves</h1>
          <span className="handle">@{profile.username}</span>
        </div>
        <div className="header-actions">
          <div className="pills">
            <div className="pill">🌾 {seeds}</div>
            <div className="pill">🔥 {streak}</div>
            <button className="pill" onClick={() => setShowAchievements(true)} title="Achievements">🏆</button>
            <button className="pill" onClick={() => setShowLeaderboard(true)} title="Leaderboard">📊</button>
            <button className="pill" onClick={() => setShowNotifications(true)} title="Notifications">🔔</button>
            {profile.is_admin && (
              <button className="pill" onClick={() => setAdminOpen(true)} title="Admin">🔧</button>
            )}
          </div>
          <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }} onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="hero-band">
        <HeroScene />
        <div className="hero-motifs">
          {theme.motifs.map((m, i) => (
            <span
              key={i}
              style={{
                left: `${8 + i * 20}%`,
                top: `${10 + (i % 3) * 22}%`,
                animationDelay: `${i * 1.3}s`,
              }}
            >
              {m}
            </span>
          ))}
        </div>
        <div className="hero-inner">
          <div className="income-strip">
            <div>
              <div className="label">Loft income</div>
              <div className="amount">+{pending} seeds</div>
            </div>
            <button className="btn btn-primary" onClick={handleCollect} disabled={pending <= 0}>
              Collect
            </button>
          </div>
        </div>
      </div>

      <nav className="site-nav">
        {TABS.map((t) => (
          <button
            key={t.key}
            className="tabbtn"
            style={{ color: tab === t.key ? t.color : undefined, background: tab === t.key ? t.color + "1a" : "transparent" }}
            onClick={() => setTab(t.key)}
          >
            <span className="icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
          {tab === "loft" && (
            <>
              <div className="section-title">
                Your birds ({birds.length}/{loftCapacity})
              </div>
              <div className="loft-grid">
                {birds.map((b) => {
                  const happiness = computeHappiness(b, now, config, decorBonus);
                  const busy = b.breedingUntil && b.breedingUntil > now;
                  return (
                    <div key={b.id} className={`bird-card${busy ? " busy" : ""}`} onClick={() => setSelectedBirdId(b.id)}>
                      <BirdSVG speciesKey={b.speciesKey} colorKey={b.colorKey} stage={b.stage} size={58} />
                      <div className="bname">{b.name || "?"}</div>
                      <div className="bspecies">
                        {b.stage === "egg" ? `hatches ${formatDuration(b.hatchAt - now)}` : b.stage === "baby" ? `growing ${formatDuration(b.growAt - now)}` : SPECIES[b.speciesKey].name}
                      </div>
                      {b.stage !== "egg" && <StatBar value={happiness} color="var(--sage)" />}
                    </div>
                  );
                })}
                {Array.from({ length: Math.max(0, loftCapacity - birds.length) }).map((_, i) => (
                  <div className="empty-slot" key={i}>An empty perch — adopt or breed a bird to fill it</div>
                ))}
              </div>
            </>
          )}

          {tab === "nests" && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button className={`btn segbtn ${nestsSubtab === "adopt" ? "btn-primary" : "btn-ghost"}`} onClick={() => setNestsSubtab("adopt")}>Adopt</button>
                <button className={`btn segbtn ${nestsSubtab === "breed" ? "btn-primary" : "btn-ghost"}`} onClick={() => setNestsSubtab("breed")}>Breed</button>
              </div>

              {nestsSubtab === "adopt" ? (
                <>
                  <div className="section-title">Adopt a bird</div>
                  <div className="item-grid">
                  {Object.entries(SPECIES).map(([key, sp]) => (
                    <div className="market-item" key={key}>
                      <BirdSVG speciesKey={key} colorKey={sp.colors[0]} stage="adult" size={46} />
                      <div className="info">
                        <div className="nm">{sp.name}</div>
                        <div className="sub">{adoptCost(config, key, birds.length)} seeds</div>
                      </div>
                      <button className="btn btn-primary" onClick={() => handleAdopt(key)} disabled={birds.length >= loftCapacity || seeds < adoptCost(config, key, birds.length)}>
                        Adopt
                      </button>
                    </div>
                  ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="section-title">Pair Up Two Birds to Nest</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 10 }}>
                    Pick one male ♂ and one female ♀ adult bird. Nesting costs {config.breedCost} seeds and takes {formatDuration(config.eggHatchHours * HOUR)}.
                  </div>
                  {birds.filter((b) => b.stage === "adult").map((b) => {
                    const busy = b.breedingUntil && b.breedingUntil > now;
                    const selected = breedSelection.includes(b.id);
                    return (
                      <div key={b.id} className={`breed-row${selected ? " selected" : ""}${busy ? " disabled" : ""}`} onClick={() => !busy && toggleBreedSelect(b.id)}>
                        <BirdSVG speciesKey={b.speciesKey} colorKey={b.colorKey} stage="adult" size={40} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 13 }}>
                            {b.name} <span className={`gender ${b.gender}`}>{b.gender === "m" ? "♂" : "♀"}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{busy ? `nesting ${formatDuration(b.breedingUntil - now)}` : SPECIES[b.speciesKey].name}</div>
                        </div>
                      </div>
                    );
                  })}
                  <button className="btn btn-secondary" style={{ width: "100%", marginTop: 8, padding: "12px" }} onClick={handleBreed} disabled={!canBreed || seeds < config.breedCost || birds.length >= loftCapacity}>
                    Start nesting ({config.breedCost} seeds)
                  </button>
                </>
              )}
            </>
          )}

          {tab === "events" && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button className={`btn segbtn ${eventsSubtab === "christmas" ? "btn-primary" : "btn-ghost"}`} onClick={() => setEventsSubtab("christmas")}>🎄 Christmas</button>
                <button className={`btn segbtn ${eventsSubtab === "halloween" ? "btn-primary" : "btn-ghost"}`} onClick={() => setEventsSubtab("halloween")}>🎃 Halloween</button>
              </div>

              <div className="section-title">Decorations</div>
              <div className="item-grid">
              {(eventsSubtab === "christmas" ? config.christmasItems : config.halloweenItems).map((d) => {
                const owned = decorations.includes(d.key);
                return (
                  <div className="decor-item" key={d.key}>
                    <div style={{ fontSize: 26 }}>{d.emoji}</div>
                    <div className="info">
                      <div className="nm">{d.name}</div>
                      <div className="sub">{owned ? `owned · +${d.bonus} happiness` : `${d.cost} seeds · +${d.bonus} happiness`}</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleBuyDecor(d.key, d.cost)} disabled={owned || seeds < d.cost}>
                      {owned ? "Placed" : "Buy"}
                    </button>
                  </div>
                );
              })}
              </div>

              <div className="section-title" style={{ marginTop: 16 }}>Exclusive birds</div>
              <div className="item-grid">
              {config.seasonalBirds.filter((b) => b.season === eventsSubtab).map((sb) => (
                <div className="market-item" key={sb.key}>
                  <BirdSVG speciesKey={sb.speciesKey} colorKey={sb.colorKey} stage="adult" size={46} />
                  <div className="info">
                    <div className="nm">{sb.name}</div>
                    <div className="sub">{sb.cost} seeds</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleAdoptSeasonal(sb)} disabled={birds.length >= loftCapacity || seeds < sb.cost}>
                    Adopt
                  </button>
                </div>
              ))}
              </div>
            </>
          )}

          {tab === "games" && (
            <>
              <div className="section-title">Games at the Roost</div>
              <div className="item-grid">
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🧱</div>
                <div className="info">
                  <div className="nm">Seed Breaker</div>
                  <div className="sub">Break bricks, earn seeds</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("breaker")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🪺</div>
                <div className="info">
                  <div className="nm">Nest Match</div>
                  <div className="sub">Memory matching game</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("match")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🐦</div>
                <div className="info">
                  <div className="nm">Sky Dash</div>
                  <div className="sub">Flap between the vines, endless</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("skydash")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🌬️</div>
                <div className="info">
                  <div className="nm">Wind Rider</div>
                  <div className="sub">Switch lanes, grab seeds, dodge storms</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("windrider")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>⛈️</div>
                <div className="info">
                  <div className="nm">Storm Chase</div>
                  <div className="sub">Outfly the storm, manage your boost</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("stormchase")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🌸</div>
                <div className="info">
                  <div className="nm">Bloom Breaker</div>
                  <div className="sub">Click matching groups to clear the board</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("bloombreaker")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🧠</div>
                <div className="info">
                  <div className="nm">Bird Trivia</div>
                  <div className="sub">8 questions about pigeons &amp; doves</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("trivia")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🪹</div>
                <div className="info">
                  <div className="nm">Nest Catch</div>
                  <div className="sub">Catch falling seeds before time runs out</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("nestcatch")}>Play</button>
              </div>
              </div>
            </>
          )}

          {tab === "shop" && (
            <>
              <div className="section-title">Expand the loft</div>
              <div className="decor-item">
                <div style={{ fontSize: 26 }}>🏗️</div>
                <div className="info">
                  <div className="nm">Add nest boxes</div>
                  <div className="sub">+{CAPACITY_PER_UPGRADE} capacity · {upgradeCost(config, upgradesBought)} seeds</div>
                </div>
                <button className="btn btn-primary" onClick={handleUpgradeLoft} disabled={seeds < upgradeCost(config, upgradesBought)}>
                  Build
                </button>
              </div>

              <div className="section-title" style={{ marginTop: 16 }}>Decorate (+happiness for everyone)</div>
              <div className="item-grid">
              {config.decorations.map((d) => {
                const owned = decorations.includes(d.key);
                return (
                  <div className="decor-item" key={d.key}>
                    <div style={{ fontSize: 26 }}>{d.emoji}</div>
                    <div className="info">
                      <div className="nm">{d.name}</div>
                      <div className="sub">{owned ? `owned · +${d.bonus} happiness` : `${d.cost} seeds · +${d.bonus} happiness`}</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleBuyDecor(d.key, d.cost)} disabled={owned || seeds < d.cost}>
                      {owned ? "Placed" : "Buy"}
                    </button>
                  </div>
                );
              })}
              </div>

              <div className="section-title" style={{ marginTop: 16 }}>Get more seeds</div>
              <div className="item-grid">
              {(config.seedPacks || []).map((p) => (
                <div className="market-item" key={p.key}>
                  <div style={{ fontSize: 28 }}>{p.emoji}</div>
                  <div className="info">
                    <div className="nm">{p.name}</div>
                    <div className="sub">{p.seeds} seeds · ${(p.priceCents / 100).toFixed(2)}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleBuyPack(p.key)}>
                    Buy
                  </button>
                </div>
              ))}
              </div>

              <button className="btn btn-ghost" style={{ width: "100%", marginTop: 18 }} onClick={resetGame}>
                Reset progress
              </button>
            </>
          )}
        </main>

        {toast && <div className="toast">{toast}</div>}

        {selectedBird && (
          <Modal onClose={() => { setSelectedBirdId(null); setRenameDraft(""); }}>
            <div style={{ textAlign: "center" }}>
              <BirdSVG speciesKey={selectedBird.speciesKey} colorKey={selectedBird.colorKey} stage={selectedBird.stage} size={100} />
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginTop: 4 }}>
                {selectedBird.name} <span className={`gender ${selectedBird.gender}`}>{selectedBird.gender === "m" ? "♂" : "♀"}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 8 }}>{SPECIES[selectedBird.speciesKey].name}</div>
            </div>

            {selectedBird.stage === "egg" ? (
              <div style={{ textAlign: "center", fontWeight: 700, padding: "10px 0" }}>Hatches in {formatDuration(selectedBird.hatchAt - now)}</div>
            ) : (
              <>
                <div className="stat-row">
                  <span style={{ width: 78 }}>Hunger</span>
                  <StatBar value={computeHunger(selectedBird, now, config)} color="#D9A441" />
                </div>
                <div className="stat-row">
                  <span style={{ width: 78 }}>Clean</span>
                  <StatBar value={computeClean(selectedBird, now, config)} color="#7FA6C9" />
                </div>
                <div className="stat-row">
                  <span style={{ width: 78 }}>Happiness</span>
                  <StatBar value={computeHappiness(selectedBird, now, config, decorBonus)} color="var(--sage)" />
                </div>
                {selectedBird.stage === "baby" && (
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", margin: "8px 0" }}>Grows up in {formatDuration(selectedBird.growAt - now)}</div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleFeed(selectedBird.id)} disabled={seeds < config.feedCost}>
                    Feed ({config.feedCost}🌾)
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleClean(selectedBird.id)}>
                    Clean nest
                  </button>
                </div>
              </>
            )}

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Rename</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" placeholder={selectedBird.name} value={renameDraft} onChange={(e) => setRenameDraft(e.target.value)} />
                <button className="btn btn-ghost" onClick={() => handleRename(selectedBird.id)}>Save</button>
              </div>
            </div>
          </Modal>
        )}

        {dailyReward && (
          <div className="modal-backdrop">
            <div className="modal-sheet centered" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>🔥</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, margin: "6px 0" }}>Day {dailyReward.streak} streak!</div>
              <div style={{ fontSize: 14, marginBottom: 14, color: "var(--ink-soft)" }}>Welcome back to the loft. Here's a little something for stopping by.</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--gold)", marginBottom: 14 }}>+{dailyReward.amount} 🌾</div>
              <button className="btn btn-primary" style={{ width: "100%", padding: 12 }} onClick={claimDaily}>Claim</button>
            </div>
          </div>
        )}

        {activeGame === "breaker" && (
          <Modal onClose={() => setActiveGame(null)}>
            <SeedBreakerGame onFinish={(amount, won) => handleGameFinish(amount, won, "breaker")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "match" && (
          <Modal onClose={() => setActiveGame(null)}>
            <NestMatchGame onFinish={(amount, won) => handleGameFinish(amount, won, "match")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "skydash" && (
          <Modal onClose={() => setActiveGame(null)}>
            <SkyDashGame onFinish={(amount, won) => handleGameFinish(amount, won, "skydash")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "windrider" && (
          <Modal onClose={() => setActiveGame(null)}>
            <WindRiderGame onFinish={(amount, won) => handleGameFinish(amount, won, "windrider")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "stormchase" && (
          <Modal onClose={() => setActiveGame(null)}>
            <StormChaseGame onFinish={(amount, won) => handleGameFinish(amount, won, "stormchase")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "bloombreaker" && (
          <Modal onClose={() => setActiveGame(null)}>
            <BloomBreakerGame onFinish={(amount, won) => handleGameFinish(amount, won, "bloombreaker")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "trivia" && (
          <Modal onClose={() => setActiveGame(null)}>
            <BirdTriviaGame onFinish={(amount, won) => handleGameFinish(amount, won, "trivia")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}
        {activeGame === "nestcatch" && (
          <Modal onClose={() => setActiveGame(null)}>
            <NestCatchGame onFinish={(amount, won) => handleGameFinish(amount, won, "nestcatch")} onClose={() => setActiveGame(null)} />
          </Modal>
        )}

        {showAchievements && (
          <Modal onClose={() => setShowAchievements(false)}>
            <Achievements catalog={achievementCatalog} unlockedKeys={unlockedKeys} />
          </Modal>
        )}
        {showLeaderboard && (
          <Modal onClose={() => setShowLeaderboard(false)}>
            <Leaderboard myUsername={profile.username} />
          </Modal>
        )}
        {showNotifications && (
          <Modal onClose={() => setShowNotifications(false)}>
            <PushOptIn userId={user.id} />
          </Modal>
        )}

        {adminOpen && (
          <AdminPanel config={config} saving={adminSaving} onClose={() => setAdminOpen(false)} onSave={handleAdminSave} />
        )}
    </div>
  );
}
