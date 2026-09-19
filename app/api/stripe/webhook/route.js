import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_CONFIG } from "@/lib/gameData";

export const runtime = "nodejs";

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Stripe env vars missing on webhook route");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const packKey = session.metadata?.packKey;
    const packType = session.metadata?.packType === "bones" ? "bones" : "seeds";

    if (userId && packKey) {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: cfgRow } = await supabaseAdmin.from("game_config").select("config").eq("id", 1).single();
      const config = cfgRow?.config ? { ...DEFAULT_CONFIG, ...cfgRow.config } : DEFAULT_CONFIG;
      const catalog = packType === "bones" ? (config.bonePacks || []) : (config.seedPacks || []);
      const pack = catalog.find((p) => p.key === packKey);

      if (pack) {
        const seedsGranted = packType === "seeds" ? pack.seeds : 0;
        const bonesGranted = packType === "bones" ? pack.bones : 0;

        // Idempotency: stripe_session_id is unique, so Stripe retries cannot
        // grant the same purchase twice.
        const { error: insertErr } = await supabaseAdmin.from("purchases").insert({
          user_id: userId,
          stripe_session_id: session.id,
          pack_key: pack.key,
          purchase_type: packType,
          seeds_granted: seedsGranted,
          bones_granted: bonesGranted,
          amount_cents: session.amount_total ?? pack.priceCents,
        });

        if (!insertErr) {
          if (packType === "bones") {
            const { error: grantErr } = await supabaseAdmin.rpc("grant_special_dog_bones", {
              p_user_id: userId,
              p_amount: bonesGranted,
            });
            if (grantErr) console.error("bone grant failed", grantErr);
          } else {
            const { data: save } = await supabaseAdmin.from("player_saves").select("seeds").eq("user_id", userId).single();
            const currentSeeds = save?.seeds ?? 0;
            await supabaseAdmin
              .from("player_saves")
              .update({ seeds: currentSeeds + seedsGranted, updated_at: new Date().toISOString() })
              .eq("user_id", userId);
          }
        } else if (insertErr.code !== "23505") {
          console.error("purchase insert failed", insertErr);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
