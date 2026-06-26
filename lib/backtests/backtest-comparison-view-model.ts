import type {
  BacktestComparisonVariantKey,
  BacktestComparisonResponse,
  BacktestComparisonViewModel,
  BacktestComparisonVariantResult,
  ComparisonWinnerSummary,
  IndicatorMode,
  NullableHorizonMetrics,
  VariantDetailView,
  VariantSubgroupPreview,
} from "@/types/backtest-comparison";
import type { ReportGroup } from "@/types/backtest-report";

const subgroupSections = [
  { key: "byCompositeAction", title: "اقدام ترکیبی" },
  { key: "byScoreBucket", title: "بازه امتیاز" },
  { key: "byVolatilityRegime", title: "رژیم نوسان" },
] as const;

export const defaultComparisonVariants: BacktestComparisonVariantKey[] = [
  "full_composite",
  "stochRsi_only",
  "priceTrend_only",
  "liquidity_only",
  "composite_without_atr",
  "composite_without_adx",
  "composite_without_stochRsi",
  "composite_without_priceTrend",
];

export const comparisonVariantLabels: Record<
  BacktestComparisonVariantKey,
  string
> = {
  full_composite: "Composite",
  stochRsi_only: "Stoch RSI Only",
  priceTrend_only: "Price Trend Only",
  liquidity_only: "Liquidity Only",
  composite_without_atr: "Composite - ATR",
  composite_without_adx: "Composite - ADX",
  composite_without_stochRsi: "Composite - Stoch RSI",
  composite_without_priceTrend: "Composite - Price Trend",
};

function getVariantLabel(key: BacktestComparisonVariantKey) {
  return comparisonVariantLabels[key];
}

function getVariantOverall(
  variant: BacktestComparisonVariantResult,
  horizon: "20d" | "60d",
): NullableHorizonMetrics | null {
  const metrics = variant.report?.global?.overall?.horizons?.[horizon];

  return (metrics as NullableHorizonMetrics | undefined) ?? null;
}

function getNullableMetric(
  variant: BacktestComparisonVariantResult,
  horizon: "20d" | "60d",
  metric: keyof NullableHorizonMetrics,
): number | null {
  const overall = getVariantOverall(variant, horizon);
  const value = overall?.[metric];

  return typeof value === "number" ? value : null;
}

function getOverallSampleCount(variant: BacktestComparisonVariantResult) {
  return variant.report?.global?.overall?.sampleCount ?? 0;
}

function hasExtremeRisk(variant: BacktestComparisonVariantResult) {
  const overall20d = getVariantOverall(variant, "20d");
  const overall60d = getVariantOverall(variant, "60d");

  return Boolean(
    (overall20d?.worstDrawdown ?? 0) <= -1 ||
      (overall60d?.worstDrawdown ?? 0) <= -1 ||
      (overall20d?.avgMaxDrawdown ?? 0) <= -0.35 ||
      (overall60d?.avgMaxDrawdown ?? 0) <= -0.7,
  );
}

function buildSubgroupPreview(
  title: string,
  groups: ReportGroup[] | undefined,
): VariantSubgroupPreview {
  const rows = (groups ?? [])
    .slice()
    .sort((left, right) => right.sampleCount - left.sampleCount)
    .slice(0, 3)
    .map((group) => ({
      key: group.key,
      sampleCount: group.sampleCount,
      avgReturn20d:
        typeof group.horizons["20d"]?.avgReturn === "number"
          ? group.horizons["20d"].avgReturn
          : null,
      avgReturn60d:
        typeof group.horizons["60d"]?.avgReturn === "number"
          ? group.horizons["60d"].avgReturn
          : null,
      winRate60d:
        typeof group.horizons["60d"]?.winRate === "number"
          ? group.horizons["60d"].winRate
          : null,
      profitFactor60d:
        typeof group.horizons["60d"]?.profitFactorLikeRatio === "number"
          ? group.horizons["60d"].profitFactorLikeRatio
          : null,
    }));

  return {
    key: title,
    title,
    rows,
  };
}

function normalizeIndicatorMode(value: string | undefined): IndicatorMode | null {
  if (
    value === "composite" ||
    value === "liquidity_only" ||
    value === "stochRsi_only" ||
    value === "priceTrend_only"
  ) {
    return value;
  }

  return null;
}

function toVariantDetailView(
  variant: BacktestComparisonVariantResult,
): VariantDetailView {
  return {
    key: variant.key,
    label: getVariantLabel(variant.key),
    sampleCount: getOverallSampleCount(variant),
    snapshotCount: variant.run.snapshotCount,
    avgReturn20d: getNullableMetric(variant, "20d", "avgReturn"),
    avgReturn60d: getNullableMetric(variant, "60d", "avgReturn"),
    medianReturn20d: getNullableMetric(variant, "20d", "medianReturn"),
    medianReturn60d: getNullableMetric(variant, "60d", "medianReturn"),
    winRate20d: getNullableMetric(variant, "20d", "winRate"),
    winRate60d: getNullableMetric(variant, "60d", "winRate"),
    profitFactor20d: getNullableMetric(variant, "20d", "profitFactorLikeRatio"),
    profitFactor60d: getNullableMetric(variant, "60d", "profitFactorLikeRatio"),
    avgDrawdown20d: getNullableMetric(variant, "20d", "avgMaxDrawdown"),
    avgDrawdown60d: getNullableMetric(variant, "60d", "avgMaxDrawdown"),
    errorCount: variant.run.errorCount,
    lowConfidence: getOverallSampleCount(variant) < 30,
    riskFlag: hasExtremeRisk(variant),
    runStatus: variant.run.status,
    truncated: variant.truncated,
    totalMatchedSnapshots: variant.totalMatchedSnapshots,
    returnedSnapshots: variant.returnedSnapshots,
    disabledIndicators:
      variant.config.disabledIndicators ?? variant.run.params.disabledIndicators ?? [],
    indicatorMode:
      normalizeIndicatorMode(variant.config.indicatorMode) ??
      normalizeIndicatorMode(variant.run.params.indicatorMode),
    worstDrawdown20d: getNullableMetric(variant, "20d", "worstDrawdown"),
    worstDrawdown60d: getNullableMetric(variant, "60d", "worstDrawdown"),
    subgroupPreviews: subgroupSections.map((section) =>
      buildSubgroupPreview(
        section.title,
        variant.report?.global?.[section.key] as ReportGroup[] | undefined,
      ),
    ),
  };
}

function pickWinner(
  variants: VariantDetailView[],
  label: string,
  selectMetric: (variant: VariantDetailView) => number | null,
  horizon: "20d" | "60d",
): ComparisonWinnerSummary {
  const preferred = variants
    .filter((variant) => !variant.lowConfidence)
    .filter((variant) => selectMetric(variant) !== null);
  const pool = preferred.length > 0 ? preferred : variants;

  const winner = pool
    .filter((variant) => selectMetric(variant) !== null)
    .sort((left, right) => (selectMetric(right) ?? -Infinity) - (selectMetric(left) ?? -Infinity))[0];

  return {
    label,
    variantKey: winner?.key ?? null,
    variantLabel: winner?.label ?? null,
    metricValue: winner ? selectMetric(winner) : null,
    horizon,
  };
}

export function buildBacktestComparisonViewModel(
  response: BacktestComparisonResponse,
): BacktestComparisonViewModel {
  const variants = response.variants.map(toVariantDetailView);

  return {
    symbol: response.symbol,
    comparisonCount: response.comparisonCount,
    variants,
    bestBy60dAvgReturn: pickWinner(
      variants,
      "بهترین بازده 60 روزه",
      (variant) => variant.avgReturn60d,
      "60d",
    ),
    bestBy20dProfitFactor: pickWinner(
      variants,
      "بهترین نسبت سود به زیان 20 روزه",
      (variant) => variant.profitFactor20d,
      "20d",
    ),
    safestBy20dDrawdown: pickWinner(
      variants,
      "کم ریسک ترین افت سرمایه 20 روزه",
      (variant) => variant.avgDrawdown20d,
      "20d",
    ),
  };
}
