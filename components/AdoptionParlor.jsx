"use client";
import PetArt from "./PetArt";
const VISITORS=[{speciesKey:"rock",colorKey:"slate",name:"Slate"},{speciesKey:"king",colorKey:"tan",name:"Fawn"},{speciesKey:"ringneck",colorKey:"white",name:"Pied"}];
export default function AdoptionParlor(){return <section className="meadow-adoption-welcome" aria-label="Adoption House welcome"><div><small>A NOTE FROM THE ADOPTION HOUSE</small><h3>Take your time, little friend</h3><p>Every empty room can become somebody’s favorite place. Your new companion is waiting just below.</p></div><div className="meadow-adoption-visitors">{VISITORS.map(pet=><span key={pet.name}><PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage="adult" size={76}/><small>{pet.name} family</small></span>)}</div></section>}
