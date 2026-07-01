import { format, parseISO } from "date-fns";

export interface DayGroup<T> {
  /** Local calendar day key, "yyyy-MM-dd". */
  key: string;
  /** ISO timestamp of the first item in the group (for labeling). */
  dateIso: string;
  items: T[];
}

/**
 * Group items by local calendar day, preserving input order. Repositories
 * already return items sorted by their date column descending, so the resulting
 * groups (and the items within them) stay newest-first.
 */
export function groupByDay<T>(
  items: T[],
  getIso: (item: T) => string,
): DayGroup<T>[] {
  const groups: DayGroup<T>[] = [];
  const byKey = new Map<string, DayGroup<T>>();

  for (const item of items) {
    const iso = getIso(item);
    const key = format(parseISO(iso), "yyyy-MM-dd");
    let group = byKey.get(key);
    if (!group) {
      group = { key, dateIso: iso, items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups;
}
