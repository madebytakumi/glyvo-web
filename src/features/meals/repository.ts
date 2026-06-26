import {
  createSupabaseRepository,
  type RowMapper,
} from "@/shared/data/supabaseRepository";
import type { Meal, MealInput, MealType } from "./model";

const mealMapper: RowMapper<Meal, MealInput> = {
  table: "meals",
  orderColumn: "meal_at",
  rangeColumn: "meal_at",
  searchColumns: ["description", "notes"],
  toRow: (input) => ({
    type: input.type,
    description: input.description ?? null,
    meal_at: input.mealAt,
    notes: input.notes ?? null,
  }),
  fromRow: (row) => ({
    type: row.type as MealType,
    description: row.description ?? null,
    mealAt: row.meal_at,
    notes: row.notes ?? null,
  }),
};

export const mealsRepository = createSupabaseRepository(mealMapper);
