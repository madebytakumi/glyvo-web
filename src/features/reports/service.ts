import { glucoseService } from "@/features/glucose/instance";
import { insulinRepository } from "@/features/insulin/repository";
import { mealsRepository } from "@/features/meals/repository";
import { medicationsService } from "@/features/medications/instance";
import { buildReport, computePeriod } from "./aggregate";
import type { Report, ReportRangeKind } from "./model";

/**
 * Reports service: gathers the user's records from each feature (Supabase) and
 * delegates to the pure `buildReport` aggregator. Read-only.
 */
export const reportsService = {
  async build(
    userId: string,
    kind: ReportRangeKind,
    now: Date = new Date(),
  ): Promise<Report> {
    const period = computePeriod(kind, now);
    const [glucose, insulin, meals, medications, schedules, intakeLogs] =
      await Promise.all([
        glucoseService.list(userId),
        insulinRepository.listByUser(userId),
        mealsRepository.listByUser(userId),
        medicationsService.listMedications(userId),
        medicationsService.listAllSchedules(userId),
        medicationsService.listIntakeLogs(userId, period.startIso, period.endIso),
      ]);
    return buildReport(
      { glucose, insulin, meals, medications, schedules, intakeLogs },
      period,
      now,
    );
  },
};
