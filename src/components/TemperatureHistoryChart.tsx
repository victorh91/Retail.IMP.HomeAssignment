import { ResponsiveLine } from "@nivo/line";
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

export function TemperatureHistoryChart({ days }: TemperatureHistoryChartProps) {
  const data = [
    { id: "High", data: days.map((day) => ({ x: day.date, y: day.high })) },
    { id: "Low", data: days.map((day) => ({ x: day.date, y: day.low })) },
  ];

  const tickValues = days
    .filter((_, index) => index % DAYS_BETWEEN_TICKS === 0)
    .map((day) => day.date);

  const first = days[0]?.date ?? "";
  const last = days[days.length - 1]?.date ?? "";

  return (
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
      />
    </div>
  );
}
