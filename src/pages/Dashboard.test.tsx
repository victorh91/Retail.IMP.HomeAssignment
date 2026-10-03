import { fireEvent, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
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
      screen.getByRole("heading", { name: /90 days up to 2025-03-10/ }),
    ).toBeInTheDocument();
  });

  it("shows an error for history but keeps the forecast when history fails", async () => {
    server.use(
      http.get("/api/weather/history", () =>
        HttpResponse.json(
          { error: "History service is down" },
          { status: 500 },
        ),
      ),
    );

    renderDashboard("/dashboard?date=2025-05-01");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "History service is down",
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
