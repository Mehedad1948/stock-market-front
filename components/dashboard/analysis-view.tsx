import { BarChart3, TrendingUp } from "lucide-react";

import {
  DashboardIconFrame,
  DashboardPanel,
  DashboardSectionLabel,
} from "@/components/dashboard/dashboard-primitives";
import { cn } from "@/lib/utils";
import type {
  PresentedTimeframeComposite,
  StockAnalysisResult,
  TimeframeAction,
} from "@/types/stock-analysis-api";

type AnalysisViewProps = {
  analysis: StockAnalysisResult;
  symbol: string;
};

type TimeframeEntry = {
  label: string;
  timeframe: PresentedTimeframeComposite;
};

function getSignalProgress(score: number) {
  return Math.min(100, Math.max(0, (score + 100) / 2));
}

function getTimeframeSignalTheme(action: TimeframeAction) {
  switch (action) {
    case "BUY":
      return {
        badgeClassName:
          "border border-emerald-400/50 bg-emerald-100 text-emerald-800",
      };
    case "PROBABLE_BUY":
      return {
        badgeClassName:
          "border border-[#dbe96d] bg-[#efff78] text-[#17181c]",
      };
    case "HOLD":
      return {
        badgeClassName:
          "border border-black/8 bg-[#f1f1eb] text-[#17181c]",
      };
    case "WAIT":
      return {
        badgeClassName:
          "border border-[#efd3a2] bg-[#f7e6c5] text-[#17181c]",
      };
    case "CAUTION":
      return {
        badgeClassName:
          "border border-[#f4c88a] bg-[#fde7bf] text-[#17181c]",
      };
    case "REDUCE":
      return {
        badgeClassName:
          "border border-rose-200 bg-rose-100 text-rose-700",
      };
    case "EXIT":
      return {
        badgeClassName:
          "border border-rose-300 bg-rose-200 text-rose-800",
      };
  }
}

function TimeframeSignalCard({ label, timeframe }: TimeframeEntry) {
  const signalTheme = getTimeframeSignalTheme(timeframe.action.value);

  return (
    <DashboardPanel
      tone="default"
      className="overflow-hidden bg-white p-0"
    >
      <div className="grid min-h-[300px] grid-rows-[1fr_auto_1fr]">
        <div className="flex flex-col justify-center gap-3 px-5 py-6 text-center sm:px-6">
          <DashboardSectionLabel className="text-black/42">
            ورود جدید
          </DashboardSectionLabel>
          <div className="text-xl font-medium tracking-[-0.04em] text-[#17181c]">
            {timeframe.positionAdvice.forNewPosition.label}
          </div>
        </div>

        <div className="border-y border-black/6 bg-[#f8f8f4] px-5 py-5 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-xl font-medium tracking-[-0.04em] text-[#17181c]">
              {label}
            </div>
            <div
              className={cn(
                "inline-flex min-w-[132px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-[0_14px_32px_-22px_rgba(23,24,28,0.55)]",
                signalTheme.badgeClassName,
              )}
            >
              {timeframe.action.label}
            </div>
            <div className="text-sm font-medium text-black/52">
              {timeframe.quality.label}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 px-5 py-6 text-center sm:px-6">
          <DashboardSectionLabel className="text-black/42">
            موقعیت موجود
          </DashboardSectionLabel>
          <div className="text-xl font-medium tracking-[-0.04em] text-[#17181c]">
            {timeframe.positionAdvice.forExistingPosition.label}
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}

export function AnalysisView({ analysis, symbol }: AnalysisViewProps) {
  const composite = analysis.signals.composite;
  const scoreValue = getSignalProgress(composite.score);
  const timeframeCards: TimeframeEntry[] = [
    {
      label: "کوتاه‌مدت",
      timeframe: composite.timeframes.shortTerm,
    },
    {
      label: "میان‌مدت",
      timeframe: composite.timeframes.midTerm,
    },
    {
      label: "بلندمدت",
      timeframe: composite.timeframes.longTerm,
    },
  ];

  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <DashboardIconFrame>
            <BarChart3 className="h-5 w-5" />
          </DashboardIconFrame>
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.05em]">
              جزئیات بازه‌های زمانی
            </h2>
            <DashboardSectionLabel>
              سیگنال {symbol} برای هر بازه به‌صورت مستقل و قابل مقایسه
            </DashboardSectionLabel>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {timeframeCards.map((entry) => (
            <TimeframeSignalCard key={entry.label} {...entry} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardPanel tone="accent" className="space-y-6">
          <div className="flex items-center gap-3">
            <DashboardIconFrame className="bg-[#fbfbf8]">
              <TrendingUp className="h-5 w-5" />
            </DashboardIconFrame>
            <div className="text-2xl font-medium tracking-[-0.05em]">
              نمای کلی
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/56">امتیاز ترکیبی</span>
              <span className="font-medium">{composite.score}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#17181c] transition-all"
                style={{ width: `${scoreValue}%` }}
              />
            </div>
            <p className="text-sm leading-7 text-black/64">
              {analysis.persianSummary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="dashboard-pill p-4">
              <DashboardSectionLabel>آخرین داده</DashboardSectionLabel>
              <div className="mt-2 text-sm font-medium">
                {analysis.latestDataDate}
              </div>
            </div>
            <div className="dashboard-pill p-4">
              <DashboardSectionLabel>وضعیت کش</DashboardSectionLabel>
              <div className="mt-2 text-sm font-medium">
                {analysis.cacheHit ? "اصابت" : "عدم اصابت"}
              </div>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}
