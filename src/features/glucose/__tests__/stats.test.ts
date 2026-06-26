import { describe, it, expect } from "vitest";
import { computeDailyStats } from "../service";
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

describe("computeDailyStats", () => {
  it("returns empty stats with no readings", () => {
    expect(computeDailyStats([])).toEqual({
      count: 0,
      latest: null,
      average: null,
      highest: null,
      lowest: null,
    });
  });

  it("computes count, average, extremes and latest", () => {
    const a = reading(100, "2026-06-25T08:00:00.000Z");
    const b = reading(200, "2026-06-25T12:00:00.000Z");
    const c = reading(150, "2026-06-25T10:00:00.000Z");
    const stats = computeDailyStats([a, b, c]);
    expect(stats.count).toBe(3);
    expect(stats.average).toBe(150);
    expect(stats.highest).toBe(200);
    expect(stats.lowest).toBe(100);
    expect(stats.latest?.id).toBe(b.id); // latest measuredAt
  });
});
