export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export function getUserMessage(error: Error): string {
  if (error instanceof ApiError && error.status >= 500) {
    return "The weather service is having problems. Please try again later.";
  }
  // fetch() rejects with a TypeError when the network is unreachable.
  if (error instanceof TypeError) {
    return "Could not reach the weather service. Check your connection.";
  }
  return error.message;
}
