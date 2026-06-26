import { useTranslation } from "react-i18next";
import { Badge, type BadgeTone } from "@/components/Badge";
import { Button } from "@/components/Button";
import { formatTimeHHmm } from "@/lib/datetime";
import { useClearDose, useMarkDose } from "../queries";
import type { DoseStatus, ResolvedDose } from "../model";

const statusTone: Record<DoseStatus, BadgeTone> = {
  taken: "success",
  skipped: "neutral",
  pending: "primary",
  missed: "danger",
};

export function DoseItem({ dose }: { dose: ResolvedDose }) {
  const { t } = useTranslation("medications");
  const mark = useMarkDose();
  const clear = useClearDose();
  const acted = dose.status === "taken" || dose.status === "skipped";
  const busy = mark.isPending || clear.isPending;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{dose.medicationName}</span>
          {dose.dosage && (
            <span className="text-sm text-muted">{dose.dosage}</span>
          )}
        </div>
        <span className="text-xs text-muted">{formatTimeHHmm(dose.scheduledTime)}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge tone={statusTone[dose.status]}>{t(`status.${dose.status}`)}</Badge>
        {acted ? (
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => clear.mutate(dose)}>
            {t("undo")}
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => mark.mutate({ occurrence: dose, status: "skipped" })}
            >
              {t("markSkipped")}
            </Button>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => mark.mutate({ occurrence: dose, status: "taken" })}
            >
              {t("markTaken")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
