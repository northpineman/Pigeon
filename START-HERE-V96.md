# Iggy Meadow v96 — start here

This version starts from v94 via v95 and turns the existing site into short, paginated petsite pages. Use your existing database and account setup.

## Launch locally today

1. Extract the ZIP into a fresh folder.
2. Copy the working `.env.local` from your successful Iggy Meadow version into the extracted project folder, beside `package.json`.
3. Use Node.js 24 LTS; this package was built and tested on Node 24.19.0. Node 20 is not the launch target.
4. On Windows, double-click **LAUNCH-V96.bat**. It checks configuration, installs the locked dependencies, builds, and starts the site. Keep the window open.
5. After “Ready” appears, open **http://localhost:3000**.

On macOS/Linux, open a terminal in the project folder and run:

```sh
node scripts/check-launch.cjs
npm ci --no-audit --no-fund
npm run build
npm run start
```

You can also use **BUILD-V96.bat** followed by **START-V96.bat** on Windows.

## Existing saves and Special Dog Bones

Keep the same Supabase project and working environment settings. There is no v96 database migration. Keep your existing Stripe/webhook settings if purchases already work. The 14-Iggy maximum and separate Special Dog Bones wallet remain intact. Do not initialize a new database to install this update.

## Go live

Update the code in your existing hosting project and rebuild with its existing environment settings. Use the deployed URL to check sign-in, existing kennel, adoption below capacity, saving and reload, wardrobe, and the bone wallet. Paid checkout also needs a live/test Stripe check in your own environment.

The included production build and browser checks used intercepted database fixtures, not your live account or payment service. Real sign-in, live persistence, checkout, and public deployment have not been verified here. Build output is excluded because it must be rebuilt with your own environment configuration.

## Page sizes

Home is a compact plaza with companion portrait, painted destinations, and a daily noticeboard. Longer catalogs use shelves and Previous/Next controls. Desktop page checks include a 1280 × 640 browser viewport, a 1366 × 768 viewport, and 1920 × 1080. Phones reflow naturally and may scroll; zoom and expanded dialogs also need room for their content.
