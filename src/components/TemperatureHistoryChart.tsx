import { ResponsiveLine } from "@nivo/line";
import { useId } from "react";
import type { HistoryDay } from "../api/types";

const HIGH_COLOR = "#f97316";
const LOW_COLOR = "#3b82f6";
const DAYS_BETWEEN_TICKS = 14;

interface TemperatureHistoryChartProps {
  days: HistoryDay[];
}

function formatDate(isoDate: string): string {
  // Parse as local midnight; a bare "YYYY-MM-DD" would be parsed as UTC and could shift a day.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function average(values: number[]): number {
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

export function TemperatureHistoryChart({
  days,
}: TemperatureHistoryChartProps) {
  const summaryId = useId();

  if (days.length === 0) {
    return <p className="text-gray-600">No history for this period.</p>;
  }

  const data = [
    { id: "High", data: days.map((day) => ({ x: day.date, y: day.high })) },
    { id: "Low", data: days.map((day) => ({ x: day.date, y: day.low })) },
  ];

  const tickValues = days
    .filter((_, index) => index % DAYS_BETWEEN_TICKS === 0)
    .map((day) => day.date);

  const first = days[0].date;
  const last = days[days.length - 1].date;
  const warmest = days.reduce((max, day) => (day.high > max.high ? day : max));
  const coldest = days.reduce((min, day) => (day.low < min.low ? day : min));

  return (
    <div>
      <dl
        id={summaryId}
        className="mb-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4"
      >
        <div>
          <dt className="text-gray-600">Average high</dt>
          <dd className="text-lg font-semibold">
            {average(days.map((day) => day.high))}°C
          </dd>
        </div>
        <div>
          <dt className="text-gray-600">Average low</dt>
          <dd className="text-lg font-semibold">
            {average(days.map((day) => day.low))}°C
          </dd>
        </div>
        <div>
          <dt className="text-gray-600">Warmest day</dt>
          <dd className="text-lg font-semibold">
            {formatDate(warmest.date)} ({warmest.high}°C)
          </dd>
        </div>
        <div>
          <dt className="text-gray-600">Coldest night</dt>
          <dd className="text-lg font-semibold">
            {formatDate(coldest.date)} ({coldest.low}°C)
          </dd>
        </div>
      </dl>

      <div className="h-80">
        <ResponsiveLine
          data={data}
          margin={{ top: 30, right: 20, bottom: 40, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          colors={[HIGH_COLOR, LOW_COLOR]}
          curve="monotoneX"
          lineWidth={2}
          enablePoints={false}
          enableGridX={false}
          axisBottom={{
            tickValues,
            format: (value) => formatDate(String(value)),
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            format: (value) => `${value}°C`,
            tickSize: 0,
            tickPadding: 8,
          }}
          enableSlices="x"
          sliceTooltip={({ slice }) => (
            <div className="rounded-md bg-white px-3 py-2 text-sm shadow-md">
              <p className="font-medium">
                {formatDate(String(slice.points[0].data.x))}
              </p>
              {slice.points.map((point) => (
                <p key={point.id} style={{ color: point.seriesColor }}>
                  {point.seriesId}: {point.data.yFormatted}°C
                </p>
              ))}
            </div>
          )}
          legends={[
            {
              anchor: "top-right",
              direction: "row",
              translateY: -30,
              itemWidth: 70,
              itemHeight: 20,
              symbolShape: "circle",
              symbolSize: 10,
            },
          ]}
          role="img"
          ariaLabel={`Daily high and low temperatures from ${first} to ${last}`}
          ariaDescribedBy={summaryId}
        />
      </div>

      {/* Keyboard and screen reader access to the values behind the mouse-only tooltip. */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-gray-700">
          Show daily data as a table
        </summary>
        <table className="mt-2 w-full text-left">
          <caption className="sr-only">
            Daily low and high temperatures from {first} to {last}
          </caption>
          <thead>
            <tr className="border-b text-gray-600">
              <th scope="col" className="py-1">
                Date
              </th>
              <th scope="col" className="py-1">
                Low
              </th>
              <th scope="col" className="py-1">
                High
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date} className="border-b border-gray-100">
                <td className="py-1">{day.date}</td>
                <td className="py-1">{day.low}°C</td>
                <td className="py-1">{day.high}°C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
