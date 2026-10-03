import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;

  return "Unknown error";
}

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div role="alert" className="p-8">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-gray-600">{getErrorMessage(error)}</p>
      <Link to="/home" className="mt-4 inline-block text-blue-600 underline">
        Back to home
      </Link>
    </div>
  );
};
