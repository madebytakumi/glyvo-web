import type { BaseEntity } from "@/shared/types/entity";

// --- Medication catalog ----------------------------------------------------

export interface Medication extends BaseEntity {
  name: string;
  dosage: string | null;
  instructions: string | null;
  active: boolean;
  startDate: string | null; // ISO date (yyyy-mm-dd)
  endDate: string | null;
}

export interface MedicationInput {
  name: string;
  dosage?: string | null;
  instructions?: string | null;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

// --- Schedules -------------------------------------------------------------

export const SCHEDULE_FREQUENCIES = ["daily", "specific_days"] as const;
export type ScheduleFrequency = (typeof SCHEDULE_FREQUENCIES)[number];

export interface MedicationSchedule extends BaseEntity {
  medicationId: string;
  time: string; // "HH:MM" local
  frequency: ScheduleFrequency;
  daysOfWeek: string | null; // CSV of JS weekday numbers (0=Sun..6=Sat)
  active: boolean;
}

export interface ScheduleInput {
  medicationId: string;
  time: string;
  frequency: ScheduleFrequency;
  daysOfWeek?: string | null;
  active: boolean;
}

// --- Intake logs -----------------------------------------------------------

export type IntakeStatus = "taken" | "skipped";

export interface IntakeLog extends BaseEntity {
  medicationId: string;
  scheduledTime: string; // ISO datetime of the occurrence
  actualIntakeTime: string | null;
  status: IntakeStatus;
}

// --- Derived dose occurrences ---------------------------------------------

/** A status that can be shown for a dose (stored ones + derived ones). */
export type DoseStatus = "taken" | "skipped" | "pending" | "missed";

/** A single expected dose for a day, derived from a schedule. */
export interface DoseOccurrence {
  medicationId: string;
  medicationName: string;
  dosage: string | null;
  scheduleId: string;
  time: string; // "HH:MM"
  scheduledTime: string; // ISO
}

/** A dose occurrence with its resolved status (for the UI). */
export interface ResolvedDose extends DoseOccurrence {
  status: DoseStatus;
}

export interface AdherenceStats {
  expected: number;
  taken: number;
  skipped: number;
  missed: number;
  pct: number | null; // taken / expected, rounded; null when nothing expected
}

// --- Weekday helpers -------------------------------------------------------

/** JS weekday numbers in display order (0 = Sunday). */
export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

/** Parse a CSV of weekday numbers into a sorted, de-duped list. */
export function parseDays(csv: string | null | undefined): number[] {
  if (!csv) return [];
  const set = new Set<number>();
  for (const part of csv.split(",")) {
    const n = Number(part.trim());
    if (Number.isInteger(n) && n >= 0 && n <= 6) set.add(n);
  }
  return [...set].sort((a, b) => a - b);
}

/** Format a list of weekday numbers back into a clean CSV (or null). */
export function formatDays(days: number[]): string | null {
  const clean = [...new Set(days)]
    .filter((n) => n >= 0 && n <= 6)
    .sort((a, b) => a - b);
  return clean.length > 0 ? clean.join(",") : null;
}

/** Build the occurrence key used to match logs to occurrences. */
export function occurrenceKey(medicationId: string, scheduledTime: string): string {
  return `${medicationId}|${scheduledTime}`;
}
