// ============================================================
// LOOKS REGISTRY — real painted artwork, layered on top of the
// procedural PetSVG shapes.
//
// Each entry is a complete finished image (the animal + any outfit,
// painted as one piece — see the art spec for why). A look is keyed
// by "speciesKey:colorKey", so any pet with that exact species +
// color combination automatically renders with the real artwork
// instead of the code-drawn shape — no changes needed anywhere else
// in the app.
//
// NOTE: this was reset when the site's animal changed from capybaras
// to Italian Greyhounds — any art made for the old animal won't match
// and needs to be redone for the new one before it's added back here.
//
// To add a new uploaded piece:
//   1. Drop the image in /public/art/dogs/<name>.png
//   2. Add one line below: "speciesKey:colorKey": "/art/dogs/<name>.png"
//   3. If it's a brand new species+color combo (not an existing one),
//      add a matching entry to SPECIES/COLOR_HEX in gameData.js and/or
//      seasonalBirds so players can actually obtain it.
// ============================================================

export const LOOKS = {
  "king:tan": "/art/dogs/fawn-base.png",
  "ringneck:raven": "/art/dogs/raven-witch.png",
  "king:pumpkin": "/art/dogs/jack-o.png",
  "diamond:candycorn": "/art/dogs/candycorn.png",
};

export function getLookImage(speciesKey, colorKey) {
  return LOOKS[`${speciesKey}:${colorKey}`] || null;
}
