import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * App brand lockup (mascots + wordmark). The mascot pair is wired in during the
 * mascots pass; for now it renders the wordmark.
 */
export function Brand({ className }: { className?: string }) {
  const { t } = useTranslation("common");
  return (
    <span className={cn("text-xl font-bold text-primary", className)}>
      {t("appName")}
    </span>
  );
}
