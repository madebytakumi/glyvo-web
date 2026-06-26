import { combineDateAndTime, eachDay, weekdayOf } from "@/lib/datetime";
import {
  occurrenceKey,
  parseDays,
  type AdherenceStats,
  type DoseOccurrence,
  type DoseStatus,
  type IntakeLog,
  type Medication,
  type MedicationSchedule,
  type ResolvedDose,
} from "./model";

/**
 * Pure adherence engine. No DB/UI imports — operates on plain arrays so it is
 * fully unit-testable and deterministic given an injected `now`.
 *
 * Design: schedules define the EXPECTED doses; intake logs record ACTUAL
 * outcomes only when the user acts. Occurrences are derived on the fly (never
 * materialized), and `pending`/`missed` are computed, never stored.
 */

/** Whether the calendar day falls within the medication's active window. */
function withinWindow(medication: Medication, day: Date): boolean {
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  if (medication.startDate) {
    const start = new Date(`${medication.startDate}T00:00:00`);
    if (dayStart.getTime() < start.setHours(0, 0, 0, 0)) return false;
  }
  if (medication.endDate) {
    const end = new Date(`${medication.endDate}T00:00:00`);
    if (dayStart.getTime() > end.setHours(0, 0, 0, 0)) return false;
  }
  return true;
}

/** Does this schedule produce a dose on `day`? */
export function scheduleAppliesOn(
  schedule: MedicationSchedule,
  medication: Medication,
  day: Date,
): boolean {
  if (!medication.active || !schedule.active) return false;
  if (medication.deletedAt || schedule.deletedAt) return false;
  if (!withinWindow(medication, day)) return false;

  if (schedule.frequency === "daily") return true;
  if (schedule.frequency === "specific_days") {
    return parseDays(schedule.daysOfWeek).includes(weekdayOf(day));
  }
  return false;
}

/** Expected dose occurrences for a single day, sorted by time. */
export function occurrencesForDay(
  medications: Medication[],
  schedules: MedicationSchedule[],
  day: Date,
): DoseOccurrence[] {
  const medById = new Map(medications.map((m) => [m.id, m]));
  const out: DoseOccurrence[] = [];

  for (const schedule of schedules) {
    const med = medById.get(schedule.medicationId);
    if (!med || !scheduleAppliesOn(schedule, med, day)) continue;
    out.push({
      medicationId: med.id,
      medicationName: med.name,
      dosage: med.dosage,
      scheduleId: schedule.id,
      time: schedule.time,
      scheduledTime: combineDateAndTime(day, schedule.time),
    });
  }

  return out.sort((a, b) => a.time.localeCompare(b.time));
}

/** Index non-deleted logs by occurrence key for O(1) lookup. */
export function indexLogs(logs: IntakeLog[]): Map<string, IntakeLog> {
  const map = new Map<string, IntakeLog>();
  for (const log of logs) {
    if (log.deletedAt) continue;
    map.set(occurrenceKey(log.medicationId, log.scheduledTime), log);
  }
  return map;
}

/** Resolve the display status of an occurrence given known logs and `now`. */
export function resolveStatus(
  occurrence: DoseOccurrence,
  logsByKey: Map<string, IntakeLog>,
  now: Date,
): DoseStatus {
  const log = logsByKey.get(
    occurrenceKey(occurrence.medicationId, occurrence.scheduledTime),
  );
  if (log) return log.status;
  return new Date(occurrence.scheduledTime).getTime() >= now.getTime()
    ? "pending"
    : "missed";
}

/** Today's doses with resolved status, sorted by time. */
export function resolveDoses(
  medications: Medication[],
  schedules: MedicationSchedule[],
  logs: IntakeLog[],
  day: Date,
  now: Date,
): ResolvedDose[] {
  const logsByKey = indexLogs(logs);
  return occurrencesForDay(medications, schedules, day).map((occ) => ({
    ...occ,
    status: resolveStatus(occ, logsByKey, now),
  }));
}

/**
 * Adherence over a date range. Only doses already due (scheduledTime <= now)
 * count toward the stats. `pct = taken / expected` rounded, or null if nothing
 * was due yet.
 */
export function computeAdherence(
  medications: Medication[],
  schedules: MedicationSchedule[],
  logs: IntakeLog[],
  rangeStart: Date,
  rangeEnd: Date,
  now: Date,
): AdherenceStats {
  const logsByKey = indexLogs(logs);
  let taken = 0;
  let skipped = 0;
  let missed = 0;

  for (const day of eachDay(rangeStart, rangeEnd)) {
    for (const occ of occurrencesForDay(medications, schedules, day)) {
      if (new Date(occ.scheduledTime).getTime() > now.getTime()) continue; // not due yet
      const status = resolveStatus(occ, logsByKey, now);
      if (status === "taken") taken += 1;
      else if (status === "skipped") skipped += 1;
      else missed += 1; // pending can't happen for due doses
    }
  }

  const expected = taken + skipped + missed;
  return {
    expected,
    taken,
    skipped,
    missed,
    pct: expected > 0 ? Math.round((100 * taken) / expected) : null,
  };
}
