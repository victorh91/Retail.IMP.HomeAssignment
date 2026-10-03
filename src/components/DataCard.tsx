import type { ReactNode } from "react";
import { getUserMessage } from "../api/errors";
import type { Status } from "../api/types";

interface DataCardProps {
  title: string;
  status: Status;
  error: Error | null;
  children: ReactNode;
}

export function DataCard({ title, status, error, children }: DataCardProps) {
  const isLoading = status === "loading";

  return (
    <section
      className="rounded-xl bg-white p-6 shadow-sm"
      aria-busy={isLoading}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span aria-live="polite" className="text-sm text-gray-500">
          {isLoading ? "Loading…" : ""}
        </span>
      </div>

      {status === "error" && error ? (
        <p role="alert" className="text-red-700">
          {getUserMessage(error)}
        </p>
      ) : (
        // Previous data stays visible but dimmed while new data loads.
        <div
          className={
            isLoading ? "opacity-50 transition-opacity" : "transition-opacity"
          }
        >
          {children}
        </div>
      )}
    </section>
  );
}
