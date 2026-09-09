import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. This client uses the service role key, which bypasses row
// level security entirely. Never import this file from a "use client"
// component or expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.

let cached = null;

export function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  }
  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
