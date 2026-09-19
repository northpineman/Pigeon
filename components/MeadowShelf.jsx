"use client";
import ItemArt from "./ItemArt";
import { TOYS } from "@/lib/toys";

const DECOR_LABELS = {
  mats: ["Cozy Dog Bed","🛏️"], bath: ["Bubble Bath Tub","🫧"], "toy-basket": ["Squeaky Toy Basket","🧸"], vine: ["Agility Tunnel","🌀"], chimes: ["Little Bell Collar","🔔"], rainbow: ["Rainbow Sweater","🌈"],
  "xmas-tree": ["Christmas Tree","🎄"], "xmas-lights": ["Twinkle Lights","✨"], "hw-pumpkin": ["Jack-o'-Lantern","🎃"], "hw-bats": ["Bat Banner","🦇"]
};

export default function MeadowShelf({ decorations = [], toyInventory = {}, wardrobeInventory = [], onGoShop, onGoCollection }) {
  const entries = [];
  decorations.forEach((key) => { const meta = DECOR_LABELS[key] || [key,"✦"]; entries.push({ key:`decor-${key}`, artKey:key, name:meta[0], emoji:meta[1], tag:"Decoration" }); });
  TOYS.forEach((toy) => { const count = Number(toyInventory?.[toy.key] || 0); if (count > 0) entries.push({ key:`toy-${toy.key}`, artKey:toy.key, name:toy.name, emoji:toy.emoji, tag:`Toy ×${count}` }); });
  (wardrobeInventory || []).filter((k) => !["none","ribbon"].includes(k)).forEach((key) => entries.push({ key:`outfit-${key}`, artKey:key, name:key.replaceAll("_"," "), emoji:"🎀", tag:"Outfit" }));
  const shown = entries.slice(0, 8);

  return (
    <section className="meadow-curio-cabinet">
      <div className="curio-title"><div><small>YOUR LITTLE TREASURES</small><strong>Meadow Curio Cabinet</strong><span>Collected things make the world feel lived in.</span></div><div><button onClick={onGoCollection}>Open collection</button><button onClick={onGoShop}>Visit Market Lane</button></div></div>
      <div className="curio-cabinet-frame">
        <div className="curio-grid">
          {shown.length ? shown.map((entry) => <div className="curio-slot" key={entry.key}><ItemArt itemKey={entry.artKey} emoji={entry.emoji} size={74} /><strong>{entry.name}</strong><small>{entry.tag}</small></div>) : <div className="curio-empty"><span>🗝️</span><strong>Your cabinet is waiting</strong><small>Decorations, toys, and special finds will appear here.</small></div>}
          {shown.length > 0 && Array.from({length:Math.max(0,Math.min(8-shown.length,3))}).map((_,i)=><div className="curio-slot curio-slot-empty" key={`empty-${i}`}><span>?</span><strong>Undiscovered</strong><small>Keep exploring</small></div>)}
        </div>
      </div>
    </section>
  );
}
