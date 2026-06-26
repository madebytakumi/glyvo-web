import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "glyvo.theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function resolveDark(preference: ThemePreference): boolean {
  if (preference === "system") return media().matches;
  return preference === "dark";
}

/** Apply the resolved scheme by toggling `.dark` on <html>. */
function apply(preference: ThemePreference): void {
  document.documentElement.classList.toggle("dark", resolveDark(preference));
}

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

function initialPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
  return stored ?? "system";
}

/** Persisted light/dark/system preference, applied via a `.dark` class. */
export const useThemeStore = create<ThemeState>((set) => ({
  preference: initialPreference(),
  setPreference: (preference) => {
    localStorage.setItem(STORAGE_KEY, preference);
    apply(preference);
    set({ preference });
  },
}));

/** Apply the stored theme and keep `system` in sync with OS changes. */
export function initTheme(): void {
  apply(useThemeStore.getState().preference);
  media().addEventListener("change", () => {
    if (useThemeStore.getState().preference === "system") apply("system");
  });
}
