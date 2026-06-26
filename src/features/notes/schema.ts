import { z } from "zod";
import type { TFunction } from "i18next";
import { NOTE_CONTENT_MAX } from "./model";

/** Validation for the note form. Content is required; title and tags optional. */
export function noteFormSchema(t: TFunction) {
  return z.object({
    title: z.string().optional(),
    content: z
      .string()
      .trim()
      .min(1, t("validation.contentRequired"))
      .max(NOTE_CONTENT_MAX, t("validation.contentMax")),
    noteAt: z.string().min(1),
    tags: z.string().optional(),
  });
}

export type NoteFormValues = z.infer<ReturnType<typeof noteFormSchema>>;
