import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InsulinForm } from "../components/InsulinForm";
import {
  useCreateInsulin,
  useDeleteInsulin,
  useInsulinLog,
  useUpdateInsulin,
} from "../queries";
import type { InsulinInput } from "../model";

export function InsulinFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t } = useTranslation("insulin");
  const { t: tc } = useTranslation("common");

  const { data: log, isLoading } = useInsulinLog(id ?? "");
  const create = useCreateInsulin();
  const update = useUpdateInsulin();
  const remove = useDeleteInsulin();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const back = () => navigate("/insulin");

  function handleSubmit(input: InsulinInput) {
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
      <PageHeader title={isEdit ? t("editLog") : t("newLog")} />
      <Card>
        <InsulinForm
          initial={log ?? undefined}
          submitting={create.isPending || update.isPending}
          onSubmit={handleSubmit}
          onCancel={back}
        />
      </Card>
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
            onConfirm={() => remove.mutate(id as string, { onSuccess: back })}
          />
        </>
      )}
    </div>
  );
}
