"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { loadPlayerSave } from "@/lib/loadPlayerSave.mjs";
import PetArt from "./PetArt";
import PremiumScene from "./PremiumScene";
import MeadowMasthead from "./MeadowMasthead";
import { LAUNCH_ART } from "@/lib/launchArt";
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
import { SPECIES, TABS, DAILY_QUESTS, MEADOW_NEWS, DEFAULT_CONFIG, HOUR, LOFT_BASE_CAPACITY, CAPACITY_PER_UPGRADE, MAX_IGGIES, pickRandom, todayStr, yesterdayStr, pickRandomName, computeHunger, computeClean, computeHappiness, pendingIncome, adoptCost, upgradeCost, formatDuration, makeBird, defaultBirds, computeUnlockedKeys, ACHIEVEMENT_REWARDS, BOTS, getLife, getMaxLife, getStrength, getWisdom } from "@/lib/gameData";
import { theme } from "@/lib/theme";
import HeroScene from "./HeroScene";
import StorybookBanner from "./StorybookBanner";
import MeadowAtmosphere from "./MeadowAtmosphere";
import MeadowPlaza from "./MeadowPlaza";
import PortalDashboard from "./PortalDashboard";
import TownDistrict from "./TownDistrict";
import MarketKeepers from "./MarketKeepers";
import MarketStreetScene from "./MarketStreetScene";
import KennelWing from "./KennelWing";
import ItemArt from "./ItemArt";
import AdoptionParlor from "./AdoptionParlor";
import MeadowShelf from "./MeadowShelf";
import TownfolkSquare from "./TownfolkSquare";
import MeadowGazette from "./MeadowGazette";
import IggyRoomScene from "./IggyRoomScene";
import WorldPostcards from "./WorldPostcards";
import WorldMap from "./WorldMap";
import WhisperingWoods from "./WhisperingWoods";
import Bramblewick from "./Bramblewick";
import HarvestWheel from "./HarvestWheel";
import Explore from "./Explore";
import { sfx } from "@/lib/sfx";
import { OUTFITS, getOutfit, normalizeWardrobeSlots, isCompleteOutfit } from "@/lib/looks";
import Wardrobe from "./Wardrobe";
import CompactHome from "./CompactHome";
import { PageTabs, PagedGrid } from "./CompactPages";
import { createGenetics, normalizeGenetics, geneticRarity, traitLabel, traitEmoji } from "@/lib/genetics";
import { appearanceInventoryDefaults, appearanceItemKey, createAppearance, getEyeColor, getEyeStyle, normalizeAppearance, EYE_COLORS, EYE_STYLES } from "@/lib/appearance";
import { TOYS, toyInventoryDefaults, toyCount, getToy, TOY_RARITY_LABELS, toyPlayMemory } from "@/lib/toys";
import Compendium from "./Compendium";
import { getCompendiumStats } from "@/lib/compendium";
import { addBondExperience, bondLevel, bondProgress } from "@/lib/bond";
import { MEADOW_PROMISES, meadowGuideStep } from "@/lib/meadowGuide";

export default function GameApp({ user, profile, onSignOut }) {
  const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [now, setNow] = useState(Date.now());

  const [seeds, setSeeds] = useState(30);
  const [bones, setBones] = useState(0);
  const [pets, setPets] = useState([]);
  const [loftCapacity, setLoftCapacity] = useState(LOFT_BASE_CAPACITY);
  const [upgradesBought, setUpgradesBought] = useState(0);
  const [decorations, setDecorations] = useState([]);
  const [lastCollectAt, setLastCollectAt] = useState(Date.now());
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [streak, setStreak] = useState(0);
  const [flags, setFlags] = useState({});
  const [saveStatus, setSaveStatus] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const [achievementCatalog, setAchievementCatalog] = useState([]);
  const [unlockedKeys, setUnlockedKeys] = useState([]);

  const [tab, setTab] = useState("home");
  const [collectionFilter, setCollectionFilter] = useState("iggies");
  const [kennelSearch, setKennelSearch] = useState("");
  const [kennelSort, setKennelSort] = useState("name");
  const [kennelPage, setKennelPage] = useState(1);
  const [nestsSubtab, setNestsSubtab] = useState("adopt");
  const [eventsSubtab, setEventsSubtab] = useState("map");
  const [seasonShelf, setSeasonShelf] = useState("decor");
  const [selectedBirdId, setSelectedBirdId] = useState(null);
  const [wardrobePetId, setWardrobePetId] = useState(null);
  const [breedSelection, setBreedSelection] = useState([]);
  const [dailyReward, setDailyReward] = useState(null);
  const [toast, setToast] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [profileTab, setProfileTab] = useState("about");
  const [shopSubtab, setShopSubtab] = useState("shop");
  const [shopShelf, setShopShelf] = useState("decor");
  const [activeGame, setActiveGame] = useState(null);
  const [gameRound, setGameRound] = useState(0);
  const restartActiveGame = () => setGameRound((r) => r + 1);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [questState, setQuestState] = useState({ date: null, completed: [], claimed: [] });
  const [toyShopFilter, setToyShopFilter] = useState("all");
  const [worldRegion, setWorldRegion] = useState("bramblewick");
  const [bramblewickState, setBramblewickState] = useState({ completed: [], claimed: [], discoveries: [], inventory: [], npcTalked: [], reputation: 0, encounters: [], journal: [], lastAdventureAt: null });
  const [woodsState, setWoodsState] = useState({ discoveries: [], journal: [], visits: [], steps: 0, lastExploreAt: null });

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);

  const dailyCheckedRef = useRef(false);
  const toastTimer = useRef(null);
  const saveTimer = useRef(null);
  const saveQueueRef = useRef(Promise.resolve());
  const saveRevisionRef = useRef(0);
  const actionLocksRef = useRef(new Set());
  const gameRewardLocksRef = useRef(new Set());

  // Prevent accidental double-clicks from applying the same economy action twice
  // before React has had a chance to re-render with the updated balance.
  const guardAction = useCallback((key, fn) => {
    if (actionLocksRef.current.has(key)) return false;
    actionLocksRef.current.add(key);
    try {
      fn();
    } finally {
      window.setTimeout(() => actionLocksRef.current.delete(key), 300);
    }
    return true;
  }, []);

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
    let cancelled = false;
    setLoaded(false);
    setLoadError(false);
    (async () => {
      try {
      const { data: cfgRow } = await supabase.from("game_config").select("config").eq("id", 1).single();
      setConfig(cfgRow?.config ? { ...DEFAULT_CONFIG, ...cfgRow.config } : DEFAULT_CONFIG);

      const { data: catalog } = await supabase.from("achievements").select("*").order("key");
      setAchievementCatalog(catalog || []);

      const { data: earned } = await supabase.from("player_achievements").select("achievement_key").eq("user_id", user.id);
      setUnlockedKeys((earned || []).map((r) => r.achievement_key));

      const { data: premiumWallet } = await supabase.from("premium_wallets").select("bones").eq("user_id", user.id).maybeSingle();
      setBones(premiumWallet?.bones ?? 0);

      const save = await loadPlayerSave(supabase, user.id, () => ({
            seeds: 30,
            birds: defaultBirds(),
            loft_capacity: LOFT_BASE_CAPACITY,
            upgrades_bought: 0,
            decorations: [],
            last_collect_at: Date.now(),
            last_login_date: null,
            streak: 0,
            flags: {},
          }));
      if (cancelled) return;
      if (save) {
        setSeeds(save.seeds ?? 30);
        const loadedPets = save.birds && save.birds.length ? save.birds : defaultBirds();
        setPets(loadedPets.map((b) => {
          const slots = normalizeWardrobeSlots(b);
          const complete = isCompleteOutfit(slots.full) ? slots.full : (isCompleteOutfit(b.outfitKey) ? b.outfitKey : null);
          return { ...b, wardrobeSlots: complete ? { full: complete } : {}, outfitKey: complete, appearance: normalizeAppearance(b) };
        }));
        setLoftCapacity(Math.min(save.loft_capacity ?? LOFT_BASE_CAPACITY, MAX_IGGIES));
        setUpgradesBought(save.upgrades_bought ?? 0);
        setDecorations(save.decorations ?? []);
        setLastCollectAt(save.last_collect_at ?? Date.now());
        setLastLoginDate(save.last_login_date ?? null);
        setStreak(save.streak ?? 0);
        const loadedFlags = save.flags ?? {};
        const ownedOutfits = Array.from(new Set(["none", "ribbon", ...(loadedFlags.wardrobeInventory || []), ...(save.birds || []).map((b) => b.outfitKey).filter(Boolean)]));
        const ownedAppearance = Array.from(new Set([...(loadedFlags.appearanceInventory || appearanceInventoryDefaults())]));
        const toyInventory = { ...toyInventoryDefaults(), ...(loadedFlags.toyInventory || {}) };
        setFlags({ ...loadedFlags, wardrobeInventory: ownedOutfits, appearanceInventory: ownedAppearance, toyInventory });
        setQuestState(loadedFlags.questState || { date: null, completed: [], claimed: [] });
        setBramblewickState(loadedFlags.bramblewick || { completed: [], claimed: [], discoveries: [], inventory: [], npcTalked: [], reputation: 0, encounters: [], journal: [], lastAdventureAt: null });
        setWoodsState(loadedFlags.whisperingWoods || { discoveries: [], journal: [], visits: [], steps: 0, lastExploreAt: null });
      }
      setLoaded(true);
      } catch (error) {
        console.error("Could not load player save", error?.code || "connection_error");
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [user.id, loadAttempt]);

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

  const claimDaily = () => guardAction("daily-reward", () => {
    if (!dailyReward) return;
    setSeeds((s) => s + dailyReward.amount);
    setStreak(dailyReward.streak);
    setLastLoginDate(todayStr());
    setDailyReward(null);
    notify(`+${dailyReward.amount} seeds for stopping by 🌾`);
  });

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

  /* ---- debounced, serialized save to supabase ---- */
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const revision = ++saveRevisionRef.current;
    setSaveStatus("saving");
    saveTimer.current = setTimeout(() => {
      const payload = {
        seeds,
        birds: pets,
        loft_capacity: loftCapacity,
        upgrades_bought: upgradesBought,
        decorations,
        last_collect_at: lastCollectAt,
        last_login_date: lastLoginDate,
        streak,
        flags: { ...flags, questState, bramblewick: bramblewickState, whisperingWoods: woodsState },
        updated_at: new Date().toISOString(),
      };

      // Queue saves so a slow network response can never overwrite a newer
      // state with an older snapshot. Only the newest revision updates the UI.
      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(() => supabase.from("player_saves").update(payload).eq("user_id", user.id))
        .then(({ error }) => {
          if (revision !== saveRevisionRef.current) return;
          if (error) {
            console.error("save failed", error);
            setSaveStatus("error");
            return;
          }
          setSaveStatus("saved");
          setLastSavedAt(Date.now());
        });
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [seeds, pets, loftCapacity, upgradesBought, decorations, lastCollectAt, lastLoginDate, streak, flags, questState, bramblewickState, woodsState, loaded, user.id]);

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
    if (purchase === "success" || purchase === "seeds-success" || purchase === "bones-success") {
      notify(purchase === "bones-success" ? "Payment received — Special Dog Bones incoming 🦴" : "Payment received — seeds incoming 🌾");
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts += 1;
        const [{ data: saveData }, { data: walletData }] = await Promise.all([
          supabase.from("player_saves").select("seeds").eq("user_id", user.id).single(),
          supabase.from("premium_wallets").select("bones").eq("user_id", user.id).maybeSingle(),
        ]);
        if (saveData) setSeeds(saveData.seeds);
        if (walletData) setBones(walletData.bones ?? 0);
        if (attempts >= 5) clearInterval(poll);
      }, 1500);
    } else if (purchase === "cancelled") {
      notify("No charge — checkout cancelled");
    }
  }, []); // eslint-disable-line

  const usedNames = pets.map((b) => b.name).filter(Boolean);
  const effectiveKennelCapacity = Math.min(loftCapacity, MAX_IGGIES);
  const kennelAtLimit = pets.length >= effectiveKennelCapacity || pets.length >= MAX_IGGIES;
  const kennelPets = [...pets]
    .filter((p) => !kennelSearch.trim() || (p.name || "").toLowerCase().includes(kennelSearch.trim().toLowerCase()) || (SPECIES[p.speciesKey]?.name || "").toLowerCase().includes(kennelSearch.trim().toLowerCase()))
    .sort((a, b) => {
      if (kennelSort === "stage") return ({ egg: 0, baby: 1, adult: 2 }[a.stage] ?? 9) - ({ egg: 0, baby: 1, adult: 2 }[b.stage] ?? 9);
      if (kennelSort === "happiness") return computeHappiness(b, now, config, decorBonus) - computeHappiness(a, now, config, decorBonus);
      if (kennelSort === "bond") return (b.bondXp || 0) - (a.bondXp || 0);
      return (a.name || "").localeCompare(b.name || "");
    });
  const KENNEL_PAGE_SIZE = 4;
  const kennelPageCount = Math.max(1, Math.ceil(kennelPets.length / KENNEL_PAGE_SIZE));
  const safeKennelPage = Math.min(kennelPage, kennelPageCount);
  const pagedKennelPets = kennelPets.slice((safeKennelPage - 1) * KENNEL_PAGE_SIZE, safeKennelPage * KENNEL_PAGE_SIZE);
  const pending = pendingIncome(pets, lastCollectAt, now, config, decorBonus);
  const guidedMeadow = flags.guidedMeadow !== false;
  const guideStep = meadowGuideStep({ pets, seeds, pending, questState, config });

  const followGuideStep = () => {
    if (guideStep.action === "adopt") { setTab("nests"); setNestsSubtab("adopt"); return; }
    if (guideStep.action === "pet" && guideStep.petId) { setSelectedBirdId(guideStep.petId); setProfileTab("about"); setTab("kennel"); return; }
    if (guideStep.action === "collect") { handleCollect(); return; }
    if (guideStep.action === "explore") { setTab("explore"); return; }
    setTab("home");
  };

  /* ---- actions ---- */
  const handleCollect = () => guardAction("collect", () => {
    if (pending <= 0) return;
    setSeeds((s) => s + pending);
    setLastCollectAt(now);
    markQuest("collect");
    notify(`+${pending} seeds gathered from the kennel`);
  });

  const handleFeed = (id) => guardAction(`feed:${id}`, () => {
    const pet = pets.find((b) => b.id === id);
    if (!pet || pet.stage === "egg") return notify("That Iggy is not ready for feed yet");
    if (seeds < config.feedCost) return notify("You're a bit short on seeds for feed");
    setPets((prev) => prev.map((b) => (b.id === id ? addBondExperience({ ...b, lastFedAt: Date.now(), life: Math.min(getMaxLife(b), getLife(b) + 30) }, 2, "A caring meal together") : b)));
    setSeeds((s) => s - config.feedCost);
    markQuest("care");
  });

  const handleClean = (id) => guardAction(`clean:${id}`, () => {
    const pet = pets.find((b) => b.id === id);
    if (!pet || pet.stage === "egg") return notify("That Iggy is not ready for grooming yet");
    setPets((prev) => prev.map((b) => (b.id === id ? addBondExperience({ ...b, lastCleanedAt: Date.now() }, 2, "A gentle grooming session") : b)));
    markQuest("care");
  });

  const handleAdopt = (speciesKey) => guardAction(`adopt:${speciesKey}`, () => {
    if (!SPECIES[speciesKey]) return notify("That Iggy type isn't available right now");
    const cost = adoptCost(config, speciesKey, pets.length);
    if (kennelAtLimit) return notify(pets.length >= MAX_IGGIES ? `Your Meadow family has reached the ${MAX_IGGIES}-Iggy maximum` : "Your kennel is full — upgrade for more room");
    if (seeds < cost) return notify("You're a bit short on seeds");
    const colorKey = pickRandom(SPECIES[speciesKey].colors);
    const t = Date.now();
    const bird = makeBird({ speciesKey, colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
    bird.name = pickRandomName(usedNames);
    setPets((prev) => [...prev, bird]);
    setSeeds((s) => s - cost);
    notify(`${bird.name} has joined the kennel! 🐕`);
  });

  const handleAdoptSeasonal = (sb) => guardAction(`seasonal-adopt:${sb?.key || "unknown"}`, () => {
    if (!sb || !SPECIES[sb.speciesKey]) return notify("That seasonal Iggy isn't available right now");
    if (kennelAtLimit) return notify(pets.length >= MAX_IGGIES ? `Your Meadow family has reached the ${MAX_IGGIES}-Iggy maximum` : "Your kennel is full — upgrade for more room");
    if (seeds < sb.cost) return notify("You're a bit short on seeds");
    const t = Date.now();
    const bird = makeBird({ speciesKey: sb.speciesKey, colorKey: sb.colorKey, stage: "baby", now: t, growAt: t + config.adoptGrowHours * HOUR });
    bird.name = pickRandomName(usedNames);
    setPets((prev) => [...prev, bird]);
    setSeeds((s) => s - sb.cost);
    setFlags((prev) => ({ ...prev, seasonalAdopted: true }));
    notify(`${bird.name} has joined the kennel! 🐕`);
  });

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

  const handleWheelResult = (prize, cost) => guardAction(`wheel:${prize?.key || "unknown"}`, () => {
    if (!prize || !Number.isFinite(cost) || cost < 0) return;
    if (seeds < cost) return notify("You're a bit short on seeds for the wheel");
    setSeeds((s) => Math.max(0, s - cost));

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
      if (kennelAtLimit) {
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
  });

  const [explorerId, setExplorerId] = useState(null);
  const potions = flags.potions || 0;
  const books = flags.books || 0;
  const exploreStage = flags.exploreStage || 0;

  const handleBuyToy = (toy) => guardAction(`buy-toy:${toy?.key || "unknown"}`, () => {
    if (!toy) return;
    if (seeds < toy.cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - toy.cost);
    setFlags((prev) => ({ ...prev, toyInventory: { ...(prev.toyInventory || {}), [toy.key]: toyCount(prev.toyInventory, toy.key) + 1 } }));
    notify(`${toy.name} added to your Toy Chest ${toy.emoji}`);
  });

  const handlePlayToy = (petId, toyKey) => guardAction(`play-toy:${petId}:${toyKey}`, () => {
    const toy = getToy(toyKey);
    if (!toy || toyCount(flags.toyInventory, toyKey) <= 0) return notify("You don't have that toy yet");
    const pet = pets.find((b) => b.id === petId);
    if (!pet || pet.stage === "egg") return notify("Eggs need a little more time before playtime");
    setFlags((prev) => ({ ...prev, playedToys: Array.from(new Set([...(prev.playedToys || []), toyKey])), toyInventory: { ...(prev.toyInventory || {}), [toyKey]: Math.max(0, toyCount(prev.toyInventory, toyKey) - 1) } }));
    setPets((prev) => prev.map((b) => {
      if (b.id !== petId) return b;
      const memory = toyPlayMemory(b, toy);
      const journal = Array.isArray(b.journal) ? b.journal : [];
      return addBondExperience({ ...b, lastPlayedAt: Date.now(), playHappiness: Math.min(32, (b.playHappiness || 0) + toy.happiness), favoriteToyKey: b.favoriteToyKey || toy.key, journal: [...journal, memory].slice(-30) }, 5, `Playtime with ${toy.name}`);
    }));
    markQuest("care");
    notify(`${pet.name || "Your Iggy"} played with the ${toy.name}! +${toy.happiness} happiness 💕`);
  });

  const handleBuyTrainingItem = (item) => guardAction(`buy-training:${item?.key || "unknown"}`, () => {
    if (!item) return;
    if (seeds < item.cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - item.cost);
    const key = item.stat === "strength" ? "potions" : "books";
    setFlags((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    notify(`Bought a ${item.name}! 🎒`);
  });

  const handleUseTrainingItem = (petId, stat) => guardAction(`use-training:${petId}:${stat}`, () => {
    const key = stat === "strength" ? "potions" : "books";
    if ((flags[key] || 0) <= 0) return;
    setFlags((prev) => ({ ...prev, [key]: prev[key] - 1 }));
    setPets((prev) => prev.map((b) => (b.id === petId ? addBondExperience({ ...b, [stat]: (stat === "strength" ? getStrength(b) : getWisdom(b)) + 2 }, 3, "Training side by side") : b)));
    markQuest("care");
    notify(stat === "strength" ? "+2 Strength! 💪" : "+2 Wisdom! 📖");
  });

  const handleBattle = (petId) => {
    markQuest("explore");
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
    setPets((prev) => prev.map((b) => (b.id === petId ? addBondExperience({ ...b, life: newLife }, won ? 6 : 2, won ? "A brave victory together" : "Sticking together after a difficult encounter") : b)));

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

  const handleBreed = () => guardAction("breed", () => {
    if (!canBreed) return;
    if (kennelAtLimit) return notify(pets.length >= MAX_IGGIES ? `Your Meadow family has reached the ${MAX_IGGIES}-Iggy maximum` : "Your kennel is full — upgrade for more room");
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
    egg.appearance = createAppearance(parentA, parentB);
    const discoveredAppearance = [appearanceItemKey("eye-color", egg.appearance.eyeColor), appearanceItemKey("eye-style", egg.appearance.eyeStyle)];
    setFlags((prev) => ({ ...prev, appearanceInventory: Array.from(new Set([...(prev.appearanceInventory || appearanceInventoryDefaults()), ...discoveredAppearance])) }));
    egg.lineage = { motherId: parentA.gender === "f" ? parentA.id : parentB.id, fatherId: parentA.gender === "m" ? parentA.id : parentB.id, bredAt: t };
    setPets((prev) => prev.map((b) => (b.id === idA || b.id === idB ? addBondExperience({ ...b, breedingUntil: t + config.eggHatchHours * HOUR }, 8, "Welcoming a new Meadow family member") : b)).concat(egg));
    setSeeds((s) => s - config.breedCost);
    setBreedSelection([]);
    setFlags((prev) => ({ ...prev, bred: true }));
    notify("A pup is on the way! 🐕");
  });

  const handleUpgradeLoft = () => guardAction("upgrade-kennel", () => {
    if (effectiveKennelCapacity >= MAX_IGGIES) return notify(`Your kennel is already at the ${MAX_IGGIES}-Iggy maximum`);
    const cost = upgradeCost(config, upgradesBought);
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setLoftCapacity((c) => Math.min(MAX_IGGIES, c + CAPACITY_PER_UPGRADE));
    setUpgradesBought((n) => n + 1);
    notify("Kennel expanded — more room for Iggies");
  });

  const handleBuyDecor = (key, cost) => guardAction(`buy-decor:${key}`, () => {
    if (decorations.includes(key)) return;
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setDecorations((prev) => [...prev, key]);
    notify("Placed in your kennel");
  });

  const handleEquipOutfit = (petId, outfitKey) => {
    const outfit = getOutfit(outfitKey);
    if (outfitKey !== "none" && !isCompleteOutfit(outfitKey)) return notify("Iggy outfits are kept as complete themed sets");
    const owned = flags.wardrobeInventory || ["none", "ribbon"];
    if (outfitKey !== "none" && !owned.includes(outfitKey)) return notify("That outfit isn't in your closet yet");
    setPets((prev) => prev.map((b) => b.id === petId ? { ...b, wardrobeSlots: outfitKey === "none" ? {} : { full: outfitKey }, outfitKey: outfitKey === "none" ? null : outfitKey } : b));
    notify(outfitKey === "none" ? "Complete outfit removed ✨" : `${outfit.name} equipped ${outfit.emoji}`);
  };

  const handleUnlockWardrobe = (outfitKey) => guardAction(`unlock-outfit:${outfitKey}`, () => {
    const outfit = OUTFITS[outfitKey];
    if (!outfit || outfitKey === "none" || !isCompleteOutfit(outfitKey)) return notify("Only complete themed outfits can be added to the closet");
    if ((flags.wardrobeInventory || []).includes(outfitKey)) return notify("You already have that outfit");
    const cost = outfit.cost ?? 50;
    if (seeds < cost) return notify("You're a bit short on seeds");
    setSeeds((s) => s - cost);
    setFlags((prev) => ({ ...prev, wardrobeInventory: Array.from(new Set([...(prev.wardrobeInventory || ["none", "ribbon"]), outfitKey])) }));
    notify(`${outfit.name} added to your closet ${outfit.emoji}`);
  });

  const handleEquipAppearance = (petId, category, key) => {
    const itemKey = appearanceItemKey(category, key);
    const owned = flags.appearanceInventory || appearanceInventoryDefaults();
    if (!owned.includes(itemKey)) return notify("That appearance trait isn't in your collection yet");
    setPets((prev) => prev.map((b) => b.id === petId ? { ...b, appearance: { ...normalizeAppearance(b), [category === "eye-color" ? "eyeColor" : "eyeStyle"]: key } } : b));
    notify(`${category === "eye-color" ? getEyeColor(key).name : getEyeStyle(key).name} selected ✨`);
  };

  const handleUnlockAppearance = (category, key) => guardAction(`unlock-appearance:${category}:${key}`, () => {
    const catalog = category === "eye-color" ? EYE_COLORS : EYE_STYLES;
    const item = catalog.find((x) => x.key === key);
    if (!item) return;
    const itemKey = appearanceItemKey(category, key);
    const owned = flags.appearanceInventory || appearanceInventoryDefaults();
    if (owned.includes(itemKey)) return notify("You already have that appearance trait");
    if (seeds < (item.cost || 0)) return notify("You're a bit short on seeds");
    setSeeds((s) => s - (item.cost || 0));
    setFlags((prev) => ({ ...prev, appearanceInventory: Array.from(new Set([...(prev.appearanceInventory || appearanceInventoryDefaults()), itemKey])) }));
    notify(`${item.name} added to your appearance collection ${item.emoji}`);
  });

  const handleRename = (id) => guardAction(`rename:${id}`, () => {
    const name = renameDraft.trim().replace(/\s+/g, " ").slice(0, 16);
    if (!name) return;
    setPets((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
    setRenameDraft("");
  });

  const handleGameFinish = (amount, won, gameKey, rawScore) => {
    const rewardKey = `${gameRound}:${gameKey || "unknown"}`;
    if (gameKey && gameRewardLocksRef.current.has(rewardKey)) return;
    if (gameKey) gameRewardLocksRef.current.add(rewardKey);
    if (amount > 0) {
      setSeeds((s) => s + amount);
      markQuest("play");
      notify(`+${amount} seeds — nice playing!`);
    }
    if (won && gameKey) {
      setFlags((prev) => ({ ...prev, [`${gameKey}Won`]: true }));
    }
    if (typeof rawScore === "number" && gameKey) {
      setFlags((prev) => ({ ...prev, [`${gameKey}Best`]: Math.max(prev[`${gameKey}Best`] || 0, rawScore) }));
    }
  };

  const handleBuyPack = async (packKey, packType = "seeds") => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("This opens Stripe for a real-money purchase. A grown-up should complete purchases. Continue?");
      if (!confirmed) return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return notify("Please sign back in to continue");
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ packKey, packType }),
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

  const handleUseSpecialBone = async (petId) => {
    if (bones < 1) return notify("You don't have a Special Dog Bone yet");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return notify("Please sign back in to continue");
    try {
      const res = await fetch("/api/premium/use-bone", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ petId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return notify(data.error || "That bone couldn't be used right now");
      setBones(data.bones ?? Math.max(0, bones - 1));
      if (Array.isArray(data.birds)) setPets(data.birds);
      notify(data.message || "Special Dog Bone used 🦴✨");
    } catch (e) {
      notify("That bone couldn't be used right now");
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

  const markQuest = (key) => {
    setQuestState((prev) => {
      const today = todayStr();
      const base = prev.date === today ? prev : { date: today, completed: [], claimed: [] };
      if (base.completed.includes(key)) return base;
      return { ...base, date: today, completed: [...base.completed, key] };
    });
  };

  const claimQuest = (key) => {
    const q = DAILY_QUESTS.find((x) => x.key === key);
    if (!q) return;
    const today = todayStr();
    const state = questState.date === today ? questState : { date: today, completed: [], claimed: [] };
    if (!state.completed.includes(key) || state.claimed.includes(key)) return;
    setSeeds((s) => s + q.reward);
    setQuestState({ ...state, claimed: [...state.claimed, key] });
    notify(`+${q.reward} seeds — ${q.name} complete!`);
  };

  const questFor = (key) => {
    const today = todayStr();
    const state = questState.date === today ? questState : { date: today, completed: [], claimed: [] };
    return { completed: state.completed.includes(key), claimed: state.claimed.includes(key) };
  };

  const claimCompendiumReward = (section) => {
    const rewardTable = {
      iggies: 100,
      world: 150,
      genetics: 200,
      wardrobe: 180,
      toys: 120,
      appearance: 160,
      achievements: 250,
    };
    const reward = rewardTable[section];
    if (!reward) return;
    const claimed = flags.compendiumRewards || [];
    if (claimed.includes(section)) return notify("That archive reward has already been claimed");
    const stats = getCompendiumStats({ pets, flags, woodsState, bramblewickState, unlockedKeys, achievementCatalog });
    const entry = stats[section];
    if (!entry || entry.found < entry.total || entry.total <= 0) return notify("Complete this archive section first");
    setSeeds((s) => s + reward);
    setFlags((prev) => ({ ...prev, compendiumRewards: [...new Set([...(prev.compendiumRewards || []), section])] }));
    notify(`Archive complete! +${reward} seeds 📚🌾`);
  };

  const resetGame = () => {
    const t = Date.now();
    setSeeds(30);
    setPets(defaultBirds());
    setLoftCapacity(LOFT_BASE_CAPACITY);
    setUpgradesBought(0);
    setDecorations([]);
    setFlags({ wardrobeInventory: ["none", "ribbon"], appearanceInventory: appearanceInventoryDefaults(), toyInventory: toyInventoryDefaults(), compendiumRewards: [], bramblewick: { completed: [], claimed: [], discoveries: [], inventory: [], npcTalked: [], reputation: 0, encounters: [], journal: [], lastAdventureAt: null } });
    setBramblewickState({ completed: [], claimed: [], discoveries: [], inventory: [], npcTalked: [], reputation: 0, encounters: [], journal: [], lastAdventureAt: null });
    setQuestState({ date: todayStr(), completed: [], claimed: [] });
    setLastCollectAt(t);
    setSelectedBirdId(null);
    setBreedSelection([]);
    notify("Fresh start — welcome back to day one");
  };

  const selectedBird = pets.find((b) => b.id === selectedBirdId) || null;

  if (loadError) {
    return (
      <div className="page"><div className="auth-card" role="alert">
        <h2>Your kennel couldn’t load</h2>
        <p>We haven’t changed your saved progress. Check your connection and try again.</p>
        <button className="btn btn-primary" onClick={() => setLoadAttempt((n) => n + 1)}>Try again</button>
        <button className="btn btn-ghost" onClick={onSignOut}>Sign out</button>
      </div></div>
    );
  }

  if (!loaded) {
    return (
      <div className="site">
        <div className="loading-screen">
          <div className="em">🐕</div>
          <div className="display" style={{ fontWeight: 700 }}>Welcome to Iggy Meadow…</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`site site-${tab}`}>
      <MeadowAtmosphere tab={tab} />
      <MeadowMasthead
        username={profile.username}
        seeds={seeds}
        bones={bones}
        streak={streak}
        petCount={pets.length}
        pending={pending}
        onCollect={handleCollect}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        isAdmin={profile.is_admin}
        tab={tab}
        nestsSubtab={nestsSubtab}
        shopSubtab={shopSubtab}
        onTab={setTab}
        onNestsSubtab={setNestsSubtab}
        onShopSubtab={setShopSubtab}
        onAchievements={() => setShowAchievements(true)}
        onLeaderboard={() => setShowLeaderboard(true)}
        onNotifications={() => setShowNotifications(true)}
        onAdmin={() => setAdminOpen(true)}
        onSignOut={onSignOut}
      />

      <main id="meadow-content" tabIndex={-1} className={`content content-${tab}`}>
          
          {tab === "home" && <CompactHome username={profile.username} pets={pets} news={MEADOW_NEWS} questFor={questFor} onClaimQuest={claimQuest} promises={MEADOW_PROMISES} guided={guidedMeadow} guideStep={guideStep} onGuide={followGuideStep} onToggleGuide={(enabled) => setFlags((prev) => ({ ...prev, guidedMeadow: enabled }))} onGo={(key) => { if (key === "adopt") { setTab("nests"); setNestsSubtab("adopt"); } else if (key === "closet") { setTab("shop"); setShopSubtab("wardrobe"); } else { setTab(key); if (key === "shop") setShopSubtab("shop"); } }} />}

          {tab === "collection" && (
            <>
              <Compendium
              section={collectionFilter}
              setSection={setCollectionFilter}
              pets={pets}
              flags={flags}
              woodsState={woodsState}
              bramblewickState={bramblewickState}
              unlockedKeys={unlockedKeys}
              achievementCatalog={achievementCatalog}
              onClaimReward={claimCompendiumReward}
              onSelectPet={(id) => { setSelectedBirdId(id); setProfileTab("about"); }}
            />
            </>
          )}

          {tab === "kennel" && (
            <div className="kennel-room-page">
              <PremiumScene
                image={LAUNCH_ART.kennel}
                eyebrow="WILLOW KENNELS"
                title="Every Iggy has a story"
                copy={`${pets.length} of ${effectiveKennelCapacity} kennel spaces are filled. Your collection can grow to ${MAX_IGGIES} Iggies.`}
                compact
                actions={[{ label: "Adopt another", onClick: () => { setTab("nests"); setNestsSubtab("adopt"); } }]}
              />
              <div className="kennel-toolbar">
                <div>
                  <div className="section-title" style={{ marginBottom: 3 }}>My Iggies</div>
                  <div className="kennel-count">{pets.length} of {effectiveKennelCapacity} kennel spaces filled · {MAX_IGGIES} max</div>
                </div>
                <div className="kennel-tools">
                  <input aria-label="Search Iggies" value={kennelSearch} onChange={(e) => { setKennelSearch(e.target.value); setKennelPage(1); }} placeholder="Search your Iggies…" />
                  <select aria-label="Sort Iggies" value={kennelSort} onChange={(e) => { setKennelSort(e.target.value); setKennelPage(1); }}>
                    <option value="name">Name</option>
                    <option value="stage">Life stage</option>
                    <option value="happiness">Happiness</option>
                    <option value="bond">Guardian bond</option>
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
                <>
                <div className="loft-grid">
                  {pagedKennelPets.map((b) => {
                    const happiness = computeHappiness(b, now, config, decorBonus);
                    const busy = b.breedingUntil && b.breedingUntil > now;
                    return (
                      <button type="button" key={b.id} className={`pet-card${busy ? " busy" : ""}`} onClick={() => { setSelectedBirdId(b.id); setProfileTab("about"); }}>
                        <PetArt speciesKey={b.speciesKey} colorKey={b.colorKey} stage={b.stage} outfitKey={b.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(b)} appearance={normalizeAppearance(b)} size={74} />
                        <div className="bname">{b.name || "Unnamed Iggy"}</div>
                        <div className="bspecies">
                          {b.stage === "egg" ? `Hatches ${formatDuration(b.hatchAt - now)}` : b.stage === "baby" ? `Puppy · grows ${formatDuration(b.growAt - now)}` : "Italian Greyhound"}
                        </div>
                        {b.stage !== "egg" && <StatBar value={happiness} color="var(--sage)" />}
                        {b.stage !== "egg" && <div className="pet-card-tag bond-tag">{bondLevel(b).emoji} Bond {bondLevel(b).level}</div>}
                        {b.outfitKey && b.outfitKey !== "none" && <div className="pet-card-tag">✨ {b.outfitKey}</div>}
                      </button>
                    );
                  })}
                  {!kennelSearch.trim() && safeKennelPage === kennelPageCount && Array.from({ length: Math.min(Math.max(0, KENNEL_PAGE_SIZE - pagedKennelPets.length), Math.max(0, effectiveKennelCapacity - pets.length)) }).map((_, i) => (
                    <button type="button" className="empty-slot" key={i} onClick={() => { setTab("nests"); setNestsSubtab("adopt"); }}>+ Empty kennel space</button>
                  ))}
                </div>
                {kennelPageCount > 1 && <div className="catalog-pager" aria-label="Kennel pages"><button className="btn btn-ghost" disabled={safeKennelPage <= 1} onClick={() => setKennelPage((page) => Math.max(1, page - 1))}>← Previous</button><span>Page <strong>{safeKennelPage}</strong> of {kennelPageCount}<small>{kennelPets.length} Iggies</small></span><button className="btn btn-ghost" disabled={safeKennelPage >= kennelPageCount} onClick={() => setKennelPage((page) => Math.min(kennelPageCount, page + 1))}>Next →</button></div>}
                </>
              )}
            </div>
          )}

          {tab === "nests" && (
            <div className={`adoption-page adoption-${nestsSubtab}`}>
              <div className="storybook-segmented">
                <button className={`btn segbtn ${nestsSubtab === "adopt" ? "btn-primary" : "btn-ghost"}`} onClick={() => setNestsSubtab("adopt")}>Adopt</button>
                <button className={`btn segbtn ${nestsSubtab === "breed" ? "btn-primary" : "btn-ghost"}`} onClick={() => setNestsSubtab("breed")}>Breed</button>
              </div>

              {nestsSubtab === "adopt" ? (
                <>
                  <PremiumScene
                    image={LAUNCH_ART.adoption}
                    eyebrow="ADOPTION HOUSE"
                    title="Find your forever friend"
                    copy="Take your time. Every Iggy arrives with room to grow, bond, dress up, explore, and become part of a family line."
                    compact
                  />
                  <div className="section-title">Adopt an Iggy</div>
                  <div className="item-grid adoption-grid">
                  {Object.entries(SPECIES).map(([key, sp]) => (
                    <div className="market-item adoption-card" key={key}>
                      <div className="adoption-card-art"><PetArt speciesKey={key} colorKey={sp.colors[0]} stage="adult" size={92} /></div>
                      <div className="info">
                        <div className="nm">{sp.name}</div>
                        <div className="sub">{adoptCost(config, key, pets.length)} seeds</div>
                      </div>
                      <button className="btn btn-primary" onClick={() => handleAdopt(key)} disabled={kennelAtLimit || seeds < adoptCost(config, key, pets.length)}>
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
                  <PagedGrid className="compact-breed-grid" pageSize={4} label="Breeding companions">
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
                  </PagedGrid>
                  <button className="btn btn-secondary" style={{ width: "100%", marginTop: 8, padding: "12px" }} onClick={handleBreed} disabled={!canBreed || seeds < config.breedCost || kennelAtLimit}>
                    Start breeding ({config.breedCost} seeds)
                  </button>
                </>
              )}
            </div>
          )}

          {tab === "events" && (
            <>
              {eventsSubtab === "map" && (
                <>
                  <WorldMap
                    woodsState={woodsState}
                    bramblewickState={bramblewickState}
                    onGoRegion={(region) => {
                      setWorldRegion(region.key);
                      if (region.key === "fall-grove") { setSeasonShelf("decor"); setEventsSubtab("halloween"); setTab("events"); }
                      else if (region.key === "frostpeak") { setSeasonShelf("decor"); setEventsSubtab("christmas"); setTab("events"); }
                      else if (region.key === "arcade") setTab("games");
                      else if (region.key === "market") { setShopSubtab("shop"); setTab("shop"); }
                      else if (region.key === "meadow") setTab("home");
                      else if (region.key === "whispering-woods") { setEventsSubtab("woods"); setTab("events"); }
                      else if (region.key === "bramblewick") { setEventsSubtab("bramblewick"); setTab("events"); }
                      else notify(`${region.name} is opening as its own destination soon. For now, its world district is mapped and ready to grow! 🌿`);
                    }}
                  />
                </>
              )}

              {eventsSubtab === "woods" && (
                <WhisperingWoods
                  pets={pets}
                  state={woodsState}
                  onStateChange={(next) => { setWoodsState(next); setFlags((prev) => ({ ...prev, whisperingWoods: next })); }}
                  onReward={(amount) => setSeeds((s) => Math.max(0, s + amount))}
                  onBack={() => setEventsSubtab("map")}
                  onNotify={notify}
                />
              )}

              {eventsSubtab === "bramblewick" && (
                <Bramblewick seeds={seeds} state={bramblewickState} onStateChange={(next) => { setBramblewickState(next); setFlags((prev) => ({ ...prev, bramblewick: next })); }} onReward={(amount) => { if (amount > 0) setSeeds((s) => s + amount); else if (amount < 0) { setSeeds((s) => Math.max(0, s + amount)); } }} onBack={() => setEventsSubtab("map")} onNotify={notify} />
              )}

              {(eventsSubtab === "christmas" || eventsSubtab === "halloween") && (
                <div className={`seasonal-district seasonal-${eventsSubtab}`}>
                  <button className="btn btn-ghost" style={{ marginBottom: 14 }} onClick={() => setEventsSubtab("map")}>
                    ← Back to map
                  </button>

                  <div className="section-title">
                    {eventsSubtab === "christmas" ? "🎄 Frostpeak Woods — Christmas Shop" : "🎃 Fall Grove — Halloween Shop"}
                  </div>

                  <PageTabs items={[["decor","Seasonal Decorations"],["activities","Seasonal Highlights"]]} active={seasonShelf} onChange={setSeasonShelf} label="Seasonal pages" />
                  {seasonShelf === "decor" && <>
                  <div className="section-title" style={{ marginTop: 0, fontSize: 15, border: "none", paddingBottom: 0 }}>Decorations</div>
              <PagedGrid className="item-grid" pageSize={4} label="Shop items">
              {(eventsSubtab === "christmas" ? config.christmasItems : config.halloweenItems).map((d) => {
                const owned = decorations.includes(d.key);
                return (
                  <div className="decor-item" key={d.key}>
                    <div className="market-item-art"><ItemArt itemKey={d.key} emoji={d.emoji} size={76} /></div>
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
              </PagedGrid>

                  </>}
                  {seasonShelf === "activities" && <>
              <div className="section-title" style={{ marginTop: 16 }}>
                {eventsSubtab === "halloween" ? "Autumn Harvest Wheel" : "Exclusive Iggies"}
              </div>
              {eventsSubtab === "halloween" ? (
                <HarvestWheel prizes={halloweenWheelPrizes} cost={40} seeds={seeds} onResult={handleWheelResult} />
              ) : (
                <PagedGrid className="item-grid" pageSize={4} label="Shop items">
                {config.seasonalIggies.filter((b) => b.season === eventsSubtab).map((sb) => (
                  <div className="market-item" key={sb.key}>
                    <PetArt speciesKey={sb.speciesKey} colorKey={sb.colorKey} stage="adult" size={46} />
                    <div className="info">
                      <div className="nm">{sb.name}</div>
                      <div className="sub">{sb.cost} seeds</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleAdoptSeasonal(sb)} disabled={kennelAtLimit || seeds < sb.cost}>
                      Adopt
                    </button>
                  </div>
                ))}
                </PagedGrid>
              )}
                  </>}
                </div>
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
            <div className="game-hall-page">
              <div className="section-title">Games in the Meadow</div>
              <div className="destination-host arcade-host">
                <div className="destination-host-portrait"><PetArt speciesKey="nun" colorKey="black" stage="adult" size={100} /></div>
                <div><small>ARCADE LANE HOST</small><h3>Captain Button</h3><p>“Every cabinet has a high score, but the best prize is finding the game you want to play twice.”</p><span>Games award seeds and can unlock Meadow milestones.</span></div>
              </div>
              <div className="game-hall-intro">Lanterns glow over Arcade Lane. Pick a cabinet, chase a score, and bring home a few seeds for the kennel.</div>
              <PagedGrid className="item-grid game-hall-grid" pageSize={4} label="Games">
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🧱</div>
                <div className="info">
                  <div className="nm">Seed Breaker</div>
                  <div className="sub">Break bricks, earn seeds</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("breaker")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🌊</div>
                <div className="info">
                  <div className="nm">Iggy Match</div>
                  <div className="sub">Memory matching game</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("match")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🐕</div>
                <div className="info">
                  <div className="nm">Sky Dash</div>
                  <div className="sub">Sprint through the meadow, endless</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("skydash")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🌬️</div>
                <div className="info">
                  <div className="nm">Wind Rider</div>
                  <div className="sub">Switch lanes, grab seeds, dodge storms</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("windrider")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>⛈️</div>
                <div className="info">
                  <div className="nm">Storm Chase</div>
                  <div className="sub">Race the storm, manage your boost</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("stormchase")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🌸</div>
                <div className="info">
                  <div className="nm">Bloom Breaker</div>
                  <div className="sub">Click matching groups to clear the board</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("bloombreaker")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🧠</div>
                <div className="info">
                  <div className="nm">Iggy Trivia</div>
                  <div className="sub">8 questions about Italian Greyhounds</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("trivia")}>Play</button>
              </div>
              <div className="market-item game-card">
                <div style={{ fontSize: 28 }}>🌾</div>
                <div className="info">
                  <div className="nm">Seed Catch</div>
                  <div className="sub">Catch falling seeds before time runs out</div>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveGame("nestcatch")}>Play</button>
              </div>
              </PagedGrid>
            </div>
          )}

          {tab === "shop" && (
            <div className="market-lane-page">
              {shopSubtab === "shop" && <PremiumScene image={LAUNCH_ART.market} eyebrow="MARKET LANE" title="Treats, toys & treasures" copy="Browse useful little things for good dogs: toys, decor, training items, seeds, and optional Special Dog Bones." compact />}
              <div className="shop-subnav">
                <button className={shopSubtab === "shop" ? "active" : ""} onClick={() => setShopSubtab("shop")}>Meadow Shop</button>
                <button className={shopSubtab === "wardrobe" ? "active" : ""} onClick={() => setShopSubtab("wardrobe")}>Wardrobe</button>
                <button className={shopSubtab === "toys" ? "active" : ""} onClick={() => setShopSubtab("toys")}>Toy Chest</button>
              </div>

              {shopSubtab === "wardrobe" ? (
                <Wardrobe pets={pets} flags={flags} seeds={seeds} selectedPetId={wardrobePetId} onSelectPet={setWardrobePetId} onEquip={handleEquipOutfit} onUnlock={handleUnlockWardrobe} onEquipAppearance={handleEquipAppearance} onUnlockAppearance={handleUnlockAppearance} />
              ) : shopSubtab === "toys" ? (
                <>
                  <div className="shop-hero-card">
                    <div><div className="eyebrow">PLAYTIME SUPPLIES</div><h2>Toy Chest</h2><p>Every toy is a one-time play item. Use one on an Iggy to raise happiness, create a little memory, and keep the Meadow feeling alive.</p></div>
                    <div className="toy-count-badge"><strong>{Object.values(flags.toyInventory || {}).reduce((a, n) => a + Number(n || 0), 0)}</strong><span>toys in chest</span></div>
                  </div>
                  <div className="toy-filter-row">{[["all","All toys"],["common","Common"],["uncommon","Uncommon"],["rare","Rare"],["seasonal","Seasonal"]].map(([k,label]) => <button key={k} className={toyShopFilter === k ? "active" : ""} onClick={() => setToyShopFilter(k)}>{label}</button>)}</div>
                  <PagedGrid className="item-grid compact-toy-grid" pageSize={2} label="Shop items">
                    {TOYS.filter((toy) => toyShopFilter === "all" || toy.rarity === toyShopFilter).map((toy) => { const owned = toyCount(flags.toyInventory, toy.key); return <div className="toy-card" key={toy.key}><div className="toy-art"><ItemArt itemKey={toy.key} emoji={toy.emoji} size={86} /></div><div className="toy-copy"><div className="toy-name">{toy.name}</div><div className="toy-meta"><span>{TOY_RARITY_LABELS[toy.rarity]}</span><span>+{toy.happiness} ❤️</span>{owned > 0 && <span>×{owned}</span>}</div><p>{toy.description}</p></div><button className="btn btn-primary" onClick={() => handleBuyToy(toy)} disabled={seeds < toy.cost}>Buy · {toy.cost}🌾</button></div>; })}
                  </PagedGrid>
                  <div className="profile-note">Each toy gives one happy playtime. Find more treats on the next shelf.</div>
                </>
              ) : (
                <>
              <PageTabs items={[["decor","Decorations"],["training","Training"],["kennel","Kennel Space"],["seeds","Seeds"],["bones","Special Dog Bones"]]} active={shopShelf} onChange={setShopShelf} label="Meadow Shop shelves" />
              {shopShelf === "kennel" && <>
              <div className="section-title">Expand the Kennel</div>
              <div className="decor-item">
                <div style={{ fontSize: 26 }}>🏗️</div>
                <div className="info">
                  <div className="nm">Add kennel space</div>
                  <div className="sub">{effectiveKennelCapacity >= MAX_IGGIES ? `Maximum kennel size reached · ${MAX_IGGIES} Iggies` : `+${Math.min(CAPACITY_PER_UPGRADE, MAX_IGGIES - effectiveKennelCapacity)} capacity · ${upgradeCost(config, upgradesBought)} seeds`}</div>
                </div>
                <button className="btn btn-primary" onClick={handleUpgradeLoft} disabled={effectiveKennelCapacity >= MAX_IGGIES || seeds < upgradeCost(config, upgradesBought)}>
                  {effectiveKennelCapacity >= MAX_IGGIES ? "Maxed" : "Build"}
                </button>
              </div>

              </>}
              {shopShelf === "training" && <>
              <div className="section-title" style={{ marginTop: 16 }}>Training Items</div>
              <PagedGrid className="item-grid" pageSize={4} label="Shop items">
              {config.trainingItems.map((item) => (
                <div className="market-item" key={item.key}>
                  <div className="market-item-art"><ItemArt itemKey={item.key} emoji={item.emoji} size={76} /></div>
                  <div className="info">
                    <div className="nm">{item.name}</div>
                    <div className="sub">{item.cost} seeds · +{item.amount} {item.stat} when used</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleBuyTrainingItem(item)} disabled={seeds < item.cost}>
                    Buy
                  </button>
                </div>
              ))}
              </PagedGrid>

              </>}
              {shopShelf === "decor" && <>
              <div className="section-title" style={{ marginTop: 16 }}>Decorate (+happiness for everyone)</div>
              <PagedGrid className="item-grid" pageSize={4} label="Shop items">
              {config.decorations.map((d) => {
                const owned = decorations.includes(d.key);
                return (
                  <div className="decor-item" key={d.key}>
                    <div className="market-item-art"><ItemArt itemKey={d.key} emoji={d.emoji} size={76} /></div>
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
              </PagedGrid>

              </>}
              {shopShelf === "seeds" && <>
              <div className="section-title" style={{ marginTop: 16 }}>Get more seeds</div>
              <PagedGrid className="item-grid" pageSize={4} label="Shop items">
              {(config.seedPacks || []).map((p) => (
                <div className="market-item" key={p.key}>
                  <div className="market-item-art"><ItemArt itemKey={p.key} emoji={p.emoji} size={76} /></div>
                  <div className="info">
                    <div className="nm">{p.name}</div>
                    <div className="sub">{p.seeds} seeds · ${(p.priceCents / 100).toFixed(2)}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleBuyPack(p.key)} disabled={!paymentsEnabled} title={!paymentsEnabled ? "Real-money purchases are not enabled yet." : undefined}>
                    {paymentsEnabled ? "Buy" : "Coming soon"}
                  </button>
                </div>
              ))}
              </PagedGrid>

              </>}
              {shopShelf === "bones" && <>
              <div className="premium-bone-shop">
                <div className="premium-bone-heading">
                  <div className="premium-bone-icon">🦴</div>
                  <div><div className="eyebrow">OPTIONAL GROWN-UP PURCHASE</div><h3>Special Dog Bones</h3><p>Use one bone to finish an active Iggy growth or breeding timer immediately. No random rewards, no mystery boxes, and normal play never requires them. {!paymentsEnabled && <strong className="payment-coming-soon"> Purchases are currently disabled for launch safety.</strong>}</p></div>
                  <div className="bone-balance"><strong>{bones}</strong><span>owned</span></div>
                </div>
                <div className="item-grid premium-bone-grid">
                  {(config.bonePacks || []).map((p) => (
                    <div className="market-item premium-bone-pack" key={p.key}>
                      <div className="market-item-art"><ItemArt itemKey={p.key} emoji={p.emoji} size={76} /></div>
                      <div className="info"><div className="nm">{p.name}</div><div className="sub">{p.bones} Special Bones · ${(p.priceCents / 100).toFixed(2)}</div></div>
                      <button className="btn btn-primary" onClick={() => handleBuyPack(p.key, "bones")} disabled={!paymentsEnabled} title={!paymentsEnabled ? "Real-money purchases are not enabled yet." : undefined}>{paymentsEnabled ? "Buy" : "Coming soon"}</button>
                    </div>
                  ))}
                </div>
              </div>

              </>}
              <button className="btn btn-ghost" style={{ width: "100%", marginTop: 18 }} onClick={resetGame}>
                Reset progress
              </button>
                </>
              )}
            </div>
          )}
        </main>

        {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

        {selectedBird && (
          <Modal onClose={() => { setSelectedBirdId(null); setRenameDraft(""); }}>
            <div className="iggy-profile-head">
              <div className="iggy-profile-art">
                <PetArt speciesKey={selectedBird.speciesKey} colorKey={selectedBird.colorKey} stage={selectedBird.stage} outfitKey={selectedBird.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(selectedBird)} appearance={normalizeAppearance(selectedBird)} size={150} />
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

            <div className="profile-tabs" role="group" aria-label="Iggy profile sections">
              {[
                ["about", "About"],
                ["room", "My Room"],
                ["appearance", "Appearance"],
                ["care", "Care"],
                ["bond", "Bond"],
                ["genetics", "Genetics"],
                ["wardrobe", "Wardrobe"],
                ["history", "History"],
              ].map(([key, label]) => (
                <button key={key} type="button" aria-pressed={profileTab === key} className={profileTab === key ? "active" : ""} onClick={() => setProfileTab(key)}>{label}</button>
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

            {profileTab === "room" && (
              <div className="profile-panel v37-room-profile-panel">
                <IggyRoomScene
                  pet={selectedBird}
                  decorations={decorations}
                  toyInventory={flags.toyInventory || {}}
                  onWardrobe={() => setProfileTab("wardrobe")}
                  onCare={() => setProfileTab("care")}
                />
                <div className="profile-note">Each Iggy now has a visual room inside Willow Kennels. The room uses your collected decorations and toys so the pet page feels like a place, not just a stat sheet.</div>
              </div>
            )}

            {profileTab === "appearance" && (
              <div className="profile-panel">
                {selectedBird && <div className="iggy-journal-card">
                <div className="eyebrow">LIFE & MEMORIES</div><h3>📖 Iggy Journal</h3>
                <p>Little moments become part of this Iggy's permanent story.</p>
                <div className="journal-mini-stats"><span>💗 Happiness {computeHappiness(selectedBird, now, config, decorBonus)}</span><span>🧸 Plays {(selectedBird.journal || []).filter((m) => m.kind === "play").length}</span>{selectedBird.favoriteToyKey && <span>⭐ Favorite toy: {getToy(selectedBird.favoriteToyKey)?.name || "Unknown"}</span>}</div>
                {(selectedBird.journal || []).slice(-4).reverse().map((entry) => <div className="iggy-memory" key={entry.id}><span>✦</span><div><strong>{entry.title}</strong><small>{entry.at ? new Date(entry.at).toLocaleString() : ""}</small><p>{entry.text}</p></div></div>)}
              </div>}
              <div className="appearance-preview">
                  <PetArt speciesKey={selectedBird.speciesKey} colorKey={selectedBird.colorKey} stage={selectedBird.stage} outfitKey={selectedBird.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(selectedBird)} appearance={normalizeAppearance(selectedBird)} size={190} />
                </div>
                <div className="profile-facts">
                  <div><span>Body type</span><strong>{SPECIES[selectedBird.speciesKey]?.name?.replace("Italian Greyhound · ", "") || "Iggy"}</strong></div>
                  <div><span>Coat</span><strong>{selectedBird.colorKey}</strong></div>
                  <div><span>Base species key</span><strong>{selectedBird.speciesKey}</strong></div>
                  <div><span>Eyes</span><strong>{getEyeColor(normalizeAppearance(selectedBird).eyeColor).name} · {getEyeStyle(normalizeAppearance(selectedBird).eyeStyle).name}</strong></div>
                  <div><span>Visual layers</span><strong>Coat · markings · eyes · wardrobe · effects</strong></div>
                </div>
              </div>
            )}

            {profileTab === "care" && (
              <div className="profile-panel">
                {selectedBird.stage === "egg" ? (
                  <div className="profile-empty"><div className="profile-empty-icon">🥚</div><strong>Growing safely in the nest</strong><span>Hatches in {formatDuration(selectedBird.hatchAt - now)}</span><button className="btn btn-secondary bone-speedup-btn" onClick={() => handleUseSpecialBone(selectedBird.id)} disabled={bones < 1}>🦴 Hatch now · 1 bone</button></div>
                ) : (
                  <>
                    <div className="stat-row"><span>Life</span><StatBar value={(getLife(selectedBird) / getMaxLife(selectedBird)) * 100} color="#B96A34" /></div>
                    <div className="stat-row"><span>Hunger</span><StatBar value={computeHunger(selectedBird, now, config)} color="#D9A441" /></div>
                    <div className="stat-row"><span>Clean</span><StatBar value={computeClean(selectedBird, now, config)} color="#7FA6C9" /></div>
                    <div className="stat-row"><span>Happiness</span><StatBar value={computeHappiness(selectedBird, now, config, decorBonus)} color="var(--sage-deep)" /></div>
                    {selectedBird.stage === "baby" && <div className="profile-note bone-speedup-note">This puppy grows up in {formatDuration(selectedBird.growAt - now)}.<button className="btn btn-secondary bone-speedup-btn" onClick={() => handleUseSpecialBone(selectedBird.id)} disabled={bones < 1}>🦴 Grow up now · 1 bone</button></div>}
                    {selectedBird.stage === "adult" && selectedBird.breedingUntil && selectedBird.breedingUntil > now && <div className="profile-note bone-speedup-note">Resting after a family milestone for {formatDuration(selectedBird.breedingUntil - now)}.<button className="btn btn-secondary bone-speedup-btn" onClick={() => handleUseSpecialBone(selectedBird.id)} disabled={bones < 1}>🦴 Finish rest now · 1 bone</button></div>}
                    <div className="playtime-box">
                      <div><strong>🧸 Playtime</strong><small>Use a toy once to give {selectedBird.name || "this Iggy"} a happiness boost.</small></div>
                      <div className="playtime-toys">
                        {TOYS.filter((toy) => toyCount(flags.toyInventory, toy.key) > 0).slice(0, 4).map((toy) => <button key={toy.key} className="toy-use-btn" title={`${toy.name} · +${toy.happiness} happiness`} onClick={() => handlePlayToy(selectedBird.id, toy.key)}><span>{toy.emoji}</span><small>×{toyCount(flags.toyInventory, toy.key)}</small></button>)}
                        <button className="toy-use-btn more" onClick={() => { setTab("shop"); setShopSubtab("toys"); }}>＋<small>Shop</small></button>
                      </div>
                    </div>
                    <div className="profile-actions">
                      <button className="btn btn-primary" onClick={() => handleFeed(selectedBird.id)} disabled={seeds < config.feedCost}>Feed ({config.feedCost}🌾)</button>
                      <button className="btn btn-secondary" onClick={() => handleClean(selectedBird.id)}>Bathe</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {profileTab === "bond" && (() => {
              const bp = bondProgress(selectedBird);
              const bondMemories = (selectedBird.journal || []).filter((m) => m.kind === "bond");
              return (
                <div className="profile-panel">
                  <div className="bond-hero">
                    <div className="bond-emblem">{bp.current.emoji}</div>
                    <div><div className="eyebrow">GUARDIAN BOND · LEVEL {bp.current.level}</div><h3>{bp.current.name}</h3><p>{bp.next ? `${bp.remaining} bond XP until ${bp.next.name}` : "The strongest bond currently known in Iggy Meadow."}</p></div>
                  </div>
                  <div className="bond-track"><i style={{ width: `${bp.percent}%` }} /></div>
                  <div className="profile-facts">
                    <div><span>Bond experience</span><strong>{bp.xp} XP</strong></div>
                    <div><span>Next milestone</span><strong>{bp.next ? `${bp.next.emoji} ${bp.next.name}` : "Complete"}</strong></div>
                    <div><span>Play memories</span><strong>{(selectedBird.journal || []).filter((m) => m.kind === "play").length}</strong></div>
                    <div><span>Bond milestones</span><strong>{bondMemories.length}</strong></div>
                  </div>
                  <div className="profile-note">Feed, groom, play, train, explore, and share family milestones with this Iggy to deepen your bond. Bond progress is permanent and saved with the Iggy.</div>
                  {bondMemories.length > 0 && <div className="bond-memories">{bondMemories.slice(-3).reverse().map((entry) => <div key={entry.id}><span>✦</span><div><strong>{entry.title}</strong><small>{new Date(entry.at).toLocaleString()}</small></div></div>)}</div>}
                </div>
              );
            })()}

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
                <Wardrobe pets={pets} flags={flags} seeds={seeds} selectedPetId={selectedBird.id} onSelectPet={setSelectedBirdId} onEquip={handleEquipOutfit} onUnlock={handleUnlockWardrobe} onEquipAppearance={handleEquipAppearance} onUnlockAppearance={handleUnlockAppearance} />
              </div>
            )}

            {profileTab === "history" && (
              <div className="profile-panel">
                <div className="history-list">
                  <div><span className="history-dot">🐾</span><div><strong>Joined the Meadow</strong><small>{new Date(selectedBird.bornAt || Date.now()).toLocaleString()}</small></div></div>
                  {selectedBird.stage !== "egg" && <div><span className="history-dot">🌱</span><div><strong>{selectedBird.stage === "adult" ? "Reached adulthood" : "Became a puppy"}</strong><small>{selectedBird.stage === "adult" && selectedBird.growAt ? new Date(selectedBird.growAt).toLocaleString() : "Growth record"}</small></div></div>}
                  {selectedBird.lineage?.bredAt && <div><span className="history-dot">🧬</span><div><strong>Born from a Meadow pairing</strong><small>{new Date(selectedBird.lineage.bredAt).toLocaleString()}</small></div></div>}
                  <div><span className="history-dot">💗</span><div><strong>{bondLevel(selectedBird).name}</strong><small>Guardian bond level {bondLevel(selectedBird).level} · {selectedBird.bondXp || 0} XP</small></div></div>
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
