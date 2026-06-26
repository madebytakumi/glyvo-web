import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
import { Select } from "@/components/Select";
import { DateTimeField } from "@/components/DateTimeField";
import { FormField } from "@/components/FormField";
import { fromDateTimeLocal, toDateTimeLocal, nowIso } from "@/lib/datetime";
import { mealFormSchema, type MealFormValues } from "../schema";
import { MEAL_TYPES, type Meal, type MealInput } from "../model";

interface MealFormProps {
  initial?: Meal;
  submitting?: boolean;
  onSubmit: (input: MealInput) => void;
  onCancel: () => void;
}

export function MealForm({ initial, submitting, onSubmit, onCancel }: MealFormProps) {
  const { t } = useTranslation("meals");
  const { t: tc } = useTranslation("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema(t)),
    defaultValues: {
      type: initial?.type ?? "desayuno",
      description: initial?.description ?? "",
      mealAt: toDateTimeLocal(initial?.mealAt ?? nowIso()),
      notes: initial?.notes ?? "",
    },
  });

  function submit(values: MealFormValues) {
    onSubmit({
      type: values.type,
      description: values.description?.trim() ? values.description.trim() : null,
      mealAt: fromDateTimeLocal(values.mealAt),
      notes: values.notes?.trim() ? values.notes.trim() : null,
    });
  }

  const typeOptions = MEAL_TYPES.map((type) => ({
    value: type,
    label: t(`types.${type}`),
  }));

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <FormField label={t("type")} htmlFor="type" error={errors.type?.message}>
        <Select id="type" options={typeOptions} invalid={!!errors.type} {...register("type")} />
      </FormField>
      <FormField label={t("description")} htmlFor="description" error={errors.description?.message}>
        <TextArea id="description" placeholder={t("descriptionPlaceholder")} {...register("description")} />
      </FormField>
      <FormField label={t("mealAt")} htmlFor="mealAt" error={errors.mealAt?.message}>
        <DateTimeField id="mealAt" invalid={!!errors.mealAt} {...register("mealAt")} />
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
