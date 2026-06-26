import { z } from "zod";
import type { TFunction } from "i18next";
import { INSULIN_UNITS_MAX, INSULIN_UNITS_MIN } from "./model";

/** Validation for the insulin form. `units` arrives as a string (one decimal). */
export function insulinFormSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t("validation.nameRequired")),
    units: z
      .string()
      .min(1, t("validation.unitsRequired"))
      .refine((v) => /^\d+(\.\d+)?$/.test(v), t("validation.unitsNumber"))
      .refine((v) => {
        const n = Number(v);
        return n >= INSULIN_UNITS_MIN && n <= INSULIN_UNITS_MAX;
      }, t("validation.unitsRange")),
    administeredAt: z.string().min(1),
    notes: z.string().optional(),
  });
}

export type InsulinFormValues = z.infer<ReturnType<typeof insulinFormSchema>>;
