import type { BaseEntity } from "@/shared/types/entity";

export const MEAL_TYPES = ["desayuno", "comida", "cena", "snack"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

/** A single meal entry (domain model). */
export interface Meal extends BaseEntity {
  type: MealType;
  description: string | null;
  mealAt: string;
  notes: string | null;
}

/** Fields the user provides when creating/editing a meal. */
export interface MealInput {
  type: MealType;
  description?: string | null;
  mealAt: string;
  notes?: string | null;
}

export const MEAL_DESCRIPTION_MAX = 280;
