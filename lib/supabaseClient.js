import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This will show up clearly in the browser console if env vars are missing.
  console.warn(
    "Supabase environment variables are missing. Check .env.local (locally) " +
      "or your Vercel Project Settings -> Environment Variables (when deployed)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
