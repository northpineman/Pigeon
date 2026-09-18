"use client";
import PetArt from "./PetArt";
import { normalizeAppearance } from "@/lib/appearance";
import { normalizeGenetics } from "@/lib/genetics";

function IggySpot({ pet, index, onSelect }) {
  if (!pet) return null;
  const gen = normalizeGenetics(pet).generation;
  return (
    <button className={`v38-plaza-iggy v38-plaza-iggy-${index + 1}`} onClick={() => onSelect?.(pet.id)} title={`Visit ${pet.name || "this Iggy"}`}>
      <span className="v38-plaza-pet-shadow" />
      <PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} outfitKey={pet.outfitKey || null} appearance={normalizeAppearance(pet)} size={index === 0 ? 160 : 126} />
      <span className="v38-plaza-nameplate"><strong>{pet.name || "Unnamed Iggy"}</strong><small>Generation {gen}</small></span>
    </button>
  );
}

export default function MeadowPlaza({ pets = [], onSelectPet, onGoKennel, onGoWorld }) {
  const visible = pets.filter((p) => p.stage !== "egg").slice(0, 3);
  return (
    <section className="v38-meadow-plaza" aria-label="Meadow plaza">
      <img className="v38-plaza-backdrop" src="/art/scenes/meadow-plaza.svg" alt="" loading="eager" decoding="async" />
      <div className="v38-plaza-copy">
        <div className="eyebrow">MEADOW PLAZA</div>
        <h3>Where every little story meets</h3>
        <p>Your Iggies wander between Willow Kennels, Velvet Ribbon, the pond, and the roads beyond town.</p>
      </div>
      <div className="v38-plaza-pets">
        {visible.map((pet, index) => <IggySpot key={pet.id} pet={pet} index={index} onSelect={onSelectPet} />)}
        {!visible.length && <button className="v38-plaza-empty" onClick={onGoKennel}>🐕<strong>Your Meadow is waiting</strong><small>Adopt an Iggy to bring the plaza to life.</small></button>}
      </div>
      <div className="v38-plaza-actions">
        <button onClick={onGoKennel}><span>🏡</span><strong>Willow Kennels</strong><small>Visit your companions</small></button>
        <button onClick={onGoWorld}><span>🗺️</span><strong>Garden Gate</strong><small>Open the world map</small></button>
      </div>
    </section>
  );
}
