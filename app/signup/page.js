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
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters (letters, numbers, underscore only).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: cleanUsername } },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If your Supabase project has "Confirm email" turned on, there will be
    // no active session yet — the person needs to click the emailed link first.
    if (!data.session) {
      setConfirmSent(true);
      return;
    }

    router.replace("/");
  };

  if (confirmSent) {
    return (
      <div className="page">
        <div className="auth-card">
          <div style={{ fontSize: 40 }}>📬</div>
          <h1>Check your email</h1>
          <div className="sub">
            We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and log in.
          </div>
          <Link href="/login">
            <button className="btn btn-primary" style={{ width: "100%", padding: 12 }}>Go to login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="auth-card">
        <div style={{ fontSize: 40 }}>🐹</div>
        <h1>🐹 Join CapyCove</h1>
        <div className="sub">Create your account and start your loft</div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="birdlover99" />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: "100%", padding: 12 }} disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
