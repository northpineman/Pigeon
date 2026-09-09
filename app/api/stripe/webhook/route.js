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

    if (userId && packKey) {
      const supabaseAdmin = getSupabaseAdmin();

      const { data: cfgRow } = await supabaseAdmin.from("game_config").select("config").eq("id", 1).single();
      const config = cfgRow?.config ? { ...DEFAULT_CONFIG, ...cfgRow.config } : DEFAULT_CONFIG;
      const pack = (config.seedPacks || []).find((p) => p.key === packKey);

      if (pack) {
        // Idempotency: this insert has a unique constraint on stripe_session_id,
        // so if Stripe retries the same webhook we won't double-credit seeds.
        const { error: insertErr } = await supabaseAdmin.from("purchases").insert({
          user_id: userId,
          stripe_session_id: session.id,
          pack_key: pack.key,
          seeds_granted: pack.seeds,
          amount_cents: session.amount_total ?? pack.priceCents,
        });

        if (!insertErr) {
          const { data: save } = await supabaseAdmin.from("player_saves").select("seeds").eq("user_id", userId).single();
          const currentSeeds = save?.seeds ?? 0;
          await supabaseAdmin
            .from("player_saves")
            .update({ seeds: currentSeeds + pack.seeds, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
        } else if (insertErr.code !== "23505") {
          // 23505 = unique_violation (already processed this session) — anything else, log it.
          console.error("purchase insert failed", insertErr);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
