import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { BacktestComparisonPageClient } from "@/components/backtests/BacktestComparisonPageClient";
import { buildBacktestComparisonViewModel, defaultComparisonVariants } from "@/lib/backtests/backtest-comparison-view-model";
import { runBacktestComparison } from "@/services/http/backtest-comparison.service";

export const metadata: Metadata = {
  title: "مقایسه بک تست | استاک سیگنال",
  description: "مقایسه واریانت های سیگنال برای تشخیص سریع نسخه های امیدوارکننده تر در افق های 20 و 60 روزه.",
};

export default async function BacktestComparisonPage() {
  const initialResponse = await runBacktestComparison({
    symbol: "فملی",
    weeklyWindow: 7,
    monthlyWindow: 30,
    quarterlyWindow: 90,
    variants: defaultComparisonVariants,
    reportLimit: 50000,
  });

  const initialData = buildBacktestComparisonViewModel(initialResponse);

  return (
    <main className="min-h-screen py-8 sm:py-10">
      <Container className="space-y-8">
        <BacktestComparisonPageClient initialData={initialData} />
      </Container>
    </main>
  );
}
