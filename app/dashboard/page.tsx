import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SymbolCatalog } from "@/components/dashboard/symbol-catalog";
import { getSession } from "@/lib/auth/session";
import { getGroupedSymbols } from "@/services/http/symbols.service";

export const metadata: Metadata = {
  title: "داشبورد | KhayyamPulse",
  description: "داشبورد عملیاتی پلتفرم تحلیل و سیگنال‌سازی بازار سرمایه.",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const groups = await getGroupedSymbols();

  return (
    <main dir="rtl" className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-graphite-900 dark:text-graphite-50 sm:text-5xl">
          تحلیل سهام
        </h1>
        <p className="text-base text-graphite-600 dark:text-graphite-300">
          دسترسی به مجموعه جامع نمادهای بازار سرمایه و تحلیل‌های فنی
        </p>
      </section>
      <SymbolCatalog groups={groups} activeSymbol={undefined} />
    </main>
  );
}
