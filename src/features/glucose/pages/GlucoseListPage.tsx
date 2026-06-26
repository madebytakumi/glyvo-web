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
import { formatDateTime } from "@/lib/datetime";
import { useGlucoseList } from "../queries";
import { classifyGlucose, zoneToTone } from "../zones";

export function GlucoseListPage() {
  const { t, i18n } = useTranslation("glucose");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: readings, isLoading } = useGlucoseList(search);
  const lang = i18n.language as "es" | "en";

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
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {readings.map((r) => {
            const zone = classifyGlucose(r.value);
            return (
              <li key={r.id}>
                <ListItem onClick={() => navigate(`/glucose/${r.id}`)}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold">{r.value}</span>
                    <span className="text-sm text-muted">{t("valueUnit")}</span>
                    <span className="text-sm text-muted">· {t(`types.${r.type}`)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={zoneToTone[zone]}>{t(`zones.${zone}`)}</Badge>
                    <span className="text-xs text-muted">
                      {formatDateTime(r.measuredAt, lang)}
                    </span>
                  </div>
                </ListItem>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
