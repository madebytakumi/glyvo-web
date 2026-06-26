import { z } from "zod";
import type { TFunction } from "i18next";

/**
 * Auth validation schemas. Built as factories so error messages are localized
 * (the auth namespace `t`).
 */
export function signInSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailInvalid")),
    password: z.string().min(1, t("errors.passwordRequired")),
  });
}

export function signUpSchema(t: TFunction) {
  return z.object({
    displayName: z.string().optional(),
    email: z
      .string()
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailInvalid")),
    password: z.string().min(6, t("errors.passwordMin")),
  });
}

export type SignInValues = z.infer<ReturnType<typeof signInSchema>>;
export type SignUpValues = z.infer<ReturnType<typeof signUpSchema>>;
