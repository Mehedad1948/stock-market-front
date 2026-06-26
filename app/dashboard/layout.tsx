import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  params?: Promise<{ symbol?: string }>;
};

function safeDecodeSymbol(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const resolvedParams = params ? await params : undefined;
  const symbol = safeDecodeSymbol(resolvedParams?.symbol);

  return (
    <div className="grid min-h-screen gap-6 lg:grid-cols-[320px_minmax(0,1fr)] bg-gradient-to-br from-graphite-50 to-graphite-100 dark:from-graphite-950 dark:to-graphite-900">
      <DashboardSidebar
        activePath={symbol ? "analysis" : "dashboard"}
        symbol={symbol}
      />
      <div className="min-w-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
