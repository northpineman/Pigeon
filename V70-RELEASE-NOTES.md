# Iggy Meadow v70 — Launch Visual Sprint

This release is a concentrated 20-step launch sprint built from v50. The goal is not to add another pile of mechanics; it is to make the working game presentable, cohesive, secure enough for a controlled launch, and dramatically closer to the approved premium art direction.

## Twenty completed steps
1. Froze v50 as the recovery baseline.
2. Added a dedicated launch-art directory.
3. Optimized the approved Meadow Plaza art to WebP.
4. Optimized the approved Adoption House art to WebP.
5. Optimized the approved Wardrobe Boutique art to WebP.
6. Optimized the approved Market Lane art to WebP.
7. Added cohesive Character Collection and Collectibles art.
8. Added a centralized launch-art registry.
9. Added a reusable responsive PremiumScene component.
10. Rebuilt the home entry around the premium Meadow scene.
11. Added a premium kennel collection hero.
12. Added a premium Adoption House hero.
13. Added a premium Collection/Archive hero.
14. Added dynamic Market Lane / Wardrobe premium heroes.
15. Preserved all existing functional controls below the art-first scenes.
16. Added the premium Wardrobe scene when the wardrobe is opened directly.
17. Reworked login/signup to use the cohesive launch art and premium Iggy master.
18. Updated Next.js from 14.2.5 to the patched 14.2.35 line and added baseline response security headers.
19. Added responsive polish, reduced-motion support, preloading, and consistent launch styling.
20. Ran static QA and packaged a fresh launch candidate.

## Important
- No save-format changes.
- No new database migration beyond the existing v35 premium-wallet migration.
- `.env.local` is not included.
- Run `npm install` so Windows updates Next.js to 14.2.35 before building.
