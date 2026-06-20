export interface ApiError {
  code: string;
  fieldErrors?: Record<string, string[]>;
  message: string;
  requestId?: string;
  status: number;
}

export interface ApiErrorEnvelope {
  error: ApiError;
}

export type ApiActionResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: ApiError;
    };

export interface BackendApiRequestData {
  method: string;
  path: string;
  requestId: string | null;
  timestamp: string;
}

export interface BackendApiErrorBody {
  code: string;
  details?: Record<string, unknown>;
  message: string;
}

export interface BackendApiErrorEnvelope {
  error: BackendApiErrorBody;
  requestData: BackendApiRequestData;
  statusCode: number;
  success: false;
}

export interface BackendApiSuccessEnvelope<TData> {
  data: TData;
  meta: Record<string, unknown>;
  requestData: BackendApiRequestData;
  statusCode: number;
  success: true;
}
