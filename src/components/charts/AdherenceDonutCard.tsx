import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import type { AdherenceStats } from "@/features/medications/model";
import type { DonutSlice } from "./AdherenceDonut";

const AdherenceDonut = lazy(() => import("./AdherenceDonut"));

const Fallback = () => (
  <div className="flex h-[200px] items-center justify-center">
    <Spinner />
  </div>
);

export function AdherenceDonutCard({
  stats,
  title,
}: {
  stats: AdherenceStats | undefined;
  title: string;
}) {
  const { t } = useTranslation("medications");

  const slices: DonutSlice[] = stats
    ? [
        { name: t("status.taken"), value: stats.taken, color: "#16A34A" },
        { name: t("status.skipped"), value: stats.skipped, color: "#94A3B8" },
        { name: t("status.missed"), value: stats.missed, color: "#DC2626" },
      ]
    : [];

  return (
    <Card>
      <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>
      {!stats || stats.expected === 0 ? (
        <p className="py-12 text-center text-muted">{t("adherenceEmpty")}</p>
      ) : (
        <>
          <Suspense fallback={<Fallback />}>
            <AdherenceDonut
              data={slices}
              centerLabel={stats.pct == null ? "—" : `${stats.pct}%`}
            />
          </Suspense>
          <div className="mt-3 flex justify-center gap-4 text-xs text-muted">
            {slices.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} {s.value}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
