import { describe, it, expect } from "vitest";
import { combineDateAndTime } from "@/lib/datetime";
import {
  computeAdherence,
  occurrencesForDay,
  resolveDoses,
} from "../adherence";
import type {
  IntakeLog,
  Medication,
  MedicationSchedule,
} from "../model";

const TS = "2026-06-25T00:00:00.000Z";

function med(over: Partial<Medication> = {}): Medication {
  return {
    id: "m1",
    userId: "u1",
    createdAt: TS,
    updatedAt: TS,
    deletedAt: null,
    name: "Metformina",
    dosage: "850 mg",
    instructions: null,
    active: true,
    startDate: null,
    endDate: null,
    ...over,
  };
}

function schedule(over: Partial<MedicationSchedule> = {}): MedicationSchedule {
  return {
    id: "s1",
    userId: "u1",
    createdAt: TS,
    updatedAt: TS,
    deletedAt: null,
    medicationId: "m1",
    time: "08:00",
    frequency: "daily",
    daysOfWeek: null,
    active: true,
    ...over,
  };
}

function intake(scheduledTime: string, over: Partial<IntakeLog> = {}): IntakeLog {
  return {
    id: "i1",
    userId: "u1",
    createdAt: TS,
    updatedAt: TS,
    deletedAt: null,
    medicationId: "m1",
    scheduledTime,
    actualIntakeTime: scheduledTime,
    status: "taken",
    ...over,
  };
}

describe("occurrencesForDay", () => {
  it("includes a daily schedule", () => {
    const day = new Date(2026, 5, 25);
    const occ = occurrencesForDay([med()], [schedule()], day);
    expect(occ).toHaveLength(1);
    expect(occ[0].scheduledTime).toBe(combineDateAndTime(day, "08:00"));
  });

  it("respects specific_days", () => {
    const day = new Date(2026, 5, 25);
    const todayCsv = String(day.getDay());
    const otherCsv = String((day.getDay() + 1) % 7);
    expect(
      occurrencesForDay(
        [med()],
        [schedule({ frequency: "specific_days", daysOfWeek: todayCsv })],
        day,
      ),
    ).toHaveLength(1);
    expect(
      occurrencesForDay(
        [med()],
        [schedule({ frequency: "specific_days", daysOfWeek: otherCsv })],
        day,
      ),
    ).toHaveLength(0);
  });

  it("skips inactive or deleted medications/schedules", () => {
    const day = new Date(2026, 5, 25);
    expect(occurrencesForDay([med({ active: false })], [schedule()], day)).toHaveLength(0);
    expect(occurrencesForDay([med()], [schedule({ active: false })], day)).toHaveLength(0);
  });
});

describe("computeAdherence / resolveDoses", () => {
  it("counts a taken dose as 100% adherence", () => {
    const day = new Date(2026, 5, 25);
    const now = new Date(2026, 5, 25, 12, 0); // after 08:00, dose is due
    const occTime = combineDateAndTime(day, "08:00");
    const stats = computeAdherence(
      [med()],
      [schedule()],
      [intake(occTime)],
      day,
      day,
      now,
    );
    expect(stats).toMatchObject({ expected: 1, taken: 1, missed: 0, pct: 100 });
  });

  it("counts a due-but-unlogged dose as missed", () => {
    const day = new Date(2026, 5, 25);
    const now = new Date(2026, 5, 25, 12, 0);
    const stats = computeAdherence([med()], [schedule()], [], day, day, now);
    expect(stats).toMatchObject({ expected: 1, taken: 0, missed: 1, pct: 0 });
  });

  it("marks a future dose as pending (not yet due)", () => {
    const day = new Date(2026, 5, 25);
    const now = new Date(2026, 5, 25, 6, 0); // before 08:00
    const doses = resolveDoses([med()], [schedule()], [], day, now);
    expect(doses[0].status).toBe("pending");
  });
});
