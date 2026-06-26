import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { CacheKeys } from "@/constants/cache-keys";
import type {
  BacktestReportQuery,
  BacktestReportResponse,
} from "@/types/backtest-report";

const localApiBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";

function buildBacktestReportUrl(query: BacktestReportQuery): URL {
  const url = new URL("/api/stocks/backtests/reports", localApiBaseUrl);

  url.searchParams.set("runId", query.runId);
  url.searchParams.set("timeframe", query.timeframe);

  if (query.groupBy) {
    url.searchParams.set("groupBy", query.groupBy);
  }

  for (const symbol of query.symbols) {
    url.searchParams.append("symbols", symbol);
  }

  return url;
}

async function getCachedBacktestReport(
  query: BacktestReportQuery,
): Promise<BacktestReportResponse> {
  "use cache";

  const url = buildBacktestReportUrl(query);
  const cacheKey = url.searchParams.toString();

  cacheLife({
    stale: 60 * 30,
    revalidate: 60 * 30,
    expire: 60 * 30 + 1,
  });
  cacheTag(CacheKeys.backtestReport);
  cacheTag(CacheKeys.backtestReportByQuery(cacheKey));

  const response = await fetch(url, {
    cache: "no-store",
    next: {
      revalidate: 60 * 30,
    },
  });

  if (!response.ok) {
    throw new Error(`Backtest report request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as BacktestReportResponse;

  if (payload.status !== "OK" || !payload.report?.global?.overall) {
    throw new Error("Backtest report response was invalid.");
  }

  return payload;
}

export const backtestReportService = {
  getReport(query: BacktestReportQuery) {
    return getCachedBacktestReport(query);
  },
};

export const getBacktestReport = backtestReportService.getReport;
