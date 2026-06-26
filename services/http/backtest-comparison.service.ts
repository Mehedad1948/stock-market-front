import "server-only";

import type {
  BacktestComparisonRequestBody,
  BacktestComparisonResponse,
} from "@/types/backtest-comparison";

const compareApiBaseUrl = "http://localhost:3005";

export async function runBacktestComparison(
  body: BacktestComparisonRequestBody,
): Promise<BacktestComparisonResponse> {
  const response = await fetch(
    new URL("/api/stocks/backtests/compare", compareApiBaseUrl),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Backtest comparison request failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as BacktestComparisonResponse;

  if (payload.status !== "OK" || !Array.isArray(payload.variants)) {
    throw new Error("Backtest comparison response was invalid.");
  }

  return payload;
}
