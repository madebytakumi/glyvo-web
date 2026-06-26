import { supabase } from "@/lib/supabase";
import { newId } from "@/lib/id";
import { nowIso } from "@/lib/datetime";
import type { DbRow } from "@/shared/data/supabaseRepository";
import type { BaseEntity } from "@/shared/types/entity";
import type {
  IntakeLog,
  IntakeStatus,
  Medication,
  MedicationInput,
  MedicationSchedule,
  ScheduleFrequency,
  ScheduleInput,
} from "./model";

/** Base audit columns for a brand-new row. */
function baseInsert(userId: string): DbRow {
  const ts = nowIso();
  return {
    id: newId(),
    user_id: userId,
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
  };
}

function mapBase(row: DbRow): BaseEntity {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

const clean = (v: string | null | undefined): string | null =>
  v?.trim() ? v.trim() : null;

// --- Medications -----------------------------------------------------------

function toMedicationRow(input: MedicationInput): DbRow {
  return {
    name: input.name.trim(),
    dosage: clean(input.dosage),
    instructions: clean(input.instructions),
    active: input.active,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
  };
}

function fromMedicationRow(row: DbRow): Medication {
  return {
    ...mapBase(row),
    name: row.name,
    dosage: row.dosage ?? null,
    instructions: row.instructions ?? null,
    active: row.active ?? true,
    startDate: row.start_date ?? null,
    endDate: row.end_date ?? null,
  };
}

export const medicationsRepository = {
  async insert(userId: string, input: MedicationInput): Promise<Medication> {
    const { data, error } = await supabase
      .from("medications")
      .insert({ ...baseInsert(userId), ...toMedicationRow(input) })
      .select()
      .single();
    if (error) throw error;
    return fromMedicationRow(data);
  },
  async update(id: string, input: MedicationInput): Promise<void> {
    const { error } = await supabase
      .from("medications")
      .update({ ...toMedicationRow(input), updated_at: nowIso() })
      .eq("id", id);
    if (error) throw error;
  },
  async softDelete(id: string): Promise<void> {
    const ts = nowIso();
    const { error } = await supabase
      .from("medications")
      .update({ deleted_at: ts, updated_at: ts })
      .eq("id", id);
    if (error) throw error;
  },
  async getById(id: string): Promise<Medication | null> {
    const { data, error } = await supabase
      .from("medications")
      .select()
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data ? fromMedicationRow(data) : null;
  },
  async listByUser(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from("medications")
      .select()
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(fromMedicationRow);
  },
};

// --- Schedules -------------------------------------------------------------

function fromScheduleRow(row: DbRow): MedicationSchedule {
  return {
    ...mapBase(row),
    medicationId: row.medication_id,
    time: row.time,
    frequency: row.frequency as ScheduleFrequency,
    daysOfWeek: row.days_of_week ?? null,
    active: row.active ?? true,
  };
}

export const schedulesRepository = {
  async insert(userId: string, input: ScheduleInput): Promise<MedicationSchedule> {
    const { data, error } = await supabase
      .from("medication_schedules")
      .insert({
        ...baseInsert(userId),
        medication_id: input.medicationId,
        time: input.time,
        frequency: input.frequency,
        days_of_week: input.daysOfWeek ?? null,
        active: input.active,
      })
      .select()
      .single();
    if (error) throw error;
    return fromScheduleRow(data);
  },
  async update(id: string, input: Omit<ScheduleInput, "medicationId">): Promise<void> {
    const { error } = await supabase
      .from("medication_schedules")
      .update({
        time: input.time,
        frequency: input.frequency,
        days_of_week: input.daysOfWeek ?? null,
        active: input.active,
        updated_at: nowIso(),
      })
      .eq("id", id);
    if (error) throw error;
  },
  async softDelete(id: string): Promise<void> {
    const ts = nowIso();
    const { error } = await supabase
      .from("medication_schedules")
      .update({ deleted_at: ts, updated_at: ts })
      .eq("id", id);
    if (error) throw error;
  },
  async getById(id: string): Promise<MedicationSchedule | null> {
    const { data, error } = await supabase
      .from("medication_schedules")
      .select()
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data ? fromScheduleRow(data) : null;
  },
  async listByUser(userId: string): Promise<MedicationSchedule[]> {
    const { data, error } = await supabase
      .from("medication_schedules")
      .select()
      .eq("user_id", userId)
      .is("deleted_at", null);
    if (error) throw error;
    return (data ?? []).map(fromScheduleRow);
  },
  async listByMedication(medicationId: string): Promise<MedicationSchedule[]> {
    const { data, error } = await supabase
      .from("medication_schedules")
      .select()
      .eq("medication_id", medicationId)
      .is("deleted_at", null)
      .order("time", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(fromScheduleRow);
  },
};

// --- Intake logs -----------------------------------------------------------

interface IntakeUpsert {
  medicationId: string;
  scheduledTime: string;
  status: IntakeStatus;
  actualIntakeTime: string | null;
}

function fromIntakeRow(row: DbRow): IntakeLog {
  return {
    ...mapBase(row),
    medicationId: row.medication_id,
    // Normalize Postgres timestamptz (e.g. "...+00:00") back to canonical ISO
    // ("...000Z") so it matches the occurrence's scheduledTime when the
    // adherence engine pairs logs to doses via occurrenceKey.
    scheduledTime: new Date(row.scheduled_time).toISOString(),
    actualIntakeTime: row.actual_intake_time
      ? new Date(row.actual_intake_time).toISOString()
      : null,
    status: row.status as IntakeStatus,
  };
}

export const intakeRepository = {
  async insert(userId: string, input: IntakeUpsert): Promise<IntakeLog> {
    const { data, error } = await supabase
      .from("medication_intake_logs")
      .insert({
        ...baseInsert(userId),
        medication_id: input.medicationId,
        scheduled_time: input.scheduledTime,
        actual_intake_time: input.actualIntakeTime,
        status: input.status,
      })
      .select()
      .single();
    if (error) throw error;
    return fromIntakeRow(data);
  },
  async update(
    id: string,
    patch: { status?: IntakeStatus; actualIntakeTime?: string | null; deletedAt?: string | null },
  ): Promise<void> {
    const row: DbRow = { updated_at: nowIso() };
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.actualIntakeTime !== undefined)
      row.actual_intake_time = patch.actualIntakeTime;
    if (patch.deletedAt !== undefined) row.deleted_at = patch.deletedAt;
    const { error } = await supabase
      .from("medication_intake_logs")
      .update(row)
      .eq("id", id);
    if (error) throw error;
  },
  async softDelete(id: string): Promise<void> {
    const ts = nowIso();
    const { error } = await supabase
      .from("medication_intake_logs")
      .update({ deleted_at: ts, updated_at: ts })
      .eq("id", id);
    if (error) throw error;
  },
  /** The (possibly soft-deleted) log for a specific dose occurrence. */
  async findByOccurrence(
    medicationId: string,
    scheduledTime: string,
  ): Promise<IntakeLog | null> {
    const { data, error } = await supabase
      .from("medication_intake_logs")
      .select()
      .eq("medication_id", medicationId)
      .eq("scheduled_time", scheduledTime)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? fromIntakeRow(data) : null;
  },
  async listForRange(
    userId: string,
    startIso: string,
    endIso: string,
  ): Promise<IntakeLog[]> {
    const { data, error } = await supabase
      .from("medication_intake_logs")
      .select()
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("scheduled_time", startIso)
      .lte("scheduled_time", endIso)
      .order("scheduled_time", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(fromIntakeRow);
  },
};
