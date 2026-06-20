import type { ApiError, ApiErrorEnvelope } from "@/types/api";

export class ApiClientError extends Error implements ApiError {
  code: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
  status: number;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.code = error.code;
    this.status = error.status;

    if (error.fieldErrors) {
      this.fieldErrors = error.fieldErrors;
    }

    if (error.requestId) {
      this.requestId = error.requestId;
    }
  }
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return false;
  }

  const error = value.error;
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string" &&
    "message" in error &&
    typeof error.message === "string" &&
    "status" in error &&
    typeof error.status === "number"
  );
}
