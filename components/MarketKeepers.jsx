"use client";
import NpcPortrait from "./NpcPortrait";

const KEEPERS = [
  { key: "shop", name: "Rowan", title: "Meadow Shopkeeper", speciesKey: "rock", colorKey: "slate", line: "Seeds, charms, and practical little treasures for a happy kennel." },
  { key: "wardrobe", name: "Velvet", title: "Boutique Keeper", speciesKey: "king", colorKey: "tan", line: "A complete look should feel like a tiny story your Iggy can wear." },
  { key: "toys", name: "Pippin", title: "Toy Chest Keeper", speciesKey: "ringneck", colorKey: "white", line: "The best toys are the ones that become a favorite memory." },
];

export default function MarketKeepers({ active = "shop", onChoose }) {
  return (
    <section className="market-keepers" aria-label="Market Lane shopkeepers">
      <div className="market-keepers-sign"><small>MEET THE LOCALS</small><strong>Market Lane Shopkeepers</strong></div>
      <div className="market-keeper-row">
        {KEEPERS.map((keeper) => (
          <button key={keeper.key} type="button" className={`market-keeper ${active === keeper.key ? "active" : ""}`} onClick={() => onChoose?.(keeper.key)}>
            <div className="market-keeper-portrait"><NpcPortrait name={keeper.name} size={92} /></div>
            <div className="market-keeper-copy"><small>{keeper.title}</small><strong>{keeper.name}</strong><p>“{keeper.line}”</p></div>
            <span className="market-keeper-enter">Visit shop →</span>
          </button>
        ))}
      </div>
    </section>
  );
}
