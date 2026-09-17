"use client";
import PetSVG from "./PetSVG";
import { getLookImage } from "@/lib/looks";

// Drop-in art renderer: same props regardless of which animal the site
// currently features. Renders real painted artwork when one exists for
// this species+color combo, otherwise falls back to the procedural
// shape so every pet still has *something* to display before its
// artwork exists.
export default function PetArt({ speciesKey, colorKey, stage, size = 76 }) {
  const lookSrc = stage !== "egg" ? getLookImage(speciesKey, colorKey) : null;

  if (lookSrc) {
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

  return <PetSVG speciesKey={speciesKey} colorKey={colorKey} stage={stage} size={size} />;
}
