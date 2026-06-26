import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { DateTimeField } from "@/components/DateTimeField";
import { FormField } from "@/components/FormField";
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
      <FormField label={t("name")} htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          list="insulin-names"
          placeholder={t("namePlaceholder")}
          invalid={!!errors.name}
          {...register("name")}
        />
        <datalist id="insulin-names">
          {INSULIN_NAME_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </FormField>
      <FormField label={t("units")} htmlFor="units" error={errors.units?.message}>
        <Input
          id="units"
          inputMode="decimal"
          placeholder={t("unitsPlaceholder")}
          invalid={!!errors.units}
          {...register("units")}
        />
      </FormField>
      <FormField label={t("administeredAt")} htmlFor="administeredAt" error={errors.administeredAt?.message}>
        <DateTimeField id="administeredAt" invalid={!!errors.administeredAt} {...register("administeredAt")} />
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
