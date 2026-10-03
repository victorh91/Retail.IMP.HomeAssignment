import { fireEvent, render, screen } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { Dashboard } from "./Dashboard";

function renderDashboard(url: string) {
  const router = createMemoryRouter(
    [{ path: "/dashboard", element: <Dashboard /> }],
    { initialEntries: [url] },
  );
  return render(<RouterProvider router={router} />);
}

describe("Dashboard", () => {
  it("shows current weather, forecast and 90 days of history", async () => {
    renderDashboard("/dashboard?date=2025-05-01");

    expect(await screen.findByText(/in New York/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(
      await screen.findByRole("img", {
        name: "Daily high and low temperatures from 2025-02-01 to 2025-05-01",
      }),
    ).toBeInTheDocument();
  });

  it("fetches history for the newly selected date", async () => {
    renderDashboard("/dashboard?date=2025-05-01");
    await screen.findByRole("img", { name: /to 2025-05-01$/ });

    fireEvent.change(screen.getByLabelText("Select date:"), {
      target: { value: "2025-03-10" },
    });

    expect(
      await screen.findByRole("img", { name: /to 2025-03-10$/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Dec 11, 2024 – Mar 10, 2025/ }),
    ).toBeInTheDocument();
  });

  it("shows the latest selected date even if an earlier request answers last", async () => {
    server.use(
      http.get("/api/weather/history", async ({ request }) => {
        const date = new URL(request.url).searchParams.get("date")!;
        if (date === "2025-03-10") await delay(300);
        return HttpResponse.json({
          location: "New York",
          unit: "celsius",
          days: [{ date, low: 10, high: 20 }],
        });
      }),
    );

    renderDashboard("/dashboard?date=2025-05-01");
    await screen.findByRole("img", { name: /to 2025-05-01$/ });

    const datePicker = screen.getByLabelText("Select date:");
    fireEvent.change(datePicker, { target: { value: "2025-03-10" } });
    fireEvent.change(datePicker, { target: { value: "2025-04-20" } });

    expect(
      await screen.findByRole("img", { name: /to 2025-04-20$/ }),
    ).toBeInTheDocument();

    // Give the slow 2025-03-10 response time to (wrongly) overwrite the newer one.
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(
      screen.getByRole("img", { name: /to 2025-04-20$/ }),
    ).toBeInTheDocument();
  });

  it("shows a user-friendly error but keeps the forecast when history fails", async () => {
    server.use(
      http.get("/api/weather/history", () =>
        HttpResponse.json(
          { error: "Internal details the user should not see" },
          { status: 500 },
        ),
      ),
    );

    renderDashboard("/dashboard?date=2025-05-01");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The weather service is having problems. Please try again later.",
    );
    expect(await screen.findByText(/in New York/)).toBeInTheDocument();
  });

  it("shows a clear error when the server answers 200 with HTML", async () => {
    server.use(
      http.get("/api/weather/history", () =>
        HttpResponse.html("<!doctype html><html></html>"),
      ),
    );

    renderDashboard("/dashboard?date=2025-05-01");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unexpected response format from server.",
    );
  });
});
