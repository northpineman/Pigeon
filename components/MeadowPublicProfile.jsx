"use client";
import { useState } from "react";
import { PageTabs, PagedGrid } from "./CompactPages";
import Link from "next/link";
import PetArt from "./PetArt";
import PremiumScene from "./PremiumScene";
import MeadowIcon from "./MeadowIcon";
import { LAUNCH_ART } from "@/lib/launchArt";
import { normalizeAppearance } from "@/lib/appearance";
import { normalizeWardrobeSlots } from "@/lib/looks";
import { MAX_IGGIES } from "@/lib/gameData";

export default function MeadowPublicProfile({ profile, achievements = [], error }) {
  const [section,setSection] = useState("iggies");
  const pets = profile?.birds || [];
  return <div className="site site-public-profile">
    <header className="meadow-profile-masthead"><Link href="/" className="meadow-profile-brand"><span className="meadow-brand-paw"><MeadowIcon name="paw" /></span><span><small>NARROW DOGS. BROAD ADVENTURES.</small><strong>Iggy Meadow</strong></span></Link><Link href="/" className="btn btn-ghost">← Return to the Meadow</Link></header>
    <main className="content public-profile-content">
      <PremiumScene image={LAUNCH_ART.kennel} eyebrow="THE MEADOW GUESTBOOK" title={profile ? `${profile.username}’s Kennel` : "A little home in the Meadow"} copy={profile ? `Meadow member since ${new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })}. Meet the little hounds who call this place home.` : "Every little hound has a story. Take a moment to meet a Meadow family."} priority compact />
      {error ? <div className="meadow-empty-state" role="alert"><MeadowIcon name="flower" /><h3>This kennel couldn’t be found</h3><p>{error}</p><Link href="/" className="btn btn-primary">Back to the Meadow</Link></div> : !profile ? <div className="meadow-empty-state" role="status"><MeadowIcon name="paw" /><h3>Opening the garden gate…</h3><p>Gathering this family’s stories.</p></div> : <>
        <div className="public-profile-summary"><div><MeadowIcon name="paw" /><strong>{pets.length} Iggies</strong><small>{Math.min(profile.loft_capacity || 0, MAX_IGGIES)} kennel spaces</small></div><div><MeadowIcon name="flower" /><strong>{profile.streak || 0}-day streak</strong><small>Little visits, lasting memories</small></div><div><MeadowIcon name="award" /><strong>{achievements.length} milestones</strong><small>Pages in a Meadow story</small></div>{profile.bloombreaker_best > 0 && <div><MeadowIcon name="seeds" /><strong>{profile.bloombreaker_best} points</strong><small>Bloom Breaker personal best</small></div>}</div>
        <PageTabs items={[["iggies","Meet the Iggies"],["milestones","Meadow Milestones"]]} active={section} onChange={setSection} label="Public kennel sections" />
        {section === "iggies" && <>        <h2 className="section-title">The Iggies</h2>
        {pets.length ? <PagedGrid className="public-profile-pets" pageSize={4} label="Family Iggies">{pets.map((pet) => <article className="public-iggy-card" key={pet.id}><div className="public-iggy-portrait"><PetArt speciesKey={pet.speciesKey} colorKey={pet.colorKey} stage={pet.stage} outfitKey={pet.outfitKey || null} wardrobeSlots={normalizeWardrobeSlots(pet)} appearance={normalizeAppearance(pet)} size={150} /></div><h3>{pet.name || "Unnamed Iggy"}</h3><p>Italian Greyhound · {pet.stage === "baby" ? "Puppy" : pet.stage === "egg" ? "Growing" : "Adult"}</p></article>)}</PagedGrid> : <div className="meadow-empty-state"><h3>A little room for new beginnings</h3><p>This family’s first Iggy is still to come.</p></div>}
</>}
        {section === "milestones" && <>        <h2 className="section-title">Meadow milestones</h2>
        {achievements.length ? <PagedGrid className="public-achievement-grid" pageSize={4} label="Milestones">{achievements.map((item) => <article className="public-achievement" key={item.key}><MeadowIcon name="award" /><div><h3>{item.name}</h3><p>{item.description}</p></div></article>)}</PagedGrid> : <div className="meadow-empty-state"><h3>A story just beginning</h3><p>Earned milestones will find a home here.</p></div>}
</>}
      </>}
      <footer className="meadow-profile-footer">❀ Small paws, lasting stories ❀</footer>
    </main>
  </div>;
}
