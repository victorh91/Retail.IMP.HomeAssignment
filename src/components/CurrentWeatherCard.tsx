import { RiCloudyLine, RiRainyLine, RiSunLine } from "@remixicon/react";
import type { Condition, ForecastResponse } from "../api/types";
import { formatTemperature } from "../utils/temperature";

const CONDITION_ICONS: Record<Condition, typeof RiSunLine> = {
  sunny: RiSunLine,
  cloudy: RiCloudyLine,
  rainy: RiRainyLine,
};

interface CurrentWeatherCardProps {
  forecast: ForecastResponse;
}

export function CurrentWeatherCard({ forecast }: CurrentWeatherCardProps) {
  const CurrentIcon = CONDITION_ICONS[forecast.current.condition];

  return (
    <div>
      <div className="flex items-center gap-4">
        <CurrentIcon className="size-14 text-amber-500" aria-hidden />
        <div>
          <p className="text-4xl font-semibold text-gray-900">
            {formatTemperature(forecast.current.temperature, forecast.unit)}
          </p>
          <p className="text-gray-600">
            <span className="capitalize">{forecast.current.condition}</span> in{" "}
            {forecast.location}
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-3">
        {forecast.forecast.map((day) => {
          const Icon = CONDITION_ICONS[day.condition];

          return (
            <li key={day.day} className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-sm text-gray-600">{day.day}</p>
              <Icon className="mx-auto my-2 size-7 text-gray-700" aria-hidden />
              <p className="sr-only">{day.condition}</p>
              <p className="font-medium text-gray-900">
                {formatTemperature(day.temperature, forecast.unit)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
