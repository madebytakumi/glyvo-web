import type { BaseEntity } from "@/shared/types/entity";

export const GLUCOSE_TYPES = [
  "ayuno",
  "antes_comer",
  "despues_comer",
  "antes_dormir",
  "aleatoria",
] as const;

export type GlucoseType = (typeof GLUCOSE_TYPES)[number];

/** A single glucose measurement (domain model). */
export interface GlucoseReading extends BaseEntity {
  value: number;
  type: GlucoseType;
  measuredAt: string;
  notes: string | null;
}

/** Fields the user provides when creating/editing a reading. */
export interface GlucoseInput {
  value: number;
  type: GlucoseType;
  measuredAt: string;
  notes?: string | null;
}

export const GLUCOSE_VALUE_MIN = 20;
export const GLUCOSE_VALUE_MAX = 600;
