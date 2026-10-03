import type { TemperatureUnit } from "../api/types";

const UNIT_SYMBOLS: Record<TemperatureUnit, string> = {
  celsius: "°C",
  fahrenheit: "°F",
};

export function formatTemperature(
  value: number,
  unit: TemperatureUnit,
): string {
  return `${value}${UNIT_SYMBOLS[unit]}`;
}
