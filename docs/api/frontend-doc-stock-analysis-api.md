# Frontend API Doc 3 — Stock Analysis API

Frontend reference for stock analysis, refresh, history, latest metric, and manual signal scan.

> Route paths are inferred from controller names. If your backend router uses different paths, update only the paths; the response contracts still come from the uploaded controllers/types.

---

## Important frontend rules

### Encode Persian symbols

Always encode symbols in URLs:

```ts
encodeURIComponent(symbol)
```

Example:

```ts
`/api/stocks/${encodeURIComponent('خودرو')}/analysis`
```

### Labeled values

Backend returns many fields as:

```ts
export type LabeledValue<T> = {
  label: string;
  value: T;
};
```

Frontend rule:

```text
Use label for Persian UI text.
Use value for logic, colors, badges, and conditions.
```

---

## Core types

```ts
export type CompositeSignalAction =
  | 'STRONG_BUY'
  | 'PROBABLE_BUY'
  | 'HOLD'
  | 'CAUTION'
  | 'RISK_SELL'
  | 'CONFIRMED_SELL';

export type CompositeBias =
  | 'STRONG_BULLISH'
  | 'BULLISH'
  | 'NEUTRAL'
  | 'BEARISH'
  | 'STRONG_BEARISH';

export type CompositeEntryTiming = 'READY' | 'PROBABLE' | 'NOT_READY' | 'RISKY' | 'AVOID';

export type TimeframeAction =
  | 'BUY'
  | 'PROBABLE_BUY'
  | 'HOLD'
  | 'WAIT'
  | 'CAUTION'
  | 'REDUCE'
  | 'EXIT';

export type TimeframeQuality = 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'WEAK' | 'BEARISH';

export type NewPositionAdvice = 'BUY' | 'PROBABLE_BUY' | 'WAIT' | 'WAIT_FOR_ENTRY_TRIGGER' | 'AVOID';
export type ExistingPositionAdvice = 'HOLD' | 'HOLD_WITH_CAUTION' | 'REDUCE' | 'EXIT' | 'MONITOR';
```

---

## StockAnalysisResult

```ts
export type StockAnalysisResult = {
  status: 'OK';
  symbol: string;
  source: 'database' | 'brsapi' | 'mixed';
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
```

For complete `StockAnalysisSignals`, mirror the backend type file. The most important frontend field is:

```ts
analysis.signals.composite
```

---

## Presented composite shape

```ts
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
```

---

## GET stock analysis

Assumed route:

```http
GET /api/stocks/:symbol/analysis
```

Controller export: `getStockAnalysis`

Query params:

```ts
export type SymbolAnalysisQuery = {
  weeklyWindow?: number;
  monthlyWindow?: number;
  quarterlyWindow?: number;
  forceRefresh?: boolean;
  includeRealLegal?: boolean;
};
```

Backend validation:

```text
weeklyWindow < monthlyWindow < quarterlyWindow
```

Examples:

```http
GET /api/stocks/خودرو/analysis
GET /api/stocks/%D8%AE%D9%88%D8%AF%D8%B1%D9%88/analysis?forceRefresh=true
GET /api/stocks/فملی/analysis?weeklyWindow=7&monthlyWindow=30&quarterlyWindow=90
```

Frontend helper:

```ts
export async function getStockAnalysis(symbol: string, query?: SymbolAnalysisQuery) {
  const search = new URLSearchParams();

  if (query?.weeklyWindow) search.set('weeklyWindow', String(query.weeklyWindow));
  if (query?.monthlyWindow) search.set('monthlyWindow', String(query.monthlyWindow));
  if (query?.quarterlyWindow) search.set('quarterlyWindow', String(query.quarterlyWindow));
  if (query?.forceRefresh !== undefined) search.set('forceRefresh', String(query.forceRefresh));
  if (query?.includeRealLegal !== undefined) search.set('includeRealLegal', String(query.includeRealLegal));

  const qs = search.toString();
  return apiGet<StockAnalysisResult>(
    `/api/stocks/${encodeURIComponent(symbol)}/analysis${qs ? `?${qs}` : ''}`
  );
}
```

React Query:

```ts
export function useStockAnalysis(symbol: string, query?: SymbolAnalysisQuery) {
  return useQuery({
    queryKey: ['stock-analysis', symbol, query],
    queryFn: () => getStockAnalysis(symbol, query),
    enabled: Boolean(symbol)
  });
}
```

---

## POST refresh stock history

Assumed route:

```http
POST /api/stocks/:symbol/refresh
```

Controller export: `refreshStockHistory`

Body:

```ts
export type RefreshStockHistoryBody = {
  includeRealLegal?: boolean;
};
```

Response:

```ts
export type RefreshStockHistoryResponse = {
  status: 'OK';
  symbol: string;
  refreshed: true;
  includeRealLegal: boolean;
  rowsUpserted: number;
  latestDataDate: string | null;
};
```

Frontend helper:

```ts
export function refreshStockHistory(symbol: string, body?: RefreshStockHistoryBody) {
  return apiPost<RefreshStockHistoryResponse>(
    `/api/stocks/${encodeURIComponent(symbol)}/refresh`,
    body ?? {}
  );
}
```

Use this for a manual refresh button.

---

## GET stock history

Assumed route:

```http
GET /api/stocks/:symbol/history?limit=200&offset=0
```

Controller export: `getStockHistory`

Query params:

```ts
export type StockHistoryQuery = {
  limit?: number; // max 1000
  offset?: number;
};
```

Response:

```ts
export type StockHistoryResponse = {
  status: 'OK';
  symbol: string;
  limit: number;
  offset: number;
  rows: SymbolDailyMetricRow[];
};
```

Minimal row type:

```ts
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
```

---

## GET latest stock metric

Assumed route:

```http
GET /api/stocks/:symbol/latest
```

Controller export: `getLatestStockMetric`

Response:

```ts
export type LatestStockMetricResponse = {
  status: 'OK';
  symbol: string;
  row: SymbolDailyMetricRow;
};
```

---

## POST manual signal scan

Controller export: `runManualSignalScan`

Assumed route:

```http
POST /api/stocks/signals/scan
```

Body:

```ts
export type ManualSignalScanBody = {
  symbols?: string[];
  forceRefresh?: boolean;
  includeRealLegal?: boolean;
};
```

Response is service-defined and not fully documented in provided types:

```ts
export type ManualSignalScanResponse = unknown;
```

Recommendation: do not build public UI for this until backend response type is provided.

---

## UI interpretation guide

### Main report card

Use:

```ts
analysis.persianSummary
analysis.signals.composite.action.label
analysis.signals.composite.score
analysis.signals.composite.bias.label
analysis.signals.composite.entryTiming.label
analysis.latestDataDate
analysis.cacheHit
analysis.source
```

### Timeframe cards

Render three cards:

```text
کوتاه‌مدت
میان‌مدت
بلندمدت
```

Use:

```ts
analysis.signals.composite.timeframes.shortTerm
analysis.signals.composite.timeframes.midTerm
analysis.signals.composite.timeframes.longTerm
```

For each timeframe show:

- score
- action.label
- quality.label
- positionAdvice.forNewPosition.label
- positionAdvice.forExistingPosition.label
- decision badges

Important:

```text
quality is setup quality, not buy/sell.
positionAdvice is the most user-facing field.
forNewPosition is for users who do not own the stock.
forExistingPosition is for portfolio holders.
```

### Technical accordion

Put these in collapsed sections:

- regime
- confidence
- raw buy/sell timeframes
- stochRsi
- priceTrend
- adx
- atr
- metrics

---

## Badge/tone mapping

```ts
export const compositeActionUi = {
  STRONG_BUY: { tone: 'positive', title: 'خرید قوی' },
  PROBABLE_BUY: { tone: 'positive', title: 'خرید احتمالی' },
  HOLD: { tone: 'neutral', title: 'نگهداری' },
  CAUTION: { tone: 'warning', title: 'احتیاط' },
  RISK_SELL: { tone: 'danger', title: 'ریسک فروش' },
  CONFIRMED_SELL: { tone: 'danger', title: 'فروش تاییدشده' }
} as const;
```

---

## Notes for Codex frontend agent

1. Build the analysis page around `signals.composite`.
2. Use backend Persian labels for display.
3. Use `.value` for logic, badges, and colors.
4. Keep technical data collapsed by default.
5. Always encode Persian symbol URLs.
6. Do not build portfolio/watchlist UI from this doc; those endpoints are not included here.
7. Do not invent response fields not present in the backend types.
