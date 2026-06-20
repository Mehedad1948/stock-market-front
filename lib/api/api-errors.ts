import type {
  ApiError,
  BackendApiErrorEnvelope,
  BackendApiSuccessEnvelope
} from "@/types/api";

export function isApiError(value: unknown): value is ApiError {
  return Boolean(
    value &&
      typeof value === "object" &&
      "code" in value &&
      typeof value.code === "string" &&
      "message" in value &&
      typeof value.message === "string" &&
      "status" in value &&
      typeof value.status === "number"
  );
}

export function createApiError(input: {
  code: string;
  fieldErrors?: Record<string, string[] | undefined>;
  message: string;
  requestId?: string;
  status: number;
}): ApiError {
  return {
    code: input.code,
    message: input.message,
    status: input.status,
    ...(input.requestId ? { requestId: input.requestId } : {}),
    ...(input.fieldErrors ? { fieldErrors: compactFieldErrors(input.fieldErrors) } : {})
  };
}

export function compactFieldErrors(
  fieldErrors: Record<string, string[] | undefined>
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldErrors).filter((entry): entry is [string, string[]] =>
      Array.isArray(entry[1])
    )
  );
}

export function isBackendApiErrorEnvelope(value: unknown): value is BackendApiErrorEnvelope {
  return Boolean(
    value &&
      typeof value === "object" &&
      "success" in value &&
      value.success === false &&
      "error" in value
  );
}

export function isBackendApiSuccessEnvelope<TData>(
  value: unknown
): value is BackendApiSuccessEnvelope<TData> {
  return Boolean(
    value &&
      typeof value === "object" &&
      "success" in value &&
      value.success === true &&
      "data" in value
  );
}

export function backendEnvelopeToApiError(
  envelope: BackendApiErrorEnvelope,
  fallbackRequestId: string
): ApiError {
  return {
    code: envelope.error.code,
    message: envelope.error.message,
    requestId: envelope.requestData.requestId ?? fallbackRequestId,
    status: envelope.statusCode
  };
}

export function normalizeApiError(error: unknown, fallback: ApiError): ApiError {
  return isApiError(error) ? error : fallback;
}
