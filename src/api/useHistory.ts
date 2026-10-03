import { useState, useEffect } from "react";
import type { HistoryResponse, Status } from "./types";
import { fetchHistory } from "./weatherApi";

interface HistoryResult {
  date: string;
  data?: HistoryResponse;
  error?: Error;
}

function getStatus(result: HistoryResult | null, date: string): Status {
  if (result?.date !== date) return "loading";
  if (result.error) return "error";

  return "success";
}

export function useHistory(date: string) {
  const [result, setResult] = useState<HistoryResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchHistory(date, controller.signal)
      .then((data) => setResult({ date, data }))
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        setResult({ date, error });
      });

    return () => controller.abort();
  }, [date]);

  return {
    status: getStatus(result, date),
    data: result?.data ?? null,
    error: result?.error ?? null,
  };
}
