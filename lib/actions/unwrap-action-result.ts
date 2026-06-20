// src/lib/actions/unwrap-action-result.ts

import type { ApiActionResult } from "@/types/api";

export async function unwrapActionResult<TData>(
  action: Promise<ApiActionResult<TData>>
): Promise<TData> {
  const result = await action;

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
}