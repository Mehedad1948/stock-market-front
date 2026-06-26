import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, Search } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AnalysisView } from "@/components/dashboard/analysis-view";
import { DashboardPanel } from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth/session";
import { getStockAnalysis } from "@/services/http/stocks.service";

type SymbolPageProps = {
  params: Promise<{ symbol: string }>;
};

function safeDecodeSymbol(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

async function SymbolAnalysisContent({ symbol }: { symbol: string }) {
  const analysis = await getStockAnalysis(symbol);

  return <AnalysisView analysis={analysis} symbol={symbol} />;
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 rounded-[2rem] bg-black/6" />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_1.05fr]">
        <Skeleton className="h-72 rounded-[2rem] bg-black/6" />
        <Skeleton className="h-72 rounded-[2rem] bg-black/6" />
        <Skeleton className="h-72 rounded-[2rem] bg-black/6" />
      </div>
      <Skeleton className="h-80 rounded-[2rem] bg-black/6" />
    </div>
  );
}

export async function generateMetadata(
  props: SymbolPageProps,
): Promise<Metadata> {
  const { symbol: encodedSymbol } = await props.params;
  const symbol = safeDecodeSymbol(encodedSymbol);

  if (!symbol) {
    return {
      title: "تحلیل نماد | KhayyamPulse",
      description: "تحلیل نماد در پلتفرم KhayyamPulse.",
    };
  }

  return {
    title: `${symbol} | داشبورد | KhayyamPulse`,
    description: `تحلیل نماد ${symbol} در پلتفرم KhayyamPulse.`,
  };
}

export default async function SymbolAnalysisPage(props: SymbolPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { symbol: encodedSymbol } = await props.params;
  const symbol = safeDecodeSymbol(encodedSymbol);

  if (!symbol) {
    notFound();
  }

  return (
    <main dir="rtl" className="space-y-4 text-[#17181c]">
      <section className="dashboard-surface px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="dashboard" className="h-12 px-4 text-sm font-medium">
                <Search className="h-4 w-4" />
                تحلیل نماد
              </Badge>
              <Badge
                variant="dashboard-highlight"
                className="h-12 px-4 text-sm font-medium"
              >
                {symbol}
              </Badge>
            </div>
            <h1 className="text-3xl font-medium tracking-[-0.06em] sm:text-5xl">
              تحلیل {symbol}
            </h1>
          </div>

          <Button
            href="/dashboard"
            variant="dashboard-secondary"
            size="lg"
            className="h-14 px-6 text-base"
          >
            <ArrowRight className="h-5 w-5" />
            بازگشت به گروه‌ها
          </Button>
        </div>
      </section>

      <DashboardPanel tone="muted" className="p-4 sm:p-5">
        <Suspense fallback={<AnalysisSkeleton />}>
          <SymbolAnalysisContent symbol={symbol} />
        </Suspense>
      </DashboardPanel>
    </main>
  );
}
