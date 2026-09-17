"use client";
import { useState } from "react";
import { SPECIES, COLOR_HEX, DEFAULT_CONFIG, uid } from "@/lib/gameData";

export default function AdminPanel({ config, onClose, onSave, saving }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(config)));

  const setField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));
  const setAdoptCost = (key, value) => setDraft((prev) => ({ ...prev, adoptCosts: { ...prev.adoptCosts, [key]: value } }));
  const updateListItem = (listKey, idx, field, value) =>
    setDraft((prev) => {
      const list = [...prev[listKey]];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, [listKey]: list };
    });
  const addListItem = (listKey, template) =>
    setDraft((prev) => ({ ...prev, [listKey]: [...prev[listKey], { ...template, key: uid() }] }));
  const removeListItem = (listKey, idx) =>
    setDraft((prev) => {
      const list = [...prev[listKey]];
      list.splice(idx, 1);
      return { ...prev, [listKey]: list };
    });

  const renderItemList = (listKey, label) => (
    <div style={{ marginBottom: 18 }}>
      <div className="section-title">{label}</div>
      {draft[listKey].map((item, idx) => (
        <div className="admin-row" key={item.key}>
          <input type="text" value={item.emoji} onChange={(e) => updateListItem(listKey, idx, "emoji", e.target.value)} style={{ width: 44, textAlign: "center" }} />
          <input type="text" value={item.name} onChange={(e) => updateListItem(listKey, idx, "name", e.target.value)} style={{ flex: 1, minWidth: 90 }} />
          <input type="number" value={item.cost} onChange={(e) => updateListItem(listKey, idx, "cost", Number(e.target.value))} style={{ width: 60 }} title="cost" />
          <input type="number" value={item.bonus} onChange={(e) => updateListItem(listKey, idx, "bonus", Number(e.target.value))} style={{ width: 54 }} title="happiness bonus" />
          <button className="btn btn-ghost" onClick={() => removeListItem(listKey, idx)}>✕</button>
        </div>
      ))}
      <button className="btn btn-secondary" style={{ marginTop: 6 }} onClick={() => addListItem(listKey, { name: "New item", cost: 20, bonus: 3, emoji: "🌟" })}>
        + Add item
      </button>
    </div>
  );

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>🔧 Admin Panel</div>
        <button className="btn btn-ghost" onClick={onClose}>Exit</button>
      </div>
      <div className="admin-body">
        <div className="section-title">Economy</div>
        <div className="admin-row">
          <span style={{ width: 160, fontSize: 12.5, fontWeight: 700 }}>Feed cost (seeds)</span>
          <input type="number" value={draft.feedCost} onChange={(e) => setField("feedCost", Number(e.target.value))} style={{ width: 70 }} />
        </div>
        <div className="admin-row">
          <span style={{ width: 160, fontSize: 12.5, fontWeight: 700 }}>Breed cost (seeds)</span>
          <input type="number" value={draft.breedCost} onChange={(e) => setField("breedCost", Number(e.target.value))} style={{ width: 70 }} />
        </div>
        <div className="admin-row">
          <span style={{ width: 160, fontSize: 12.5, fontWeight: 700 }}>Nest box upgrade base cost</span>
          <input type="number" value={draft.upgradeBaseCost} onChange={(e) => setField("upgradeBaseCost", Number(e.target.value))} style={{ width: 70 }} />
        </div>
        <div className="admin-row">
          <span style={{ width: 160, fontSize: 12.5, fontWeight: 700 }}>Seeds earned / Iggy / hour</span>
          <input type="number" step="0.1" value={draft.incomeBaseRate} onChange={(e) => setField("incomeBaseRate", Number(e.target.value))} style={{ width: 70 }} />
        </div>

        <div className="section-title" style={{ marginTop: 16 }}>Timers &amp; pacing (hours)</div>
        {[
          ["hungerHours", "Hunger empties after"],
          ["cleanHours", "Cleanliness empties after"],
          ["eggHatchHours", "Egg hatch time"],
          ["babyGrowHours", "Baby → adult (bred)"],
          ["adoptGrowHours", "Baby → adult (adopted)"],
          ["maxBankHours", "Max banked income hours"],
        ].map(([field, label]) => (
          <div className="admin-row" key={field}>
            <span style={{ width: 190, fontSize: 12, fontWeight: 700 }}>{label}</span>
            <input type="number" value={draft[field]} onChange={(e) => setField(field, Number(e.target.value))} style={{ width: 70 }} />
          </div>
        ))}

        <div className="section-title" style={{ marginTop: 16 }}>Adoption prices</div>
        {Object.keys(SPECIES).map((key) => (
          <div className="admin-row" key={key}>
            <span style={{ width: 160, fontSize: 12.5, fontWeight: 700 }}>{SPECIES[key].name}</span>
            <input type="number" value={draft.adoptCosts[key] ?? 0} onChange={(e) => setAdoptCost(key, Number(e.target.value))} style={{ width: 70 }} />
          </div>
        ))}

        {renderItemList("decorations", "Everyday decorations")}
        {renderItemList("christmasItems", "🎄 Christmas decorations")}
        {renderItemList("halloweenItems", "🎃 Halloween decorations")}

        <div style={{ marginBottom: 18 }}>
          <div className="section-title">Exclusive seasonal Iggies</div>
          {draft.seasonalBirds.map((b, idx) => (
            <div className="admin-row" key={b.key} style={{ flexWrap: "wrap" }}>
              <input type="text" value={b.name} onChange={(e) => updateListItem("seasonalBirds", idx, "name", e.target.value)} style={{ flex: "1 1 100%", marginBottom: 4 }} />
              <select value={b.speciesKey} onChange={(e) => updateListItem("seasonalBirds", idx, "speciesKey", e.target.value)}>
                {Object.keys(SPECIES).map((k) => (
                  <option key={k} value={k}>{SPECIES[k].name}</option>
                ))}
              </select>
              <select value={b.colorKey} onChange={(e) => updateListItem("seasonalBirds", idx, "colorKey", e.target.value)}>
                {Object.keys(COLOR_HEX).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <select value={b.season} onChange={(e) => updateListItem("seasonalBirds", idx, "season", e.target.value)}>
                <option value="christmas">Christmas</option>
                <option value="halloween">Halloween</option>
              </select>
              <input type="number" value={b.cost} onChange={(e) => updateListItem("seasonalBirds", idx, "cost", Number(e.target.value))} style={{ width: 60 }} />
              <button className="btn btn-ghost" onClick={() => removeListItem("seasonalBirds", idx)}>✕</button>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ marginTop: 6 }} onClick={() => addListItem("seasonalBirds", { name: "New Iggy", speciesKey: "rock", colorKey: "slate", cost: 50, season: "christmas" })}>
            + Add Iggy
          </button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div className="section-title">💳 Real-money seed packs</div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 8 }}>
            Prices are in US dollars. These are charged for real through Stripe — double-check before saving.
          </div>
          {draft.seedPacks.map((p, idx) => (
            <div className="admin-row" key={p.key}>
              <input type="text" value={p.emoji} onChange={(e) => updateListItem("seedPacks", idx, "emoji", e.target.value)} style={{ width: 44, textAlign: "center" }} />
              <input type="text" value={p.name} onChange={(e) => updateListItem("seedPacks", idx, "name", e.target.value)} style={{ flex: 1, minWidth: 90 }} />
              <input
                type="number"
                value={p.seeds}
                onChange={(e) => updateListItem("seedPacks", idx, "seeds", Number(e.target.value))}
                style={{ width: 64 }}
                title="seeds granted"
              />
              <input
                type="number"
                step="0.01"
                value={(p.priceCents / 100).toFixed(2)}
                onChange={(e) => updateListItem("seedPacks", idx, "priceCents", Math.round(Number(e.target.value) * 100))}
                style={{ width: 64 }}
                title="price in USD"
              />
              <button className="btn btn-ghost" onClick={() => removeListItem("seedPacks", idx)}>✕</button>
            </div>
          ))}
          <button
            className="btn btn-secondary"
            style={{ marginTop: 6 }}
            onClick={() => addListItem("seedPacks", { name: "New Pack", seeds: 100, priceCents: 99, emoji: "🌾" })}
          >
            + Add pack
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 30 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDraft(JSON.parse(JSON.stringify(DEFAULT_CONFIG)))}>
            Reset to defaults
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(draft)} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
