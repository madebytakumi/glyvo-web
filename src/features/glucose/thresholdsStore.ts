import { create } from "zustand";
import { DEFAULT_THRESHOLDS, type GlucoseThresholds } from "./zones";

const STORAGE_KEY = "glyvo.glucoseThresholds";

function load(): GlucoseThresholds {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GlucoseThresholds>;
      if (
        typeof parsed.low === "number" &&
        typeof parsed.high === "number" &&
        typeof parsed.critical === "number"
      ) {
        return { low: parsed.low, high: parsed.high, critical: parsed.critical };
      }
    }
  } catch {
    // ignore malformed storage
  }
  return DEFAULT_THRESHOLDS;
}

interface ThresholdsState {
  thresholds: GlucoseThresholds;
  setThresholds: (thresholds: GlucoseThresholds) => void;
  reset: () => void;
}

/** Persisted, user-configurable glucose zone thresholds (per device). */
export const useGlucoseThresholds = create<ThresholdsState>((set) => ({
  thresholds: load(),
  setThresholds: (thresholds) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
    set({ thresholds });
  },
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ thresholds: DEFAULT_THRESHOLDS });
  },
}));
