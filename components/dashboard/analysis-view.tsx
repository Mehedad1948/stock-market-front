import {
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

  return (
    <div className="space-y-6 w-full max-w-full">
      <Card className="border-black/8 bg-white/92 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{symbol}</CardTitle>
            <CardDescription className="mt-2">
              تحلیل ترکیبی، سیگنال و ارزیابی تایم‌فریم‌ها
            </CardDescription>
          </div>
          <Badge className="rounded-full" variant="secondary">
            {analysis.source}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Score", value: composite.score, icon: BrainCircuit },
            { label: "Action", value: composite.action.label, icon: TrendingUp },
            { label: "Bias", value: composite.bias.label, icon: BarChart3 },
            { label: "Entry", value: composite.entryTiming.label, icon: BadgeCheck },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-black/8 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-black/55">
                <span>{item.label}</span>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-xl font-semibold text-black">{item.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-black/8 bg-white/92">
          <CardHeader>
            <CardTitle>Composite Overview</CardTitle>
            <CardDescription>نتیجه نهایی مدل برای این نماد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/55">Composite Score</span>
              <span className="font-medium text-black">{composite.score}</span>
            </div>
            <Progress value={Math.min(100, Math.max(0, (composite.score + 100) / 2))} />
            <p className="text-sm leading-7 text-black/70">{analysis.persianSummary}</p>
            <Separator className="bg-black/8" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/8 p-4">
                <div className="text-xs text-black/45">Latest Data</div>
                <div className="mt-1 text-sm font-medium text-black">{analysis.latestDataDate}</div>
              </div>
              <div className="rounded-2xl border border-black/8 p-4">
                <div className="text-xs text-black/45">Cache</div>
                <div className="mt-1 text-sm font-medium text-black">
                  {analysis.cacheHit ? "Hit" : "Miss"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/8 bg-white/92">
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
            <CardDescription>مهم‌ترین خروجی‌های محاسباتی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["Latest Close", analysis.metrics.latestClosePrice],
              ["Change", analysis.metrics.latestClosePriceChangePercent],
              ["Weekly Slope", analysis.metrics.weeklySlope],
              ["Monthly Slope", analysis.metrics.monthlySlope],
              ["Quarterly Slope", analysis.metrics.quarterlySlope],
              ["Liquidity Expansion", analysis.metrics.liquidityExpansion ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="flex items-center justify-between rounded-2xl border border-black/8 px-4 py-3"
              >
                <span className="text-black/55">{label}</span>
                <span className="font-medium text-black">
                  {typeof value === "number" ? value.toFixed(2) : String(value)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-black/8 bg-white/92">
        <CardHeader>
          <CardTitle>Timeframe Breakdown</CardTitle>
          <CardDescription>خلاصه تصمیم برای بازه‌های کوتاه، میانی و بلند</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Timeframe</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>New Position</TableHead>
                <TableHead>Existing Position</TableHead>
                <TableHead className="text-end">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Short Term", timeframes.shortTerm],
                ["Mid Term", timeframes.midTerm],
                ["Long Term", timeframes.longTerm],
              ].map(([label, timeframe]) => (
                <TableRow key={label as string}>
                  <TableCell className="px-6 font-medium text-black">{label}</TableCell>
                  <TableCell>{timeframe.action.label}</TableCell>
                  <TableCell>{timeframe.quality.label}</TableCell>
                  <TableCell>{timeframe.positionAdvice.forNewPosition.label}</TableCell>
                  <TableCell>{timeframe.positionAdvice.forExistingPosition.label}</TableCell>
                  <TableCell className="text-end">{formatPercent(timeframe.score)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-black/8 bg-white/92">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>اطلاعات کمکی و اجرایی</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">
              {analysis.windows.weekly}W
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {analysis.windows.monthly}M
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {analysis.windows.quarterly}Q
            </Badge>
          </div>
          <p className="text-sm leading-7 text-black/65">{analysis.disclaimer}</p>
          <div className="flex items-center gap-2 text-sm text-black/55">
            <RefreshCcw className="h-4 w-4" />
            این تحلیل از API عمومی بارگذاری شده و با کش سرور نگه‌داری می‌شود.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
