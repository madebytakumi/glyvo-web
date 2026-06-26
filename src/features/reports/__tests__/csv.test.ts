import { describe, it, expect } from "vitest";
import { buildCsv, type ReportStrings } from "../export";
import type { Report } from "../model";

const strings: ReportStrings = {
  title: "Reporte, Glyvo",
  periodLabel: "Periodo",
  period: "Semana",
  generatedLabel: "Generado",
  generatedAt: "2026-06-25",
  mgdl: "mg/dL",
  units: "U",
  sections: { glucose: "Glucosa", insulin: "Insulina", meals: "Comidas", medication: "Medicamentos" },
  metrics: {
    count: "Mediciones",
    average: "Promedio",
    highest: "Máxima",
    lowest: "Mínima",
    administrations: "Administraciones",
    totalUnits: "Unidades totales",
    mealsLogged: "Comidas registradas",
    adherence: "Adherencia",
    taken: "Tomadas",
    skipped: "Omitidas",
    missed: "Perdidas",
  },
};

const report: Report = {
  period: { kind: "week", startIso: "a", endIso: "b" },
  glucose: { count: 2, average: 150, highest: 200, lowest: 100 },
  insulin: { count: 1, totalUnits: 5.5 },
  meals: { count: 3, byType: {} },
  medication: { expected: 4, taken: 3, skipped: 0, missed: 1, pct: 75 },
  generatedAt: "2026-06-25",
};

describe("buildCsv", () => {
  it("includes every section heading and adherence as a percentage", () => {
    const csv = buildCsv(report, strings);
    expect(csv).toContain("Glucosa");
    expect(csv).toContain("Insulina");
    expect(csv).toContain("Comidas");
    expect(csv).toContain("Medicamentos");
    expect(csv).toContain("Adherencia,75%");
  });

  it("quotes cells containing commas", () => {
    const csv = buildCsv(report, strings);
    expect(csv).toContain('"Reporte, Glyvo"');
  });
});
