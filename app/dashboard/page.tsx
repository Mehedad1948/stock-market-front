import type { Metadata } from "next";
import { Suspense } from "react";
import { Search, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { SymbolCatalog } from "@/components/dashboard/symbol-catalog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth/session";
import { getGroupedSymbols } from "@/services/http/symbols.service";

export const metadata: Metadata = {
  title: "داشبورد | KhayyamPulse",
  description: "داشبورد تحلیل نمادها و گروه‌های بازار سرمایه.",
};

async function DashboardCatalogSection() {
  const groups = await getGroupedSymbols();

  return <SymbolCatalog groups={groups} activeSymbol={undefined} />;
}

function CatalogSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 rounded-full bg-black/6" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-[1.02] rounded-[2rem] bg-black/6"
          />
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main dir="rtl" className="space-y-4 text-[#17181c]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="dashboard" className="h-12 px-4 text-sm font-medium">
            <Search className="h-4 w-4" />
            جستجوی بازار
          </Badge>
          <Badge
            variant="dashboard-highlight"
            className="h-12 px-4 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            تحلیل نمادها
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="dashboard-dark" className="h-12 px-5 text-sm font-medium">
          گروه‌ها
        </Badge>
        <Badge variant="dashboard" className="h-12 px-5 text-sm font-medium">
          نمادها
        </Badge>
      </div>

      <Suspense fallback={<CatalogSkeleton />}>
        <DashboardCatalogSection />
      </Suspense>
    </main>
  );
}
