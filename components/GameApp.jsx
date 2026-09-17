"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import PetArt from "./PetArt";
import { StatBar, Modal } from "./ui";
import SeedBreakerGame from "./SeedBreakerGame";
import NestMatchGame from "./NestMatchGame";
import SkyDashGame from "./SkyDashGame";
import WindRiderGame from "./WindRiderGame";
import StormChaseGame from "./StormChaseGame";
import BloomBreakerGame from "./BloomBreakerGame";
import IggyTriviaGame from "./IggyTriviaGame";
import NestCatchGame from "./NestCatchGame";
import AdminPanel from "./AdminPanel";
import Achievements from "./Achievements";
import Leaderboard from "./Leaderboard";
import PushOptIn from "./PushOptIn";
import { SPECIES, TABS, DEFAULT_CONFIG, HOUR, LOFT_BASE_CAPACITY, CAPACITY_PER_UPGRADE, pickRandom, todayStr, yesterdayStr, pickRandomName, computeHunger, computeClean, computeHappiness, pendingIncome, adoptCost, upgradeCost, formatDuration, makeBird, defaultBirds, computeUnlockedKeys, ACHIEVEMENT_REWARDS, BOTS, getLife, getMaxLife, getStrength, getWisdom } from "@/lib/gameData";
import { theme } from "@/lib/theme";
import HeroScene from "./HeroScene";
import WorldMap from "./WorldMap";
import HarvestWheel from "./HarvestWheel";
import Explore from "./Explore";
import { sfx } from "@/lib/sfx";
import { OUTFITS, getOutfit, normalizeWardrobeSlots } from "@/lib/looks";
import Wardrobe from "./Wardrobe";
import { createGenetics, normalizeGenetics, geneticRarity, traitLabel, traitEmoji } from "@/lib/genetics";

export default function GameApp({ user, profile, onSignOut }) {
  const [loaded, setLoaded] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [now, setNow] = useState(Date.now());

  const [seeds, setSeeds] = useState(30);
  const [pets, setPets] = useState([]);
  const [loftCapacity, setLoftCapacity] = useState(LOFT_BASE_CAPACITY);
  const [upgradesBought, setUpgradesBought] = useState(0);
  const [decorations, setDecorations] = useState([]);
  const [lastCollectAt, setLastCollectAt] = useState(Date.now());
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [streak, setStreak] = useState(0);
  const [flags, setFlags] = useState({});

  const [achievementCatalog, setAchievementCatalog] = useState([]);
  const [unlockedKeys, setUnlockedKeys] = useState([]);

  const [tab, setTab] = useState("kennel");
  const [kennelSearch, setKennelSearch] = useState("");
  const [kennelSort, setKennelSort] = useState("name");
  const [nestsSubtab, setNestsSubtab] = useState("adopt");
  const [eventsSubtab, setEventsSubtab] = useState("map");
  const [selectedBirdId, setSelectedBirdId] = useState(null);
  const [breedSelection, setBreedSelection] = useState([]);
  const [dailyReward, setDailyReward] = useState(null);
  const [toast, setToast] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [profileTab, setProfileTab] = useState("about");
  const [shopSubtab, setShopSubtab] = useState("shop");
  const [activeGame, setActiveGame] = useState(null);
  const [gameRound, setGameRound] = useState(0);
  const restartActiveGame = () => setGameRound((r) => r + 1);
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
        setPets(save.birds && save.birds.length ? save.birds : defaultBirds());
        setLoftCapacity(save.loft_capacity ?? LOFT_BASE_CAPACITY);
        setUpgradesBought(save.upgrades_bought ?? 0);
        setDecorations(save.decorations ?? []);
        setLastCollectAt(save.last_collect_at ?? Date.now());
        setLastLoginDate(save.last_login_date ?? null);
        setStreak(save.streak ?? 0);
        const loadedFlags = save.flags ?? {};
        const ownedOutfits = Array.from(new Set(["none", "ribbon", ...(loadedFlags.wardrobeInventory || []), ...(save.birds || []).map((b) => b.outfitKey).filter(Boolean)]));
        setFlags({ ...loadedFlags, wardrobeInventory: ownedOutfits });
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
      setPets((prev) => {
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
          if (b.breedingUntil && t >= b.breedingUntil) {
            changed = true;
            return { ...b, breedingUntil: null };
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
          birds: pets,
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
  }, [seeds, pets, loftCapacity, upgradesBought, decorations, lastCollectAt, lastLoginDate, streak, flags, loaded, user.id]);

  /* ---- achievement checking ---- */
  useEffect(() => {
    if (!loaded || achievementCatalog.length === 0) return;
    const currentKeys = computeUnlockedKeys({ birds: pets, decorations, seeds, streak, upgradesBought, flags });
    const newKeys = currentKeys.filter((k) => !unlockedKeys.includes(k));
    if (newKeys.length === 0) return;
    (async () => {
      const rows = newKeys.map((k) => ({ user_id: user.id, achievement_key: k }));
      const { error } = await supabase.from("player_achievements").insert(rows);
      if (!error) {
        setUnlockedKeys((prev) => [...prev, ...newKeys]);
        let bonus = 0;
        newKeys.forEach((k) => {
          const a = achievementCatalog.find((x) => x.key === k);
          const reward = ACHIEVEMENT_REWARDS[k];
          bonus += reward || 0;
          if (a) notify(reward ? `🏆 Earned: ${a.name} (+${reward} seeds)` : `🏆 Earned: ${a.name}`);
        });
        if (bonus > 0) setSeeds((s) => s + bonus);
      }
    })();
  }, [pets, decorations, seeds, streak, upgradesBought, flags, loaded, achievementCatalog]); // eslint-disable-line

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

  const usedNames = pets.map((b) => b.name).filter(Boolean);
  const kennelPets = [...pets]
    .filter((p) => !kennelSearch.trim() || (p.name || "").toLowerCase().includes(kennelSearch.trim().toLowerCase()) || (SPECIES[p.speciesKey]?.name || "").toLowerCase().includes(kennelSearch.trim().toLowerCase()))
    .sort((a, b) => {
      if (kennelSort === "stage") return ({ egg: 0, baby: 1, adult: 2 }[a.stage] ?? 9) - ({ egg: 0, baby: 1, adult: 2 }[b.stage] ?? 9);
      if (kennelSort === "happiness") return computeHappiness(b, now, config, decorBonus) - computeHappiness(a, now, config, decorBonus);
      return (a.name || "").localeCompare(b.name || "");
    });
  const pending = pendingIncome(pets, lastCollectAt, now, config, decorBonus);

  /* ---- actions ---- */
  const handleCollect = () => {
    if (pending <= 0) return;
    setSeeds((s) => s + pending);
    setLastCollectAt(now);
    notify(`+${pending} seeds gathered from the kennel`);
  };

  const handleFeed = (id) => {
    if (seeds < config.feedCost) return notify("You're a bit short on seeds for feed");
    setPets((prev) => prev.map((b) => (b.id === id ? { ...b, lastFedAt: Date.now(), life: Math.min(getMaxLife(b), getLife(b) + 30) } : b)));
    setSeeds((s) => s - config.feedCost);
  };

  const handleClean = (id) => {
    setPets((prev) => prev.map((b) => (b.id === id ? { ...b, lastCleanedAt: Date.now() } : b)));
  };

  const handleAdopt = (speciesKey) => {
    const cost = adoptCost(config, speciesKey, pets.length);
    if (pets.length >= loftCapacity) return notify("Your kennel is full — upgrade for more room");
    if (seeds < cost) return notify("You're a bit short on seeds");
    const colorKey = pickRandom(SPECIES[speciesKey].colors);
    const t = Date.now();
    const bird = makeBird({ speciesKey, colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
    bird.name = pickRandomName(usedNames);
    setPets((prev) => [...prev, bird]);
    setSeeds((s) => s - cost);
    notify(`${bird.name} has joined the kennel! 🐕`);
  };

  const handleAdoptSeasonal = (sb) => {
    if (pets.length >= loftCapacity) return notify("Your kennel is full — upgrade for more room");
    if (seeds < sb.cost) return notify("You're a bit short on seeds");
    const t = Date.now();
    const bird = makeBird({ speciesKey: sb.speciesKey, colorKey: sb.colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
    bird.name = pickRandomName(usedNames);
    setPets((prev) => [...prev, bird]);
    setSeeds((s) => s - sb.cost);
    setFlags((prev) => ({ ...prev, seasonalAdopted: true }));
    notify(`${bird.name} has joined the kennel! 🐕`);
  };

  const halloweenSeasonalIggies = config.seasonalIggies.filter((b) => b.season === "halloween");
  const findSeasonalIggy = (key) => halloweenSeasonalIggies.find((b) => b.key === key);
  const halloweenWheelPrizes = [
    { key: "seeds10", label: "10 seeds", emoji: "🌾", weight: 25, rarity: "common", kind: "seeds", amount: 10 },
    { key: "seeds25", label: "25 seeds", emoji: "🌾", weight: 20, rarity: "common", kind: "seeds", amount: 25 },
    { key: "decor", label: "Random Halloween decoration", emoji: "🎃", weight: 15, rarity: "uncommon", kind: "decor" },
    { key: "raven", label: "Raven Iggy", emoji: "🐦", weight: 12, rarity: "uncommon", kind: "iggy", sb: findSeasonalIggy("sb-raven") },
    { key: "jack", label: "Jack-o'-Iggy", emoji: "🎃", weight: 12, rarity: "uncommon", kind: "iggy", sb: findSeasonalIggy("sb-jack") },
    { key: "candycorn", label: "Candy Corn Iggy", emoji: "🍬", weight: 12, rarity: "uncommon", kind: "iggy", sb: findSeasonalIggy("sb-candycorn") },
    { key: "ghost", label: "Ghost Iggy", emoji: "👻", weight: 4, rarity: "rare", kind: "iggy", sb: findSeasonalIggy("sb-ghost") },
  ].filter((p) => p.kind !== "iggy" || p.sb);

  const handleWheelResult = (prize, cost) => {
    setSeeds((s) => s - cost);

    if (prize.kind === "seeds") {
      setSeeds((s) => s + prize.amount);
      notify(`+${prize.amount} seeds from the wheel! 🌾`);
      return;
    }

    if (prize.kind === "decor") {
      const unowned = config.halloweenItems.filter((d) => !decorations.includes(d.key));
      if (unowned.length === 0) {
        setSeeds((s) => s + 30);
        notify("Already have every decoration — +30 seeds instead!");
        return;
      }
      const d = unowned[Math.floor(Math.random() * unowned.length)];
      setDecorations((prev) => [...prev, d.key]);
      notify(`Won a decoration: ${d.name}! 🎃`);
      return;
    }

    if (prize.kind === "iggy") {
      if (pets.length >= loftCapacity) {
        setSeeds((s) => s + 50);
        notify("Your kennel is full — +50 seeds instead!");
        return;
      }
      const t = Date.now();
      const bird = makeBird({ speciesKey: prize.sb.speciesKey, colorKey: prize.sb.colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
      bird.name = pickRandomName(usedNames);
      setPets((prev) => [...prev, bird]);
      setFlags((prev) => ({ ...prev, seasonalAdopted: true }));
      notify(`${bird.name} the ${prize.sb.name} has joined the kennel! 🐕`);
    }
  };

  const [explorerId, setExplorerId] = useState(null);
  const potions = flags.potions || 0;
  const books = flags.books || 0;
  const exploreStage = flags.exploreStage || 0;

  const handleBuyTrainingItem = (item) => {
    if (seeds < item.cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - item.cost);
    const key = item.stat === "strength" ? "potions" : "books";
    setFlags((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    notify(`Bought a ${item.name}! 🎒`);
  };

  const handleUseTrainingItem = (petId, stat) => {
    const key = stat === "strength" ? "potions" : "books";
    if ((flags[key] || 0) <= 0) return;
    setFlags((prev) => ({ ...prev, [key]: prev[key] - 1 }));
    setPets((prev) => prev.map((b) => (b.id === petId ? { ...b, [stat]: (stat === "strength" ? getStrength(b) : getWisdom(b)) + 2 } : b)));
    notify(stat === "strength" ? "+2 Strength! 💪" : "+2 Wisdom! 📖");
  };

  const handleBattle = (petId) => {
    const bot = BOTS[Math.min(exploreStage, BOTS.length - 1)];
    const pet = pets.find((b) => b.id === petId);
    if (!pet || getLife(pet) <= 0) return { won: false, message: "Too weak to battle right now." };

    const petPower = getStrength(pet) * 2 + getWisdom(pet) + Math.random() * 10;
    const botPower = bot.power + Math.random() * 10;
    const won = petPower >= botPower;

    const damage = won
      ? Math.max(3, Math.round(5 + Math.random() * 10 - getWisdom(pet) / 2))
      : Math.max(8, Math.round(15 + Math.random() * 15 - getWisdom(pet) / 3));

    const newLife = Math.max(0, getLife(pet) - damage);
    setPets((prev) => prev.map((b) => (b.id === petId ? { ...b, life: newLife } : b)));

    if (won) {
      setSeeds((s) => s + bot.seedReward);
      let itemMsg = "";
      if (Math.random() < bot.itemChance) {
        const stat = Math.random() < 0.5 ? "potions" : "books";
        setFlags((prev) => ({ ...prev, [stat]: (prev[stat] || 0) + 1, exploreStage: Math.min(BOTS.length, exploreStage + 1) }));
        itemMsg = stat === "potions" ? " Found a Strength Potion!" : " Found a Wisdom Book!";
      } else {
        setFlags((prev) => ({ ...prev, exploreStage: Math.min(BOTS.length, exploreStage + 1) }));
      }
      sfx.success();
      return { won: true, message: `Beat ${bot.name}! +${bot.seedReward} seeds.${itemMsg} (-${damage} life)` };
    } else {
      sfx.fail();
      return { won: false, message: `${bot.name} was too strong this time. (-${damage} life)` };
    }
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
    const [a, b] = breedSelection.map((id) => pets.find((x) => x.id === id));
    if (!a || !b) return false;
    return a.stage === "adult" && b.stage === "adult" && a.gender !== b.gender && !(a.breedingUntil && a.breedingUntil > Date.now()) && !(b.breedingUntil && b.breedingUntil > Date.now());
  })();

  const handleBreed = () => {
    if (!canBreed) return;
    if (pets.length >= loftCapacity) return notify("Your kennel is full — upgrade for more room");
    if (seeds < config.breedCost) return notify("You're a bit short on seeds");
    const t = Date.now();
    const [idA, idB] = breedSelection;
    const parentA = pets.find((b) => b.id === idA);
    const parentB = pets.find((b) => b.id === idB);
    const speciesKey = Math.random() < 0.5 ? parentA.speciesKey : parentB.speciesKey;
    let colorKey = Math.random() < 0.5 ? parentA.colorKey : parentB.colorKey;
    if (Math.random() < 0.08) colorKey = "iridescent";
    const egg = makeBird({ speciesKey, colorKey, stage: "egg", now: t, hatchAt: t + config.eggHatchHours * HOUR });
    egg.name = pickRandomName(usedNames);
    egg.genetics = createGenetics({ parentA, parentB, speciesKey, colorKey });
    egg.lineage = { motherId: parentA.gender === "f" ? parentA.id : parentB.id, fatherId: parentA.gender === "m" ? parentA.id : parentB.id, bredAt: t };
    setPets((prev) => prev.map((b) => (b.id === idA || b.id === idB ? { ...b, breedingUntil: t + config.eggHatchHours * HOUR } : b)).concat(egg));
    setSeeds((s) => s - config.breedCost);
    setBreedSelection([]);
    setFlags((prev) => ({ ...prev, bred: true }));
    notify("A pup is on the way! 🐕");
  };

  const handleUpgradeLoft = () => {
    const cost = upgradeCost(config, upgradesBought);
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setLoftCapacity((c) => c + CAPACITY_PER_UPGRADE);
    setUpgradesBought((n) => n + 1);
    notify("Kennel expanded — more room for Iggies");
  };

  const handleBuyDecor = (key, cost) => {
    if (decorations.includes(key)) return;
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setDecorations((prev) => [...prev, key]);
    notify("Placed in your kennel");
  };

  const handleEquipOutfit = (petId, outfitKey, explicitSlot = null) => {
    const outfit = getOutfit(outfitKey);
    if (outfitKey !== "none" && outfit.key !== outfitKey) return;
    const owned = flags.wardrobeInventory || ["none", "ribbon"];
    if (outfitKey !== "none" && !owned.includes(outfitKey)) return notify("That wardrobe piece isn't in your closet yet");
    setPets((prev) => prev.map((b) => {
      if (b.id !== petId) return b;
      const slot = explicitSlot || outfit.slot;
      const wardrobeSlots = { ...normalizeWardrobeSlots(b) };
      if (outfitKey === "none") delete wardrobeSlots[slot];
      else wardrobeSlots[slot] = outfitKey;
      const first = Object.values(wardrobeSlots).find(Boolean) || null;
      return { ...b, wardrobeSlots, outfitKey: first };
    }));
    notify(outfitKey === "none" ? "Wardrobe piece removed ✨" : `${outfit.name} equipped ${outfit.emoji}`);
  };

  const handleUnlockWardrobe = (outfitKey) => {
    const outfit = OUTFITS[outfitKey];
    if (!outfit || outfitKey === "none") return;
    if ((flags.wardrobeInventory || []).includes(outfitKey)) return notify("You already have that wardrobe piece");
    const cost = outfit.cost ?? 50;
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setFlags((prev) => ({ ...prev, wardrobeInventory: Array.from(new Set([...(prev.wardrobeInventory || ["none", "ribbon"]), outfitKey])) }));
    notify(`${outfit.name} added to your closet ${outfit.emoji}`);
  };

  const handleRename = (id) => {
    const name = renameDraft.trim().slice(0, 16);
    if (!name) return;
    setPets((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
    setRenameDraft("");
  };

  const handleGameFinish = (amount, won, gameKey, rawScore) => {
    if (amount > 0) {
      setSeeds((s) => s + amount);
      notify(`+${amount} seeds — nice playing!`);
    }
    if (won && gameKey) {
      setFlags((prev) => ({ ...prev, [`${gameKey}Won`]: true }));
    }
    if (typeof rawScore === "number" && gameKey) {
      setFlags((prev) => ({ ...prev, [`${gameKey}Best`]: Math.max(prev[`${gameKey}Best`] || 0, rawScore) }));
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
    setPets(defaultBirds());
    setLoftCapacity(LOFT_BASE_CAPACITY);
    setUpgradesBought(0);
    setDecorations([]);
    setFlags({ wardrobeInventory: ["none", "ribbon"] });
    setLastCollectAt(t);
    setSelectedBirdId(null);
    setBreedSelection([]);
    notify("Fresh start — welcome back to day one");
  };

  const selectedBird = pets.find((b) => b.id === selectedBirdId) || null;

  if (!loaded) {
    return (
      <div className="site">
        <div className="loading-screen">
          <div className="em">🐹</div>
          <div className="display" style={{ fontWeight: 700 }}>Welcome to Iggy Meadow…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="brand">
          <h1>🐕 Iggy Meadow</h1>
          <span className="handle">@{profile.username}</span>
        </div>
        <div className="header-actions">
          <div className="pills">
            <div className="pill">🌾 {seeds}</div>
            <div className="pill">🔥 {streak}</div>
            <a className="pill" href={`/profile/${encodeURIComponent(profile.username)}`} title="My Profile" style={{ textDecoration: "none" }}>👤</a>
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
              <div className="label">Kennel income</div>
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

      <div className="world-links" aria-label="Iggy Meadow shortcuts">
        <button onClick={() => setTab("kennel")} className={tab === "kennel" ? "active" : ""}>🏡 Kennel</button>
        <button onClick={() => { setTab("nests"); setNestsSubtab("adopt"); }} className={tab === "nests" && nestsSubtab === "adopt" ? "active" : ""}>🐕 Adopt</button>
        <button onClick={() => { setTab("nests"); setNestsSubtab("breed"); }} className={tab === "nests" && nestsSubtab === "breed" ? "active" : ""}>🧬 Breeding</button>
        <button onClick={() => setTab("events")} className={tab === "events" ? "active" : ""}>🌸 Events</button>
        <button onClick={() => setTab("explore")} className={tab === "explore" ? "active" : ""}>🗺️ Explore</button>
        <button onClick={() => setTab("games")} className={tab === "games" ? "active" : ""}>🎮 Games</button>
        <button onClick={() => { setTab("shop"); setShopSubtab("shop"); }} className={tab === "shop" && shopSubtab === "shop" ? "active" : ""}>🛍️ Shops</button>
        <button onClick={() => { setTab("shop"); setShopSubtab("wardrobe"); }} className={tab === "shop" && shopSubtab === "wardrobe" ? "active" : ""}>👗 Closet</button>
      </div>

      <main className="content">
          {tab === "kennel" && (
            <>
              <div className="kennel-toolbar">
                <div>
                  <div className="section-title" style={{ marginBottom: 3 }}>My Iggies</div>
                  <div className="kennel-count">{pets.length} of {loftCapacity} kennel spaces filled</div>
                </div>
                <div className="kennel-tools">
                  <input aria-label="Search Iggies" value={kennelSearch} onChange={(e) => setKennelSearch(e.target.value)} placeholder="Search your Iggies…" />
                  <select aria-label="Sort Iggies" value={kennelSort} onChange={(e) => setKennelSort(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="stage">Life stage</option>
                    <option value="happiness">Happiness</option>
                  </select>
                </div>
              </div>
              {pets.length === 0 ? (
                <div className="kennel-empty">
                  <div className="kennel-empty-art">🐕</div>
                  <h3>Your kennel is waiting</h3>
                  <p>Adopt your first Italian Greyhound to begin your collection.</p>
                  <button className="btn btn-primary" onClick={() => { setTab("nests"); setNestsSubtab("adopt"); }}>Adopt an Iggy</button>
                </div>
              ) : kennelPets.length === 0 ? (
                <div className="kennel-empty"><h3>No Iggies found</h3><p>Try a different name or clear the search.</p></div>
              ) : (
                <div className="loft-grid">
                  {kennelPets.map((b) => {
                    const happiness = computeHappiness(b, now, config, decorBonus);
                    const busy = b.breedingUntil && b.breedingUntil > now;
                    return (
                      <button type="button" key={b.id} className={`pet-card${busy ? " busy" : ""}`} onClick={() => { setSelectedBirdId(b.id); setProfileTab("about"); }}>
                        <PetArt speciesKey={b.speciesKey} colorKey={b.colorKey} stage={b.stage} outfitKey={b.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(b)} size={74} />
                        <div className="bname">{b.name || "Unnamed Iggy"}</div>
                        <div className="bspecies">
                          {b.stage === "egg" ? `Hatches ${formatDuration(b.hatchAt - now)}` : b.stage === "baby" ? `Puppy · grows ${formatDuration(b.growAt - now)}` : "Italian Greyhound"}
                        </div>
                        {b.stage !== "egg" && <StatBar value={happiness} color="var(--sage)" />}
                        {b.outfitKey && b.outfitKey !== "none" && <div className="pet-card-tag">✨ {b.outfitKey}</div>}
                      </button>
                    );
                  })}
                  {Array.from({ length: Math.max(0, loftCapacity - pets.length) }).map((_, i) => (
                    <button type="button" className="empty-slot" key={i} onClick={() => { setTab("nests"); setNestsSubtab("adopt"); }}>+ Empty kennel space</button>
                  ))}
                </div>
              )}
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
                  <div className="section-title">Adopt an Iggy</div>
                  <div className="item-grid">
                  {Object.entries(SPECIES).map(([key, sp]) => (
                    <div className="market-item" key={key}>
                      <PetArt speciesKey={key} colorKey={sp.colors[0]} stage="adult" size={46} />
                      <div className="info">
                        <div className="nm">{sp.name}</div>
                        <div className="sub">{adoptCost(config, key, pets.length)} seeds</div>
                      </div>
                      <button className="btn btn-primary" onClick={() => handleAdopt(key)} disabled={pets.length >= loftCapacity || seeds < adoptCost(config, key, pets.length)}>
                        Adopt
                      </button>
                    </div>
                  ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="section-title">Find a Match for Two Iggies</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 10 }}>
                    Pick one male ♂ and one female ♀ adult Iggy. Nesting costs {config.breedCost} seeds and takes {formatDuration(config.eggHatchHours * HOUR)}.
                  </div>
                  {pets.filter((b) => b.stage === "adult").map((b) => {
                    const busy = b.breedingUntil && b.breedingUntil > now;
                    const selected = breedSelection.includes(b.id);
                    return (
                      <div key={b.id} className={`breed-row${selected ? " selected" : ""}${busy ? " disabled" : ""}`} onClick={() => !busy && toggleBreedSelect(b.id)}>
                        <PetArt speciesKey={b.speciesKey} colorKey={b.colorKey} stage="adult" size={40} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 13 }}>
                            {b.name} <span className={`gender ${b.gender}`}>{b.gender === "m" ? "♂" : "♀"}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{busy ? `nesting ${formatDuration(b.breedingUntil - now)}` : SPECIES[b.speciesKey].name}</div>
                        </div>
                      </div>
                    );
                  })}
                  <button className="btn btn-secondary" style={{ width: "100%", marginTop: 8, padding: "12px" }} onClick={handleBreed} disabled={!canBreed || seeds < config.breedCost || pets.length >= loftCapacity}>
                    Start breeding ({config.breedCost} seeds)
                  </button>
                </>
              )}
            </>
          )}

          {tab === "events" && (
            <>
              {eventsSubtab === "map" && (
                <>
                  <div className="section-title">World Map</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
                    Tap a region to visit it. Fall Grove and Frostpeak Woods hold seasonal shops.
                  </div>
                  <WorldMap
                    onEnterHalloween={() => setEventsSubtab("halloween")}
                    onEnterChristmas={() => setEventsSubtab("christmas")}
                    onGoGames={() => setTab("games")}
                    onGoShop={() => setTab("shop")}
                  />
                </>
              )}

              {(eventsSubtab === "christmas" || eventsSubtab === "halloween") && (
                <>
                  <button className="btn btn-ghost" style={{ marginBottom: 14 }} onClick={() => setEventsSubtab("map")}>
                    ← Back to map
                  </button>

                  <div className="section-title">
                    {eventsSubtab === "christmas" ? "🎄 Frostpeak Woods — Christmas Shop" : "🎃 Fall Grove — Halloween Shop"}
                  </div>

                  <div className="section-title" style={{ marginTop: 0, fontSize: 15, border: "none", paddingBottom: 0 }}>Decorations</div>
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

              <div className="section-title" style={{ marginTop: 16 }}>
                {eventsSubtab === "halloween" ? "Autumn Harvest Wheel" : "Exclusive Iggies"}
              </div>
              {eventsSubtab === "halloween" ? (
                <HarvestWheel prizes={halloweenWheelPrizes} cost={40} seeds={seeds} onResult={handleWheelResult} />
              ) : (
                <div className="item-grid">
                {config.seasonalIggies.filter((b) => b.season === eventsSubtab).map((sb) => (
                  <div className="market-item" key={sb.key}>
                    <PetArt speciesKey={sb.speciesKey} colorKey={sb.colorKey} stage="adult" size={46} />
                    <div className="info">
                      <div className="nm">{sb.name}</div>
                      <div className="sub">{sb.cost} seeds</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleAdoptSeasonal(sb)} disabled={pets.length >= loftCapacity || seeds < sb.cost}>
                      Adopt
                    </button>
                  </div>
                ))}
                </div>
              )}
                </>
              )}
            </>
          )}

          {tab === "explore" && (
            <Explore
              birds={pets}
              bots={BOTS}
              exploreStage={exploreStage}
              explorerId={explorerId}
              onSelectExplorer={setExplorerId}
              onBattle={handleBattle}
              potions={potions}
              books={books}
              onUseItem={handleUseTrainingItem}
            />
          )}

          {tab === "games" && (
            <>
              <div className="section-title">Games in the Meadow</div>
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
                <div style={{ fontSize: 28 }}>🌊</div>
                <div className="info">
                  <div className="nm">Iggy Match</div>
                  <div className="sub">Memory matching game</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("match")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🐕</div>
                <div className="info">
                  <div className="nm">Sky Dash</div>
                  <div className="sub">Sprint through the meadow, endless</div>
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
                  <div className="sub">Race the storm, manage your boost</div>
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
                  <div className="nm">Iggy Trivia</div>
                  <div className="sub">8 questions about Italian Greyhounds</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("trivia")}>Play</button>
              </div>
              <div className="market-item">
                <div style={{ fontSize: 28 }}>🌾</div>
                <div className="info">
                  <div className="nm">Seed Catch</div>
                  <div className="sub">Catch falling seeds before time runs out</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("nestcatch")}>Play</button>
              </div>
              </div>
            </>
          )}

          {tab === "shop" && (
            <>
              <div className="shop-subnav">
                <button className={shopSubtab === "shop" ? "active" : ""} onClick={() => setShopSubtab("shop")}>🌾 Meadow Shop</button>
                <button className={shopSubtab === "wardrobe" ? "active" : ""} onClick={() => setShopSubtab("wardrobe")}>👗 Wardrobe</button>
              </div>
              {shopSubtab === "wardrobe" ? (
                <Wardrobe pets={pets} flags={flags} seeds={seeds} selectedPetId={selectedBirdId} onSelectPet={(id) => { setSelectedBirdId(id); setProfileTab("wardrobe"); }} onEquip={handleEquipOutfit} onUnlock={handleUnlockWardrobe} />
              ) : (
                <>
              <div className="section-title">Expand the Kennel</div>
              <div className="decor-item">
                <div style={{ fontSize: 26 }}>🏗️</div>
                <div className="info">
                  <div className="nm">Add kennel space</div>
                  <div className="sub">+{CAPACITY_PER_UPGRADE} capacity · {upgradeCost(config, upgradesBought)} seeds</div>
                </div>
                <button className="btn btn-primary" onClick={handleUpgradeLoft} disabled={seeds < upgradeCost(config, upgradesBought)}>
                  Build
                </button>
              </div>

              <div className="section-title" style={{ marginTop: 16 }}>Training Items</div>
              <div className="item-grid">
              {config.trainingItems.map((item) => (
                <div className="market-item" key={item.key}>
                  <div style={{ fontSize: 26 }}>{item.emoji}</div>
                  <div className="info">
                    <div className="nm">{item.name}</div>
                    <div className="sub">{item.cost} seeds · +{item.amount} {item.stat} when used</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleBuyTrainingItem(item)} disabled={seeds < item.cost}>
                    Buy
                  </button>
                </div>
              ))}
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
            </>
          )}
        </main>

        {toast && <div className="toast">{toast}</div>}

        {selectedBird && (
          <Modal onClose={() => { setSelectedBirdId(null); setRenameDraft(""); }}>
            <div className="iggy-profile-head">
              <div className="iggy-profile-art">
                <PetArt speciesKey={selectedBird.speciesKey} colorKey={selectedBird.colorKey} stage={selectedBird.stage} outfitKey={selectedBird.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(selectedBird)} size={150} />
              </div>
              <div className="iggy-profile-heading">
                <div className="iggy-profile-kicker">MY IGGY</div>
                <h2>{selectedBird.name || "Unnamed Iggy"}</h2>
                <div className="iggy-profile-sub">
                  <span className={`gender ${selectedBird.gender}`}>{selectedBird.gender === "m" ? "♂ Male" : "♀ Female"}</span>
                  <span>Italian Greyhound</span>
                  <span>{selectedBird.stage === "adult" ? "Adult" : selectedBird.stage === "baby" ? "Puppy" : "Egg"}</span>
                </div>
              </div>
            </div>

            <div className="profile-tabs" role="tablist" aria-label="Iggy profile sections">
              {[
                ["about", "About"],
                ["appearance", "Appearance"],
                ["care", "Care"],
                ["genetics", "Genetics"],
                ["wardrobe", "Wardrobe"],
                ["history", "History"],
              ].map(([key, label]) => (
                <button key={key} type="button" className={profileTab === key ? "active" : ""} onClick={() => setProfileTab(key)}>{label}</button>
              ))}
            </div>

            {profileTab === "about" && (
              <div className="profile-panel">
                <div className="profile-facts">
                  <div><span>Name</span><strong>{selectedBird.name || "Unnamed Iggy"}</strong></div>
                  <div><span>Breed</span><strong>Italian Greyhound</strong></div>
                  <div><span>Sex</span><strong>{selectedBird.gender === "m" ? "Male" : "Female"}</strong></div>
                  <div><span>Life stage</span><strong>{selectedBird.stage === "adult" ? "Adult" : selectedBird.stage === "baby" ? "Puppy" : "Egg"}</strong></div>
                  <div><span>Current outfit</span><strong>{getOutfit(selectedBird.outfitKey).name}</strong></div>
                  <div><span>Strength</span><strong>{getStrength(selectedBird)}</strong></div>
                  <div><span>Wisdom</span><strong>{getWisdom(selectedBird)}</strong></div>
                  <div><span>Life</span><strong>{getLife(selectedBird)} / {getMaxLife(selectedBird)}</strong></div>
                </div>
                <div className="profile-note">Every Iggy has a little story of their own. As the Meadow grows, this page will become the home for that story.</div>
              </div>
            )}

            {profileTab === "appearance" && (
              <div className="profile-panel">
                <div className="appearance-preview">
                  <PetArt speciesKey={selectedBird.speciesKey} colorKey={selectedBird.colorKey} stage={selectedBird.stage} outfitKey={selectedBird.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(selectedBird)} size={190} />
                </div>
                <div className="profile-facts">
                  <div><span>Body type</span><strong>{SPECIES[selectedBird.speciesKey]?.name?.replace("Italian Greyhound · ", "") || "Iggy"}</strong></div>
                  <div><span>Coat</span><strong>{selectedBird.colorKey}</strong></div>
                  <div><span>Base species key</span><strong>{selectedBird.speciesKey}</strong></div>
                  <div><span>Visual layers</span><strong>Coat · markings · eyes · wardrobe · effects</strong></div>
                </div>
              </div>
            )}

            {profileTab === "care" && (
              <div className="profile-panel">
                {selectedBird.stage === "egg" ? (
                  <div className="profile-empty"><div className="profile-empty-icon">🥚</div><strong>Growing safely in the nest</strong><span>Hatches in {formatDuration(selectedBird.hatchAt - now)}</span></div>
                ) : (
                  <>
                    <div className="stat-row"><span>Life</span><StatBar value={(getLife(selectedBird) / getMaxLife(selectedBird)) * 100} color="#B96A34" /></div>
                    <div className="stat-row"><span>Hunger</span><StatBar value={computeHunger(selectedBird, now, config)} color="#D9A441" /></div>
                    <div className="stat-row"><span>Clean</span><StatBar value={computeClean(selectedBird, now, config)} color="#7FA6C9" /></div>
                    <div className="stat-row"><span>Happiness</span><StatBar value={computeHappiness(selectedBird, now, config, decorBonus)} color="var(--sage-deep)" /></div>
                    {selectedBird.stage === "baby" && <div className="profile-note">This puppy grows up in {formatDuration(selectedBird.growAt - now)}.</div>}
                    <div className="profile-actions">
                      <button className="btn btn-primary" onClick={() => handleFeed(selectedBird.id)} disabled={seeds < config.feedCost}>Feed ({config.feedCost}🌾)</button>
                      <button className="btn btn-secondary" onClick={() => handleClean(selectedBird.id)}>Bathe</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {profileTab === "genetics" && (
              <div className="profile-panel">
                <div className="genetics-card"><span>Species</span><strong>Italian Greyhound</strong><small>{selectedBird.speciesKey}</small></div>
                <div className="genetics-card"><span>Coat color</span><strong>{selectedBird.colorKey}</strong><small>Inherited/selected coat record</small></div>
                {(() => {
                  const g = normalizeGenetics(selectedBird);
                  const mother = pets.find((p) => p.id === selectedBird.lineage?.motherId);
                  const father = pets.find((p) => p.id === selectedBird.lineage?.fatherId);
                  return <>
                    <div className="genetics-card"><span>Generation</span><strong>{g.generation === 0 ? "Foundation" : `Generation ${g.generation}`}</strong><small>{geneticRarity(selectedBird)} genetic rarity</small></div>
                    <div className="genetics-card"><span>Inherited traits</span><strong>{g.traits.length ? g.traits.map(traitLabel).join(" · ") : "No special traits recorded"}</strong><small>{g.traits.length ? g.traits.map(traitEmoji).join(" ") : "A clean foundation line"}</small></div>
                    <div className="genetics-card"><span>Parentage</span><strong>{mother || father ? `${mother?.name || "Unknown mother"} × ${father?.name || "Unknown father"}` : "Foundation Iggy"}</strong><small>{selectedBird.lineage?.bredAt ? new Date(selectedBird.lineage.bredAt).toLocaleString() : "No parents recorded"}</small></div>
                    <div className="profile-note">Genetics are additive and backward-compatible. Older Iggies remain foundation animals, while every new bred Iggy receives a generation, inherited traits, and a permanent parent record.</div>
                  </>;
                })()}
              </div>
            )}

            {profileTab === "wardrobe" && (
              <div className="profile-panel">
                <Wardrobe pets={pets} flags={flags} seeds={seeds} selectedPetId={selectedBird.id} onSelectPet={setSelectedBirdId} onEquip={handleEquipOutfit} onUnlock={handleUnlockWardrobe} />
              </div>
            )}

            {profileTab === "history" && (
              <div className="profile-panel">
                <div className="history-list">
                  <div><span className="history-dot">🐾</span><div><strong>Joined the Meadow</strong><small>{new Date(selectedBird.bornAt || Date.now()).toLocaleString()}</small></div></div>
                  {selectedBird.stage !== "egg" && <div><span className="history-dot">🌱</span><div><strong>{selectedBird.stage === "adult" ? "Reached adulthood" : "Became a puppy"}</strong><small>{selectedBird.stage === "adult" && selectedBird.growAt ? new Date(selectedBird.growAt).toLocaleString() : "Growth record"}</small></div></div>}
                  {selectedBird.lineage?.bredAt && <div><span className="history-dot">🧬</span><div><strong>Born from a Meadow pairing</strong><small>{new Date(selectedBird.lineage.bredAt).toLocaleString()}</small></div></div>}
                  <div><span className="history-dot">🎀</span><div><strong>{getOutfit(selectedBird.outfitKey).name}</strong><small>Current wardrobe record</small></div></div>
                </div>
                <div className="profile-note">More milestones—adoptions, breeding, competitions, discoveries, outfits, and achievements—will accumulate here as those systems mature.</div>
              </div>
            )}

            <div className="profile-rename">
              <label htmlFor="iggy-rename">Rename Iggy</label>
              <div><input id="iggy-rename" type="text" placeholder={selectedBird.name || "New name"} value={renameDraft} onChange={(e) => setRenameDraft(e.target.value)} /><button className="btn btn-ghost" onClick={() => handleRename(selectedBird.id)}>Save</button></div>
            </div>
          </Modal>
        )}
        {dailyReward && (
          <div className="modal-backdrop">
            <div className="modal-sheet centered" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>🔥</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, margin: "6px 0" }}>Day {dailyReward.streak} streak!</div>
              <div style={{ fontSize: 14, marginBottom: 14, color: "var(--ink-soft)" }}>Welcome back to the kennel. Here's a little something for stopping by.</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--gold)", marginBottom: 14 }}>+{dailyReward.amount} 🌾</div>
              <button className="btn btn-primary" style={{ width: "100%", padding: 12 }} onClick={claimDaily}>Claim</button>
            </div>
          </div>
        )}

        {activeGame === "breaker" && (
          <Modal onClose={() => setActiveGame(null)}>
            <SeedBreakerGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "breaker")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "match" && (
          <Modal onClose={() => setActiveGame(null)}>
            <NestMatchGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "match")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "skydash" && (
          <Modal onClose={() => setActiveGame(null)}>
            <SkyDashGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "skydash")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "windrider" && (
          <Modal onClose={() => setActiveGame(null)}>
            <WindRiderGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "windrider")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "stormchase" && (
          <Modal onClose={() => setActiveGame(null)}>
            <StormChaseGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "stormchase")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "bloombreaker" && (
          <Modal onClose={() => setActiveGame(null)}>
            <BloomBreakerGame key={gameRound} onFinish={(amount, won, score) => handleGameFinish(amount, won, "bloombreaker", score)} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "trivia" && (
          <Modal onClose={() => setActiveGame(null)}>
            <IggyTriviaGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "trivia")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
          </Modal>
        )}
        {activeGame === "nestcatch" && (
          <Modal onClose={() => setActiveGame(null)}>
            <NestCatchGame key={gameRound} onFinish={(amount, won) => handleGameFinish(amount, won, "nestcatch")} onClose={() => setActiveGame(null)} onPlayAgain={restartActiveGame} />
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
