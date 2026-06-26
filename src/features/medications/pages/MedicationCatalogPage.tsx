import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Pill } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { ListItem } from "@/components/ListItem";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { useMedications } from "../queries";

export function MedicationCatalogPage() {
  const { t } = useTranslation("medications");
  const navigate = useNavigate();
  const { data: meds, isLoading } = useMedications();

  return (
    <div>
      <PageHeader
        title={t("catalogTitle")}
        icon={<Pill className="size-6" />}
        action={
          <Button size="sm" onClick={() => navigate("/medications/new")}>
            {t("newMedication")}
          </Button>
        }
      />
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : !meds || meds.length === 0 ? (
        <EmptyState message={t("emptyMessage")} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {meds.map((m) => (
            <li key={m.id}>
              <ListItem onClick={() => navigate(`/medications/${m.id}`)}>
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">{m.name}</span>
                  {m.dosage && <span className="text-sm text-muted">{m.dosage}</span>}
                </div>
                <Badge tone={m.active ? "success" : "neutral"}>
                  {m.active ? t("active") : t("inactive")}
                </Badge>
              </ListItem>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
