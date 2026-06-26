import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { useAdherence } from "../queries";

export function AdherenceCard({ days = 7 }: { days?: number }) {
  const { t } = useTranslation("medications");
  const { data } = useAdherence(days);

  return (
    <Card className="mb-4">
      <h2 className="text-sm font-medium text-muted">
        {t("adherenceTitle", { days })}
      </h2>
      {!data || data.expected === 0 ? (
        <p className="mt-1 text-muted">{t("adherenceEmpty")}</p>
      ) : (
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-primary">{data.pct}%</span>
          <span className="text-sm text-muted">
            {data.taken}/{data.expected} · {t("status.skipped")} {data.skipped} ·{" "}
            {t("status.missed")} {data.missed}
          </span>
        </div>
      )}
    </Card>
  );
}
