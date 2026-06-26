import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { SelectField } from "@/components/fields/SelectField";
import { DateTimeField } from "@/components/fields/DateTimeField";
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
    control,
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
      <TextAreaField
        label={t("description")}
        placeholder={t("descriptionPlaceholder")}
        error={errors.description?.message}
        {...register("description")}
      />
      <Controller
        control={control}
        name="mealAt"
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
