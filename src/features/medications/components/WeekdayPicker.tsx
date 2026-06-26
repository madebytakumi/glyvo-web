import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { WEEKDAYS } from "../model";

interface WeekdayPickerProps {
  value: number[];
  onChange: (days: number[]) => void;
}

/** Toggle buttons for JS weekday numbers (0=Sun..6=Sat). */
export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const { t } = useTranslation("medications");
  const labels = t("weekdaysShort", { returnObjects: true }) as string[];

  function toggle(day: number) {
    onChange(
      value.includes(day) ? value.filter((d) => d !== day) : [...value, day],
    );
  }

  return (
    <div className="flex gap-1">
      {WEEKDAYS.map((day) => {
        const active = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            className={cn(
              "size-9 rounded-full text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-fg"
                : "bg-primary-soft/40 text-muted hover:bg-primary-soft",
            )}
          >
            {labels[day]}
          </button>
        );
      })}
    </div>
  );
}
