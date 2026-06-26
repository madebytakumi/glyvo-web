import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { setLanguage } from "@/i18n";
import type { AppLanguage } from "@/locales";
import { useAuthStore } from "@/features/auth/store";
import { authService } from "@/features/auth/service";
import { useThemeStore, type ThemePreference } from "@/theme/themeStore";
import { InstallSection } from "../components/InstallSection";

interface Segment<T extends string> {
  value: T;
  label: string;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Segment<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-primary-soft/30 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-surface text-text shadow-sm"
              : "text-muted hover:text-text",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="mb-3">
      <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>
      {children}
    </Card>
  );
}

export function SettingsPage() {
  const { t, i18n } = useTranslation("settings");
  const user = useAuthStore((s) => s.user);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const langOptions: Segment<AppLanguage>[] = [
    { value: "es", label: t("languageSpanish") },
    { value: "en", label: t("languageEnglish") },
  ];
  const themeOptions: Segment<ThemePreference>[] = [
    { value: "system", label: t("themeSystem") },
    { value: "light", label: t("themeLight") },
    { value: "dark", label: t("themeDark") },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("title")} />

      <Section title={t("language")}>
        <Segmented
          value={i18n.language as AppLanguage}
          options={langOptions}
          onChange={setLanguage}
        />
      </Section>

      <Section title={t("appearance")}>
        <Segmented value={preference} options={themeOptions} onChange={setPreference} />
      </Section>

      <InstallSection />

      <Section title={t("account")}>
        <p className="mb-3 text-text">{user?.email}</p>
        <Button variant="danger" onClick={() => authService.signOut()}>
          {t("signOut")}
        </Button>
      </Section>

      <Section title={t("about")}>
        <p className="mb-2 text-sm text-muted">
          {t("version")} {import.meta.env.VITE_APP_VERSION ?? "1.0.0"}
        </p>
        <h3 className="text-sm font-medium text-text">{t("disclaimerTitle")}</h3>
        <p className="mt-1 text-sm text-muted">{t("disclaimerBody")}</p>
      </Section>
    </div>
  );
}
