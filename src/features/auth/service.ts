import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuthStore } from "./store";

export interface Credentials {
  email: string;
  password: string;
}

/** Auth service wrapping supabase-js. */
export const authService = {
  async signIn({ email, password }: Credentials) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signUp({ email, password }: Credentials, displayName?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Return the confirmation link to the same origin the user signed up on
        // (prod → prod, local → local). The origin must be allow-listed in
        // Supabase → Authentication → URL Configuration → Redirect URLs.
        emailRedirectTo: window.location.origin,
        data: displayName ? { display_name: displayName } : undefined,
      },
    });
    if (error) throw error;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  /**
   * Loads the current session and subscribes to auth changes. Returns an
   * unsubscribe function. Safe to call when Supabase is not configured.
   */
  initialize(): () => void {
    const store = useAuthStore.getState();

    if (!isSupabaseConfigured) {
      store.setInitializing(false);
      return () => {};
    }

    void supabase.auth.getSession().then(({ data }) => {
      store.setSession(data.session);
      store.setInitializing(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session);
    });

    return () => data.subscription.unsubscribe();
  },
};
