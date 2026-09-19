# Iggy Meadow v96 — Short Pages Petsite

Starts from v94 through the verified v95 package. This sprint changes presentation and navigation, with no new game mechanics or save migration.

## Short pages

- Home becomes a compact plaza: companion portrait, six painted destination windows, and a daily noticeboard. Daily Board, Gazette, and Meadow Promise live on their own short sections.
- The masthead, resource rail, account controls, menus, chapter ribbon, and decorative furniture use a cohesive compact petsite composition.
- Kennel displays four companions per page. Empty spaces appear within the current page, and all 14 companions remain reachable.
- Adoption House has a short painted welcome and six compact adoption cards. Breeding remains a separate section with paginated adult companions.
- Market Lane separates decorations, training, kennel space, seeds, and Special Dog Bones into shelves. Toy Chest uses two wide cards per page.
- Wardrobe separates outfits, eyes, and art archive. Complete outfits display two per page; the dressing selector reaches every eligible Iggy. Eye colors and styles have separate shelves.
- Collections use short pages and parallel record columns. World destinations use painted region choices; Atlas and Routes have their own pages.
- Bramblewick, Whispering Woods, seasonal shops, games, and public profiles use short sections and catalogs. Full content stays accessible through section buttons and page controls.
- Existing Meadow art is reused for decorative painted scenes. No replacement artwork or gameplay system is introduced.
- Phone layouts reflow naturally. Expanded dialogs, phone content, and browser zoom can scroll to preserve access.

## Start locally

Copy your working `.env.local` from your successful version into this project. Use Node.js 24 LTS and double-click `LAUNCH-V96.bat` on Windows, or follow `START-HERE-V96.md`. The shortcut checks configuration, installs locked dependencies, builds, and starts the local server. Existing `BUILD` and `START` shortcuts are updated for v96.

## Compatibility

The 14-Iggy maximum, existing save/database format, Special Dog Bones wallet, premium APIs, payment handlers, game data, and approved artwork remain intact. All 149 files under `lib`, `supabase`, `app/api`, and `public/art` are byte-identical to v95, which preserved those files from v94. `docs/V96-COMPATIBILITY.json` records the hashes. No new database migration is required.

## Verification

- `npm run build` passed on Node 24.19.0 / Next.js 14.2.35 with a local placeholder Supabase configuration.
- The resulting production-mode server passed 97 browser viewport checks across 1280 × 640, 1366 × 768, 1920 × 1080, and 390 × 844.
- Every tested desktop view had no document scrolling or horizontal overflow. The complete section sweep ran at the smallest desktop viewport. Phone content reflowed without horizontal overflow.
- Browser checks reported no broken image assets or uncaught errors. Images were decoded before visual captures.
- Pagination reached all 14 kennel/public-profile Iggies, all six featured outfits, and all eight game choices.
- Full-kennel adoption controls stayed disabled. The separate Special Dog Bones wallet retained seven bones; the boutique selector reached the 14th Iggy.
- Profile dialogs remained within each viewport and passed Escape/Tab containment checks.
- The intercepted save retained 14 pets, capacity 14, 1,200 seeds, and the existing complete outfit. Bones stayed outside the ordinary save payload.
- The launch readiness script rejected missing configuration and accepted a temporary fixture configuration. Windows batch shortcuts were reviewed; they were not executed on Windows here.


See `docs/validation/v96` for the final build log, browser report, and visual samples. Account and database traffic in the browser tests is intercepted. Real sign-in, live saves and database permissions, payment checkout/webhooks, and a hosted deployment still require validation with your own configured project.
