"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MeadowPublicProfile from "@/components/MeadowPublicProfile";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username || "";

  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setProfile(null);
    setAchievements(null);
    setError(null);
    (async () => {
      const [{ data: p, error: pErr }, { data: a }] = await Promise.all([
        supabase.from("public_profiles").select("*").eq("username", username).maybeSingle(),
        supabase.from("public_achievements").select("*").eq("username", username).order("earned_at", { ascending: false }),
      ]);
      if (!active) return;
      if (pErr || !p) {
        setError("Couldn't find a kennel for that username.");
        return;
      }
      setProfile(p);
      setAchievements(a || []);
    })();
    return () => { active = false; };
  }, [username]);

  return <MeadowPublicProfile profile={profile} achievements={achievements || []} error={error} />;
}
