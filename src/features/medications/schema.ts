import { z } from "zod";
import type { TFunction } from "i18next";
import { SCHEDULE_FREQUENCIES } from "./model";

/**
 * Medication catalog form. Name required; dosage/instructions optional; optional
 * ISO date window (end must not precede start).
 */
export function medicationFormSchema(t: TFunction) {
  return z
    .object({
      name: z.string().trim().min(1, t("validation.nameRequired")),
      dosage: z.string().optional(),
      instructions: z.string().optional(),
      active: z.boolean(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .refine(
      (v) => !v.startDate || !v.endDate || v.endDate >= v.startDate,
      { message: t("validation.endBeforeStart"), path: ["endDate"] },
    );
}

export type MedicationFormValues = z.infer<
  ReturnType<typeof medicationFormSchema>
>;

/**
 * Schedule form. Time is "HH:MM"; specific_days requires at least one weekday.
 * `days` is held as a number[] in the form and serialized to CSV on submit.
 */
export function scheduleFormSchema(t: TFunction) {
  return z
    .object({
      time: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, t("validation.timeRequired")),
      frequency: z.enum(SCHEDULE_FREQUENCIES),
      days: z.array(z.number().int().min(0).max(6)),
      active: z.boolean(),
    })
    .refine(
      (v) => v.frequency !== "specific_days" || v.days.length > 0,
      { message: t("validation.daysRequired"), path: ["days"] },
    );
}

export type ScheduleFormValues = z.infer<ReturnType<typeof scheduleFormSchema>>;
