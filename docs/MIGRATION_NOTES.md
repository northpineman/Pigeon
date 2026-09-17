# Iggy Foundation Migration Notes

When modifying the game:

- Treat Italian Greyhound as the canonical species.
- Do not introduce new `bird`, `pigeon`, or `dove` application concepts.
- Existing database compatibility names may remain until a safe DB migration exists.
- Keep pet appearance separate from wearable outfits.
- Prefer small domain modules over expanding the main game component.
- Never hard-code secrets, API keys, or private keys.
- Do not destructively reset player data during migrations.

- Supabase `player_saves.birds` remains the persistence compatibility column; React state is `pets`.
- Do not rename the database column casually; use an additive migration when we are ready.
