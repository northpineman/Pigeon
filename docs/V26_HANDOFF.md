# Iggy Meadow v26 Handoff

v26 is a reliability-focused release after v25.

### Main engineering change
Supabase save writes are now serialized. Each debounced snapshot enters a promise queue, preventing overlapping requests from arriving out of order and allowing an older snapshot to overwrite a newer one.

### Important compatibility decision
`player_saves.birds` remains the database column. It is legacy storage terminology, not a reason to risk existing player saves. The application/UI should continue moving toward Iggy-native terminology around it.

### Migration
Run `supabase/migration-iggy-meadow-v26.sql` after the prior migrations. It only updates achievement text.

### Known verification limitation
Do not claim a production build passed unless `npm install` and `npm run build` actually complete successfully.
