import { describe, it, expect } from "vitest";
import { classifyGlucose, zoneToTone } from "../zones";

describe("classifyGlucose", () => {
  it("classifies by threshold", () => {
    expect(classifyGlucose(50)).toBe("low");
    expect(classifyGlucose(69)).toBe("low");
    expect(classifyGlucose(70)).toBe("normal");
    expect(classifyGlucose(180)).toBe("normal");
    expect(classifyGlucose(181)).toBe("high");
    expect(classifyGlucose(250)).toBe("high");
    expect(classifyGlucose(251)).toBe("critical");
  });

  it("maps every zone to a badge tone", () => {
    expect(zoneToTone.normal).toBe("success");
    expect(zoneToTone.critical).toBe("danger");
  });

  it("honors custom thresholds", () => {
    const t = { low: 80, high: 140, critical: 200 };
    expect(classifyGlucose(79, t)).toBe("low");
    expect(classifyGlucose(80, t)).toBe("normal");
    expect(classifyGlucose(140, t)).toBe("normal");
    expect(classifyGlucose(141, t)).toBe("high");
    expect(classifyGlucose(200, t)).toBe("high");
    expect(classifyGlucose(201, t)).toBe("critical");
  });
});
