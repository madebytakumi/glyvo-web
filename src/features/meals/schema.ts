import { z } from "zod";
import type { TFunction } from "i18next";
import { MEAL_TYPES, MEAL_DESCRIPTION_MAX } from "./model";

/** Validation for the meal form. Description is optional, capped for sanity. */
export function mealFormSchema(t: TFunction) {
  return z.object({
    type: z.enum(MEAL_TYPES, { message: t("validation.typeRequired") }),
    description: z
      .string()
      .max(MEAL_DESCRIPTION_MAX, t("validation.descriptionMax"))
      .optional(),
    mealAt: z.string().min(1),
    notes: z.string().optional(),
  });
}

export type MealFormValues = z.infer<ReturnType<typeof mealFormSchema>>;
