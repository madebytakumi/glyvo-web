import { startOfDay, endOfDay, subDays, format, isSameDay } from "date-fns";
import { dayBounds } from "@/lib/datetime";
import type { SupabaseRepository } from "@/shared/data/supabaseRepository";
import type { GlucoseInput, GlucoseReading } from "./model";

export interface GlucoseTrendPoint {
  /** Start-of-day ISO for the bucket. */
  date: string;
  /** Short label for the x-axis (dd/MM). */
  label: string;
  avg: number | null;
  min: number | null;
  max: number | null;
  count: number;
}

/**
 * Pure daily trend over the trailing `days` window (oldest→newest). Each bucket
 * is one calendar day; empty days are kept (null values) so the x-axis is
 * continuous. Exported for direct testing.
 */
export function buildGlucoseTrend(
  readings: GlucoseReading[],
  days: number,
  now: Date = new Date(),
): GlucoseTrendPoint[] {
  const points: GlucoseTrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(now, i);
    const dayReadings = readings.filter((r) =>
      isSameDay(new Date(r.measuredAt), day),
    );
    const values = dayReadings.map((r) => r.value);
    points.push({
      date: startOfDay(day).toISOString(),
      label: format(day, "dd/MM"),
      avg: values.length
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : null,
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
      count: values.length,
    });
  }
  return points;
}

export interface GlucoseDailyStats {
  count: number;
  latest: GlucoseReading | null;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}

/** Pure aggregation used by the dashboard; exported for direct testing. */
export function computeDailyStats(readings: GlucoseReading[]): GlucoseDailyStats {
  if (readings.length === 0) {
    return { count: 0, latest: null, average: null, highest: null, lowest: null };
  }
  const values = readings.map((r) => r.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const latest = readings.reduce((acc, r) =>
    r.measuredAt > acc.measuredAt ? r : acc,
  );
  return {
    count: readings.length,
    latest,
    average: Math.round(sum / values.length),
    highest: Math.max(...values),
    lowest: Math.min(...values),
  };
}

type GlucoseRepo = SupabaseRepository<GlucoseReading, GlucoseInput>;

/**
 * Glucose business logic. Built as a factory so tests can inject a fake repo;
 * the app wires the real Supabase repository in instance.ts (DIP).
 */
export function createGlucoseService(repo: GlucoseRepo) {
  return {
    create: (userId: string, input: GlucoseInput) => repo.insert(userId, input),
    update: (id: string, input: GlucoseInput) => repo.update(id, input),
    remove: (id: string) => repo.softDelete(id),
    get: (id: string) => repo.getById(id),
    list: (userId: string) => repo.listByUser(userId),
    search: (userId: string, query: string) => repo.search(userId, query),

    async dailyStats(
      userId: string,
      day: Date = new Date(),
    ): Promise<GlucoseDailyStats> {
      const { start, end } = dayBounds(day);
      return computeDailyStats(await repo.listForRange(userId, start, end));
    },

    async trend(userId: string, days: number): Promise<GlucoseTrendPoint[]> {
      const now = new Date();
      const start = startOfDay(subDays(now, days - 1)).toISOString();
      const end = endOfDay(now).toISOString();
      return buildGlucoseTrend(await repo.listForRange(userId, start, end), days, now);
    },
  };
}

export type GlucoseService = ReturnType<typeof createGlucoseService>;
