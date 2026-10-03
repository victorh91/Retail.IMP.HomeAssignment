import { useEffect, useState } from "react";
import { fetchForecast } from "./weatherApi";
import type { ForecastResponse, Status } from "./types";

interface ForecastResult {
  error?: Error;
  data?: ForecastResponse;
}

function getStatus(result: ForecastResult | null): Status {
  if (!result) return "loading";
  if (result.error) return "error";

  return "success";
}

export function useForecast() {
  const [result, setResult] = useState<ForecastResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchForecast(controller.signal)
      .then((data) => {
        setResult({ data });
      })
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        setResult({ error });
      });

    return () => controller.abort();
  }, []);

  return {
    status: getStatus(result),
    data: result?.data ?? null,
    error: result?.error ?? null,
  };
}
