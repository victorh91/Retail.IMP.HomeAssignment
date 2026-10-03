import { describe, expect, it } from "vitest";
import { formatDayRange, isValidIsoDate } from "./date";

describe("formatDayRange", () => {
  it("shows the year once when the range is within one year", () => {
    expect(formatDayRange("2026-10-03", 90)).toBe("Jul 6 – Oct 3, 2026");
  });

  it("shows both years when the range crosses New Year", () => {
    expect(formatDayRange("2025-03-10", 90)).toBe(
      "Dec 11, 2024 – Mar 10, 2025",
    );
  });
});

describe("isValidIsoDate", () => {
  it.each([
    ["2025-06-15", true],
    ["2024-02-29", true],
    ["2025-02-29", false],
    ["2025-02-30", false],
    ["2025-13-01", false],
    ["2025-6-15", false],
    ["skrap", false],
    ["", false],
  ])("%s -> %s", (value, expected) => {
    expect(isValidIsoDate(value)).toBe(expected);
  });
});
