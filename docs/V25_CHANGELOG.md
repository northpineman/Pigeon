# Iggy Meadow v25 — Reliability Pass

## Focus
A stability-oriented pass designed to harden everyday player actions without changing the existing save schema.

## Changes
- Added visible save state in the desktop header: Saved, Saving, or Save failed.
- Added last-successful-save timestamp to the save indicator tooltip.
- Added action guards to feeding, grooming, daily reward claims, renaming, and Harvest Wheel result handling.
- Added a per-game-round reward lock so a game completion callback cannot grant the same game reward twice in one round.
- Prevented feeding/grooming egg-stage Iggies.
- Added validation to wheel result handling so malformed/negative costs cannot deduct seeds.
- Public kennel profiles now render baby Iggies as babies instead of forcing every non-egg pet to adult art.
- Added a no-op v25 SQL migration documenting that no destructive schema change is required.

## Preserved
- `player_saves.birds` remains unchanged for database compatibility.
- Existing genetics, wardrobe, appearance, toys, exploration, Bramblewick, Woods, Compendium, quests, achievements, and Stripe flows remain intact.
