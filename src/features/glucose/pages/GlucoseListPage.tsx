import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Droplet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { ListItem } from "@/components/ListItem";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { DayHeader } from "@/components/DayHeader";
import { formatTime } from "@/lib/datetime";
import { groupByDay } from "@/lib/groupByDay";
import { useGlucoseList } from "../queries";
import { classifyGlucose, zoneToTone } from "../zones";
import { useGlucoseThresholds } from "@/features/profile/queries";
import type { GlucoseReading } from "../model";

export function GlucoseListPage() {
  const { t, i18n } = useTranslation("glucose");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: readings, isLoading } = useGlucoseList(search);
  const thresholds = useGlucoseThresholds();
  const lang = i18n.language as "es" | "en";

  const daySummary = (items: GlucoseReading[]) => {
    const values = items.map((r) => r.value);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return t("daySummary", {
      count: items.length,
      avg,
      min: Math.min(...values),
      max: Math.max(...values),
    });
  };

  return (
    <div>
      <PageHeader
        title={t("title")}
        icon={<Droplet className="size-6" />}
        action={
          <Button size="sm" onClick={() => navigate("/glucose/new")}>
            {t("newReading")}
          </Button>
        }
      />

      <Input
        className="mb-4"
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : !readings || readings.length === 0 ? (
        <EmptyState message={search ? tc("empty") : t("emptyMessage")} />
      ) : (
        <div className="mx-auto max-w-2xl">
          {groupByDay(readings, (r) => r.measuredAt).map((group) => (
            <section key={group.key}>
              <DayHeader dateIso={group.dateIso} summary={daySummary(group.items)} />
              <ul className="flex flex-col gap-2">
                {group.items.map((r) => {
                  const zone = classifyGlucose(r.value, thresholds);
                  return (
                    <li key={r.id}>
                      <ListItem onClick={() => navigate(`/glucose/${r.id}`)}>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-semibold">{r.value}</span>
                          <span className="text-sm text-muted">{t("valueUnit")}</span>
                          <span className="text-sm text-muted">
                            · {t(`types.${r.type}`)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge tone={zoneToTone[zone]}>{t(`zones.${zone}`)}</Badge>
                          <span className="text-xs text-muted">
                            {formatTime(r.measuredAt, lang)}
                          </span>
                        </div>
                      </ListItem>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
