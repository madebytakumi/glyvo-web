export type ReportRangeKind = "day" | "week" | "month";

export interface ReportPeriod {
  kind: ReportRangeKind;
  startIso: string;
  endIso: string;
}

export interface GlucoseSummary {
  count: number;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}

export interface InsulinSummary {
  count: number;
  totalUnits: number;
}

export interface MealSummary {
  count: number;
  byType: Record<string, number>;
}

export interface MedicationSummary {
  expected: number;
  taken: number;
  skipped: number;
  missed: number;
  pct: number | null;
}

export interface Report {
  period: ReportPeriod;
  glucose: GlucoseSummary;
  insulin: InsulinSummary;
  meals: MealSummary;
  medication: MedicationSummary;
  generatedAt: string;
}
