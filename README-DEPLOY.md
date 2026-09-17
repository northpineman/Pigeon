
## Current build: v8 — Layered Meadow Closet

# Deploying PigeonsnDoves

This is a real website: people can sign up with an email + password, keep their
own loft, earn achievements, and see a leaderboard. It's built with **Next.js**
(the website) and **Supabase** (accounts + database). Both have generous free
tiers and you can set the whole thing up by clicking through their websites —
no command line required.

Total time: about 20–30 minutes the first time.

---

## Part 1 — Create your database (Supabase)

1. Go to **supabase.com** and sign up (free).
2. Click **New project**. Pick any name (e.g. "pigeonsndoves"), set a database
   password (save it somewhere), pick a region close to you, and create it.
   Wait a minute or two for it to finish setting up.
3. In the left sidebar, click the **SQL Editor** icon.
4. Click **New query**.
5. Open the file `supabase/schema.sql` from this project, select all of it,
   copy it, and paste it into the SQL editor.
6. Click **Run** (bottom right). You should see "Success. No rows returned."
   This creates all the tables, security rules, starter achievements, and the
   default shop/economy settings.
7. In the left sidebar, go to **Project Settings -> API**. You'll need two
   values from this page in Part 3:
   - **Project URL**
   - **anon public** key (under "Project API keys")

### Turn off email confirmation (optional, recommended for a small/friends site)

By default Supabase makes new users click a confirmation link in their email
before they can log in. If you'd rather people can sign up and play
immediately:

- Go to **Authentication -> Providers -> Email** (or **Authentication ->
  Settings** depending on the current Supabase layout) and turn off **Confirm
  email**.

If you leave it on, that's fine too — new users will just get an email with a
link to click first (Supabase sends this automatically, nothing to build).

---

## Part 2 — Put the code on GitHub (no git commands needed)

1. Go to **github.com** and sign up (free) if you don't have an account.
2. Click the **+** in the top right -> **New repository**. Name it
   `pigeonsndoves`, keep it **Public** or **Private** (either works), and
   click **Create repository**. Don't add a README — leave it empty.
3. On the new repo's page, click **uploading an existing file**.
4. Drag in every file and folder from this project (unzip it first on your
   computer, then drag the *contents* of the folder in — `app`, `components`,
   `lib`, `supabase`, `package.json`, etc.).
5. Scroll down and click **Commit changes**.

---

## Part 3 — Deploy the website (Vercel)

1. Go to **vercel.com** and sign up (free) — choose "Continue with GitHub" so
   the two are connected automatically.
2. Click **Add New -> Project**.
3. Find your `pigeonsndoves` repo in the list and click **Import**.
4. Before clicking Deploy, open **Environment Variables** and add these two
   (from Part 1, step 7):
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
5. Click **Deploy**. Wait a minute or two — Vercel will build the site and
   give you a live link like `pigeonsndoves.vercel.app`.

That link is your real, live website. Anyone can visit it, sign up, and play.

---

## Part 4 — Make yourself an admin

1. Sign up for an account on your new live site (use your real username).
2. Back in Supabase, go to **SQL Editor -> New query** and run:
   ```sql
   update public.profiles set is_admin = true where username = 'your_username_here';
   ```
   (replace `your_username_here` with the username you signed up with).
3. Refresh the website and log back in — you'll now see a 🔧 admin icon in
   the header. Tap it to edit prices, decorations, timers, and seasonal items
   — no code involved, just fill in the forms and hit **Save changes**. Those
   changes apply to everyone who plays.

---

---

## Already deployed this before payments/notifications were added?

If you already ran the original `supabase/schema.sql` in an earlier version
of this project, don't re-run the whole file. Instead run
`supabase/migration-payments-push.sql` once (same process: SQL Editor -> New
query -> paste -> Run). It only adds the new tables and merges in the new
seed-pack settings — it won't touch any prices or items you've already
customized. Then continue with Parts 5–7 below.

If this is your first time setting this project up, `schema.sql` already
includes everything, and you can skip `migration-payments-push.sql` entirely.

---

## Part 5 — Real-money purchases (Stripe)

This lets players buy seed packs with a real credit card, via Stripe's own
secure checkout page — no card numbers ever touch your code.

1. Go to **stripe.com** and sign up (free to start; you only need to
   activate full payouts later when you're ready to accept real charges —
   everything below works in **test mode** immediately).
2. In the Stripe Dashboard, go to **Developers -> API keys**. Copy the
   **Secret key** (starts with `sk_test_...` in test mode).
3. In Vercel, go to your project -> **Settings -> Environment Variables** and
   add: `STRIPE_SECRET_KEY` = that secret key.
4. Also add `SUPABASE_SERVICE_ROLE_KEY` — find it in Supabase under
   **Project Settings -> API -> service_role** (click "Reveal" — this one is
   secret, don't share it).
5. Redeploy (Vercel -> Deployments -> ⋯ on the latest one -> Redeploy) so the
   new variables take effect.
6. Now set up the webhook so Stripe can tell your site when a payment
   succeeds: in Stripe, go to **Developers -> Webhooks -> Add endpoint**.
   - Endpoint URL: `https://your-site.vercel.app/api/stripe/webhook`
   - Events to send: select **checkout.session.completed**
   - Click **Add endpoint**, then click into it and copy the **Signing
     secret** (starts with `whsec_...`).
7. Back in Vercel, add `STRIPE_WEBHOOK_SECRET` = that signing secret, and
   redeploy once more.

**Testing it:** while in test mode, use Stripe's test card `4242 4242 4242
4242`, any future expiry date, any 3-digit CVC. Buy a seed pack from the
Shop tab — your seeds should update within a few seconds.

**Going live for real:** in the Stripe Dashboard, finish **Activate your
account** (business details, bank account for payouts). Then switch your
`STRIPE_SECRET_KEY` in Vercel to the **live** secret key (starts with
`sk_live_...`) and create a second webhook endpoint the same way as step 6
using live mode, with its own live `whsec_...` secret. A quick note: selling
virtual currency for real money may have tax/legal implications depending on
where you and your players are — worth a quick look at your local rules if
this grows beyond a hobby project.

Admins can edit seed-pack names, seed amounts, and prices anytime from the
🔧 admin panel — no code needed, and changes take effect on the very next
purchase.

---

## Part 6 — Push notifications

Lets players opt in to a daily reminder ("your loft misses you!") even when
the site/tab isn't open.

1. A working set of notification keys was already generated for you:
   ```
   VAPID_PUBLIC_KEY=BJdX-UMVvXuCRLhRTKKbm3IK7Aoc2nCl0sNT8HyCBCkwXStGfDrsDhLormSeip8bSkp1iX3Ialiy4Kw7jbSsryo
   VAPID_PRIVATE_KEY=[REDACTED — configure via environment variable]
   ```
   In Vercel -> Settings -> Environment Variables, add:
   - `VAPID_PUBLIC_KEY` = the public key above
   - `VAPID_PRIVATE_KEY` = the private key above
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = the **same** public key again (the app
     needs it available on both the server and the browser)
   - `VAPID_SUBJECT` = `mailto:` followed by your email, e.g.
     `mailto:you@example.com`
   - `CRON_SECRET` = any random string of 16+ characters you make up (this
     just stops strangers from triggering your reminder job directly)
2. Redeploy.
3. In the app, tap the 🔔 icon and hit **Enable notifications** — your
   browser will ask for permission.
4. A daily reminder is already scheduled (see `vercel.json`) to run once a
   day and notify everyone who opted in. On Vercel's free plan, cron jobs run
   at most once a day, which matches this setup already.

Want your own private keys instead of the shared ones above (recommended if
this becomes more than a personal project)? Ask me to generate a fresh pair,
or use a generator like vapidkeys.com — either way just swap the three VAPID
values in Vercel and redeploy.

---

## Part 7 — "Mobile app" (installable PWA)

The site is now a installable web app: on a phone, opening it in Chrome or
Safari and choosing **"Add to Home Screen"** puts a real app icon on the
home screen that opens full-screen, with its own icon — no app store needed,
and it's already wired up (manifest + service worker are included).

This is different from a native App Store / Play Store app. That's a bigger,
separate project: it needs a Mac with Xcode (for iOS) or Android Studio, a
paid Apple Developer account ($99/year) and/or Google Play account ($25
one-time), and each app store's review process. A tool called Capacitor can
wrap this exact website into that kind of native app fairly directly if you
ever want to go that route — just let me know and I can scaffold that
project too, but actually building and submitting it will need those
accounts and that software on your end.

---

## Updating the game later

Whenever you want to change something in the *code* (not just prices/items,
which the admin panel already handles): edit the files on GitHub directly
(click the pencil icon on any file in the repo, edit, commit), or re-upload
changed files the same way as Part 2. Vercel automatically redeploys within
a minute or two of any change to the repo.

## Notes and limitations

- **Costs:** both Supabase and Vercel have free tiers that comfortably cover
  a small personal or friends-and-family site. If it ever gets very popular,
  each has paid tiers you can upgrade to from their dashboards.
- **Custom domain:** Vercel lets you attach your own domain name (e.g.
  `pigeonsndoves.com`) for free under Project Settings -> Domains, if you buy
  one from a registrar.
- **Email sending:** Supabase sends confirmation/password-reset emails
  automatically using their own shared email service. For a small site this
  is fine; if you outgrow it, Supabase's docs explain how to connect your own
  email provider.
- **I can't click through these dashboards for you** — but if you get stuck
  or hit an error message at any step, copy/paste it back to me and I'll help
  you fix it.
