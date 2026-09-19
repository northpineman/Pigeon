# Iggy Meadow v35 — 14-Iggy Kennel + Special Dog Bones

## Permanent kennel maximum

- A player may own at most **14 Iggies**.
- Kennel upgrades still begin at 4 spaces and add 2 spaces at a time, but can never exceed 14.
- Adoption, seasonal adoption, breeding, and pet prizes all respect the same hard cap.
- Supabase also enforces `jsonb_array_length(birds) <= 14`, so the rule does not rely only on the browser UI.
- Existing saves are never asked to delete an Iggy. The migration is marked `NOT VALID` for legacy data, while new writes are enforced.

## Special Dog Bones

Special Dog Bones are an optional premium currency purchased through Stripe.

One bone performs one deterministic time skip for a selected Iggy:

1. Egg -> hatches immediately into a puppy.
2. Puppy -> grows immediately into an adult.
3. Adult on breeding rest -> rest timer ends immediately.

There are **no randomized rewards, loot boxes, mystery results, or chance-based premium purchases**.
Normal game progression remains available without buying bones.

The shop labels bones as an **optional grown-up purchase** and asks for confirmation before opening Stripe checkout.

## Security design

Premium balances are stored in `public.premium_wallets`, separate from normal player-save data.
Authenticated browser users can read their own balance but cannot directly insert or update it.

- Stripe webhook verifies the payment and calls a service-role-only database function to grant bones.
- Spending a bone goes through `/api/premium/use-bone`.
- A service-role-only Postgres function atomically verifies the balance, consumes one bone, and updates the Iggy timer state.
- Stripe purchase rows remain idempotent through the unique `stripe_session_id` constraint.

## Required migration

For an existing Iggy Meadow Supabase project, run:

`supabase/migration-iggy-meadow-v35.sql`

before testing Special Dog Bones or the database-level 14-Iggy limit.

No destructive migration is included.
