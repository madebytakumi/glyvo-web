import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { DateTimeField } from "@/components/DateTimeField";
import { FormField } from "@/components/FormField";
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
      <FormField label={t("fieldTitle")} htmlFor="title">
        <Input id="title" placeholder={t("titlePlaceholder")} {...register("title")} />
      </FormField>
      <FormField label={t("content")} htmlFor="content" error={errors.content?.message}>
        <TextArea
          id="content"
          rows={5}
          placeholder={t("contentPlaceholder")}
          invalid={!!errors.content}
          {...register("content")}
        />
      </FormField>
      <FormField label={t("noteAt")} htmlFor="noteAt" error={errors.noteAt?.message}>
        <DateTimeField id="noteAt" invalid={!!errors.noteAt} {...register("noteAt")} />
      </FormField>
      <FormField label={t("tags")} htmlFor="tags" error={errors.tags?.message}>
        <Input id="tags" placeholder={t("tagsPlaceholder")} {...register("tags")} />
        <span className="text-xs text-muted">{t("tagsHint")}</span>
      </FormField>
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
