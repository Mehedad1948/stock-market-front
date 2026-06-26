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
    <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="dashboard-app-frame mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1880px] p-3 sm:p-4">
        <div className="min-h-[calc(100vh-3rem)]">
          <DashboardSidebar
            activePath={symbol ? "analysis" : "dashboard"}
            symbol={symbol}
          />
          <div className="min-w-0 rounded-[2rem] bg-transparent p-2 sm:p-3 lg:pr-[132px] lg:pl-4 lg:py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
