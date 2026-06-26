import { describe, it, expect } from "vitest";
import { formatDays, parseDays, occurrenceKey } from "../model";

describe("parseDays / formatDays", () => {
  it("parses CSV into sorted unique weekday numbers", () => {
    expect(parseDays("5,1,1,3")).toEqual([1, 3, 5]);
    expect(parseDays("7,-1,2")).toEqual([2]); // out-of-range dropped
    expect(parseDays(null)).toEqual([]);
  });

  it("formats weekday numbers back to clean CSV or null", () => {
    expect(formatDays([3, 1, 1])).toBe("1,3");
    expect(formatDays([])).toBeNull();
  });
});

describe("occurrenceKey", () => {
  it("joins medication id and scheduled time", () => {
    expect(occurrenceKey("m1", "2026-06-25T08:00:00.000Z")).toBe(
      "m1|2026-06-25T08:00:00.000Z",
    );
  });
});
