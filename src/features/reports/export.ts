import type { Report } from "./model";

/**
 * Localized strings the builders need. Passed in by the page (from i18n) so
 * `buildCsv` / `buildHtml` stay pure and unit-testable.
 */
export interface ReportStrings {
  title: string;
  periodLabel: string;
  period: string;
  generatedLabel: string;
  generatedAt: string;
  mgdl: string;
  units: string;
  sections: { glucose: string; insulin: string; meals: string; medication: string };
  metrics: {
    count: string;
    average: string;
    highest: string;
    lowest: string;
    administrations: string;
    totalUnits: string;
    mealsLogged: string;
    adherence: string;
    taken: string;
    skipped: string;
    missed: string;
  };
}

const dash = (v: number | null) => (v == null ? "—" : String(v));

/** Quote a CSV cell when it contains a comma, quote, or newline. */
function cell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** A summary CSV (metric,value) grouped by section. */
export function buildCsv(report: Report, s: ReportStrings): string {
  const lines: string[] = [];
  const row = (a: string, b: string | number) => lines.push(`${cell(a)},${cell(b)}`);

  lines.push(cell(s.title));
  row(s.periodLabel, s.period);
  row(s.generatedLabel, s.generatedAt);

  lines.push("");
  lines.push(cell(s.sections.glucose));
  row(s.metrics.count, report.glucose.count);
  row(s.metrics.average, dash(report.glucose.average));
  row(s.metrics.highest, dash(report.glucose.highest));
  row(s.metrics.lowest, dash(report.glucose.lowest));

  lines.push("");
  lines.push(cell(s.sections.insulin));
  row(s.metrics.administrations, report.insulin.count);
  row(s.metrics.totalUnits, report.insulin.totalUnits);

  lines.push("");
  lines.push(cell(s.sections.meals));
  row(s.metrics.mealsLogged, report.meals.count);

  lines.push("");
  lines.push(cell(s.sections.medication));
  row(
    s.metrics.adherence,
    report.medication.pct == null ? "—" : `${report.medication.pct}%`,
  );
  row(s.metrics.taken, report.medication.taken);
  row(s.metrics.skipped, report.medication.skipped);
  row(s.metrics.missed, report.medication.missed);

  return lines.join("\n");
}
