"use client";
import PetSVG from "./PetSVG";
import { getLookImage } from "@/lib/looks";

// Drop-in art renderer: same props regardless of which animal the site
// currently features. Renders real painted artwork when one exists for
// this species+color combo, otherwise falls back to the procedural
// shape so every pet still has *something* to display before its
// artwork exists.
export default function PetArt({ speciesKey, colorKey, stage, outfitKey = null, wardrobeSlots = null, size = 76 }) {
  const lookSrc = stage !== "egg" ? getLookImage(speciesKey, colorKey, outfitKey) : null;
  const hasCustomOutfit = Boolean((outfitKey && outfitKey !== "none") || (wardrobeSlots && Object.values(wardrobeSlots).some(Boolean)));
  const shouldUsePaintedLook = Boolean(lookSrc && !hasCustomOutfit);

  if (shouldUsePaintedLook) {
    return (
      <img
        src={lookSrc}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain", borderRadius: 8 }}
      />
    );
  }

  return <PetSVG speciesKey={speciesKey} colorKey={colorKey} stage={stage} outfitKey={outfitKey} wardrobeSlots={wardrobeSlots} size={size} />;
}
