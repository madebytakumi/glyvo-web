import type { BaseEntity } from "@/shared/types/entity";

/** A single insulin administration record (domain model). */
export interface InsulinLog extends BaseEntity {
  name: string;
  units: number;
  administeredAt: string;
  notes: string | null;
}

/** Fields the user provides when creating/editing an insulin record. */
export interface InsulinInput {
  name: string;
  units: number;
  administeredAt: string;
  notes?: string | null;
}

export const INSULIN_UNITS_MIN = 0.5;
export const INSULIN_UNITS_MAX = 300;

/** Common quick-pick insulin names (free text is still allowed). */
export const INSULIN_NAME_SUGGESTIONS = ["Rápida", "Lenta", "NPH", "Mixta"] as const;
