import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
    }

    const { petId } = await req.json();
    if (!petId || typeof petId !== "string") {
      return NextResponse.json({ ok: false, error: "Choose an Iggy first." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc("use_special_dog_bone", {
      p_user_id: userData.user.id,
      p_pet_id: petId,
    });

    if (error) {
      console.error("use_special_dog_bone failed", error);
      return NextResponse.json({ ok: false, error: "That bone couldn't be used right now." }, { status: 500 });
    }

    if (!data?.ok) {
      const messages = {
        no_bones: "You don't have a Special Dog Bone yet.",
        pet_not_found: "That Iggy could not be found.",
        nothing_to_speed_up: "This Iggy doesn't have an active timer to finish.",
        save_not_found: "Your kennel save could not be found.",
      };
      return NextResponse.json({ ok: false, error: messages[data?.error] || "That bone couldn't be used right now." }, { status: 400 });
    }

    const messages = {
      hatch: "Your Iggy hatched early with a Special Dog Bone! 🦴✨",
      grow: "Your puppy grew up with a Special Dog Bone! 🦴✨",
      breeding_rest: "Breeding rest finished early with a Special Dog Bone! 🦴✨",
    };

    return NextResponse.json({
      ok: true,
      bones: data.bones,
      birds: data.birds,
      action: data.action,
      message: messages[data.action] || "Special Dog Bone used 🦴✨",
    });
  } catch (err) {
    console.error("use-bone route error", err);
    return NextResponse.json({ ok: false, error: "That bone couldn't be used right now." }, { status: 500 });
  }
}
