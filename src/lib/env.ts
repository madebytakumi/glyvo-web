/**
 * Environment configuration. VITE_* vars are inlined by Vite at build time and
 * are safe to expose in the client (the Supabase anon key is protected by RLS).
 */
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
} as const;

/** Whether Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);
