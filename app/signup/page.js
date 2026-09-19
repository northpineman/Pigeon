"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (cleanUsername.length < 3) { setError("Username must be at least 3 characters (letters, numbers, underscore only)."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { username: cleanUsername } } });
    setLoading(false);
    if (signUpError) { setError(signUpError.message); return; }
    if (!data.session) { setConfirmSent(true); return; }
    router.replace("/");
  };

  if (confirmSent) return (
    <div className="page auth-world"><main className="auth-storybook auth-storybook-small"><section className="auth-card auth-card-v30 auth-confirm"><div className="auth-mail">📬</div><div className="auth-kicker">ONE LAST LITTLE STEP</div><h2>Check your email</h2><div className="sub">A confirmation link is headed to <strong>{email}</strong>. Follow it, then come back through the garden gate.</div><Link href="/login"><button className="btn btn-primary auth-submit">Go to login</button></Link></section></main></div>
  );

  return (
    <div className="page auth-world">
      <div className="launch-auth-art" aria-hidden="true"><img src="/art/launch/adoption-house.webp" alt=""/></div>
      <main className="auth-storybook">
        <section className="auth-illustration auth-illustration-signup">
          <div className="auth-sign">A NEW STORY BEGINS</div>
          <h1>Join the Meadow</h1>
          <p>Adopt your first Iggy, fill a cozy kennel, collect beautiful looks, trace family lines, and discover the world beyond the gate.</p>
          <div className="auth-dog-frame auth-dog-frame-premium"><img src="/art/launch/fawn-master.webp" alt="Illustrated Italian Greyhound" /></div>
          <div className="auth-promise-row"><span>💗 Kind</span><span>🌙 Cozy</span><span>✨ Curious</span><span>🎃 Spooky-cute</span></div>
        </section>
        <section className="auth-card auth-card-v30">
          <div className="auth-kicker">MEADOW REGISTRATION</div>
          <h2>Create your keeper account</h2>
          <div className="sub">Your first kennel is just beyond the gate.</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field"><label>Username</label><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="iggylover99" /></div>
            <div className="auth-field"><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="auth-field"><label>Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>{loading ? "Preparing your kennel…" : "Begin my Meadow story"}</button>
          </form>
          <div className="auth-switch">Already have a kennel? <Link href="/login">Log in</Link></div>
        </section>
      </main>
    </div>
  );
}
