export type HorizonKey = "1d" | "5d" | "20d" | "60d" | string;

export interface HorizonMetrics {
  sampleCount: number;
  avgReturn: number;
  medianReturn: number;
  winRate: number;
  negativeReturnRate: number;
  bestReturn: number;
  worstReturn: number;
  avgMaxDrawdown: number;
  worstDrawdown: number;
  profitFactorLikeRatio: number | null;
}

export interface HorizonMetricsMap {
  [horizon: HorizonKey]: HorizonMetrics;
}

export interface ReportGroup {
  key: string;
  sampleCount: number;
  horizons: HorizonMetricsMap;
}

export interface GlobalReportSection {
  overall: ReportGroup;
  byCompositeAction?: ReportGroup[];
  byScoreBucket?: ReportGroup[];
  bySector?: ReportGroup[];
  byLiquidityBucket?: ReportGroup[];
  byVolatilityRegime?: ReportGroup[];
  byBias?: ReportGroup[];
  byEntryTiming?: ReportGroup[];
  customGroups?: Record<string, ReportGroup[]>;
  [sectionName: string]:
    | ReportGroup
    | ReportGroup[]
    | Record<string, ReportGroup[]>
    | undefined;
}

export interface BacktestReportPayload {
  sampleCount: number;
  global: GlobalReportSection;
}

export interface BacktestRunSummary {
  id: string;
  status: string;
  paramsHash: string;
  scoringVersion: number;
  horizons: number[];
  symbols: string[];
  symbolCount: number;
  snapshotCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
  startedAt: string;
  finishedAt: string;
}

export interface BacktestReportFilters {
  runId: string;
  symbols: string[];
  timeframe: string;
  groupBy?: string;
  limit: number;
}

export interface BacktestReportResponse {
  status: "OK";
  run: BacktestRunSummary;
  filters: BacktestReportFilters;
  totalMatchedSnapshots: number;
  returnedSnapshots: number;
  truncated: boolean;
  report: BacktestReportPayload;
}

export interface BacktestReportQuery {
  runId: string;
  symbols: readonly string[];
  timeframe: "shortTerm" | "midTerm" | "longTerm" | string;
  groupBy?: string;
}
