import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { TimeField } from "@/components/fields/TimeField";
import { SelectField } from "@/components/fields/SelectField";
import { SwitchField } from "@/components/fields/SwitchField";
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
    control,
    handleSubmit,
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
      <Controller
        control={control}
        name="time"
        render={({ field, fieldState }) => (
          <TimeField
            label={t("time")}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="frequency"
        render={({ field }) => (
          <SelectField
            label={t("frequency")}
            value={field.value}
            onChange={field.onChange}
            options={freqOptions}
          />
        )}
      />
      {frequency === "specific_days" && (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">{t("days")}</span>
          <Controller
            control={control}
            name="days"
            render={({ field }) => (
              <WeekdayPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.days && (
            <span className="text-xs text-danger">
              {errors.days.message as string}
            </span>
          )}
        </div>
      )}
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
