import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { useGlucoseTrend } from "@/features/glucose/queries";

const GlucoseTrendChart = lazy(() => import("./GlucoseTrendChart"));

const ChartFallback = () => (
  <div className="flex h-[200px] items-center justify-center">
    <Spinner />
  </div>
);

export function GlucoseTrendCard({ days = 7 }: { days?: number }) {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useGlucoseTrend(days);
  const hasData = !!data?.some((p) => p.count > 0);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-medium text-muted">{t("glucoseTrend")}</h2>
      {isLoading || !data ? (
        <ChartFallback />
      ) : !hasData ? (
        <p className="py-12 text-center text-muted">{t("trendEmpty")}</p>
      ) : (
        <Suspense fallback={<ChartFallback />}>
          <GlucoseTrendChart data={data} />
        </Suspense>
      )}
    </Card>
  );
}
