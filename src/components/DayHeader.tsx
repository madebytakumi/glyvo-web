import type { ReactNode } from "react";
import { isToday, isYesterday, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/datetime";

interface DayHeaderProps {
  /** Any ISO timestamp within the day. */
  dateIso: string;
  /** Compact per-day summary (wraps below the date on mobile). */
  summary?: ReactNode;
}

/** Section header for a day group: relative/absolute date + optional summary. */
export function DayHeader({ dateIso, summary }: DayHeaderProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language as "es" | "en";
  const date = parseISO(dateIso);

  const label = isToday(date)
    ? t("today")
    : isYesterday(date)
      ? t("yesterday")
      : formatDate(dateIso, "PP", lang);

  return (
    <div className="mb-2 mt-4 flex flex-col gap-0.5 border-b border-border pb-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <h2 className="text-sm font-semibold capitalize text-text">{label}</h2>
      {summary && <span className="text-xs text-muted">{summary}</span>}
    </div>
  );
}
