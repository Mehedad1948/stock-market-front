"use client";

import { useState } from "react";
import {
  ChartSpline,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";

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
    activeFor: "analysis" as const,
    href: "/dashboard",
    icon: ChartSpline,
    label: "نمادها",
  },
];

export function DashboardSidebar({
  activePath,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed right-4 top-4 bottom-4 z-20 hidden flex-col rounded-[2rem] bg-[#191a1f] p-4 text-white transition-[width] duration-200 lg:flex",
        collapsed ? "w-[88px]" : "w-full lg:w-[128px]",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] border border-white/12 bg-white/6">
          <Sparkles className="h-7 w-7" />
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const active = item.activeFor !== null && item.activeFor === activePath;

          return (
            <a
              key={item.label}
              href={item.href}
              title={item.label}
              className={cn(
                "flex h-14 items-center overflow-hidden rounded-[1.35rem] px-4 text-sm transition",
                active
                  ? "bg-white/14 text-white"
                  : "text-white/68 hover:bg-white/8 hover:text-white",
                collapsed ? "justify-center" : "gap-3",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-150",
                  collapsed ? "w-0 opacity-0" : "opacity-100",
                )}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="space-y-3">
        <a
          href="/logout"
          title="خروج"
          className={cn(
            "flex h-14 items-center rounded-[1.35rem] px-4 text-sm transition",
            "bg-[#3a2025] text-[#ffb7c1] hover:bg-[#4a262d]",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-opacity duration-150",
              collapsed ? "w-0 opacity-0" : "opacity-100",
            )}
          >
            خروج
          </span>
        </a>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="flex w-full h-14 items-center justify-center rounded-[1.35rem] bg-white/10 text-white/80 transition hover:bg-white/16"
          aria-label={collapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
