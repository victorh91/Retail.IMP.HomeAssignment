import { delay, http, HttpResponse } from "msw";
import type {
  ApiErrorBody,
  ForecastResponse,
  HistoryDay,
  HistoryResponse,
} from "../api/types";

const HISTORY_DAYS = 90;

/** Random whole number between min and max (inclusive). */
const randomInt = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

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
      const dateParam = new URL(request.url).searchParams.get("date");
      const endDate = dateParam ? new Date(dateParam) : new Date();

      if (Number.isNaN(endDate.getTime())) {
        return HttpResponse.json(
          { error: "`date` must be a valid YYYY-MM-DD date." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        location: "New York",
        days: generateHistory(endDate),
      });
    },
  ),
];
