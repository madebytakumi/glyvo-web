import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Spinner } from "@/components/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useGlucoseDailyStats } from "@/features/glucose/queries";
import { classifyGlucose, zoneToTone } from "@/features/glucose/zones";
import { useGlucoseThresholds } from "@/features/glucose/thresholdsStore";
import { useAdherence, useTodayDoses } from "@/features/medications/queries";
import { GlucoseTrendCard } from "@/components/charts/GlucoseTrendCard";
import { AdherenceDonutCard } from "@/components/charts/AdherenceDonutCard";
import { QuickActionsFab } from "@/components/QuickActionsFab";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation("dashboard");
  const { t: tMed } = useTranslation("medications");
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "";

  const { data: stats, isLoading } = useGlucoseDailyStats();
  const thresholds = useGlucoseThresholds((s) => s.thresholds);
  const { data: doses } = useTodayDoses();
  const { data: adherence } = useAdherence(7);
  const pending = doses?.filter((d) => d.status === "pending").length ?? 0;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">
        {t("greeting")}
        {displayName ? `, ${displayName}` : ""}
      </h1>

      <Card className="mb-4">
        <h2 className="mb-3 text-sm font-medium text-muted">{t("todaySummary")}</h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : !stats || stats.count === 0 ? (
          <p className="text-muted">{t("noReadingsToday")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted">{t("latestGlucose")}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{stats.latest?.value}</span>
                {stats.latest && (
                  <Badge tone={zoneToTone[classifyGlucose(stats.latest.value, thresholds)]}>
                    {stats.latest.value}
                  </Badge>
                )}
              </div>
            </div>
            <Stat label={t("dailyAverage")} value={String(stats.average ?? "—")} />
            <Stat label={t("dailyHigh")} value={String(stats.highest ?? "—")} />
            <Stat label={t("dailyLow")} value={String(stats.lowest ?? "—")} />
          </div>
        )}
      </Card>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted">{t("medsToday")}</h2>
          <Button size="sm" variant="secondary" onClick={() => navigate("/medications")}>
            {pending > 0 ? t("medsPending", { count: pending }) : t("medsAllDone")}
          </Button>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlucoseTrendCard days={7} />
        </div>
        <AdherenceDonutCard stats={adherence} title={tMed("adherenceTitle", { days: 7 })} />
      </div>

      <QuickActionsFab />
    </div>
  );
}
