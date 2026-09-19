# Iggy Meadow v25 Handoff

v25 is the current stability baseline.

### Review priorities
1. Confirm the new action guards do not interfere with legitimate repeated actions.
2. Verify save-status transitions around Supabase errors and reconnects.
3. Exercise daily reward, wheel, feed/clean, rename, and minigame completion flows.
4. Verify public profiles render egg/baby/adult stages correctly.
5. Continue reviewing client-authoritative economy architecture before production launch.

No SQL changes are required for v25; `supabase/migration-iggy-meadow-v25.sql` is a documented no-op.
