# Iggy Meadow v95 — Botanical Finish

Starts from **v94 Meadow Chrome**. A launch polish sprint for the existing game; no new mechanics.

## Changes

- Painted destination thumbnails replace emoji navigation tiles, with clearer Home, Adoption House, and Market Lane names.
- Engraved paw, seed, bone, flower, account, and utility ornaments unify the masthead.
- Special Dog Bones have their full name in the wallet; balances and purchase behavior are preserved.
- Botanical notices, headers, menus, filters, care facts, and resource plaques share blush, sage, ivory, and antique gold treatments.
- Painted shop windows replace the procedural Market Lane storefronts. Keeper portraits receive matching frames.
- Sunroom companion portraits replace the old procedural kennel rooms while retaining their profile actions.
- Adoption House receives a calmer welcome panel and framed visitor portraits.
- Kennel cards, empty spaces, adoption cards, market goods, and boutique shelves use coordinated frames.
- Repeated hero banners are removed from Kennel, Adoption House, and Market Lane. Wardrobe no longer renders two boutique heroes.
- Boutique selection uses separate, unsaved UI state: picking an Iggy no longer opens a profile modal over the dressing room. All 14 Iggies remain selectable.
- Wardrobe empty filters provide a clear route back to all looks.
- Public profiles now use painted scenes, matching portrait frames, milestones, and branded loading/empty/error states. Saved outfits and appearance are displayed.
- Tall outfit images are contained in their portrait boxes; dialog names wrap within the header.
- Dialogs gain a visible close button, Escape handling, Tab containment, focus restoration, and background scroll locking.
- Mobile navigation fits into two rows of four illustrated destinations; utility controls use larger targets.
- Keyboard skip navigation, filter selection states, toast announcements, reduced motion, and browser zoom support are included.
- A dependency lockfile is included for repeatable installs.

## Compatibility

No new migration or save-format change. Keep your existing Supabase project and working `.env.local`.

The 14-Iggy maximum is preserved. Special Dog Bone wallet, purchases, and use-bone API are unchanged. All 149 existing files under `lib`, `supabase`, `app/api`, and `public/art` are byte-identical to v94. Existing GameApp load/save, timer, adoption, breeding, purchase, and bone handlers are also byte-identical; the only added state is the temporary boutique selection.

## Verification

- `npm run build` completed successfully on Node 24.19.0 / Next.js 14.2.35 using a local placeholder Supabase configuration.
- The resulting production-mode server was exercised with intercepted account/database fixtures. Seven views at 1440, 768, and 390 pixels passed: Home, Kennel, Iggy dialog, Adoption House, Market Lane, Wardrobe, and public profile.
- No page overflow, broken artwork, or uncaught browser errors in these 21 view checks.
- Full-kennel adoption controls remained disabled. Seven Special Dog Bones appeared in the wallet/shop. The 14th Iggy remained selectable in the boutique without opening a dialog.
- Escape, Tab containment, and focus restoration passed. Profile artwork and headings stayed inside their allocated areas.
- A fixture save retained 14 pets, 14 capacity, 1,200 seeds, and the existing complete outfit. Bones remained outside the ordinary save payload.
- Compatibility hashes, build output, visual review samples, and fixture results are under `docs/validation` and `docs/V95-COMPATIBILITY.json`.

This verifies compilation and fixture-based local behavior. Live Supabase authentication/RLS, payment/provider operations, and deployment are **not certified** by these checks. The ZIP contains source, not a prebuilt `.next` folder; rebuild with your own configuration.

## Start

1. Extract into a new folder; retain the working v94 installation as a fallback.
2. Copy your working `.env.local` into the new folder.
3. Run `BUILD-V95.bat`. After a successful build, run `START-V95.bat`.
4. Open `http://localhost:3000`. No new SQL is required.

Never reset your database or use Reset progress to install this update.
