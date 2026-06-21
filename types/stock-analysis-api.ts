export type LabeledValue<TValue> = {
  label: string;
  value: TValue;
};

export type CompositeSignalAction =
  | "STRONG_BUY"
  | "PROBABLE_BUY"
  | "HOLD"
  | "CAUTION"
  | "RISK_SELL"
  | "CONFIRMED_SELL";

export type CompositeBias =
  | "STRONG_BULLISH"
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH"
  | "STRONG_BEARISH";

export type CompositeEntryTiming =
  | "READY"
  | "PROBABLE"
  | "NOT_READY"
  | "RISKY"
  | "AVOID";

export type TimeframeAction =
  | "BUY"
  | "PROBABLE_BUY"
  | "HOLD"
  | "WAIT"
  | "CAUTION"
  | "REDUCE"
  | "EXIT";

export type TimeframeQuality =
  | "STRONG_BULLISH"
  | "BULLISH"
  | "NEUTRAL"
  | "WEAK"
  | "BEARISH";

export type NewPositionAdvice =
  | "BUY"
  | "PROBABLE_BUY"
  | "WAIT"
  | "WAIT_FOR_ENTRY_TRIGGER"
  | "AVOID";

export type ExistingPositionAdvice =
  | "HOLD"
  | "HOLD_WITH_CAUTION"
  | "REDUCE"
  | "EXIT"
  | "MONITOR";

export type PresentedTimeframeComposite = {
  score: number;
  action: LabeledValue<TimeframeAction>;
  quality: LabeledValue<TimeframeQuality>;
  decision: {
    buy: LabeledValue<boolean>;
    sell: LabeledValue<boolean>;
    hold: LabeledValue<boolean>;
    wait: LabeledValue<boolean>;
    caution: LabeledValue<boolean>;
    reduce: LabeledValue<boolean>;
    exit: LabeledValue<boolean>;
  };
  positionAdvice: {
    forNewPosition: LabeledValue<NewPositionAdvice>;
    forExistingPosition: LabeledValue<ExistingPositionAdvice>;
  };
  explanationKey: string;
};

export type PresentedCompositeSignal = {
  action: LabeledValue<CompositeSignalAction>;
  score: number;
  bias: LabeledValue<CompositeBias>;
  entryTiming: LabeledValue<CompositeEntryTiming>;
  explanationKey: string;
  scoreScale: {
    min: -100;
    max: 100;
  };
  timeframes: {
    shortTerm: PresentedTimeframeComposite;
    midTerm: PresentedTimeframeComposite;
    longTerm: PresentedTimeframeComposite;
  };
};

export type StockAnalysisSignals = {
  composite: PresentedCompositeSignal;
} & Record<string, unknown>;

export type SymbolAnalysisQuery = {
  weeklyWindow?: number;
  monthlyWindow?: number;
  quarterlyWindow?: number;
  forceRefresh?: boolean;
  includeRealLegal?: boolean;
};

export type RefreshStockHistoryBody = {
  includeRealLegal?: boolean;
};

export type StockHistoryQuery = {
  limit?: number;
  offset?: number;
};

export type ManualSignalScanBody = {
  symbols?: string[];
  forceRefresh?: boolean;
  includeRealLegal?: boolean;
};

export type SymbolDailyMetricRow = {
  id: string;
  symbol: string;
  date: string;
  time: string | null;
  tradeCount: string | number | null;
  tradeVolume: string | number | null;
  tradeValue: string | number | null;
  priceMin: string | number | null;
  priceMax: string | number | null;
  priceYesterday: string | number | null;
  priceFirst: string | number | null;
  priceLast: string | number | null;
  closePrice: string | number | null;
  closePriceChangePercent: string | number | null;
  createdAt: string;
  updatedAt: string;
};

export type StockAnalysisResult = {
  status: "OK";
  symbol: string;
  source: "database" | "brsapi" | "mixed";
  cacheHit: boolean;
  latestDataDate: string;
  windows: {
    weekly: number;
    monthly: number;
    quarterly: number;
  };
  metrics: {
    latestTradeValue: number | null;
    latestClosePrice: number | null;
    latestClosePriceChangePercent: number | null;
    maWeekly: number;
    maMonthly: number;
    maQuarterly: number;
    weeklySlope: number;
    monthlySlope: number;
    quarterlySlope: number;
    valueChangeVsMonthly: number | null;
    valueChangeVsQuarterly: number | null;
    relativeTradeValue20: number | null;
    liquidityExpansion: boolean;
    liquidityContraction: boolean;
  };
  signals: StockAnalysisSignals;
  persianSummary: string;
  disclaimer: string;
};

export type RefreshStockHistoryResponse = {
  status: "OK";
  symbol: string;
  refreshed: true;
  includeRealLegal: boolean;
  rowsUpserted: number;
  latestDataDate: string | null;
};

export type StockHistoryResponse = {
  status: "OK";
  symbol: string;
  limit: number;
  offset: number;
  rows: SymbolDailyMetricRow[];
};

export type LatestStockMetricResponse = {
  status: "OK";
  symbol: string;
  row: SymbolDailyMetricRow;
};

export type ManualSignalScanResponse = unknown;
