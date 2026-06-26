import type { CSSProperties } from "react";
import { DayPicker } from "react-day-picker";
import { es, enUS } from "date-fns/locale";
import "react-day-picker/style.css";

/**
 * Themed month calendar (lazy-loaded so react-day-picker stays out of the
 * initial bundle). Selection/today are themed via react-day-picker CSS vars.
 */
export default function Calendar({
  selected,
  onSelect,
  lang,
}: {
  selected?: Date;
  onSelect: (date?: Date) => void;
  lang: string;
}) {
  const themeVars = {
    "--rdp-accent-color": "rgb(var(--primary))",
    "--rdp-accent-background-color": "rgb(var(--primary-soft))",
    "--rdp-today-color": "rgb(var(--primary))",
    "--rdp-day-width": "2.25rem",
    "--rdp-day-height": "2.25rem",
    "--rdp-day_button-width": "2.25rem",
    "--rdp-day_button-height": "2.25rem",
  } as CSSProperties;

  return (
    <div style={themeVars} className="text-text">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={lang === "en" ? enUS : es}
        showOutsideDays
        weekStartsOn={1}
      />
    </div>
  );
}
