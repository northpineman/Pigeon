"use client";
import { useMemo, useState } from "react";
import PetArt from "./PetArt";
import { OUTFITS, WARDROBE_SLOTS, getOutfit, normalizeWardrobeSlots } from "@/lib/looks";

const FILTERS = [
  { key: "all", label: "All" }, { key: "owned", label: "Owned" },
  { key: "common", label: "Common" }, { key: "uncommon", label: "Uncommon" }, { key: "rare", label: "Rare" },
];

export default function Wardrobe({ pets, flags, seeds, selectedPetId, onSelectPet, onEquip, onUnlock }) {
  const [filter, setFilter] = useState("all");
  const selected = pets.find((p) => p.id === selectedPetId) || pets.find((p) => p.stage !== "egg") || pets[0] || null;
  const owned = flags?.wardrobeInventory || ["none", "ribbon"];
  const equipped = normalizeWardrobeSlots(selected);
  const outfits = useMemo(() => Object.values(OUTFITS).filter((item) => {
    if (filter === "owned") return owned.includes(item.key);
    if (["common", "uncommon", "rare"].includes(filter)) return item.rarity === filter;
    return true;
  }), [filter, owned]);
  const ownedCount = Object.keys(OUTFITS).filter((key) => owned.includes(key)).length;
  const equippedCount = Object.values(equipped).filter(Boolean).length;

  return (
    <div className="wardrobe-page">
      <div className="wardrobe-hero">
        <div><div className="profile-kicker">THE MEADOW CLOSET</div><h2>Wardrobe</h2><p>Collect, layer, and save little Meadow looks for every season.</p></div>
        <div className="wardrobe-progress"><strong>{ownedCount}/{Object.keys(OUTFITS).length}</strong><span>pieces collected</span><small>{equippedCount} equipped</small></div>
      </div>

      <div className="wardrobe-dresser">
        <div className="dresser-preview">
          {selected ? <PetArt speciesKey={selected.speciesKey} colorKey={selected.colorKey} stage={selected.stage} outfitKey={selected.outfitKey || null} wardrobeSlots={equipped} size={180} /> : <div className="dresser-empty">🐕</div>}
        </div>
        <div className="dresser-info">
          <div className="profile-kicker">DRESSING ROOM</div>
          <h3>{selected?.name || "Choose an Iggy"}</h3>
          <p>{selected ? `${equippedCount} layered ${equippedCount === 1 ? "piece" : "pieces"} · ${selected.colorKey} coat` : "Choose an Iggy from the list to begin."}</p>
          <div className="dresser-slots">
            {WARDROBE_SLOTS.map((slot) => {
              const key = equipped[slot.key]; const item = getOutfit(key);
              return <div key={slot.key} className={`dresser-slot${key ? " filled" : ""}`}><span>{slot.icon}</span><div><strong>{slot.name}</strong><small>{key ? item.name : "Empty"}</small></div></div>;
            })}
          </div>
          <div className="dresser-iggies">
            {pets.filter((p) => p.stage !== "egg").map((pet) => (
              <button key={pet.id} type="button" className={selected?.id === pet.id ? "active" : ""} onClick={() => onSelectPet(pet.id)} title={`Dress ${pet.name}`}>
                <PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} outfitKey={pet.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(pet)} size={46} />
                <span>{pet.name || "Unnamed"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wardrobe-filterbar"><div className="section-title" style={{ marginBottom: 0 }}>Your collection</div><div className="wardrobe-filters">{FILTERS.map((item) => <button key={item.key} type="button" className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div></div>
      <div className="wardrobe-grid">
        {outfits.map((outfit) => {
          const isOwned = owned.includes(outfit.key);
          const isEquipped = Boolean(selected && equipped[outfit.slot] === outfit.key);
          const cost = outfit.cost ?? 50;
          return (
            <article key={outfit.key} className={`wardrobe-card${isEquipped ? " equipped" : ""}${!isOwned ? " locked" : ""}`}>
              <div className="wardrobe-card-art"><PetArt speciesKey={selected?.speciesKey || "rock"} colorKey={selected?.colorKey || "slate"} stage={selected?.stage === "egg" ? "baby" : (selected?.stage || "adult")} outfitKey={outfit.key === "none" ? null : outfit.key} wardrobeSlots={outfit.key === "none" ? {} : { [outfit.slot]: outfit.key }} size={92} /></div>
              <div className="wardrobe-card-body">
                <div className="wardrobe-card-title"><h3>{outfit.name}</h3><span>{outfit.emoji}</span></div>
                <div className="wardrobe-meta"><span>{outfit.rarity}</span><span>{outfit.season === "always" ? "Everyday" : outfit.season}</span><span>{outfit.slot}</span></div>
                <p>{outfit.description}</p>
                {!selected ? <button className="wardrobe-action" disabled>Choose an Iggy</button> : isEquipped ? <button className="wardrobe-action equipped" onClick={() => onEquip(selected.id, "none", outfit.slot)}>Remove</button> : isOwned ? <button className="wardrobe-action" onClick={() => onEquip(selected.id, outfit.key, outfit.slot)}>Equip</button> : <button className="wardrobe-action" onClick={() => onUnlock(outfit.key)} disabled={seeds < cost}>{cost === 0 ? "Claim" : `${cost} 🌾`}</button>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
