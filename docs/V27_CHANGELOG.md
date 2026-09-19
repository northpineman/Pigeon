# Iggy Meadow v27 — Heartbound Progression

## New persistent Guardian Bond system
Each Iggy now develops a permanent relationship level with its guardian. Existing saves begin safely at 0 XP / New Friend without migration.

Bond XP is earned through existing game loops:
- Feed: +2
- Groom: +2
- Toy play: +5
- Training: +3
- Battle victory: +6
- Battle loss: +2
- Breeding/family milestone: +8 per parent

Levels: New Friend, Meadow Pal, Trusted Companion, Heartbound, Kindred Spirit, Meadow Legend.

## Player-facing integration
- New Bond tab in every Iggy profile.
- Bond progress bar, XP, next milestone, play memories, and bond milestones.
- Bond level badge on kennel cards.
- Kennel can be sorted by Guardian Bond.
- Bond level-ups create permanent journal memories.
- History now includes current bond record.

## Compatibility
No destructive database changes. Bond fields live on each pet JSON object and default safely for older Iggies.
