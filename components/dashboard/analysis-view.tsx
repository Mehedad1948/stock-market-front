import {
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import {
  DashboardDotMeter,
  DashboardIconFrame,
  DashboardPanel,
  DashboardSectionLabel,
} from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockAnalysisResult } from "@/types/stock-analysis-api";

type AnalysisViewProps = {
  analysis: StockAnalysisResult;
  symbol: string;
};

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function AnalysisView({ analysis, symbol }: AnalysisViewProps) {
  const composite = analysis.signals.composite;
  const timeframes = composite.timeframes;
  const scoreValue = Math.min(100, Math.max(0, (composite.score + 100) / 2));
  const timeframeRows: Array<
    [string, (typeof timeframes)[keyof typeof timeframes]]
  > = [
    ["کوتاه‌مدت", timeframes.shortTerm],
    ["میان‌مدت", timeframes.midTerm],
    ["بلندمدت", timeframes.longTerm],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_1.05fr]">
        <DashboardPanel tone="muted" className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <DashboardIconFrame>
                  <BrainCircuit className="h-5 w-5" />
                </DashboardIconFrame>
                <div className="text-2xl font-medium tracking-[-0.05em]">
                  {symbol}
                </div>
              </div>
              <DashboardSectionLabel>
                نمای ترکیبی، سیگنال و ارزیابی بازه‌های زمانی
              </DashboardSectionLabel>
            </div>
            <Badge variant="dashboard">{analysis.source}</Badge>
          </div>

          <div className="flex items-end gap-3">
            <div className="text-6xl font-medium tracking-[-0.08em]">
              {composite.score}
            </div>
            <Badge variant="dashboard-highlight" className="mb-2">
              {composite.action.label}
            </Badge>
          </div>

          <DashboardDotMeter
            filled={Math.max(1, Math.min(7, Math.round(scoreValue / 15)))}
          />
        </DashboardPanel>

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

        <DashboardPanel tone="dark" className="space-y-5">
          <div className="text-3xl font-medium leading-[1.05] tracking-[-0.05em]">
            جمع‌بندی
            <br />
            سریع
            <br />
            برای
            <br />
            تصمیم‌گیری
          </div>

          <div className="grid gap-3">
            {[
              { label: "تمایل", value: composite.bias.label, icon: BarChart3 },
              { label: "ورود", value: composite.entryTiming.label, icon: BadgeCheck },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-white/6 px-4 py-3"
              >
                <div>
                  <div className="text-xs tracking-[0.04em] text-white/44">
                    {item.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {item.value}
                  </div>
                </div>
                <item.icon className="h-4 w-4 text-white/72" />
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <DashboardPanel tone="default" className="space-y-5">
          <div className="flex items-center gap-3">
            <DashboardIconFrame>
              <BarChart3 className="h-5 w-5" />
            </DashboardIconFrame>
            <div>
              <h2 className="text-2xl font-medium tracking-[-0.05em]">
                جزئیات بازه‌های زمانی
              </h2>
              <DashboardSectionLabel>
                خلاصه تصمیم برای بازه‌های کوتاه، میانی و بلند
              </DashboardSectionLabel>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-black/6">
            <Table>
              <TableHeader className="bg-[#f1f1eb]">
                <TableRow className="border-black/6 hover:bg-transparent">
                  <TableHead className="px-5">بازه</TableHead>
                  <TableHead>اقدام</TableHead>
                  <TableHead>کیفیت</TableHead>
                  <TableHead>ورود جدید</TableHead>
                  <TableHead>موقعیت موجود</TableHead>
                  <TableHead className="px-5 text-end">امتیاز</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeframeRows.map(([label, timeframe]) => (
                  <TableRow
                    key={label}
                    className="border-black/6 hover:bg-[#f8f8f3]"
                  >
                    <TableCell className="px-5 font-medium">{label}</TableCell>
                    <TableCell>{timeframe.action.label}</TableCell>
                    <TableCell>{timeframe.quality.label}</TableCell>
                    <TableCell>
                      {timeframe.positionAdvice.forNewPosition.label}
                    </TableCell>
                    <TableCell>
                      {timeframe.positionAdvice.forExistingPosition.label}
                    </TableCell>
                    <TableCell className="px-5 text-end">
                      {formatPercent(timeframe.score)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardPanel>

        <DashboardPanel tone="muted" className="space-y-4">
          <div className="flex items-center gap-3">
            <DashboardIconFrame>
              <BadgeCheck className="h-5 w-5" />
            </DashboardIconFrame>
            <div>
              <h2 className="text-2xl font-medium tracking-[-0.05em]">
                شاخص‌ها
              </h2>
              <DashboardSectionLabel>
                مهم‌ترین خروجی‌های محاسباتی
              </DashboardSectionLabel>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              ["آخرین قیمت", analysis.metrics.latestClosePrice],
              ["تغییر", analysis.metrics.latestClosePriceChangePercent],
              ["شیب هفتگی", analysis.metrics.weeklySlope],
              ["شیب ماهانه", analysis.metrics.monthlySlope],
              ["شیب فصلی", analysis.metrics.quarterlySlope],
              [
                "گسترش نقدشوندگی",
                analysis.metrics.liquidityExpansion ? "بله" : "خیر",
              ],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="dashboard-surface flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm text-black/56">{label}</span>
                <span className="text-sm font-medium">
                  {typeof value === "number" ? value.toFixed(2) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>

      <DashboardPanel tone="default" className="space-y-4">
        <div className="flex items-center gap-3">
          <DashboardIconFrame>
            <RefreshCcw className="h-5 w-5" />
          </DashboardIconFrame>
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.05em]">
              یادداشت‌ها
            </h2>
            <DashboardSectionLabel>
              اطلاعات کمکی و اجرایی
            </DashboardSectionLabel>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="dashboard">{analysis.windows.weekly}W</Badge>
          <Badge variant="dashboard">{analysis.windows.monthly}M</Badge>
          <Badge variant="dashboard">{analysis.windows.quarterly}Q</Badge>
        </div>

        <p className="text-sm leading-7 text-black/62">{analysis.disclaimer}</p>
        <div className="rounded-[1.6rem] border border-black/6 bg-[#f1f1eb] px-4 py-3 text-sm text-black/58">
          این تحلیل از API عمومی بارگذاری شده و با کش سرور نگه‌داری می‌شود.
        </div>
      </DashboardPanel>
    </div>
  );
}
