import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { DateTimeField } from "@/components/DateTimeField";
import { FormField } from "@/components/FormField";
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
      <FormField label={t("name")} htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder={t("namePlaceholder")} invalid={!!errors.name} {...register("name")} />
      </FormField>
      <FormField label={t("dosage")} htmlFor="dosage">
        <Input id="dosage" placeholder={t("dosagePlaceholder")} {...register("dosage")} />
      </FormField>
      <FormField label={t("instructions")} htmlFor="instructions">
        <TextArea id="instructions" placeholder={t("instructionsPlaceholder")} {...register("instructions")} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label={t("hasStartDate")} htmlFor="startDate">
          <DateTimeField id="startDate" mode="date" {...register("startDate")} />
        </FormField>
        <FormField label={t("hasEndDate")} htmlFor="endDate" error={errors.endDate?.message}>
          <DateTimeField id="endDate" mode="date" invalid={!!errors.endDate} {...register("endDate")} />
        </FormField>
      </div>
      <label className="flex items-center gap-2 text-text">
        <input type="checkbox" className="size-4" {...register("active")} />
        {t("active")}
      </label>

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
