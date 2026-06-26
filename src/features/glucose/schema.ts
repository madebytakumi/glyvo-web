import { z } from "zod";
import type { TFunction } from "i18next";
import {
  GLUCOSE_TYPES,
  GLUCOSE_VALUE_MAX,
  GLUCOSE_VALUE_MIN,
} from "./model";

/**
 * Validation for the glucose form. `t` is the glucose namespace translator so
 * messages are localized. The value field arrives from the UI as a string.
 */
export function glucoseFormSchema(t: TFunction) {
  return z.object({
    value: z
      .string()
      .min(1, t("validation.valueRequired"))
      .refine((v) => /^\d+$/.test(v), t("validation.valueInteger"))
      .refine((v) => {
        const n = Number(v);
        return n >= GLUCOSE_VALUE_MIN && n <= GLUCOSE_VALUE_MAX;
      }, t("validation.valueRange")),
    type: z.enum(GLUCOSE_TYPES, {
      message: t("validation.typeRequired"),
    }),
    measuredAt: z.string().min(1),
    notes: z.string().optional(),
  });
}

export type GlucoseFormValues = z.infer<ReturnType<typeof glucoseFormSchema>>;
