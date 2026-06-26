import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TextField } from "@/components/fields/TextField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { SelectField } from "@/components/fields/SelectField";
import { DateTimeField } from "@/components/fields/DateTimeField";
import { fromDateTimeLocal, toDateTimeLocal, nowIso } from "@/lib/datetime";
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
    control,
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
      <TextField
        label={`${t("value")} (${t("valueUnit")})`}
        inputMode="numeric"
        placeholder={t("valuePlaceholder")}
        error={errors.value?.message}
        {...register("value")}
      />

      <Controller
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <SelectField
            label={t("type")}
            value={field.value}
            onChange={field.onChange}
            options={typeOptions}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="measuredAt"
        render={({ field, fieldState }) => (
          <DateTimeField
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <TextAreaField
        label={t("notes")}
        placeholder={t("notesPlaceholder")}
        {...register("notes")}
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
