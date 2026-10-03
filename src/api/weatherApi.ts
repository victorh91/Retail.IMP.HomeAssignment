import type { z } from "zod";
import type { ApiErrorBody, ForecastResponse, HistoryResponse } from "./types";
import { ApiError } from "./errors";
import { forecastResponseSchema, historyResponseSchema } from "./schemas";

async function request<T>(
  url: URL,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(url.toString(), { signal });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    try {
      const errorBody: ApiErrorBody = await res.json();
      if (errorBody.error) {
        message = errorBody.error;
      }
    } catch {
      // Ignore JSON parsing errors and keep the default message
    }
    throw new ApiError(res.status, message);
  }

  // Catches both non-JSON bodies (e.g. an HTML login page) and JSON in the wrong shape.
  const body: unknown = await res.json().catch(() => undefined);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(res.status, "Unexpected response format from server.");
  }

  return parsed.data;
}

export async function fetchHistory(
  date: string,
  signal?: AbortSignal,
): Promise<HistoryResponse> {
  const url = new URL("/api/weather/history", window.location.origin);
  url.searchParams.set("date", date);

  return request(url, historyResponseSchema, signal);
}

export async function fetchForecast(
  signal?: AbortSignal,
): Promise<ForecastResponse> {
  const url = new URL("/api/weather/forecast", window.location.origin);

  return request(url, forecastResponseSchema, signal);
}
