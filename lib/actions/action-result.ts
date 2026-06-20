import type { ApiActionResult, ApiError } from "@/types/api";

export function actionSuccess<TData>(data: TData): ApiActionResult<TData> {
  return {
    ok: true,
    data
  };
}

export function actionFailure<TData = never>(error: ApiError): ApiActionResult<TData> {
  return {
    ok: false,
    error
  };
}
