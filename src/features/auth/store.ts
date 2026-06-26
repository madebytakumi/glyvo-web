import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  /** True until the initial session lookup completes. */
  initializing: boolean;
  setSession: (session: Session | null) => void;
  setInitializing: (initializing: boolean) => void;
}

/** Holds the current Supabase auth session for the whole app. */
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initializing: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setInitializing: (initializing) => set({ initializing }),
}));
