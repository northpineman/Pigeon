"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GameApp from "@/components/GameApp";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProfile(currentUser) {
      let { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
      // The profile row is created by a database trigger right after signup.
      // On a very first login it can lag by a moment, so retry briefly.
      let attempts = 0;
      while ((!data || error) && attempts < 5) {
        await new Promise((r) => setTimeout(r, 400));
        const retry = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
        data = retry.data;
        error = retry.error;
        attempts += 1;
      }
      if (!active) return;
      if (error || !data) {
        setProfileError("Couldn't load your profile. Try refreshing the page.");
      } else {
        setProfile(data);
      }
    }

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      if (!session) {
        router.replace("/login");
        return;
      }
      setUser(session.user);
      await loadProfile(session.user);
      setChecking(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/login");
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking || !user) {
    return (
      <div className="site">
        <div className="loading-screen">
          <div className="em">🐕</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="page">
        <div className="auth-card">
          <div className="auth-error">{profileError}</div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return <GameApp user={user} profile={profile} onSignOut={handleSignOut} />;
}
