import { z } from "zod";
import type { ForecastResponse, HistoryResponse } from "./types";

// Typed against the interfaces so TypeScript flags any drift between the two.

const unitSchema = z.enum(["celsius", "fahrenheit"]);
const conditionSchema = z.enum(["sunny", "cloudy", "rainy"]);

export const forecastResponseSchema: z.ZodType<ForecastResponse> = z.object({
  location: z.string(),
  unit: unitSchema,
  current: z.object({
    temperature: z.number(),
    condition: conditionSchema,
  }),
  forecast: z.array(
    z.object({
      day: z.string(),
      temperature: z.number(),
      condition: conditionSchema,
    }),
  ),
});

export const historyResponseSchema: z.ZodType<HistoryResponse> = z.object({
  location: z.string(),
  unit: unitSchema,
  days: z.array(
    z.object({
      date: z.iso.date(),
      low: z.number(),
      high: z.number(),
    }),
  ),
});
