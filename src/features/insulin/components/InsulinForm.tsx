import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TextField } from "@/components/fields/TextField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { DateTimeField } from "@/components/fields/DateTimeField";
import { fromDateTimeLocal, toDateTimeLocal, nowIso } from "@/lib/datetime";
import { insulinFormSchema, type InsulinFormValues } from "../schema";
import {
  INSULIN_NAME_SUGGESTIONS,
  type InsulinInput,
  type InsulinLog,
} from "../model";

interface InsulinFormProps {
  initial?: InsulinLog;
  submitting?: boolean;
  onSubmit: (input: InsulinInput) => void;
  onCancel: () => void;
}

export function InsulinForm({ initial, submitting, onSubmit, onCancel }: InsulinFormProps) {
  const { t } = useTranslation("insulin");
  const { t: tc } = useTranslation("common");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsulinFormValues>({
    resolver: zodResolver(insulinFormSchema(t)),
    defaultValues: {
      name: initial?.name ?? "",
      units: initial ? String(initial.units) : "",
      administeredAt: toDateTimeLocal(initial?.administeredAt ?? nowIso()),
      notes: initial?.notes ?? "",
    },
  });

  function submit(values: InsulinFormValues) {
    onSubmit({
      name: values.name.trim(),
      units: Number(values.units),
      administeredAt: fromDateTimeLocal(values.administeredAt),
      notes: values.notes?.trim() ? values.notes.trim() : null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <TextField
        label={t("name")}
        list="insulin-names"
        placeholder={t("namePlaceholder")}
        error={errors.name?.message}
        {...register("name")}
      />
      <datalist id="insulin-names">
        {INSULIN_NAME_SUGGESTIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <TextField
        label={t("units")}
        inputMode="decimal"
        placeholder={t("unitsPlaceholder")}
        error={errors.units?.message}
        {...register("units")}
      />

      <Controller
        control={control}
        name="administeredAt"
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
