import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { DateTimeField } from "@/components/DateTimeField";
import { Select } from "@/components/Select";
import { FormField } from "@/components/FormField";
import { scheduleFormSchema, type ScheduleFormValues } from "../schema";
import {
  SCHEDULE_FREQUENCIES,
  formatDays,
  parseDays,
  type MedicationSchedule,
  type ScheduleInput,
} from "../model";
import { WeekdayPicker } from "./WeekdayPicker";

interface ScheduleFormProps {
  initial?: MedicationSchedule;
  submitting?: boolean;
  onSubmit: (input: Omit<ScheduleInput, "medicationId">) => void;
  onCancel: () => void;
}

export function ScheduleForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: ScheduleFormProps) {
  const { t } = useTranslation("medications");
  const { t: tc } = useTranslation("common");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema(t)),
    defaultValues: {
      time: initial?.time ?? "08:00",
      frequency: initial?.frequency ?? "daily",
      days: parseDays(initial?.daysOfWeek),
      active: initial?.active ?? true,
    },
  });

  const frequency = watch("frequency");

  function submit(values: ScheduleFormValues) {
    onSubmit({
      time: values.time,
      frequency: values.frequency,
      daysOfWeek: values.frequency === "specific_days" ? formatDays(values.days) : null,
      active: values.active,
    });
  }

  const freqOptions = SCHEDULE_FREQUENCIES.map((f) => ({
    value: f,
    label: t(`frequencies.${f}`),
  }));

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <FormField label={t("time")} htmlFor="time" error={errors.time?.message}>
        <DateTimeField id="time" mode="time" invalid={!!errors.time} {...register("time")} />
      </FormField>
      <FormField label={t("frequency")} htmlFor="frequency">
        <Select id="frequency" options={freqOptions} {...register("frequency")} />
      </FormField>
      {frequency === "specific_days" && (
        <FormField label={t("days")} error={errors.days?.message as string | undefined}>
          <Controller
            control={control}
            name="days"
            render={({ field }) => (
              <WeekdayPicker value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
      )}
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
