import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Link
        to="/dashboard"
        className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white shadow-sm hover:bg-gray-700 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Open Dashboard
      </Link>
    </main>
  );
}
