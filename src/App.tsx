import { ErrorPage } from "./components/ErrorPage";
import { Home } from "./pages/Home";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    // Shown on first load while a lazy route (e.g. /dashboard) is downloading.
    hydrateFallbackElement: (
      <p className="p-6 text-gray-500" aria-live="polite">
        Loading…
      </p>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/dashboard",
        // Loaded on demand so the charting libraries stay out of the initial bundle.
        lazy: async () => {
          const { Dashboard } = await import("./pages/Dashboard");
          return { Component: Dashboard };
        },
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
