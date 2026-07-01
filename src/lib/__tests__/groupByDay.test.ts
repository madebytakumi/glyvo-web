import { describe, it, expect } from "vitest";
import { groupByDay } from "../groupByDay";

interface Row {
  id: string;
  at: string;
}

describe("groupByDay", () => {
  it("groups by local calendar day preserving order", () => {
    const rows: Row[] = [
      { id: "a", at: "2026-06-25T21:00:00.000Z" },
      { id: "b", at: "2026-06-25T08:00:00.000Z" },
      { id: "c", at: "2026-06-24T12:00:00.000Z" },
    ];
    const groups = groupByDay(rows, (r) => r.at);
    expect(groups).toHaveLength(2);
    expect(groups[0].items.map((r) => r.id)).toEqual(["a", "b"]);
    expect(groups[1].items.map((r) => r.id)).toEqual(["c"]);
    expect(groups[0].key).toBe("2026-06-25");
  });

  it("returns [] for no items", () => {
    expect(groupByDay([], (r: Row) => r.at)).toEqual([]);
  });
});
