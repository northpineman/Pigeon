# Launch checklist — v96

## Existing project

- Extract v96 into a fresh folder and reuse your working `.env.local`.
- Use Node.js 24 LTS and run `LAUNCH-V96.bat`, or the commands in `START-HERE-V96.md`.
- Keep the existing database: v96 requires no new migration.
- Preserve the existing Special Dog Bones and Stripe settings.
- Check sign-in, an existing save, adoption below capacity, saving/reload, wardrobe, shop, exploration, and logout/login.
- Update your existing hosting project and check the same actions at its public URL.
- Verify checkout/webhook behavior in your own Stripe environment before enabling paid purchases.

## Visual acceptance

Home and desktop destination pages use compact painted scenes and short catalog pages. Previous/Next and section tabs expose the full content. The browser report records document heights rather than cropping overflow to simulate a fit. Phone pages and expanded dialogs can scroll to keep their controls accessible.

## Verification boundary

The included build and browser results use a placeholder Supabase URL and intercepted fixtures. They establish local build, layout, navigation, pagination, and fixture compatibility. Real authentication, database permissions/persistence, payments, and a public deployment still need your configured environment.
