import { dayBounds } from "@/lib/datetime";
import type { SupabaseRepository } from "@/shared/data/supabaseRepository";
import type { GlucoseInput, GlucoseReading } from "./model";

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
  };
}

export type GlucoseService = ReturnType<typeof createGlucoseService>;
