import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/fields/TextField";
import { MascotPair } from "@/components/mascots/MascotPair";
import { authService } from "../service";
import { signInSchema, type SignInValues } from "../schema";

export function SignInPage() {
  const { t } = useTranslation("auth");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema(t)) });

  async function onSubmit(values: SignInValues) {
    setSubmitError(null);
    try {
      await authService.signIn(values);
    } catch {
      setSubmitError(t("errors.invalidCredentials"));
    }
  }

  return (
    <AuthShell title={t("welcomeTitle")} subtitle={t("welcomeSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label={t("email")}
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label={t("password")}
          type="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          error={errors.password?.message}
          {...register("password")}
        />
        {submitError && <p className="text-sm text-danger">{submitError}</p>}
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? t("signingIn") : t("signInCta")}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link to="/sign-up" className="font-medium text-primary">
          {t("signUp")}
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-4 flex justify-center">
          <MascotPair size={84} />
        </div>
        <h1 className="text-center text-2xl font-semibold text-text">{title}</h1>
        <p className="mb-6 mt-1 text-center text-muted">{subtitle}</p>
        {children}
      </Card>
    </div>
  );
}
