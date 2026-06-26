import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { NoteForm } from "../components/NoteForm";
import { useCreateNote, useDeleteNote, useNote, useUpdateNote } from "../queries";
import type { NoteInput } from "../model";

export function NoteFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t } = useTranslation("notes");
  const { t: tc } = useTranslation("common");

  const { data: note, isLoading } = useNote(id ?? "");
  const create = useCreateNote();
  const update = useUpdateNote();
  const remove = useDeleteNote();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const back = () => navigate("/notes");

  function handleSubmit(input: NoteInput) {
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
      <PageHeader title={isEdit ? t("editNote") : t("newNote")} />
      <Card>
        <NoteForm
          initial={note ?? undefined}
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
