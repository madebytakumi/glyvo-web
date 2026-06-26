import { describe, it, expect } from "vitest";
import {
  computePeriod,
  glucoseSummary,
  insulinSummary,
  mealSummary,
  buildReport,
  type ReportInputs,
} from "../aggregate";
import type { GlucoseReading } from "@/features/glucose/model";
import type { InsulinLog } from "@/features/insulin/model";
import type { Meal } from "@/features/meals/model";

const base = {
  userId: "u1",
  createdAt: "2026-06-25T00:00:00.000Z",
  updatedAt: "2026-06-25T00:00:00.000Z",
  deletedAt: null,
};

describe("summaries", () => {
  it("glucoseSummary computes average/extremes", () => {
    const readings: GlucoseReading[] = [
      { ...base, id: "1", value: 100, type: "ayuno", measuredAt: "x", notes: null },
      { ...base, id: "2", value: 200, type: "ayuno", measuredAt: "y", notes: null },
    ];
    expect(glucoseSummary(readings)).toEqual({
      count: 2,
      average: 150,
      highest: 200,
      lowest: 100,
    });
    expect(glucoseSummary([])).toEqual({
      count: 0,
      average: null,
      highest: null,
      lowest: null,
    });
  });

  it("insulinSummary totals units with 2-decimal rounding", () => {
    const logs: InsulinLog[] = [
      { ...base, id: "1", name: "Rápida", units: 5.5, administeredAt: "x", notes: null },
      { ...base, id: "2", name: "Lenta", units: 2.25, administeredAt: "y", notes: null },
    ];
    expect(insulinSummary(logs)).toEqual({ count: 2, totalUnits: 7.75 });
  });

  it("mealSummary counts by type", () => {
    const meals: Meal[] = [
      { ...base, id: "1", type: "desayuno", description: null, mealAt: "x", notes: null },
      { ...base, id: "2", type: "desayuno", description: null, mealAt: "y", notes: null },
      { ...base, id: "3", type: "cena", description: null, mealAt: "z", notes: null },
    ];
    const summary = mealSummary(meals);
    expect(summary.count).toBe(3);
    expect(summary.byType).toEqual({ desayuno: 2, cena: 1 });
  });
});

describe("computePeriod", () => {
  it("week spans 7 days inclusive", () => {
    const now = new Date(2026, 5, 25, 10, 0);
    const period = computePeriod("week", now);
    expect(period.kind).toBe("week");
    expect(new Date(period.startIso).getDate()).toBe(19); // 25 - 6
  });
});

describe("buildReport", () => {
  it("filters records to the period window", () => {
    const now = new Date(2026, 5, 25, 23, 0);
    const period = computePeriod("day", now);
    const inWindow = period.startIso;
    const before = "2020-01-01T00:00:00.000Z";
    const inputs: ReportInputs = {
      glucose: [
        { ...base, id: "1", value: 120, type: "ayuno", measuredAt: inWindow, notes: null },
        { ...base, id: "2", value: 999, type: "ayuno", measuredAt: before, notes: null },
      ],
      insulin: [],
      meals: [],
      medications: [],
      schedules: [],
      intakeLogs: [],
    };
    const report = buildReport(inputs, period, now);
    expect(report.glucose.count).toBe(1);
    expect(report.glucose.average).toBe(120);
  });
});
