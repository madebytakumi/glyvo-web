import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { useTodayDoses } from "../queries";
import { AdherenceCard } from "../components/AdherenceCard";
import { DoseItem } from "../components/DoseItem";

export function MedicationsTodayPage() {
  const { t } = useTranslation("medications");
  const navigate = useNavigate();
  const { data: doses, isLoading } = useTodayDoses();

  return (
    <div>
      <PageHeader
        title={t("title")}
        action={
          <Button size="sm" variant="secondary" onClick={() => navigate("/medications/catalog")}>
            {t("manage")}
          </Button>
        }
      />

      <AdherenceCard days={7} />

      <h2 className="mb-2 mt-4 text-sm font-medium text-muted">{t("todaysDoses")}</h2>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : !doses || doses.length === 0 ? (
        <EmptyState message={t("noDosesMessage")} />
      ) : (
        <ul className="flex flex-col gap-2">
          {doses.map((dose) => (
            <li key={`${dose.scheduleId}-${dose.scheduledTime}`}>
              <DoseItem dose={dose} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
