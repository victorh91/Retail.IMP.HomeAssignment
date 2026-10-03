import { useSearchParams } from "react-router-dom";
import { useForecast } from "../api/useForecast";
import { useHistory } from "../api/useHistory";
import { CurrentWeatherCard } from "../components/CurrentWeatherCard";
import { DataCard } from "../components/DataCard";
import { DatePicker } from "../components/DatePicker";
import { TemperatureHistoryChart } from "../components/TemperatureHistoryChart";
import { formatDayRange, isValidIsoDate, todayLocal } from "../utils/date";

// Matches the number of days the history API returns.
const HISTORY_DAYS = 90;

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayLocal();
  const dateParam = searchParams.get("date");
  // The URL is user input: fall back to today for missing, malformed or future dates.
  const date =
    dateParam && isValidIsoDate(dateParam) && dateParam <= today
      ? dateParam
      : today;

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
        <DataCard
          title="Current weather & forecast"
          status={forecast.status}
          error={forecast.error}
        >
          {forecast.data && <CurrentWeatherCard forecast={forecast.data} />}
        </DataCard>

        <DataCard
          title={`Temperature history, ${formatDayRange(date, HISTORY_DAYS)}`}
          status={history.status}
          error={history.error}
        >
          {history.data && <TemperatureHistoryChart days={history.data.days} />}
        </DataCard>
      </main>
    </div>
  );
}
