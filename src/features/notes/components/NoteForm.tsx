import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TextField } from "@/components/fields/TextField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { DateTimeField } from "@/components/fields/DateTimeField";
import { fromDateTimeLocal, toDateTimeLocal, nowIso } from "@/lib/datetime";
import { noteFormSchema, type NoteFormValues } from "../schema";
import type { Note, NoteInput } from "../model";

interface NoteFormProps {
  initial?: Note;
  submitting?: boolean;
  onSubmit: (input: NoteInput) => void;
  onCancel: () => void;
}

export function NoteForm({ initial, submitting, onSubmit, onCancel }: NoteFormProps) {
  const { t } = useTranslation("notes");
  const { t: tc } = useTranslation("common");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema(t)),
    defaultValues: {
      title: initial?.title ?? "",
      content: initial?.content ?? "",
      noteAt: toDateTimeLocal(initial?.noteAt ?? nowIso()),
      tags: initial?.tags ?? "",
    },
  });

  function submit(values: NoteFormValues) {
    onSubmit({
      title: values.title?.trim() ? values.title.trim() : null,
      content: values.content.trim(),
      noteAt: fromDateTimeLocal(values.noteAt),
      tags: values.tags ?? null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <TextField
        label={t("fieldTitle")}
        placeholder={t("titlePlaceholder")}
        {...register("title")}
      />
      <TextAreaField
        label={t("content")}
        rows={5}
        placeholder={t("contentPlaceholder")}
        error={errors.content?.message}
        {...register("content")}
      />
      <Controller
        control={control}
        name="noteAt"
        render={({ field, fieldState }) => (
          <DateTimeField
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <TextField
        label={t("tags")}
        placeholder={t("tagsPlaceholder")}
        hint={t("tagsHint")}
        error={errors.tags?.message}
        {...register("tags")}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {tc("cancel")}
        </Button>
        <Button type="submit" loading={submitting}>
          {tc("save")}
        </Button>
      </div>
    </form>
  );
}
