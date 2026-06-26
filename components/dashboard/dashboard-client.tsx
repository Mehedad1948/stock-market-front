"use client";

import {
  ArrowUpRight,
  BrainCircuit,
  Clock3,
  Layers3,
  LineChart,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type DashboardClientProps = {
  displayName: string;
  accountScope: string;
};

const signalRows = [
  {
    action: "BUY",
    bias: "Bullish",
    score: 84,
    symbol: "فولاد",
    timing: "Entry near support",
  },
  {
    action: "HOLD",
    bias: "Neutral",
    score: 62,
    symbol: "شبندر",
    timing: "Wait for confirmation",
  },
  {
    action: "WATCH",
    bias: "Reversal watch",
    score: 71,
    symbol: "خساپا",
    timing: "Momentum building",
  },
  {
    action: "BUY",
    bias: "Trend aligned",
    score: 89,
    symbol: "شپنا",
    timing: "Breakout setup",
  },
];

const watchlistRows = [
  { symbol: "فولاد", status: "Active", price: "32,840", change: "+2.4%" },
  { symbol: "فملی", status: "Monitoring", price: "41,520", change: "+1.1%" },
  { symbol: "شپنا", status: "Breakout", price: "57,900", change: "+3.7%" },
];

const portfolioRows = [
  { symbol: "فولاد", weight: "28%", pnl: "+12.8%", conviction: 86 },
  { symbol: "فملی", weight: "24%", pnl: "+7.3%", conviction: 74 },
  { symbol: "شپنا", weight: "19%", pnl: "+14.1%", conviction: 91 },
];

function scoreTone(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (score >= 65) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-graphite-100 text-graphite-700 dark:bg-graphite-700 dark:text-graphite-300";
}

export function DashboardClient({
  displayName,
  accountScope,
}: DashboardClientProps) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-graphite-200 bg-white p-8 sm:p-10 shadow-lg dark:border-graphite-700 dark:bg-graphite-800">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-lg border border-graphite-300 bg-graphite-50 px-4 py-2 text-xs font-semibold text-graphite-700 dark:border-graphite-600 dark:bg-graphite-700 dark:text-graphite-300">
              <Sparkles className="h-4 w-4" />
              <span>{accountScope}</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-graphite-900 sm:text-5xl dark:text-graphite-50">
                خوش آمدی، {displayName}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-graphite-700 dark:text-graphite-300">
                این داشبورد برای بررسی سریع سیگنال‌ها، پایش واچ‌لیست، و دیدن
                وضعیت پوزیشن‌ها طراحی شده است.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-lg px-6" size="lg" variant="default">
                شروع اسکن جدید
                <ScanSearch className="h-5 w-5" />
              </Button>
              <Button className="rounded-lg px-6" size="lg" variant="outline">
                مشاهده سیگنال‌ها
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Card className="border-graphite-200 bg-graphite-50 dark:border-graphite-700 dark:bg-graphite-700">
            <CardHeader>
              <CardTitle className="text-graphite-900 dark:text-graphite-100">وضعیت امروز</CardTitle>
              <CardDescription className="text-graphite-600 dark:text-graphite-400">خلاصه‌ای از فعالیت و تمرکز فعلی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-graphite-700 dark:text-graphite-400">نرخ پوشش واچ‌لیست</span>
                <span className="font-semibold text-graphite-900 dark:text-graphite-100">86%</span>
              </div>
              <Progress value={86} className="h-2 bg-graphite-200 dark:bg-graphite-600" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-graphite-200 bg-white p-4 dark:border-graphite-600 dark:bg-graphite-800">
                  <div className="flex items-center gap-2 text-sm text-graphite-600 dark:text-graphite-400">
                    <TrendingUp className="h-4 w-4" />
                    سیگنال فعال
                  </div>
                  <div className="mt-3 text-3xl font-bold text-graphite-900 dark:text-graphite-100">24</div>
                </div>
                <div className="rounded-lg border border-graphite-200 bg-white p-4 dark:border-graphite-600 dark:bg-graphite-800">
                  <div className="flex items-center gap-2 text-sm text-graphite-600 dark:text-graphite-400">
                    <Clock3 className="h-4 w-4" />
                    آخرین به‌روزرسانی
                  </div>
                  <div className="mt-3 text-3xl font-bold text-graphite-900 dark:text-graphite-100">12:40</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: LineChart,
            label: "Score Median",
            value: "78",
            hint: "+6 vs yesterday",
          },
          {
            icon: Layers3,
            label: "Tracked Symbols",
            value: "48",
            hint: "4 sectors",
          },
          {
            icon: ShieldCheck,
            label: "Risk Filter",
            value: "Active",
            hint: "Capital preservation mode",
          },
          {
            icon: BrainCircuit,
            label: "Model Mode",
            value: "Composite",
            hint: "Primary signal engine",
          },
        ].map((item) => (
          <Card key={item.label} className="border-graphite-200 bg-white hover:shadow-lg transition-all dark:border-graphite-700 dark:bg-graphite-800">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-sm text-graphite-600 dark:text-graphite-400">{item.label}</div>
                <div className="mt-2 text-2xl font-bold text-graphite-900 dark:text-graphite-100">{item.value}</div>
                <div className="mt-1 text-xs text-graphite-500 dark:text-graphite-400">{item.hint}</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-graphite-100 text-graphite-700 dark:bg-graphite-700 dark:text-graphite-300">
                <item.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="signals" className="gap-4">
        <TabsList variant="line" className="w-full justify-start gap-3 rounded-none p-0 border-b border-graphite-200 bg-transparent dark:border-graphite-700">
          <TabsTrigger value="signals" className="rounded-lg px-4 py-2 text-graphite-700 dark:text-graphite-400 data-[state=active]:bg-graphite-100 data-[state=active]:text-graphite-900 dark:data-[state=active]:bg-graphite-700 dark:data-[state=active]:text-graphite-100">
            سیگنال‌ها
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="rounded-lg px-4 py-2 text-graphite-700 dark:text-graphite-400 data-[state=active]:bg-graphite-100 data-[state=active]:text-graphite-900 dark:data-[state=active]:bg-graphite-700 dark:data-[state=active]:text-graphite-100">
            واچ‌لیست
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="rounded-lg px-4 py-2 text-graphite-700 dark:text-graphite-400 data-[state=active]:bg-graphite-100 data-[state=active]:text-graphite-900 dark:data-[state=active]:bg-graphite-700 dark:data-[state=active]:text-graphite-100">
            پورتفوی
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="mt-6" id="signals">
          <Card className="border-graphite-200 bg-white dark:border-graphite-700 dark:bg-graphite-800">
            <CardHeader className="flex-row items-center justify-between gap-4 border-b border-graphite-200 dark:border-graphite-700">
              <div>
                <CardTitle className="text-graphite-900 dark:text-graphite-100">سیگنال‌های منتخب</CardTitle>
                <CardDescription className="text-graphite-600 dark:text-graphite-400">نمونه‌ای از خروجی قابل‌اقدام برای امروز</CardDescription>
              </div>
              <Badge variant="default" className="rounded-full">
                Live
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-graphite-200 dark:border-graphite-700">
                    <TableHead className="px-6 text-graphite-700 dark:text-graphite-400">نماد</TableHead>
                    <TableHead className="text-graphite-700 dark:text-graphite-400">اقدام</TableHead>
                    <TableHead className="text-graphite-700 dark:text-graphite-400">Bias</TableHead>
                    <TableHead className="text-graphite-700 dark:text-graphite-400">Score</TableHead>
                    <TableHead className="text-end text-graphite-700 dark:text-graphite-400">Timing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signalRows.map((row) => (
                    <TableRow key={row.symbol} className="border-b border-graphite-200 hover:bg-graphite-50 transition-colors dark:border-graphite-700 dark:hover:bg-graphite-700">
                      <TableCell className="px-6 font-semibold text-graphite-900 dark:text-graphite-100">{row.symbol}</TableCell>
                      <TableCell>
                        <Badge className="rounded-full" variant="default">
                          {row.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-graphite-700 dark:text-graphite-400">{row.bias}</TableCell>
                      <TableCell>
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", scoreTone(row.score))}>
                          {row.score}
                        </span>
                      </TableCell>
                      <TableCell className="text-end text-graphite-600 dark:text-graphite-400">{row.timing}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="mt-6" id="watchlist">
          <Card className="border-graphite-200 bg-white dark:border-graphite-700 dark:bg-graphite-800">
            <CardHeader>
              <CardTitle className="text-graphite-900 dark:text-graphite-100">واچ‌لیست فعال</CardTitle>
              <CardDescription className="text-graphite-600 dark:text-graphite-400">نمادهایی که برای رصد کوتاه‌مدت نگه داشته شده‌اند</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {watchlistRows.map((item, index) => (
                <div key={item.symbol} className="group">
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-graphite-50 transition-colors dark:hover:bg-graphite-700">
                    <div>
                      <div className="font-semibold text-graphite-900 dark:text-graphite-100">{item.symbol}</div>
                      <div className="mt-1 text-sm text-graphite-600 dark:text-graphite-400">{item.status}</div>
                    </div>
                    <div className="text-end">
                      <div className="font-semibold text-graphite-900 dark:text-graphite-100">{item.price}</div>
                      <div className="mt-1 text-sm text-emerald-600 font-medium dark:text-emerald-400">{item.change}</div>
                    </div>
                  </div>
                  {index < watchlistRows.length - 1 ? (
                    <Separator className="mt-4 bg-graphite-200 dark:bg-graphite-700" />
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6" id="portfolio">
          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <Card className="border-graphite-200 bg-white dark:border-graphite-700 dark:bg-graphite-800">
              <CardHeader>
                <CardTitle className="text-graphite-900 dark:text-graphite-100">پوزیشن‌های مهم</CardTitle>
                <CardDescription className="text-graphite-600 dark:text-graphite-400">تمرکز سرمایه روی بهترین ایده‌های فعلی</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioRows.map((row) => (
                  <div key={row.symbol} className="rounded-lg border border-graphite-200 bg-graphite-50 p-4 hover:bg-graphite-100 transition-colors dark:border-graphite-600 dark:bg-graphite-700 dark:hover:bg-graphite-600">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-graphite-900 dark:text-graphite-100">{row.symbol}</div>
                        <div className="mt-1 text-sm text-graphite-600 dark:text-graphite-400">Weight {row.weight}</div>
                      </div>
                      <Badge className="rounded-full" variant="default">
                        {row.pnl}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-graphite-200 overflow-hidden dark:bg-graphite-600">
                        <div 
                          className="h-full bg-graphite-700 rounded-full dark:bg-graphite-300" 
                          style={{ width: `${row.conviction}%` }}
                        ></div>
                      </div>
                      <span className="min-w-10 text-end text-sm font-medium text-graphite-900 dark:text-graphite-100">
                        {row.conviction}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-graphite-200 bg-white dark:border-graphite-700 dark:bg-graphite-800">
              <CardHeader>
                <CardTitle className="text-graphite-900 dark:text-graphite-100">اکشن سنتر</CardTitle>
                <CardDescription className="text-graphite-600 dark:text-graphite-400">اقدام‌های سریع و عملی</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "اجرای اسکن جدید روی واچ‌لیست",
                  "مرور نمادهای score بالای 80",
                  "بازبینی پوزیشن‌های با conviction پایین",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 rounded-lg border border-graphite-200 bg-graphite-50 p-3 text-sm leading-6 text-graphite-700 hover:bg-graphite-100 transition-colors dark:border-graphite-600 dark:bg-graphite-700 dark:text-graphite-400 dark:hover:bg-graphite-600"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-graphite-400 flex-shrink-0 dark:bg-graphite-500" />
                    <span>{text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
