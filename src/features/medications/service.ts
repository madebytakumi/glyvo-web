import { dayBounds, nowIso } from "@/lib/datetime";
import {
  intakeRepository,
  medicationsRepository,
  schedulesRepository,
} from "./repository";
import { computeAdherence, resolveDoses } from "./adherence";
import type {
  AdherenceStats,
  DoseOccurrence,
  IntakeStatus,
  MedicationInput,
  ResolvedDose,
  ScheduleInput,
} from "./model";

type MedRepo = typeof medicationsRepository;
type SchedRepo = typeof schedulesRepository;
type IntakeRepo = typeof intakeRepository;

/**
 * Medications business logic: catalog + schedules CRUD, intake marking, and the
 * derived "today's doses" + adherence views. Repos are injected so tests can
 * swap them (DIP); the app wires the real Supabase repos in instance.ts.
 */
export function createMedicationsService(
  medRepo: MedRepo,
  scheduleRepo: SchedRepo,
  intakeRepo: IntakeRepo,
) {
  async function removeMedication(id: string): Promise<void> {
    // Soft-delete the medication and its schedules so it stops generating doses.
    await medRepo.softDelete(id);
    const schedules = await scheduleRepo.listByMedication(id);
    await Promise.all(schedules.map((s) => scheduleRepo.softDelete(s.id)));
  }

  async function mark(
    userId: string,
    occurrence: DoseOccurrence,
    status: IntakeStatus,
  ): Promise<void> {
    const ts = nowIso();
    const actualIntakeTime = status === "taken" ? ts : null;
    const existing = await intakeRepo.findByOccurrence(
      occurrence.medicationId,
      occurrence.scheduledTime,
    );
    if (existing) {
      await intakeRepo.update(existing.id, {
        status,
        actualIntakeTime,
        deletedAt: null, // un-delete if it had been cleared
      });
    } else {
      await intakeRepo.insert(userId, {
        medicationId: occurrence.medicationId,
        scheduledTime: occurrence.scheduledTime,
        status,
        actualIntakeTime,
      });
    }
  }

  async function clearIntake(occurrence: DoseOccurrence): Promise<void> {
    const existing = await intakeRepo.findByOccurrence(
      occurrence.medicationId,
      occurrence.scheduledTime,
    );
    if (existing && !existing.deletedAt) {
      await intakeRepo.softDelete(existing.id);
    }
  }

  async function todayDoses(
    userId: string,
    day: Date = new Date(),
  ): Promise<ResolvedDose[]> {
    const [meds, schedules] = await Promise.all([
      medRepo.listByUser(userId),
      scheduleRepo.listByUser(userId),
    ]);
    const { start, end } = dayBounds(day);
    const logs = await intakeRepo.listForRange(userId, start, end);
    return resolveDoses(meds, schedules, logs, day, new Date());
  }

  async function adherence(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<AdherenceStats> {
    const [meds, schedules] = await Promise.all([
      medRepo.listByUser(userId),
      scheduleRepo.listByUser(userId),
    ]);
    const logs = await intakeRepo.listForRange(
      userId,
      dayBounds(start).start,
      dayBounds(end).end,
    );
    return computeAdherence(meds, schedules, logs, start, end, new Date());
  }

  return {
    createMedication: (userId: string, input: MedicationInput) =>
      medRepo.insert(userId, input),
    updateMedication: (id: string, input: MedicationInput) =>
      medRepo.update(id, input),
    removeMedication,
    getMedication: (id: string) => medRepo.getById(id),
    listMedications: (userId: string) => medRepo.listByUser(userId),
    createSchedule: (userId: string, input: ScheduleInput) =>
      scheduleRepo.insert(userId, input),
    updateSchedule: (id: string, input: Omit<ScheduleInput, "medicationId">) =>
      scheduleRepo.update(id, input),
    removeSchedule: (id: string) => scheduleRepo.softDelete(id),
    listSchedules: (medicationId: string) =>
      scheduleRepo.listByMedication(medicationId),
    listAllSchedules: (userId: string) => scheduleRepo.listByUser(userId),
    listIntakeLogs: (userId: string, startIso: string, endIso: string) =>
      intakeRepo.listForRange(userId, startIso, endIso),
    markTaken: (userId: string, occ: DoseOccurrence) => mark(userId, occ, "taken"),
    markSkipped: (userId: string, occ: DoseOccurrence) =>
      mark(userId, occ, "skipped"),
    clearIntake,
    todayDoses,
    adherence,
  };
}

export type MedicationsService = ReturnType<typeof createMedicationsService>;
