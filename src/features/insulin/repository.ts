import {
  createSupabaseRepository,
  type RowMapper,
} from "@/shared/data/supabaseRepository";
import type { InsulinInput, InsulinLog } from "./model";

const insulinMapper: RowMapper<InsulinLog, InsulinInput> = {
  table: "insulin_logs",
  orderColumn: "administered_at",
  rangeColumn: "administered_at",
  searchColumns: ["name", "notes"],
  toRow: (input) => ({
    name: input.name,
    units: input.units,
    administered_at: input.administeredAt,
    notes: input.notes ?? null,
  }),
  fromRow: (row) => ({
    name: row.name,
    units: Number(row.units),
    administeredAt: row.administered_at,
    notes: row.notes ?? null,
  }),
};

export const insulinRepository = createSupabaseRepository(insulinMapper);
