import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "./env";

/**
 * Supabase client for the web app. On web the session is persisted in
 * localStorage by default. When credentials are absent we still create a client
 * against a placeholder so imports never crash; network calls simply fail.
 * Guard them with `isSupabaseConfigured`.
 */
export const supabase: SupabaseClient = createClient(
  env.supabaseUrl || "http://localhost",
  env.supabaseAnonKey || "public-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export { isSupabaseConfigured };
