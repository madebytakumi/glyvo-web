import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { FormField } from "@/components/FormField";
import { authService } from "../service";
import { signUpSchema, type SignUpValues } from "../schema";
import { AuthShell } from "./SignInPage";

export function SignUpPage() {
  const { t } = useTranslation("auth");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema(t)) });

  async function onSubmit(values: SignUpValues) {
    setSubmitError(null);
    try {
      await authService.signUp(values, values.displayName);
      setDone(true);
    } catch {
      setSubmitError(t("errors.generic"));
    }
  }

  return (
    <AuthShell title={t("signUp")} subtitle={t("welcomeSubtitle")}>
      {done ? (
        <p className="text-success">{t("checkEmail")}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label={t("displayName")} htmlFor="displayName">
            <Input
              id="displayName"
              autoComplete="name"
              placeholder={t("displayNamePlaceholder")}
              {...register("displayName")}
            />
          </FormField>
          <FormField label={t("email")} htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <FormField
            label={t("password")}
            htmlFor="password"
            error={errors.password?.message}
          >
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>
          {submitError && <p className="text-sm text-danger">{submitError}</p>}
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? t("signingUp") : t("signUpCta")}
          </Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link to="/sign-in" className="font-medium text-primary">
          {t("signIn")}
        </Link>
      </p>
    </AuthShell>
  );
}
