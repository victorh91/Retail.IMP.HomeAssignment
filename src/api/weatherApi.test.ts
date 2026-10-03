import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { ApiError } from "./errors";
import { fetchHistory } from "./weatherApi";

describe("fetchHistory", () => {
  it("returns 90 consecutive days ending on the requested date", async () => {
    const { days } = await fetchHistory("2025-05-01");

    expect(days).toHaveLength(90);
    expect(days[0].date).toBe("2025-02-01");
    expect(days[89].date).toBe("2025-05-01");
  });

  it.each([
    ["2999-01-01", "`date` cannot be in the future."],
    ["2026", "`date` must be a valid YYYY-MM-DD date."],
  ])("rejects %s with a 400 ApiError", async (date, message) => {
    const error = await fetchHistory(date).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, message });
  });

  it("rejects a 200 response with the wrong shape", async () => {
    server.use(
      http.get("/api/weather/history", () =>
        HttpResponse.json({ location: "New York", days: "not a list" }),
      ),
    );

    const error = await fetchHistory("2025-05-01").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: "Unexpected response format from server.",
    });
  });
});
