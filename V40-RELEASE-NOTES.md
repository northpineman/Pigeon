# Iggy Meadow v40 — First Reveal Candidate

This release is the recommended first visual re-test after the v28 baseline.

## New visual depth
- Six bespoke illustrated Townfolk/shopkeeper portrait assets.
- Market Lane shelves now visibly carry illustrated merchandise.
- Four themed private Iggy-room backdrops: Garden, Moonlight, Harvest, and Peppermint.
- Private rooms choose a theme from the Iggy’s current outfit when possible.
- New Meadow Gazette on the home portal with illustrated story cards linking back into the world.
- Additional interaction cues and responsive polish.

## Preserved systems
- 14-Iggy ownership maximum.
- Special Dog Bones premium convenience system from v35.
- Existing save compatibility.
- No new Supabase migration beyond the existing v35 migration.

## Testing recommendation
This is a good visual reveal checkpoint. Run the v35 migration first if it has not yet been applied, copy your local `.env.local` into this release locally (never distribute it), then `npm install` and `npm run build`.
