import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Select } from "@/components/Select";
import { DateTimeField } from "@/components/DateTimeField";
import { FormField } from "@/components/FormField";
import { fromDateTimeLocal, toDateTimeLocal } from "@/lib/datetime";
import { nowIso } from "@/lib/datetime";
import { glucoseFormSchema, type GlucoseFormValues } from "../schema";
import { GLUCOSE_TYPES, type GlucoseInput, type GlucoseReading } from "../model";

interface GlucoseFormProps {
  initial?: GlucoseReading;
  submitting?: boolean;
  onSubmit: (input: GlucoseInput) => void;
  onCancel: () => void;
}

export function GlucoseForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: GlucoseFormProps) {
  const { t } = useTranslation("glucose");
  const { t: tc } = useTranslation("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GlucoseFormValues>({
    resolver: zodResolver(glucoseFormSchema(t)),
    defaultValues: {
      value: initial ? String(initial.value) : "",
      type: initial?.type ?? "ayuno",
      measuredAt: toDateTimeLocal(initial?.measuredAt ?? nowIso()),
      notes: initial?.notes ?? "",
    },
  });

  function submit(values: GlucoseFormValues) {
    onSubmit({
      value: Number(values.value),
      type: values.type,
      measuredAt: fromDateTimeLocal(values.measuredAt),
      notes: values.notes?.trim() ? values.notes.trim() : null,
    });
  }

  const typeOptions = GLUCOSE_TYPES.map((type) => ({
    value: type,
    label: t(`types.${type}`),
  }));

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <FormField label={`${t("value")} (${t("valueUnit")})`} htmlFor="value" error={errors.value?.message}>
        <Input
          id="value"
          inputMode="numeric"
          placeholder={t("valuePlaceholder")}
          invalid={!!errors.value}
          {...register("value")}
        />
      </FormField>

      <FormField label={t("type")} htmlFor="type" error={errors.type?.message}>
        <Select id="type" options={typeOptions} invalid={!!errors.type} {...register("type")} />
      </FormField>

      <FormField label={t("measuredAt")} htmlFor="measuredAt" error={errors.measuredAt?.message}>
        <DateTimeField id="measuredAt" invalid={!!errors.measuredAt} {...register("measuredAt")} />
      </FormField>

      <FormField label={t("notes")} htmlFor="notes">
        <TextArea id="notes" placeholder={t("notesPlaceholder")} {...register("notes")} />
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
