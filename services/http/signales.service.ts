import "server-only";

import { CacheKeys } from "@/constants/cache-keys";
import { WebService } from "@/services/http/server-client";
import type {
  LatestStockMetricResponse,
  ManualSignalScanBody,
  ManualSignalScanResponse,
  RefreshStockHistoryBody,
  RefreshStockHistoryResponse,
  StockAnalysisResult,
  StockHistoryResponse,
  StockHistoryQuery,
  SymbolAnalysisQuery
} from "@/types/stock-analysis-api";
import { cacheLife, cacheTag } from "next/cache";

interface ServiceOptions {
  requestId?: string;
}

const stocksWebService = new WebService("/stocks");

function buildSearchParams(
  query?: Record<string, boolean | number | string | undefined>
): string {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const serializedQuery = searchParams.toString();
  return serializedQuery ? `?${serializedQuery}` : "";
}

function buildEncodedSymbolPath(symbol: string, suffix: string): `/${string}` {
  return `/${encodeURIComponent(symbol)}${suffix}` as `/${string}`;
}

async function getCachedStockAnalysis(
  symbol: string,
  query?: SymbolAnalysisQuery
): Promise<StockAnalysisResult> {
  "use cache";

  const queryString = buildSearchParams(query);

  cacheLife({
    stale: 60 * 60,
    revalidate: 60 * 60,
    expire: (60 * 60) + 1
  });
  cacheTag(CacheKeys.stockAnalysis);
  cacheTag(CacheKeys.stockAnalysisBySymbol(symbol));
  cacheTag(CacheKeys.stockAnalysisByQuery(symbol, queryString));

  return stocksWebService.get<StockAnalysisResult>(
    buildEncodedSymbolPath(symbol, `/analysis${queryString}`),
    {
      rawResponse: true,
      withAuth: false,
    }
  );
}

export const signalesService = {
  getAnalysis(symbol: string, query?: SymbolAnalysisQuery, options: ServiceOptions = {}) {
    if (options.requestId) {
      return stocksWebService.get<StockAnalysisResult>(
        buildEncodedSymbolPath(symbol, `/analysis${buildSearchParams(query)}`),
        {
          rawResponse: true,
          requestId: options.requestId,
          withAuth: false,
        }
      );
    }

    return getCachedStockAnalysis(symbol, query);
  },

  refreshHistory(
    symbol: string,
    body?: RefreshStockHistoryBody,
    options: ServiceOptions = {}
  ) {
    return stocksWebService.post<RefreshStockHistoryResponse>(
      buildEncodedSymbolPath(symbol, "/refresh"),
      {
        body: body ?? {},
        rawResponse: true,
        requestId: options.requestId,
        withAuth: false,
      }
    );
  },

  getHistory(symbol: string, query?: StockHistoryQuery, options: ServiceOptions = {}) {
    return stocksWebService.get<StockHistoryResponse>(
      buildEncodedSymbolPath(symbol, `/history${buildSearchParams(query)}`),
      {
        rawResponse: true,
        requestId: options.requestId,
        withAuth: false,
      }
    );
  },

  getLatestMetric(symbol: string, options: ServiceOptions = {}) {
    return stocksWebService.get<LatestStockMetricResponse>(
      buildEncodedSymbolPath(symbol, "/latest"),
      {
        rawResponse: true,
        requestId: options.requestId,
        withAuth: false,
      }
    );
  },

  scanSignals(body?: ManualSignalScanBody, options: ServiceOptions = {}) {
    return stocksWebService.post<ManualSignalScanResponse>("/signals/scan", {
      body: body ?? {},
      rawResponse: true,
      requestId: options.requestId,
      withAuth: false,
    });
  }
};

export const getStockAnalysis = signalesService.getAnalysis;
export const refreshStockHistory = signalesService.refreshHistory;
export const getStockHistory = signalesService.getHistory;
export const getLatestStockMetric = signalesService.getLatestMetric;
export const runManualSignalScan = signalesService.scanSignals;
