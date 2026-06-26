import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { GlucoseForm } from "../components/GlucoseForm";
import {
  useCreateGlucose,
  useDeleteGlucose,
  useGlucoseReading,
  useUpdateGlucose,
} from "../queries";
import type { GlucoseInput } from "../model";

export function GlucoseFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t } = useTranslation("glucose");
  const { t: tc } = useTranslation("common");

  const { data: reading, isLoading } = useGlucoseReading(id ?? "");
  const create = useCreateGlucose();
  const update = useUpdateGlucose();
  const remove = useDeleteGlucose();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const back = () => navigate("/glucose");

  function handleSubmit(input: GlucoseInput) {
    if (isEdit) {
      update.mutate({ id: id as string, input }, { onSuccess: back });
    } else {
      create.mutate(input, { onSuccess: back });
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
      <PageHeader title={isEdit ? t("editReading") : t("newReading")} />
      <Card>
        <GlucoseForm
          initial={reading ?? undefined}
          submitting={create.isPending || update.isPending}
          onSubmit={handleSubmit}
          onCancel={back}
        />
      </Card>

      {isEdit && (
        <>
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => setConfirmDelete(true)}
          >
            {tc("delete")}
          </Button>
          <ConfirmDialog
            open={confirmDelete}
            message={t("deleteMessage")}
            loading={remove.isPending}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={() =>
              remove.mutate(id as string, { onSuccess: back })
            }
          />
        </>
      )}
    </div>
  );
}
