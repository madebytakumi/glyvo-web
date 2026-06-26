import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";

/** Temporary page for routes not yet implemented. */
export function Placeholder({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t(titleKey)}</h1>
      <Card>
        <p className="font-medium">{t("comingSoon")}</p>
        <p className="text-muted">{t("comingSoonMessage")}</p>
      </Card>
    </div>
  );
}
