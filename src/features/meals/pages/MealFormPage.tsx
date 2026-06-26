import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MealForm } from "../components/MealForm";
import { useCreateMeal, useDeleteMeal, useMeal, useUpdateMeal } from "../queries";
import type { MealInput } from "../model";

export function MealFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t } = useTranslation("meals");
  const { t: tc } = useTranslation("common");

  const { data: meal, isLoading } = useMeal(id ?? "");
  const create = useCreateMeal();
  const update = useUpdateMeal();
  const remove = useDeleteMeal();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const back = () => navigate("/meals");

  function handleSubmit(input: MealInput) {
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
    <div className="mx-auto max-w-xl">
      <PageHeader title={isEdit ? t("editMeal") : t("newMeal")} />
      <Card>
        <MealForm
          initial={meal ?? undefined}
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
