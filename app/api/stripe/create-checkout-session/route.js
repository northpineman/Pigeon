import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_CONFIG } from "@/lib/gameData";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payments are not configured on this server yet." }, { status: 500 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabaseAdmin = getSupabaseAdmin();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }
    const user = userData.user;

    const { packKey } = await req.json();

    const { data: cfgRow } = await supabaseAdmin.from("game_config").select("config").eq("id", 1).single();
    const config = cfgRow?.config ? { ...DEFAULT_CONFIG, ...cfgRow.config } : DEFAULT_CONFIG;
    const pack = (config.seedPacks || []).find((p) => p.key === packKey);
    if (!pack) return NextResponse.json({ error: "Unknown seed pack." }, { status: 400 });

    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      client_reference_id: user.id,
      customer_email: user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: pack.priceCents,
            product_data: {
              name: `${pack.name} (${pack.seeds} seeds) — PigeonsnDoves`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        packKey: pack.key,
      },
      success_url: `${origin}/?purchase=success`,
      cancel_url: `${origin}/?purchase=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error", err);
    return NextResponse.json({ error: "Something went wrong starting checkout." }, { status: 500 });
  }
}
