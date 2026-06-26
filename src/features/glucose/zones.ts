import type { BadgeTone } from "@/components/Badge";

export type GlucoseZone = "low" | "normal" | "high" | "critical";

/**
 * Classify a glucose value into a display zone. These thresholds are for visual
 * grouping only and are NOT medical guidance — Glyvo never diagnoses or
 * recommends treatment.
 */
export function classifyGlucose(value: number): GlucoseZone {
  if (value < 70) return "low";
  if (value <= 180) return "normal";
  if (value <= 250) return "high";
  return "critical";
}

export const zoneToTone: Record<GlucoseZone, BadgeTone> = {
  low: "warning",
  normal: "success",
  high: "warning",
  critical: "danger",
};
