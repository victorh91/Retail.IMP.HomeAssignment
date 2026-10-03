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
