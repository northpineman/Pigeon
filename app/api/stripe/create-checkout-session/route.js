import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_CONFIG } from "@/lib/gameData";

export const runtime = "nodejs";

export async function POST(req) {
  if (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Purchases are not available yet." }, { status: 503 });
  }
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

    const { packKey, packType = "seeds" } = await req.json();
    if (!['seeds', 'bones'].includes(packType)) {
      return NextResponse.json({ error: "Unknown purchase type." }, { status: 400 });
    }

    const { data: cfgRow } = await supabaseAdmin.from("game_config").select("config").eq("id", 1).single();
    const config = cfgRow?.config ? { ...DEFAULT_CONFIG, ...cfgRow.config } : DEFAULT_CONFIG;
    const catalog = packType === "bones" ? (config.bonePacks || []) : (config.seedPacks || []);
    const pack = catalog.find((p) => p.key === packKey);
    if (!pack) return NextResponse.json({ error: "Unknown purchase pack." }, { status: 400 });

    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
    const itemCount = packType === "bones" ? pack.bones : pack.seeds;
    const itemLabel = packType === "bones" ? "Special Dog Bones" : "seeds";

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
              name: `${pack.name} (${itemCount} ${itemLabel}) — Iggy Meadow`,
              description: packType === "bones"
                ? "Optional speed-up currency. One Special Dog Bone finishes one active Iggy growth or breeding timer."
                : "Iggy Meadow seed pack.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        packKey: pack.key,
        packType,
      },
      success_url: `${origin}/?purchase=${packType === "bones" ? "bones-success" : "seeds-success"}`,
      cancel_url: `${origin}/?purchase=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error", err);
    return NextResponse.json({ error: "Something went wrong starting checkout." }, { status: 500 });
  }
}
