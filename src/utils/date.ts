/** Today's date as "YYYY-MM-DD" in the user's local time zone (toISOString() would use UTC). */
export function todayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Readable range for `days` days ending on `endDate`, e.g. "Jul 6 – Oct 3, 2026". */
export function formatDayRange(endDate: string, days: number): string {
  const end = new Date(`${endDate}T00:00:00`);
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));

  const monthDay = { month: "short", day: "numeric" } as const;
  const withYear = { ...monthDay, year: "numeric" } as const;
  const startFormat =
    start.getFullYear() === end.getFullYear() ? monthDay : withYear;

  return `${start.toLocaleDateString("en-US", startFormat)} – ${end.toLocaleDateString("en-US", withYear)}`;
}

/** True for a real calendar date in "YYYY-MM-DD" format, e.g. rejects "2025-02-30". */
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}
