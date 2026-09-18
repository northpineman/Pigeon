"use client";

import PetSVG from "./PetSVG";
import { getLookImage, getOutfit, getPremiumCoatImage } from "@/lib/looks";
import { normalizeAppearance } from "@/lib/appearance";

function outfitKeys(outfitKey, wardrobeSlots) {
  const slots = wardrobeSlots && typeof wardrobeSlots === "object" ? wardrobeSlots : {};
  const keys = Object.values(slots).filter(Boolean);
  if (outfitKey && outfitKey !== "none" && !keys.includes(outfitKey)) keys.push(outfitKey);
  return [...new Set(keys)];
}

function getFullOutfitArt(outfitKey, wardrobeSlots) {
  const slots = wardrobeSlots && typeof wardrobeSlots === "object" ? wardrobeSlots : {};
  const direct = slots.full || null;
  if (direct) {
    const art = getOutfit(direct)?.fullArt;
    if (art) return { key: direct, art };
  }
  if (outfitKey && outfitKey !== "none") {
    const outfit = getOutfit(outfitKey);
    if (outfit?.fullArt) return { key: outfitKey, art: outfit.fullArt };
  }
  return null;
}

export default function PetArt({
  speciesKey,
  colorKey,
  stage,
  outfitKey = null,
  wardrobeSlots = null,
  appearance = null,
  size = 76,
  className = "",
}) {
  // Keep the swaddled “on the way” state from the procedural renderer. Every
  // visible baby/adult Iggy now uses painted artwork instead of the old SVG body.
  if (stage === "egg") {
    return (
      <div className={`premium-iggy premium-iggy-egg ${className}`.trim()} style={{ width: size, height: size }}>
        <PetSVG speciesKey={speciesKey} colorKey={colorKey} stage="egg" size={size} />
      </div>
    );
  }

  const face = normalizeAppearance({ appearance });
  const complete = getFullOutfitArt(outfitKey, wardrobeSlots);
  const special = getLookImage(speciesKey, colorKey, outfitKey);
  const src = complete?.art || special || getPremiumCoatImage(colorKey);
  const keys = outfitKeys(outfitKey, wardrobeSlots).filter((key) => key !== complete?.key);
  const stageClass = stage === "baby" ? "premium-iggy-baby" : "premium-iggy-adult";
  const hasFantasyCoat = ["iridescent", "ghost", "holly", "robin", "raven", "candycorn", "pumpkin", "santa"].includes(colorKey);

  return (
    <div
      className={`premium-iggy ${stageClass}${complete ? " premium-iggy-full-look" : ""}${hasFantasyCoat ? " premium-iggy-fantasy" : ""} ${className}`.trim()}
      style={{ width: size, height: size }}
      data-eye-color={face.eyeColor}
      data-eye-style={face.eyeStyle}
    >
      <span className="premium-iggy-shadow" aria-hidden="true" />
      <img
        className="premium-iggy-art"
        loading="lazy"
        decoding="async"
        src={src}
        alt=""
        width={size}
        height={size}
        draggable="false"
      />
      {keys.length > 0 && (
        <span className="premium-iggy-accessories" aria-label="Equipped accessories">
          {keys.slice(0, 3).map((key) => {
            const item = getOutfit(key);
            return <i key={key} title={item?.name || key}>{item?.emoji || "✦"}</i>;
          })}
        </span>
      )}
      {face.eyeStyle !== "classic" && <span className={`premium-eye-spark eye-${face.eyeStyle}`} aria-hidden="true">✦</span>}
      {stage === "baby" && <span className="premium-puppy-ribbon" aria-hidden="true">baby</span>}
    </div>
  );
}
