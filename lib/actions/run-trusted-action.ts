
// src/lib/actions/run-trusted-action.ts

import "server-only";

import { actionFailure, actionSuccess } from "@/lib/actions/action-result";
import { createApiError, normalizeApiError } from "@/lib/api/api-errors";
import type { ApiActionResult } from "@/types/api";

interface ActionFallbackError {
  code?: string;
  message?: string;
  status?: number;
}

const DEFAULT_FALLBACK_ERROR = {
  code: "ACTION_FAILED",
  message: "The requested action could not be completed.",
  status: 500
} satisfies Required<ActionFallbackError>;

export async function runTrustedAction<TData>(
  handler: () => Promise<TData>,
  fallbackError?: ActionFallbackError
): Promise<ApiActionResult<TData>> {

  try {
    const data = await handler();

    return actionSuccess(data);
  } catch (error) {

    return actionFailure(
      normalizeApiError(
        error,
        createApiError({
          ...DEFAULT_FALLBACK_ERROR,
          ...fallbackError
        })
      )
    );
  }
}

