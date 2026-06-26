import { format, parseISO, isSameDay, startOfDay, endOfDay } from "date-fns";
import { es, enUS } from "date-fns/locale";

type SupportedLocale = "es" | "en";

const locales = { es, en: enUS } as const;

export function nowIso(): string {
  return new Date().toISOString();
}

export function toIso(date: Date): string {
  return date.toISOString();
}

export function fromIso(iso: string): Date {
  return parseISO(iso);
}

/** Locale-aware date formatting. */
export function formatDate(
  iso: string,
  pattern: string,
  locale: SupportedLocale = "es",
): string {
  return format(parseISO(iso), pattern, { locale: locales[locale] });
}

export function formatTime(iso: string, locale: SupportedLocale = "es"): string {
  return format(parseISO(iso), "p", { locale: locales[locale] });
}

export function formatDateTime(
  iso: string,
  locale: SupportedLocale = "es",
): string {
  return format(parseISO(iso), "PP p", { locale: locales[locale] });
}

export function isToday(iso: string): boolean {
  return isSameDay(parseISO(iso), new Date());
}

export function dayBounds(date: Date = new Date()): { start: string; end: string } {
  return { start: startOfDay(date).toISOString(), end: endOfDay(date).toISOString() };
}

/** Combine a calendar day with an "HH:MM" local time into an ISO datetime. */
export function combineDateAndTime(day: Date, hhmm: string): string {
  const [h, m] = hhmm.split(":").map((n) => Number(n));
  const d = new Date(day);
  d.setHours(h || 0, m || 0, 0, 0);
  return d.toISOString();
}

/** Format an ISO datetime as a local "HH:MM" string. */
export function formatTimeHHmm(iso: string): string {
  return format(parseISO(iso), "HH:mm");
}

/**
 * Convert an ISO datetime to the value a <input type="datetime-local"> expects
 * (local "YYYY-MM-DDTHH:MM", no timezone/seconds).
 */
export function toDateTimeLocal(iso: string): string {
  const d = parseISO(iso);
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

/** Parse a <input type="datetime-local"> value into an ISO datetime. */
export function fromDateTimeLocal(value: string): string {
  return new Date(value).toISOString();
}

/** JS weekday (0=Sun..6=Sat) of a Date. */
export function weekdayOf(date: Date): number {
  return date.getDay();
}

/** Inclusive list of day-start Dates from `start` to `end`. */
export function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const cursor = startOfDay(start);
  const last = startOfDay(end);
  while (cursor.getTime() <= last.getTime()) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
