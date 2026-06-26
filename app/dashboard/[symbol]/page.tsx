import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AnalysisView } from "@/components/dashboard/analysis-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getGroupedSymbols } from "@/services/http/symbols.service";
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

  const [groups, analysis] = await Promise.all([
    getGroupedSymbols(),
    getStockAnalysis(symbol),
  ]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[linear-gradient(180deg,#f7f7fb_0%,#edf0f7_100%)] text-black"
    >
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
              تحلیل نماد {symbol}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-black/60 sm:text-base">
              نمای کامل composite، metrics و تایم‌فریم‌ها برای تصمیم‌گیری سریع.
            </p>
          </div>
        </div>

        <div className="grid gap-4 max-w-full w-full  ">
          <AnalysisView analysis={analysis} symbol={symbol} />
        </div>
      </section>
    </main>
  );
}
