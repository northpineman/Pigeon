"use client";
import PetArt from "./PetArt";
import { normalizeAppearance } from "@/lib/appearance";
export default function KennelWing({pets=[],capacity=4,maxIggies=14,onSelect,onAdopt}) {
  const residents=pets.slice(0,4);
  return <section className="meadow-sunroom" aria-label="Willow Kennels sunroom"><div className="meadow-sunroom-title"><small>AT HOME IN THE SUNROOM</small><span>{pets.length}/{capacity} rooms occupied · {maxIggies} maximum</span></div><div className="meadow-sunroom-residents">{residents.map((pet,index)=><button key={pet.id} className="meadow-sunroom-resident" onClick={()=>onSelect?.(pet.id)}><small>ROOM {String(index+1).padStart(2,'0')}</small><span className="meadow-resident-portrait"><PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} outfitKey={pet.outfitKey||null} appearance={normalizeAppearance(pet)} size={104}/></span><strong>{pet.name||"Unnamed Iggy"}</strong><span>Visit your companion →</span></button>)}{residents.length<4&&<button className="meadow-sunroom-resident empty" onClick={onAdopt}><small>A LITTLE ROOM TO GROW</small><strong>Waiting for an Iggy</strong><span>Visit the Adoption House →</span></button>}</div></section>;
}
