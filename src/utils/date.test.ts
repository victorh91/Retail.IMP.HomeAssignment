import { describe, expect, it } from "vitest";
import { isValidIsoDate } from "./date";

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
