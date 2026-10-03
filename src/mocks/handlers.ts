import { delay, http, HttpResponse } from "msw";
import type {
  ApiErrorBody,
  ForecastResponse,
  HistoryDay,
  HistoryResponse,
} from "../api/types";
import { isValidIsoDate, todayLocal } from "../utils/date";

const HISTORY_DAYS = 90;

/** Random whole number between min and max (inclusive). */
function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** HISTORY_DAYS consecutive days of random temperatures, ending on `endDate`. */
function generateHistory(endDate: Date): HistoryDay[] {
  const days: HistoryDay[] = [];

  for (let daysAgo = HISTORY_DAYS - 1; daysAgo >= 0; daysAgo--) {
    const date = new Date(endDate);
    date.setUTCDate(date.getUTCDate() - daysAgo);

    const low = randomInt(5, 20);
    const high = low + randomInt(3, 12);

    days.push({ date: date.toISOString().slice(0, 10), low, high });
  }

  return days;
}

export const handlers = [
  http.get<never, never, ForecastResponse>(
    "/api/weather/forecast",
    async () => {
      await delay();
      return HttpResponse.json({
        location: "New York",
        unit: "celsius",
        current: { temperature: 20, condition: "sunny" },
        forecast: [
          { day: "Monday", temperature: 18, condition: "cloudy" },
          { day: "Tuesday", temperature: 22, condition: "sunny" },
          { day: "Wednesday", temperature: 20, condition: "rainy" },
        ],
      });
    },
  ),

  http.get<never, never, HistoryResponse | ApiErrorBody>(
    "/api/weather/history",
    async ({ request }) => {
      await delay();
      // The mock runs in the browser, so "today" is the same local date the client uses.
      const today = todayLocal();
      const date = new URL(request.url).searchParams.get("date") ?? today;

      if (!isValidIsoDate(date)) {
        return HttpResponse.json(
          { error: "`date` must be a valid YYYY-MM-DD date." },
          { status: 400 },
        );
      }

      if (date > today) {
        return HttpResponse.json(
          { error: "`date` cannot be in the future." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        location: "New York",
        unit: "celsius",
        days: generateHistory(new Date(date)),
      });
    },
  ),
];
