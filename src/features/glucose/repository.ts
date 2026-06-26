import {
  createSupabaseRepository,
  type RowMapper,
} from "@/shared/data/supabaseRepository";
import type { GlucoseInput, GlucoseReading, GlucoseType } from "./model";

/** Maps glucose rows between Supabase (snake_case) and the domain model. */
const glucoseMapper: RowMapper<GlucoseReading, GlucoseInput> = {
  table: "glucose_readings",
  orderColumn: "measured_at",
  rangeColumn: "measured_at",
  // value is an integer column, so only the text notes are ILIKE-searchable.
  searchColumns: ["notes"],
  toRow: (input) => ({
    value: input.value,
    type: input.type,
    measured_at: input.measuredAt,
    notes: input.notes ?? null,
  }),
  fromRow: (row) => ({
    value: row.value,
    type: row.type as GlucoseType,
    measuredAt: row.measured_at,
    notes: row.notes ?? null,
  }),
};

export const glucoseRepository = createSupabaseRepository(glucoseMapper);
export type GlucoseRepository = typeof glucoseRepository;
