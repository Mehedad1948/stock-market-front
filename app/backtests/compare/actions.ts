"use server";

import { runTrustedAction } from "@/lib/actions/run-trusted-action";
import { buildBacktestComparisonViewModel } from "@/lib/backtests/backtest-comparison-view-model";
import { runBacktestComparison } from "@/services/http/backtest-comparison.service";
import type {
  BacktestComparisonRequestBody,
  BacktestComparisonVariantKey,
  BacktestComparisonViewModel,
} from "@/types/backtest-comparison";
import type { ApiActionResult } from "@/types/api";

export interface BacktestComparisonFormInput {
  symbol: string;
  dateFrom?: string;
  dateTo?: string;
  variants: BacktestComparisonVariantKey[];
}

export async function runBacktestComparisonAction(
  input: BacktestComparisonFormInput,
): Promise<ApiActionResult<BacktestComparisonViewModel>> {
  return runTrustedAction(async () => {
    const symbol = input.symbol.trim();

    if (!symbol) {
      throw new Error("Symbol is required.");
    }

    const body: BacktestComparisonRequestBody = {
      symbol,
      weeklyWindow: 7,
      monthlyWindow: 30,
      quarterlyWindow: 90,
      variants: input.variants,
      reportLimit: 50000,
      ...(input.dateFrom ? { dateFrom: input.dateFrom } : {}),
      ...(input.dateTo ? { dateTo: input.dateTo } : {}),
    };

    const response = await runBacktestComparison(body);

    return buildBacktestComparisonViewModel(response);
  });
}
