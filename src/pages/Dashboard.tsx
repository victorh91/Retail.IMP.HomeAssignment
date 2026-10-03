import { useSearchParams } from "react-router-dom";
import { useForecast } from "../api/useForecast";
import { useHistory } from "../api/useHistory";
import { DatePicker } from "../components/DatePicker";
import { todayLocal } from "../utils/date";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayLocal();
  const date = searchParams.get("date") ?? today;

  const history = useHistory(date);
  const forecast = useForecast();

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Weather Dashboard</h1>
        <DatePicker
          selectedDate={date}
          maxDate={today}
          onDateChange={(newDate) => setSearchParams({ date: newDate })}
        />
      </header>

      {/* Temporary output to verify data flow before building the charts. */}
      <p>
        Forecast: {forecast.status} {forecast.error?.message}
      </p>
      <p>
        History: {history.status} {history.data?.days.length ?? 0} days{" "}
        {history.error?.message}
      </p>
    </div>
  );
}
