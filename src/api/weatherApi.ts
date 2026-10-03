import type { ApiErrorBody, ForecastResponse, HistoryResponse } from "./types";
import { ApiError } from "./errors";

async function request<T>(url: URL, signal?: AbortSignal): Promise<T> {
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

  return res.json();
}

export async function fetchHistory(
  date: string,
  signal?: AbortSignal,
): Promise<HistoryResponse> {
  const url = new URL("/api/weather/history", window.location.origin);
  url.searchParams.set("date", date);

  return request<HistoryResponse>(url, signal);
}

export async function fetchForecast(
  signal?: AbortSignal,
): Promise<ForecastResponse> {
  const url = new URL("/api/weather/forecast", window.location.origin);

  return request<ForecastResponse>(url, signal);
}
