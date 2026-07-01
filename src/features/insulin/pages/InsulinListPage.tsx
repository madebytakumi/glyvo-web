import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Syringe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ListItem } from "@/components/ListItem";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { DayHeader } from "@/components/DayHeader";
import { formatTime } from "@/lib/datetime";
import { groupByDay } from "@/lib/groupByDay";
import { useInsulinList } from "../queries";

export function InsulinListPage() {
  const { t, i18n } = useTranslation("insulin");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: logs, isLoading } = useInsulinList(search);
  const lang = i18n.language as "es" | "en";

  return (
    <div>
      <PageHeader
        title={t("title")}
        icon={<Syringe className="size-6" />}
        action={
          <Button size="sm" onClick={() => navigate("/insulin/new")}>
            {t("newLog")}
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
      ) : !logs || logs.length === 0 ? (
        <EmptyState message={search ? tc("empty") : t("emptyMessage")} />
      ) : (
        <div className="mx-auto max-w-2xl">
          {groupByDay(logs, (l) => l.administeredAt).map((group) => {
            const totalUnits =
              Math.round(
                group.items.reduce((a, l) => a + l.units, 0) * 100,
              ) / 100;
            return (
              <section key={group.key}>
                <DayHeader
                  dateIso={group.dateIso}
                  summary={t("daySummary", {
                    count: group.items.length,
                    units: totalUnits,
                  })}
                />
                <ul className="flex flex-col gap-2">
                  {group.items.map((l) => (
                    <li key={l.id}>
                      <ListItem onClick={() => navigate(`/insulin/${l.id}`)}>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold">{l.name}</span>
                          <span className="text-sm text-muted">
                            {l.units} {t("unitsShort")}
                          </span>
                        </div>
                        <span className="text-xs text-muted">
                          {formatTime(l.administeredAt, lang)}
                        </span>
                      </ListItem>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
