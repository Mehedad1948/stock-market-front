import { ArrowLeftRight, ChartSpline, LayoutDashboard } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  activePath: "dashboard" | "analysis";
  symbol?: string;
};

const navItems = [
  {
    activeFor: "dashboard" as const,
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "داشبورد",
  },
  {
    activeFor: "dashboard" as const,
    href: "/dashboard",
    icon: ChartSpline,
    label: "گروه‌های نماد",
  },
  {
    activeFor: null,
    href: "/logout",
    icon: ArrowLeftRight,
    label: "خروج",
  },
];

export function DashboardSidebar({
  activePath,
  symbol,
}: DashboardSidebarProps) {
  return (
    <aside className="border-black/8 bg-white/88 px-4 py-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.45)] backdrop-blur lg:min-h-screen lg:border-r">
      <div className="space-y-5 lg:sticky lg:top-0">
        <Card className="border-black/8 bg-[#2d2b37] text-white shadow-none">
          <CardHeader className="space-y-2 p-5">
            <CardTitle className="text-xl">خیام پاس</CardTitle>
            <p className="text-sm text-white/70">stock analysis platform</p>
            {symbol ? (
              <div className="inline-flex w-fit rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-white/88">
                {symbol}
              </div>
            ) : null}
          </CardHeader>
        </Card>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = item.activeFor !== null && item.activeFor === activePath;

            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                  active
                    ? "border-black/10 bg-[#111827] text-white shadow-sm"
                    : "border-black/8 bg-white text-black/72 hover:border-black/15 hover:bg-slate-50",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
