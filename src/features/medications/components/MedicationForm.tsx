import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TextField } from "@/components/fields/TextField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { DateField } from "@/components/fields/DateField";
import { SwitchField } from "@/components/fields/SwitchField";
import { medicationFormSchema, type MedicationFormValues } from "../schema";
import type { Medication, MedicationInput } from "../model";

interface MedicationFormProps {
  initial?: Medication;
  submitting?: boolean;
  onSubmit: (input: MedicationInput) => void;
  onCancel: () => void;
}

export function MedicationForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: MedicationFormProps) {
  const { t } = useTranslation("medications");
  const { t: tc } = useTranslation("common");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema(t)),
    defaultValues: {
      name: initial?.name ?? "",
      dosage: initial?.dosage ?? "",
      instructions: initial?.instructions ?? "",
      active: initial?.active ?? true,
      startDate: initial?.startDate ?? "",
      endDate: initial?.endDate ?? "",
    },
  });

  function submit(values: MedicationFormValues) {
    onSubmit({
      name: values.name.trim(),
      dosage: values.dosage?.trim() ? values.dosage.trim() : null,
      instructions: values.instructions?.trim() ? values.instructions.trim() : null,
      active: values.active,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <TextField
        label={t("name")}
        placeholder={t("namePlaceholder")}
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        label={t("dosage")}
        placeholder={t("dosagePlaceholder")}
        {...register("dosage")}
      />
      <TextAreaField
        label={t("instructions")}
        placeholder={t("instructionsPlaceholder")}
        {...register("instructions")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DateField
              label={t("hasStartDate")}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <DateField
              label={t("hasEndDate")}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <SwitchField
            label={t("active")}
            checked={field.value}
            onChange={field.onChange}
          />
        )}
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
