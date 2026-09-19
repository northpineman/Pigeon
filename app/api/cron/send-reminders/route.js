import webpush from "web-push";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const supabaseAdmin = getSupabaseAdmin();
  const { data: subs, error } = await supabaseAdmin.from("push_subscriptions").select("*");
  if (error) {
    console.error("failed to load subscriptions", error);
    return NextResponse.json({ error: "Could not load subscriptions" }, { status: 500 });
  }

  const payload = JSON.stringify({
    title: "🐕 Your kennel misses you",
    body: "Seeds are piling up and your Iggies could use a visit. Come collect today's harvest!",
    url: "/",
  });

  let sent = 0;
  let removed = 0;

  await Promise.all(
    (subs || []).map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription, payload);
        sent += 1;
      } catch (err) {
        // 404/410 means the subscription is no longer valid — clean it up.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabaseAdmin.from("push_subscriptions").delete().eq("user_id", row.user_id).eq("endpoint", row.endpoint);
          removed += 1;
        } else {
          console.error("push send failed", err.statusCode, err.body);
        }
      }
    })
  );

  return NextResponse.json({ ok: true, sent, removed });
}
