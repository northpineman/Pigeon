"use client";
import PetArt from "./PetArt";
import ItemArt from "./ItemArt";
import { normalizeAppearance } from "@/lib/appearance";

const FALLBACK_DECOR = ["mats", "toy-basket", "chimes"];

export default function IggyRoomScene({ pet, decorations = [], toyInventory = {}, onWardrobe, onCare }) {
  if (!pet) return null;
  const decor = (decorations.length ? decorations : FALLBACK_DECOR).slice(0, 3);
  const toyKeys = Object.entries(toyInventory || {}).filter(([, count]) => Number(count) > 0).map(([key]) => key);
  const favoriteToy = pet.favoriteToyKey || toyKeys[0] || "moon-bear";
  const stageLabel = pet.stage === "adult" ? "Adult Iggy" : pet.stage === "baby" ? "Puppy" : "Growing egg";
  const worn = [pet.outfitKey, ...Object.values(pet.wardrobeSlots || {})].filter(Boolean).join(" ").toLowerCase();
  const roomTheme = worn.includes("peppermint") || worn.includes("snow") || worn.includes("icy")
    ? (worn.includes("peppermint") ? "peppermint" : "moonlight")
    : worn.includes("apple") || worn.includes("harvest") || worn.includes("pumpkin") || worn.includes("golden")
      ? "harvest"
      : worn.includes("dogwood") || worn.includes("spring") || worn.includes("blossom")
        ? "garden"
        : "classic";
  const roomBackdrop = roomTheme === "classic" ? "/art/scenes/kennel-room-backdrop.svg" : `/art/rooms/${roomTheme}.svg`;

  return (
    <section className={`v38-iggy-room v40-room-theme-${roomTheme} room-tone-${pet.speciesKey || "rock"}`} aria-label={`${pet.name || "Iggy"}'s room`}>
      <img className="v38-room-backdrop" src={roomBackdrop} alt="" loading="lazy" decoding="async" />
      <div className="v38-room-frame"><span>🐾</span><small>{pet.name || "My Iggy"}</small></div>
      <div className="v38-room-shelf">{decor.slice(1).map((key) => <span key={key}><ItemArt itemKey={key} size={50} /></span>)}</div>
      <div className="v38-room-pet"><PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} outfitKey={pet.outfitKey || null} wardrobeSlots={pet.wardrobeSlots} appearance={normalizeAppearance(pet)} size={206} /></div>
      <div className="v38-room-toy"><ItemArt itemKey={favoriteToy} size={66} /><small>{pet.favoriteToyKey ? "favorite toy" : "toy corner"}</small></div>
      <div className="v38-room-decor-floor"><ItemArt itemKey={decor[0]} size={74} /></div>
      <div className="v38-room-nameplate"><small>WILLOW KENNELS · PRIVATE ROOM</small><strong>{pet.name || "Unnamed Iggy"}</strong><span>{stageLabel} · a room that remembers them</span></div>
      <div className="v38-room-actions"><button type="button" onClick={onWardrobe}>🎀 Open wardrobe</button><button type="button" onClick={onCare}>🧸 Care & play</button></div>
    </section>
  );
}
