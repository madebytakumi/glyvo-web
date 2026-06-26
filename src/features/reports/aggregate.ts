import { startOfDay, endOfDay, subDays } from "date-fns";
import { computeAdherence } from "@/features/medications/adherence";
import type { GlucoseReading } from "@/features/glucose/model";
import type { InsulinLog } from "@/features/insulin/model";
import type { Meal } from "@/features/meals/model";
import type {
  IntakeLog,
  Medication,
  MedicationSchedule,
} from "@/features/medications/model";
import type {
  GlucoseSummary,
  InsulinSummary,
  MealSummary,
  MedicationSummary,
  Report,
  ReportPeriod,
  ReportRangeKind,
} from "./model";

/**
 * Pure report aggregation — no DB/UI. The service hands in the user's records
 * and these functions compute the summaries, so reports are fully unit-testable.
 */

/** Rolling period bounds: day = today, week = last 7 days, month = last 30. */
export function computePeriod(
  kind: ReportRangeKind,
  now: Date = new Date(),
): ReportPeriod {
  const end = endOfDay(now);
  const startDay =
    kind === "day" ? now : kind === "week" ? subDays(now, 6) : subDays(now, 29);
  return {
    kind,
    startIso: startOfDay(startDay).toISOString(),
    endIso: end.toISOString(),
  };
}

function inRange(iso: string, period: ReportPeriod): boolean {
  return iso >= period.startIso && iso <= period.endIso;
}

export function glucoseSummary(readings: GlucoseReading[]): GlucoseSummary {
  if (readings.length === 0) {
    return { count: 0, average: null, highest: null, lowest: null };
  }
  const values = readings.map((r) => r.value);
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    count: readings.length,
    average: Math.round(sum / values.length),
    highest: Math.max(...values),
    lowest: Math.min(...values),
  };
}

export function insulinSummary(logs: InsulinLog[]): InsulinSummary {
  const totalUnits = logs.reduce((a, l) => a + l.units, 0);
  return { count: logs.length, totalUnits: Math.round(totalUnits * 100) / 100 };
}

export function mealSummary(meals: Meal[]): MealSummary {
  const byType: Record<string, number> = {};
  for (const meal of meals) {
    byType[meal.type] = (byType[meal.type] ?? 0) + 1;
  }
  return { count: meals.length, byType };
}

export interface ReportInputs {
  glucose: GlucoseReading[];
  insulin: InsulinLog[];
  meals: Meal[];
  medications: Medication[];
  schedules: MedicationSchedule[];
  intakeLogs: IntakeLog[];
}

/** Assemble a full report for a period from the user's records. */
export function buildReport(
  inputs: ReportInputs,
  period: ReportPeriod,
  now: Date = new Date(),
): Report {
  const glucose = glucoseSummary(
    inputs.glucose.filter((r) => inRange(r.measuredAt, period)),
  );
  const insulin = insulinSummary(
    inputs.insulin.filter((l) => inRange(l.administeredAt, period)),
  );
  const meals = mealSummary(inputs.meals.filter((m) => inRange(m.mealAt, period)));

  const adherence = computeAdherence(
    inputs.medications,
    inputs.schedules,
    inputs.intakeLogs,
    new Date(period.startIso),
    new Date(period.endIso),
    now,
  );
  const medication: MedicationSummary = {
    expected: adherence.expected,
    taken: adherence.taken,
    skipped: adherence.skipped,
    missed: adherence.missed,
    pct: adherence.pct,
  };

  return {
    period,
    glucose,
    insulin,
    meals,
    medication,
    generatedAt: now.toISOString(),
  };
}
