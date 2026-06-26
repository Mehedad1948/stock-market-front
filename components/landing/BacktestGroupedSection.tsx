"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type {
  HorizonKey,
  HorizonMetrics,
  ReportGroup,
} from "@/types/backtest-report";

type SortMetric =
  | "sampleCount"
  | "avgReturn"
  | "medianReturn"
  | "winRate"
  | "negativeReturnRate"
  | "profitFactorLikeRatio"
  | "avgMaxDrawdown";

type BacktestGroupedSectionProps = {
  title: string;
  description: string;
  groups: ReportGroup[];
  defaultSortMetric?: SortMetric;
  defaultSortHorizon?: HorizonKey;
};

const metricOptions: Array<{ value: SortMetric; label: string }> = [
  { value: "sampleCount", label: "تعداد نمونه" },
  { value: "avgReturn", label: "میانگین بازده" },
  { value: "medianReturn", label: "میانه بازده" },
  { value: "winRate", label: "نرخ برد" },
  { value: "negativeReturnRate", label: "نرخ بازده منفی" },
  { value: "profitFactorLikeRatio", label: "نسبت سود به زیان" },
  { value: "avgMaxDrawdown", label: "میانگین افت سرمایه" },
];

const horizonOrder: HorizonKey[] = ["1d", "5d", "20d", "60d"];

const percentFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("fa-IR");

function formatPercent(value: number) {
  return `${percentFormatter.format(value * 100)}%`;
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${percentFormatter.format(Math.abs(value * 100))}%`;
}

function formatProfitFactor(value: number | null) {
  if (value === null) {
    return "نامعتبر";
  }

  return percentFormatter.format(value);
}

function getConfidenceMeta(sampleCount: number) {
  if (sampleCount < 10) {
    return {
      label: "هشدار شدید",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (sampleCount < 30) {
    return {
      label: "کم نمونه",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "قابل اتکا",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
}

function getSortValue(
  group: ReportGroup,
  metric: SortMetric,
  horizon: HorizonKey,
): number {
  if (metric === "sampleCount") {
    return group.sampleCount;
  }

  const metrics = group.horizons[horizon];

  if (!metrics) {
    return Number.NEGATIVE_INFINITY;
  }

  const value = metrics[metric];

  if (value === null || value === undefined) {
    return Number.NEGATIVE_INFINITY;
  }

  return typeof value === "number" ? value : Number(value);
}

function isStrongRow(group: ReportGroup, horizon: HorizonKey) {
  const metrics = group.horizons[horizon];

  if (!metrics || group.sampleCount < 30) {
    return false;
  }

  return (
    metrics.avgReturn > 0 &&
    metrics.winRate >= 0.55 &&
    (metrics.profitFactorLikeRatio ?? 0) >= 1.2
  );
}

function HorizonMetricsCell({ metrics }: { metrics?: HorizonMetrics }) {
  if (!metrics) {
    return <div className="text-xs text-black/35">بدون داده</div>;
  }

  return (
    <div className="space-y-1 text-[11px] leading-5">
      <div className={cn(metrics.avgReturn > 0 ? "text-emerald-700" : metrics.avgReturn < 0 ? "text-red-700" : "text-slate-600")}>
        بازده: {formatSignedPercent(metrics.avgReturn)}
      </div>
      <div className="text-black/60">میانه: {formatSignedPercent(metrics.medianReturn)}</div>
      <div className="text-black/60">برد: {formatPercent(metrics.winRate)}</div>
      <div className="text-black/60">منفی: {formatPercent(metrics.negativeReturnRate)}</div>
      <div className="text-black/60">
        PF: {metrics.profitFactorLikeRatio === null ? "زیان کافی ندارد" : formatProfitFactor(metrics.profitFactorLikeRatio)}
      </div>
      <div className="text-black/48">DD: {formatSignedPercent(metrics.avgMaxDrawdown)}</div>
    </div>
  );
}

export function BacktestGroupedSection({
  title,
  description,
  groups,
  defaultSortMetric = "sampleCount",
  defaultSortHorizon = "20d",
}: BacktestGroupedSectionProps) {
  const [sortMetric, setSortMetric] = useState<SortMetric>(defaultSortMetric);
  const [sortHorizon, setSortHorizon] = useState<HorizonKey>(defaultSortHorizon);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((left, right) => {
      const rightValue = getSortValue(right, sortMetric, sortHorizon);
      const leftValue = getSortValue(left, sortMetric, sortHorizon);

      if (rightValue !== leftValue) {
        return rightValue - leftValue;
      }

      return right.sampleCount - left.sampleCount;
    });
  }, [groups, sortHorizon, sortMetric]);

  return (
    <section className="rounded-[1.75rem] border border-black/6 bg-white/74 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.2)] sm:p-5">
      <div className="flex flex-col gap-4 border-b border-black/6 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-black/82">
            {title}
          </h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-black/56">
            {description}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-black/48">
            معیار مرتب سازی
            <select
              value={sortMetric}
              onChange={(event) => setSortMetric(event.target.value as SortMetric)}
              className="h-10 rounded-full border border-black/10 bg-white px-3 text-sm text-black/72 outline-none focus:border-black/20"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-black/48">
            افق مرتب سازی
            <select
              value={sortHorizon}
              onChange={(event) => setSortHorizon(event.target.value)}
              className="h-10 rounded-full border border-black/10 bg-white px-3 text-sm text-black/72 outline-none focus:border-black/20"
            >
              {horizonOrder.map((horizon) => (
                <option key={horizon} value={horizon}>
                  {horizon}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[980px] w-full border-separate border-spacing-y-2 text-right">
          <thead>
            <tr className="text-xs text-black/46">
              <th className="px-3 py-2 font-medium">گروه</th>
              <th className="px-3 py-2 font-medium">نمونه</th>
              <th className="px-3 py-2 font-medium">اعتماد</th>
              <th className="rounded-r-2xl bg-sky-50 px-3 py-2 font-medium text-sky-800">
                1d
              </th>
              <th className="bg-sky-50 px-3 py-2 font-medium text-sky-800">5d</th>
              <th className="bg-emerald-50 px-3 py-2 font-medium text-emerald-800">
                20d
              </th>
              <th className="rounded-l-2xl bg-amber-50 px-3 py-2 font-medium text-amber-800">
                60d
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedGroups.map((group) => {
              const confidence = getConfidenceMeta(group.sampleCount);
              const strong = isStrongRow(group, sortHorizon);

              return (
                <tr
                  key={group.key}
                  className={cn(
                    "align-top",
                    strong ? "[&>td]:border-emerald-200 [&>td]:bg-emerald-50/40" : "[&>td]:bg-white/80",
                  )}
                >
                  <td className="rounded-r-2xl border border-black/6 px-3 py-3 text-sm font-semibold text-black/78">
                    {group.key}
                  </td>
                  <td className="border-y border-black/6 px-3 py-3 text-sm text-black/68">
                    {numberFormatter.format(group.sampleCount)}
                  </td>
                  <td className="border-y border-black/6 px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        confidence.className,
                      )}
                    >
                      {confidence.label}
                    </span>
                  </td>
                  {horizonOrder.map((horizon, index) => (
                    <td
                      key={horizon}
                      className={cn(
                        "border-y border-black/6 px-3 py-3",
                        index === horizonOrder.length - 1 && "rounded-l-2xl border-l",
                      )}
                    >
                      <HorizonMetricsCell metrics={group.horizons[horizon]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
