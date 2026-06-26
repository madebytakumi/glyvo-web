import { describe, it, expect } from "vitest";
import { normalizeTags, parseTags } from "../model";

describe("parseTags", () => {
  it("trims, drops blanks and de-dupes", () => {
    expect(parseTags(" a, b ,, a , c ")).toEqual(["a", "b", "c"]);
  });
  it("returns [] for empty", () => {
    expect(parseTags(null)).toEqual([]);
    expect(parseTags("")).toEqual([]);
  });
});

describe("normalizeTags", () => {
  it("normalizes to comma-space and null when empty", () => {
    expect(normalizeTags("a,,b")).toBe("a, b");
    expect(normalizeTags("  ")).toBeNull();
  });
});
