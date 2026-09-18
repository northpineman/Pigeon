"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) { setError(signInError.message); return; }
    router.replace("/");
  };

  return (
    <div className="page auth-world">
      <div className="launch-auth-art" aria-hidden="true"><img src="/art/launch/meadow-plaza.webp" alt=""/></div>
      <main className="auth-storybook">
        <section className="auth-illustration">
          <div className="auth-sign">WELCOME TO</div>
          <h1>Iggy Meadow</h1>
          <p>A soft little world of Italian Greyhounds, family lines, seasonal outfits, hidden paths, and stories worth keeping.</p>
          <div className="auth-dog-frame auth-dog-frame-premium"><img src="/art/launch/fawn-master.webp" alt="Illustrated Italian Greyhound" /></div>
          <div className="auth-promise-row"><span>🐾 Raise</span><span>🎀 Dress</span><span>🧬 Discover</span><span>🗺️ Explore</span></div>
        </section>
        <section className="auth-card auth-card-v30">
          <div className="auth-kicker">THE GARDEN GATE</div>
          <h2>Welcome home</h2>
          <div className="sub">Sign in and return to your kennel.</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field"><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="auth-field"><label>Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>{loading ? "Opening the gate…" : "Enter Iggy Meadow"}</button>
          </form>
          <div className="auth-switch">New to the Meadow? <Link href="/signup">Create an account</Link></div>
          <div className="auth-footnote">🌿 Your Iggies wait for you. Nothing bad happens because you needed time away.</div>
        </section>
      </main>
    </div>
  );
}
