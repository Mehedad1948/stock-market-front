"use client";

import { useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Target,
} from "lucide-react";

import { runBacktestComparisonAction } from "@/app/backtests/compare/actions";
import { Button } from "@/components/ui/button";
import {
  comparisonVariantLabels,
  defaultComparisonVariants,
} from "@/lib/backtests/backtest-comparison-view-model";
import { cn } from "@/lib/utils";
import type {
  BacktestComparisonVariantKey,
  BacktestComparisonViewModel,
  VariantDetailView,
  VariantSubgroupPreview,
} from "@/types/backtest-comparison";

type SortKey =
  | "sampleCount"
  | "avgReturn20d"
  | "avgReturn60d"
  | "medianReturn20d"
  | "medianReturn60d"
  | "winRate20d"
  | "winRate60d"
  | "profitFactor20d"
  | "profitFactor60d"
  | "avgDrawdown20d"
  | "avgDrawdown60d";

type Props = {
  initialData: BacktestComparisonViewModel;
};

const variantOptions = defaultComparisonVariants.map((key) => ({
  key,
  label: comparisonVariantLabels[key],
}));

const percentFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("fa-IR");

function formatPercent(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${percentFormatter.format(Math.abs(value * 100))}%`;
}

function formatRatio(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return percentFormatter.format(value);
}

function getSortValue(variant: VariantDetailView, key: SortKey) {
  const value = variant[key];

  return typeof value === "number" ? value : Number.NEGATIVE_INFINITY;
}

function SummaryCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/6 bg-white/78 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.18)]">
      <div className="text-[11px] font-medium text-black/45">{title}</div>
      <div className={cn("mt-2 text-lg font-semibold text-black/82", tone)}>
        {value}
      </div>
    </div>
  );
}

function VariantBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

function PreviewSection({ preview }: { preview: VariantSubgroupPreview }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white/80 p-4">
      <h4 className="text-sm font-semibold text-black/78">{preview.title}</h4>
      {preview.rows.length === 0 ? (
        <p className="mt-3 text-xs text-black/42">داده کافی برای این بخش وجود ندارد.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {preview.rows.map((row) => (
            <div
              key={row.key}
              className="grid gap-2 rounded-xl border border-black/6 bg-slate-50/70 px-3 py-2 text-xs text-black/62 sm:grid-cols-5"
            >
              <div className="font-semibold text-black/76">{row.key}</div>
              <div>نمونه {numberFormatter.format(row.sampleCount)}</div>
              <div>20d {formatPercent(row.avgReturn20d)}</div>
              <div>60d {formatPercent(row.avgReturn60d)}</div>
              <div>PF 60d {formatRatio(row.profitFactor60d)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BacktestComparisonPageClient({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState(initialData.symbol || "فملی");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<
    BacktestComparisonVariantKey[]
  >(defaultComparisonVariants);
  const [sortKey, setSortKey] = useState<SortKey>("avgReturn60d");
  const [sortDescending, setSortDescending] = useState(true);
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  const sortedVariants = [...data.variants].sort((left, right) => {
    const leftValue = getSortValue(left, sortKey);
    const rightValue = getSortValue(right, sortKey);
    const result = sortDescending
      ? rightValue - leftValue
      : leftValue - rightValue;

    if (result !== 0) {
      return result;
    }

    return right.sampleCount - left.sampleCount;
  });

  function toggleVariant(key: BacktestComparisonVariantKey) {
    setSelectedVariants((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function toggleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDescending((current) => !current);
      return;
    }

    setSortKey(nextKey);
    setSortDescending(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setError(null);
      const result = await runBacktestComparisonAction({
        symbol,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        variants:
          selectedVariants.length > 0
            ? selectedVariants
            : defaultComparisonVariants,
      });

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setData(result.data);
      setExpandedVariant(null);
    });
  }

  return (
    <div className="space-y-8" dir="rtl">
      <section className="rounded-[2rem] border border-white/80 bg-white/62 p-5 shadow-[0_24px_46px_-32px_rgba(15,23,42,0.18)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/74 px-3 py-1.5 text-xs font-semibold text-black/56">
              <Target className="h-3.5 w-3.5" />
              مقایسه نسخه های بک تست
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-black sm:text-[2.6rem]">
              مقایسه تشخیصی واریانت های سیگنال
            </h1>
            <p className="mt-3 text-sm leading-7 text-black/60 sm:text-[0.95rem]">
              این صفحه برای انتخاب سریع واریانت بهتر ساخته شده است. تمرکز روی
              افق‌های 20 و 60 روزه است تا تفاوت بین نسخه کامل، تک اندیکاتور و
              ابلیشن‌ها روشن شود.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/6 bg-white/78 px-4 py-3 text-sm text-black/58">
            <div>نماد فعلی: {data.symbol}</div>
            <div className="mt-1">تعداد مقایسه: {numberFormatter.format(data.comparisonCount)}</div>
          </div>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-4">
            <label className="flex flex-col gap-2 text-sm text-black/58">
              نماد
              <input
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black/82 outline-none focus:border-black/20"
                placeholder="مثال: فملی"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-black/58">
              از تاریخ
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black/82 outline-none focus:border-black/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-black/58">
              تا تاریخ
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black/82 outline-none focus:border-black/20"
              />
            </label>

            <div className="flex items-end">
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-2xl"
                disabled={isPending}
              >
                {isPending ? "در حال مقایسه..." : "اجرای مقایسه"}
              </Button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/6 bg-white/76 p-4">
            <div className="mb-3 text-sm font-semibold text-black/72">
              انتخاب واریانت ها
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {variantOptions.map((option) => {
                const checked = selectedVariants.includes(option.key);

                return (
                  <label
                    key={option.key}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                      checked
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-black/8 bg-white text-black/72",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={() => toggleVariant(option.key)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </form>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <SummaryCard title="نماد" value={data.symbol} />
        <SummaryCard
          title="بهترین بازده 60 روزه"
          value={
            data.bestBy60dAvgReturn.variantLabel
              ? `${data.bestBy60dAvgReturn.variantLabel} · ${formatPercent(data.bestBy60dAvgReturn.metricValue)}`
              : "بدون برنده روشن"
          }
          tone="text-emerald-700"
        />
        <SummaryCard
          title="بهترین PF در 20 روز"
          value={
            data.bestBy20dProfitFactor.variantLabel
              ? `${data.bestBy20dProfitFactor.variantLabel} · ${formatRatio(data.bestBy20dProfitFactor.metricValue)}`
              : "بدون برنده روشن"
          }
          tone="text-sky-700"
        />
        <SummaryCard
          title="کم ریسک ترین افت 20 روزه"
          value={
            data.safestBy20dDrawdown.variantLabel
              ? `${data.safestBy20dDrawdown.variantLabel} · ${formatPercent(data.safestBy20dDrawdown.metricValue)}`
              : "بدون برنده روشن"
          }
          tone="text-amber-700"
        />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-black/82">
            کارت واریانت ها
          </h2>
          <p className="mt-1 text-sm leading-6 text-black/56">
            تمرکز این کارت‌ها روی بازده، برد و افت سرمایه در افق‌های 20 و 60 روزه
            است. افق‌های 1 و 5 روزه عمداً از نمای اصلی کنار گذاشته شده‌اند.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sortedVariants.map((variant) => (
            <article
              key={variant.key}
              className={cn(
                "rounded-[1.75rem] border p-4 shadow-[0_20px_38px_-30px_rgba(15,23,42,0.18)]",
                variant.lowConfidence
                  ? "border-amber-200 bg-amber-50/60"
                  : "border-black/6 bg-white/78",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-black/82">
                    {variant.label}
                  </h3>
                  <p className="mt-1 text-xs text-black/46">
                    نمونه {numberFormatter.format(variant.sampleCount)} · اسنپ شات{" "}
                    {numberFormatter.format(variant.snapshotCount)}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {variant.lowConfidence ? (
                    <VariantBadge
                      label="Low sample"
                      className="border-amber-200 bg-amber-50 text-amber-700"
                    />
                  ) : null}
                  {variant.riskFlag ? (
                    <VariantBadge
                      label="Risk"
                      className="border-red-200 bg-red-50 text-red-700"
                    />
                  ) : null}
                  {variant.errorCount > 0 ? (
                    <VariantBadge
                      label={`Errors ${variant.errorCount}`}
                      className="border-slate-200 bg-slate-100 text-slate-700"
                    />
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SummaryCard
                  title="20d Avg Return"
                  value={formatPercent(variant.avgReturn20d)}
                  tone={variant.avgReturn20d && variant.avgReturn20d > 0 ? "text-emerald-700" : "text-black/82"}
                />
                <SummaryCard
                  title="60d Avg Return"
                  value={formatPercent(variant.avgReturn60d)}
                  tone={variant.avgReturn60d && variant.avgReturn60d > 0 ? "text-emerald-700" : "text-black/82"}
                />
                <SummaryCard title="20d Win Rate" value={formatPercent(variant.winRate20d)} />
                <SummaryCard title="60d Win Rate" value={formatPercent(variant.winRate60d)} />
                <SummaryCard title="20d Profit Factor" value={formatRatio(variant.profitFactor20d)} />
                <SummaryCard title="60d Profit Factor" value={formatRatio(variant.profitFactor60d)} />
                <SummaryCard title="20d Avg Drawdown" value={formatPercent(variant.avgDrawdown20d)} tone="text-amber-700" />
                <SummaryCard title="60d Avg Drawdown" value={formatPercent(variant.avgDrawdown60d)} tone="text-amber-700" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-black/6 bg-white/76 p-4 shadow-[0_20px_38px_-30px_rgba(15,23,42,0.18)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-black/82">
              جدول مقایسه
            </h2>
            <p className="mt-1 text-sm leading-6 text-black/56">
              مرتب سازی پیش فرض بر اساس بازده 60 روزه است تا بهترین کاندیدا سریع
              دیده شود.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/6 bg-white px-3 py-2 text-xs text-black/52">
            <ArrowDownUp className="h-3.5 w-3.5" />
            {sortDescending ? "نزولی" : "صعودی"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-separate border-spacing-y-2 text-right">
            <thead>
              <tr className="text-xs text-black/46">
                {[
                  ["variant", "واریانت", null],
                  ["sampleCount", "نمونه", "sampleCount"],
                  ["avgReturn20d", "20d Avg", "avgReturn20d"],
                  ["avgReturn60d", "60d Avg", "avgReturn60d"],
                  ["medianReturn20d", "20d Median", "medianReturn20d"],
                  ["medianReturn60d", "60d Median", "medianReturn60d"],
                  ["winRate20d", "20d Win", "winRate20d"],
                  ["winRate60d", "60d Win", "winRate60d"],
                  ["profitFactor20d", "20d PF", "profitFactor20d"],
                  ["profitFactor60d", "60d PF", "profitFactor60d"],
                  ["avgDrawdown20d", "20d DD", "avgDrawdown20d"],
                  ["avgDrawdown60d", "60d DD", "avgDrawdown60d"],
                ].map(([key, label, sortable]) => (
                  <th key={key} className="px-3 py-2 font-medium">
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(sortable as SortKey)}
                        className="inline-flex items-center gap-1 text-black/58 transition hover:text-black/82"
                      >
                        {label}
                        {sortKey === sortable ? (
                          sortDescending ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronUp className="h-3.5 w-3.5" />
                          )
                        ) : null}
                      </button>
                    ) : (
                      label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedVariants.map((variant) => (
                <tr key={variant.key} className="[&>td]:border-y [&>td]:border-black/6 [&>td]:bg-white/86">
                  <td className="rounded-r-2xl px-3 py-3 font-semibold text-black/82">
                    {variant.label}
                  </td>
                  <td className="px-3 py-3 text-sm text-black/68">
                    {numberFormatter.format(variant.sampleCount)}
                  </td>
                  <td className="px-3 py-3 text-sm">{formatPercent(variant.avgReturn20d)}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-emerald-700">
                    {formatPercent(variant.avgReturn60d)}
                  </td>
                  <td className="px-3 py-3 text-sm">{formatPercent(variant.medianReturn20d)}</td>
                  <td className="px-3 py-3 text-sm">{formatPercent(variant.medianReturn60d)}</td>
                  <td className="px-3 py-3 text-sm">{formatPercent(variant.winRate20d)}</td>
                  <td className="px-3 py-3 text-sm">{formatPercent(variant.winRate60d)}</td>
                  <td className="px-3 py-3 text-sm">{formatRatio(variant.profitFactor20d)}</td>
                  <td className="px-3 py-3 text-sm">{formatRatio(variant.profitFactor60d)}</td>
                  <td className="px-3 py-3 text-sm text-amber-700">
                    {formatPercent(variant.avgDrawdown20d)}
                  </td>
                  <td className="rounded-l-2xl px-3 py-3 text-sm text-amber-700">
                    {formatPercent(variant.avgDrawdown60d)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-black/82">
            جزئیات واریانت ها
          </h2>
          <p className="mt-1 text-sm leading-6 text-black/56">
            این بخش برای فهمیدن دلیل بهتر یا بدتر بودن هر واریانت است، نه رتبه بندی
            سریع. فقط چند زیرگروه مفید نمایش داده می‌شود.
          </p>
        </div>

        {sortedVariants.map((variant) => {
          const open = expandedVariant === variant.key;

          return (
            <article
              key={variant.key}
              className="rounded-[1.5rem] border border-black/6 bg-white/78 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.16)]"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedVariant((current) =>
                    current === variant.key ? null : variant.key,
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-right"
              >
                <div>
                  <h3 className="text-base font-semibold text-black/82">
                    {variant.label}
                  </h3>
                  <p className="mt-1 text-xs text-black/46">
                    وضعیت اجرا {variant.runStatus} · نمونه{" "}
                    {numberFormatter.format(variant.sampleCount)}
                  </p>
                </div>
                {open ? (
                  <ChevronUp className="h-4 w-4 text-black/46" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-black/46" />
                )}
              </button>

              {open ? (
                <div className="border-t border-black/6 px-4 py-4">
                  <div className="grid gap-3 lg:grid-cols-3">
                    <SummaryCard
                      title="Indicator Mode"
                      value={variant.indicatorMode ?? "نامشخص"}
                    />
                    <SummaryCard
                      title="Disabled Indicators"
                      value={
                        variant.disabledIndicators.length > 0
                          ? variant.disabledIndicators.join("، ")
                          : "ندارد"
                      }
                    />
                    <SummaryCard
                      title="Truncation"
                      value={
                        variant.truncated
                          ? `بریده شده · ${numberFormatter.format(variant.returnedSnapshots ?? 0)} / ${numberFormatter.format(variant.totalMatchedSnapshots ?? 0)}`
                          : "کامل"
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {variant.worstDrawdown20d !== null &&
                    variant.worstDrawdown20d <= -1 ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <div className="flex items-center gap-2 font-semibold">
                          <ShieldAlert className="h-4 w-4" />
                          هشدار افت کامل در 20 روز
                        </div>
                        <p className="mt-2 leading-6">
                          مقدار `worstDrawdown = -1` دیده شده است. این می‌تواند به
                          رخداد افت کامل یا تعریف خاص متریک اشاره کند.
                        </p>
                      </div>
                    ) : null}

                    {variant.lowConfidence ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangle className="h-4 w-4" />
                          اعتماد پایین
                        </div>
                        <p className="mt-2 leading-6">
                          این واریانت کمتر از 30 نمونه دارد. برنده شدن آن باید با
                          احتیاط تفسیر شود.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-3">
                    {variant.subgroupPreviews.map((preview) => (
                      <PreviewSection key={preview.key} preview={preview} />
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
