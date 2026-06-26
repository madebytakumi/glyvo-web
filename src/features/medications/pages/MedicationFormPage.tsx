import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Spinner } from "@/components/Spinner";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MedicationForm } from "../components/MedicationForm";
import { ScheduleForm } from "../components/ScheduleForm";
import {
  useCreateMedication,
  useCreateSchedule,
  useDeleteMedication,
  useDeleteSchedule,
  useMedication,
  useSchedules,
  useUpdateMedication,
  useUpdateSchedule,
} from "../queries";
import {
  parseDays,
  type MedicationInput,
  type MedicationSchedule,
  type ScheduleInput,
} from "../model";

export function MedicationFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t } = useTranslation("medications");
  const { t: tc } = useTranslation("common");

  const { data: med, isLoading } = useMedication(id ?? "");
  const create = useCreateMedication();
  const update = useUpdateMedication();
  const remove = useDeleteMedication();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSubmit(input: MedicationInput) {
    if (isEdit) {
      update.mutate(
        { id: id as string, input },
        { onSuccess: () => navigate("/medications/catalog") },
      );
    } else {
      // After creating, jump to edit so the user can add schedules.
      create.mutate(input, {
        onSuccess: (created) => navigate(`/medications/${created.id}`, { replace: true }),
      });
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={isEdit ? t("editMedication") : t("newMedication")} />
      <Card>
        <MedicationForm
          initial={med ?? undefined}
          submitting={create.isPending || update.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/medications/catalog")}
        />
      </Card>

      {isEdit && <SchedulesSection medicationId={id as string} />}

      {isEdit && (
        <>
          <Button variant="danger" className="mt-4" onClick={() => setConfirmDelete(true)}>
            {tc("delete")}
          </Button>
          <ConfirmDialog
            open={confirmDelete}
            message={t("deleteMessage")}
            loading={remove.isPending}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={() =>
              remove.mutate(id as string, {
                onSuccess: () => navigate("/medications/catalog"),
              })
            }
          />
        </>
      )}
    </div>
  );
}

function SchedulesSection({ medicationId }: { medicationId: string }) {
  const { t } = useTranslation("medications");
  const { data: schedules } = useSchedules(medicationId);
  const create = useCreateSchedule();
  const update = useUpdateSchedule();
  const remove = useDeleteSchedule();

  const [editing, setEditing] = useState<MedicationSchedule | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(schedule: MedicationSchedule) {
    setEditing(schedule);
    setOpen(true);
  }

  function handleSubmit(input: Omit<ScheduleInput, "medicationId">) {
    if (editing) {
      update.mutate({ id: editing.id, input }, { onSuccess: () => setOpen(false) });
    } else {
      create.mutate(
        { ...input, medicationId },
        { onSuccess: () => setOpen(false) },
      );
    }
  }

  function freqLabel(s: MedicationSchedule): string {
    if (s.frequency === "daily") return t("frequencies.daily");
    const labels = t("weekdaysShort", { returnObjects: true }) as string[];
    return parseDays(s.daysOfWeek)
      .map((d) => labels[d])
      .join(" ");
  }

  return (
    <Card className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium">{t("schedules")}</h2>
        <Button size="sm" onClick={openNew}>
          {t("addSchedule")}
        </Button>
      </div>

      {!schedules || schedules.length === 0 ? (
        <p className="text-muted">{t("noSchedules")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {schedules.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{s.time}</span>
                <span className="text-sm text-muted">{freqLabel(s)}</span>
                {!s.active && <Badge tone="neutral">{t("inactive")}</Badge>}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                  {t("editSchedule")}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteId(s.id)}>
                  ✕
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("editSchedule") : t("addSchedule")}
      >
        <ScheduleForm
          initial={editing ?? undefined}
          submitting={create.isPending || update.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        message={t("deleteScheduleMessage")}
        loading={remove.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={() =>
          remove.mutate(deleteId as string, { onSuccess: () => setDeleteId(null) })
        }
      />
    </Card>
  );
}
