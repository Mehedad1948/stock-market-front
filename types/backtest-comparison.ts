import type {
  BacktestReportPayload,
  HorizonKey,
  HorizonMetrics,
} from "@/types/backtest-report";

export type AnalysisIndicatorComponent =
  | "liquidity"
  | "stochRsi"
  | "priceTrend"
  | "adx"
  | "atr";

export type IndicatorMode =
  | "composite"
  | "liquidity_only"
  | "stochRsi_only"
  | "priceTrend_only";

export type BacktestComparisonVariantKey =
  | "full_composite"
  | "stochRsi_only"
  | "priceTrend_only"
  | "liquidity_only"
  | "composite_without_atr"
  | "composite_without_adx"
  | "composite_without_stochRsi"
  | "composite_without_priceTrend";

export interface BacktestRunParams {
  weeklyWindow: number;
  monthlyWindow: number;
  quarterlyWindow: number;
  forceRefresh: boolean;
  includeRealLegal: boolean;
  indicatorMode?: IndicatorMode;
  disabledIndicators?: AnalysisIndicatorComponent[];
}

export interface BacktestRunErrorItem {
  symbol: string;
  asOfDate?: string;
  reason: string;
}

export interface BacktestRunSummary {
  id: string;
  status: string;
  paramsHash: string;
  params: BacktestRunParams;
  scoringVersion: number;
  horizons: number[];
  symbols: string[];
  symbolCount: number;
  snapshotCount: number;
  skippedCount: number;
  errorCount: number;
  errors: BacktestRunErrorItem[];
  startedAt: string;
  finishedAt: string | null;
}

export interface BacktestComparisonVariantConfig {
  indicatorMode?: IndicatorMode;
  disabledIndicators?: AnalysisIndicatorComponent[];
}

export interface BacktestComparisonVariantResult {
  key: BacktestComparisonVariantKey;
  config: BacktestComparisonVariantConfig;
  run: BacktestRunSummary;
  report: BacktestReportPayload | null;
  totalMatchedSnapshots: number | null;
  returnedSnapshots: number | null;
  truncated: boolean | null;
}

export interface BacktestComparisonResponse {
  status: "OK";
  symbol: string;
  comparisonCount: number;
  variants: BacktestComparisonVariantResult[];
}

export interface BacktestComparisonRequestBody {
  symbol: string;
  weeklyWindow: number;
  monthlyWindow: number;
  quarterlyWindow: number;
  variants: BacktestComparisonVariantKey[];
  reportLimit: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface VariantSummaryCard {
  key: BacktestComparisonVariantKey;
  label: string;
  sampleCount: number;
  snapshotCount: number;
  avgReturn20d: number | null;
  avgReturn60d: number | null;
  medianReturn20d: number | null;
  medianReturn60d: number | null;
  winRate20d: number | null;
  winRate60d: number | null;
  profitFactor20d: number | null;
  profitFactor60d: number | null;
  avgDrawdown20d: number | null;
  avgDrawdown60d: number | null;
  errorCount: number;
  lowConfidence: boolean;
  riskFlag: boolean;
}

export interface VariantSubgroupPreviewRow {
  key: string;
  sampleCount: number;
  avgReturn20d: number | null;
  avgReturn60d: number | null;
  winRate60d: number | null;
  profitFactor60d: number | null;
}

export interface VariantSubgroupPreview {
  key: string;
  title: string;
  rows: VariantSubgroupPreviewRow[];
}

export interface VariantDetailView extends VariantSummaryCard {
  runStatus: string;
  truncated: boolean | null;
  totalMatchedSnapshots: number | null;
  returnedSnapshots: number | null;
  disabledIndicators: AnalysisIndicatorComponent[];
  indicatorMode: IndicatorMode | null;
  worstDrawdown20d: number | null;
  worstDrawdown60d: number | null;
  subgroupPreviews: VariantSubgroupPreview[];
}

export interface ComparisonWinnerSummary {
  label: string;
  variantKey: BacktestComparisonVariantKey | null;
  variantLabel: string | null;
  metricValue: number | null;
  horizon: HorizonKey | null;
}

export interface BacktestComparisonViewModel {
  symbol: string;
  comparisonCount: number;
  variants: VariantDetailView[];
  bestBy60dAvgReturn: ComparisonWinnerSummary;
  bestBy20dProfitFactor: ComparisonWinnerSummary;
  safestBy20dDrawdown: ComparisonWinnerSummary;
}

export type NullableHorizonMetrics = Omit<
  HorizonMetrics,
  | "avgReturn"
  | "medianReturn"
  | "winRate"
  | "negativeReturnRate"
  | "bestReturn"
  | "worstReturn"
  | "avgMaxDrawdown"
  | "worstDrawdown"
> & {
  avgReturn: number | null;
  medianReturn: number | null;
  winRate: number | null;
  negativeReturnRate: number | null;
  bestReturn: number | null;
  worstReturn: number | null;
  avgMaxDrawdown: number | null;
  worstDrawdown: number | null;
  profitFactorLikeRatio: number | null;
};
