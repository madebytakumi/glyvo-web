import type { BadgeTone } from "@/components/Badge";

export type GlucoseZone = "low" | "normal" | "high" | "critical";

/**
 * User-configurable zone boundaries (mg/dL):
 * - baja:    value < low
 * - normal:  low ≤ value ≤ high
 * - alta:    high < value ≤ critical
 * - crítica: value > critical  (always above "alta", derived automatically)
 */
export interface GlucoseThresholds {
  low: number;
  high: number;
  critical: number;
}

export const DEFAULT_THRESHOLDS: GlucoseThresholds = {
  low: 70,
  high: 180,
  critical: 250,
};

/**
 * Classify a glucose value into a display zone using the given thresholds
 * (defaults to the standard ranges). These are for visual grouping only and are
 * NOT medical guidance — Glyvo never diagnoses or recommends treatment.
 */
export function classifyGlucose(
  value: number,
  thresholds: GlucoseThresholds = DEFAULT_THRESHOLDS,
): GlucoseZone {
  if (value < thresholds.low) return "low";
  if (value <= thresholds.high) return "normal";
  if (value <= thresholds.critical) return "high";
  return "critical";
}

export const zoneToTone: Record<GlucoseZone, BadgeTone> = {
  low: "warning",
  normal: "success",
  high: "warning",
  critical: "danger",
};
