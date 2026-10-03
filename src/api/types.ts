export type Condition = "sunny" | "cloudy" | "rainy";

export type TemperatureUnit = "celsius" | "fahrenheit";

export type Status = "loading" | "error" | "success";

export interface CurrentWeather {
  temperature: number;
  condition: Condition;
}

export interface ForecastDay {
  day: string;
  temperature: number;
  condition: Condition;
}

export interface ForecastResponse {
  location: string;
  unit: TemperatureUnit;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export interface HistoryDay {
  date: string;
  low: number;
  high: number;
}

export interface HistoryResponse {
  location: string;
  unit: TemperatureUnit;
  days: HistoryDay[];
}

export interface ApiErrorBody {
  error: string;
}
