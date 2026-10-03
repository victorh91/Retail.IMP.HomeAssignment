import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import type { Status } from "../api/types";
import { useForecast } from "../api/useForecast";
import { useHistory } from "../api/useHistory";
import { CurrentWeatherCard } from "../components/CurrentWeatherCard";
import { DatePicker } from "../components/DatePicker";
import { TemperatureHistoryChart } from "../components/TemperatureHistoryChart";
import { todayLocal } from "../utils/date";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayLocal();
  const date = searchParams.get("date") ?? today;

  const history = useHistory(date);
  const forecast = useForecast();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-t-4 border-brand bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Weather Dashboard
          </h1>
          <DatePicker
            selectedDate={date}
            maxDate={today}
            onDateChange={(newDate) => setSearchParams({ date: newDate })}
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 p-4">
        <Card
          title="Current weather & forecast"
          status={forecast.status}
          error={forecast.error}
        >
          {forecast.data && <CurrentWeatherCard forecast={forecast.data} />}
        </Card>

        <Card
          title={`Temperature history – 90 days up to ${date}`}
          status={history.status}
          error={history.error}
        >
          {history.data && <TemperatureHistoryChart days={history.data.days} />}
        </Card>
      </main>
    </div>
  );
}

interface CardProps {
  title: string;
  status: Status;
  error: Error | null;
  children: ReactNode;
}

function Card({ title, status, error, children }: CardProps) {
  const isLoading = status === "loading";

  return (
    <section
      className="rounded-xl bg-white p-6 shadow-sm"
      aria-busy={isLoading}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span aria-live="polite" className="text-sm text-gray-500">
          {isLoading ? "Loading…" : ""}
        </span>
      </div>

      {status === "error" ? (
        <p role="alert" className="text-red-700">
          Could not load data: {error?.message}
        </p>
      ) : (
        // Previous data stays visible but dimmed while new data loads.
        <div
          className={
            isLoading ? "opacity-50 transition-opacity" : "transition-opacity"
          }
        >
          {children}
        </div>
      )}
    </section>
  );
}
