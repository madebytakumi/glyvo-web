import { describe, it, expect } from "vitest";
import { buildGlucoseTrend } from "../service";
import type { GlucoseReading } from "../model";

function reading(value: number, measuredAt: string): GlucoseReading {
  return {
    id: measuredAt,
    userId: "u1",
    createdAt: measuredAt,
    updatedAt: measuredAt,
    deletedAt: null,
    value,
    type: "aleatoria",
    measuredAt,
    notes: null,
  };
}

describe("buildGlucoseTrend", () => {
  const now = new Date(2026, 5, 25, 12, 0); // Jun 25 2026, local

  it("returns one continuous bucket per day (oldest→newest)", () => {
    const points = buildGlucoseTrend([], 7, now);
    expect(points).toHaveLength(7);
    expect(points[0].count).toBe(0);
    expect(points[0].avg).toBeNull();
    // last bucket is "today"
    expect(points[6].label).toBe("25/06");
  });

  it("aggregates avg/min/max for a day", () => {
    const today = (h: number) => new Date(2026, 5, 25, h, 0).toISOString();
    const points = buildGlucoseTrend(
      [reading(100, today(8)), reading(200, today(12)), reading(150, today(18))],
      7,
      now,
    );
    const last = points[6];
    expect(last.count).toBe(3);
    expect(last.avg).toBe(150);
    expect(last.min).toBe(100);
    expect(last.max).toBe(200);
  });

  it("ignores readings outside the window", () => {
    const old = new Date(2020, 0, 1, 8, 0).toISOString();
    const points = buildGlucoseTrend([reading(120, old)], 7, now);
    expect(points.every((p) => p.count === 0)).toBe(true);
  });
});
