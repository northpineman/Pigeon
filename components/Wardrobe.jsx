"use client";
import { useMemo, useState } from "react";
import { PageTabs, PagedGrid } from "./CompactPages";
import PetArt from "./PetArt";
import { OUTFITS, getOutfit } from "@/lib/looks";
import { appearanceInventoryDefaults, appearanceItemKey, EYE_COLORS, EYE_STYLES, getEyeColor, getEyeStyle, normalizeAppearance } from "@/lib/appearance";
import { WARDROBE_ASSET_SETS } from "@/lib/wardrobeAssets";

const FILTERS = [
  { key: "all", label: "All" }, { key: "owned", label: "Owned" },
  { key: "common", label: "Common" }, { key: "uncommon", label: "Uncommon" }, { key: "rare", label: "Rare" }, { key: "special", label: "Special" },
];

const THEMED_KEYS = ["peppermint_holly", "icy_snowflake", "apple_harvest", "golden_harvest", "spring_blossom", "dogwood_charm"];

export default function Wardrobe({ pets, flags, seeds, selectedPetId, onSelectPet, onEquip, onUnlock, onEquipAppearance, onUnlockAppearance }) {
  const [eyeSection, setEyeSection] = useState("color");
  const [studio, setStudio] = useState("outfits");
  const [filter, setFilter] = useState("all");
  const selected = pets.find((p) => p.id === selectedPetId) || pets.find((p) => p.stage !== "egg") || pets[0] || null;
  const owned = flags?.wardrobeInventory || ["none", "ribbon"];
  const appearanceOwned = flags?.appearanceInventory || appearanceInventoryDefaults();
  const outfitKeys = THEMED_KEYS;
  const outfits = useMemo(() => outfitKeys.map((key) => OUTFITS[key]).filter(Boolean).filter((item) => {
    if (filter === "owned") return owned.includes(item.key);
    return filter === "all" || item.rarity === filter;
  }), [filter, owned]);
  const equippedOutfit = selected?.outfitKey && outfitKeys.includes(selected.outfitKey) ? selected.outfitKey : null;
  const appearance = normalizeAppearance(selected);
  const ownedOutfitCount = outfitKeys.filter((key) => owned.includes(key)).length;
  const ownedAppearanceCount = appearanceOwned.length;
  const dressablePets = pets.filter((p) => p.stage !== "egg");
  const shownOutfits = outfits;

 const buyOrEquipAppearance = (category, key) => {
    const id = appearanceItemKey(category, key);
    if (appearanceOwned.includes(id)) onEquipAppearance?.(selected.id, category, key);
    else onUnlockAppearance?.(category, key);
  };

  return (
    <div className="wardrobe-page">
      <PageTabs items={[["outfits","Seasonal Outfits"],["eyes","Eye Studio"],["archive","Art Archive"]]} active={studio} onChange={setStudio} label="Boutique sections" />
      {studio !== "archive" && <div className="wardrobe-dresser">
        <div className="dresser-preview">
          {selected ? <PetArt speciesKey={selected.speciesKey} colorKey={selected.colorKey} stage={selected.stage} outfitKey={selected.outfitKey || null} wardrobeSlots={{ full: equippedOutfit }} appearance={appearance} size={180} /> : <div className="dresser-empty">🐕</div>}
        </div>
        <div className="dresser-info">
          <div className="profile-kicker">DRESSING ROOM</div>
          <h3>{selected?.name || "Choose an Iggy"}</h3>
          <p>{selected ? `${equippedOutfit ? getOutfit(equippedOutfit).name : "Everyday look"} · ${getEyeColor(appearance.eyeColor).name} eyes` : "Choose an Iggy from the list to begin."}</p>
          <label className="dresser-select"><span>Choose your Iggy</span><select aria-label="Dressing room Iggy" value={selected?.id || ""} onChange={(e) => onSelectPet(e.target.value)}>{dressablePets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name || "Unnamed Iggy"}</option>)}</select></label>

        </div>
      </div>}

      {studio === "eyes" && <section className="appearance-studio">
        <div className="section-title">✨ Eye Studio</div>
        <p className="wardrobe-asset-intro">Choose the eyes that make your Iggy yours.</p>
        <PageTabs items={[["color","Eye Colors"],["style","Eye Styles"]]} active={eyeSection} onChange={setEyeSection} label="Eye Studio shelves" />
        <div className="appearance-columns">
          {eyeSection === "color" && <div className="appearance-group">
            <div className="appearance-group-title">Eye color</div>
            <div className="appearance-grid">
              {EYE_COLORS.map((item) => {
                const id = appearanceItemKey("eye-color", item.key); const has = appearanceOwned.includes(id); const active = appearance.eyeColor === item.key;
                return <button key={item.key} type="button" className={`appearance-card${active ? " active" : ""}${!has ? " locked" : ""}`} onClick={() => selected && buyOrEquipAppearance("eye-color", item.key)} disabled={!selected || (!has && seeds < item.cost)}>
                  <span className="eye-swatch" style={{ background: item.color }}><i /></span><strong>{item.name}</strong><small>{item.rarity} · {has ? (active ? "Selected" : "Owned") : `${item.cost} 🌾`}</small>
                </button>;
              })}
            </div>
          </div>}
          {eyeSection === "style" && <div className="appearance-group">
            <div className="appearance-group-title">Eye style</div>
            <div className="appearance-grid">
              {EYE_STYLES.map((item) => {
                const id = appearanceItemKey("eye-style", item.key); const has = appearanceOwned.includes(id); const active = appearance.eyeStyle === item.key;
                return <button key={item.key} type="button" className={`appearance-card${active ? " active" : ""}${!has ? " locked" : ""}`} onClick={() => selected && buyOrEquipAppearance("eye-style", item.key)} disabled={!selected || (!has && seeds < item.cost)}>
                  <span className="eye-style-icon">{item.emoji}</span><strong>{item.name}</strong><small>{item.rarity} · {has ? (active ? "Selected" : "Owned") : `${item.cost} 🌾`}</small>
                </button>;
              })}
            </div>
          </div>}
        </div>
      </section>}

      {studio === "outfits" && <>
      <div className="wardrobe-filterbar"><div className="section-title" style={{ marginBottom: 0 }}>Seasonal outfit collection</div><div className="wardrobe-filters">{FILTERS.map((item) => <button key={item.key} type="button" aria-pressed={filter === item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div></div>
      <PagedGrid className="wardrobe-grid themed-outfit-grid" pageSize={2} label="Outfits" key={filter}>
        {shownOutfits.map((outfit) => {
          const isOwned = owned.includes(outfit.key);
          const isEquipped = Boolean(equippedOutfit === outfit.key);
          const asset = WARDROBE_ASSET_SETS.find((x) => x.key === outfit.key);
          const cost = outfit.cost ?? 50;
          return (
            <article key={outfit.key} className={`wardrobe-card${isEquipped ? " equipped" : ""}${!isOwned ? " locked" : ""}`}>
              <div className="wardrobe-card-art">{outfit.fullArt ? <img loading="lazy" decoding="async" src={outfit.fullArt} alt={`${outfit.name} complete outfit`} width={110} height={110} style={{ width: 110, height: 110, objectFit: "contain" }} /> : null}</div>
              <div className="wardrobe-card-body">
                <div className="wardrobe-card-title"><h3>{outfit.name}</h3><span>{outfit.emoji}</span></div>
                <div className="wardrobe-meta"><span>{outfit.rarity}</span><span>{outfit.season}</span><span>complete set</span></div>
                <p>{outfit.description}</p>
                {asset && <small className="outfit-asset-note">✦ {asset.componentCount} illustrated pieces · one cohesive look</small>}
                {!selected ? <button className="wardrobe-action" disabled>Choose an Iggy</button> : isEquipped ? <button className="wardrobe-action equipped" onClick={() => onEquip(selected.id, "none")}>Remove outfit</button> : isOwned ? <button className="wardrobe-action" onClick={() => onEquip(selected.id, outfit.key)}>Wear complete set</button> : <button className="wardrobe-action" onClick={() => onUnlock(outfit.key)} disabled={seeds < cost}>{cost} 🌾</button>}
              </div>
            </article>
          );
        })}
      </PagedGrid>
      {outfits.length === 0 && <div className="meadow-empty-state"><h3>No looks on this shelf yet</h3><p>Try another collection to find your Iggy’s next look.</p><button className="btn btn-ghost" onClick={() => setFilter("all")}>Browse all looks</button></div>}
      </>}

      {studio === "archive" && <section className="wardrobe-asset-library">
        <div className="section-title">Seasonal art archive</div>
        <p className="wardrobe-asset-intro">A closer look at the illustrated pieces behind each complete seasonal outfit.</p>
        <PagedGrid className="wardrobe-asset-grid" pageSize={2} label="Art sets">
          {WARDROBE_ASSET_SETS.map((set) => (
            <article key={set.key} className="wardrobe-asset-set">
              <div className="wardrobe-asset-set-head"><div><strong>{set.name}</strong><small>{set.season} · {set.rarity}</small></div><span>{set.componentCount} art pieces</span></div>
              <div className="wardrobe-asset-preview"><img loading="lazy" decoding="async" src={set.fullArt} alt="" /><img loading="lazy" decoding="async" src={set.collectionArt} alt="" /></div>
            </article>
          ))}
        </PagedGrid>
      </section>}
    </div>
  );
}
