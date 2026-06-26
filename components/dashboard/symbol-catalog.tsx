"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesGantt,
  CircleDollarSign,
  Factory,
  Landmark,
  Search,
  ShieldCheck,
  Waves,
} from "lucide-react";

import {
  DashboardIconFrame,
  DashboardPanel,
} from "@/components/dashboard/dashboard-primitives";
import {
  ResponsiveDrawer,
  ResponsiveDrawerContent,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerTrigger,
} from "@/components/ui/responsive-drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CatalogGroup, CatalogSymbolItem } from "@/types/frontend-api.types";

type SymbolCatalogProps = {
  groups: CatalogGroup[];
  activeSymbol?: string;
};

type GroupIconName =
  | "landmark"
  | "factory"
  | "money"
  | "shield"
  | "chart"
  | "briefcase"
  | "waves"
  | "building"
  | "activity";

function renderGroupIcon(iconName: GroupIconName, className: string) {
  switch (iconName) {
    case "landmark":
      return <Landmark className={className} />;
    case "factory":
      return <Factory className={className} />;
    case "money":
      return <CircleDollarSign className={className} />;
    case "shield":
      return <ShieldCheck className={className} />;
    case "chart":
      return <ChartNoAxesGantt className={className} />;
    case "briefcase":
      return <BriefcaseBusiness className={className} />;
    case "waves":
      return <Waves className={className} />;
    case "building":
      return <Building2 className={className} />;
    default:
      return <Activity className={className} />;
  }
}

function resolveGroupIconName(group: CatalogGroup): GroupIconName {
  const key = `${group.key} ${group.label}`.toLowerCase();

  if (key.includes("bank") || key.includes("finance")) return "landmark";
  if (key.includes("metal") || key.includes("min")) return "factory";
  if (key.includes("petro") || key.includes("energy")) return "money";
  if (key.includes("insurance")) return "shield";
  if (key.includes("tech") || key.includes("it")) return "chart";
  if (key.includes("investment") || key.includes("holding")) return "briefcase";
  if (key.includes("utilities") || key.includes("water")) return "waves";
  if (key.includes("industrial")) return "building";

  return "activity";
}

function flattenSymbols(group: CatalogGroup) {
  return group.symbols ?? group.children?.flatMap((child) => child.symbols) ?? [];
}

function symbolPath(symbol: CatalogSymbolItem) {
  return `/dashboard/${encodeURIComponent(symbol.code)}`;
}

function EmptyState() {
  return (
    <DashboardPanel tone="default" className="py-10 text-center">
      <p className="text-base font-medium">نتیجه‌ای پیدا نشد</p>
      <p className="mt-2 text-sm text-black/52">لطفاً جستجوی خود را تغییر دهید</p>
    </DashboardPanel>
  );
}

function GroupDrawer({
  activeSymbol,
  group,
}: {
  activeSymbol?: string;
  group: CatalogGroup;
}) {
  const groupIconName = resolveGroupIconName(group);
  const symbols = flattenSymbols(group);

  return (
    <ResponsiveDrawer>
      <ResponsiveDrawerTrigger asChild>
        <button
          type="button"
          className="flex cursor-pointer aspect-[1.05] w-full flex-col items-start justify-between rounded-[2rem] border-2 border-amber-100! bg-amber-200 p-5 text-right transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
        >
          <DashboardIconFrame className="h-14 w-14 rounded-[1.35rem] border-[#dfe4d7] bg-white">
            {renderGroupIcon(groupIconName, "h-6 w-6")}
          </DashboardIconFrame>
          <div className="space-y-1">
            <div className="line-clamp-2 text-base font-medium tracking-[-0.04em]">
              {group.label}
            </div>
            <div className="text-sm text-black/48">{group.symbolCount} نماد</div>
          </div>
        </button>
      </ResponsiveDrawerTrigger>

      <ResponsiveDrawerContent dir="rtl" className="border-0 bg-[#f5f5f1] p-0">
        <div className="border-b border-black/6 px-5 py-5 sm:px-6">
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle className="flex items-center gap-3 text-[#17181c]">
              <DashboardIconFrame>
                {renderGroupIcon(groupIconName, "h-5 w-5")}
              </DashboardIconFrame>
              <span className="text-xl font-medium tracking-[-0.04em]">
                {group.label}
              </span>
            </ResponsiveDrawerTitle>
          </ResponsiveDrawerHeader>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 py-4 sm:px-6 sm:pb-6">
          <div className="grid gap-2 overflow-y-auto">
            {symbols.length ? (
              symbols.map((symbol) => (
                <a
                  key={symbol.code}
                  href={symbolPath(symbol)}
                  className={cn(
                    "dashboard-surface flex items-start justify-between gap-3 px-4 py-4 transition-colors hover:bg-[#f1f1eb]",
                    activeSymbol === symbol.code && "border-black/12 bg-[#efefe9]",
                  )}
                >
                  <span className="flex flex-col items-start gap-1">
                    <span className="text-sm font-semibold">{symbol.code}</span>
                    <span className="text-xs text-black/54">{symbol.label}</span>
                  </span>
                  <span className="text-xs text-black/44">
                    {symbol.sectorName ?? "بدون گروه"}
                  </span>
                </a>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </ResponsiveDrawerContent>
    </ResponsiveDrawer>
  );
}

export function SymbolCatalog({ groups, activeSymbol }: SymbolCatalogProps) {
  const [query, setQuery] = useState("");

  const { visibleGroups, matchedSymbols } = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return { visibleGroups: groups, matchedSymbols: [] };
    }

    const allSymbols = groups.flatMap((group) =>
      flattenSymbols(group).map((symbol) => ({
        ...symbol,
        groupLabel: group.label,
        groupKey: group.key,
      })),
    );

    const matched = allSymbols.filter((symbol) => {
      const symbolText =
        `${symbol.code} ${symbol.label} ${symbol.sectorName ?? ""}`.toLowerCase();
      return symbolText.includes(normalizedQuery);
    });

    const visibleGroupsFiltered = groups.filter((group) => {
      const groupText = `${group.label} ${group.key}`.toLowerCase();

      if (groupText.includes(normalizedQuery)) {
        return true;
      }

      return flattenSymbols(group).some((symbol) => {
        const symbolText =
          `${symbol.code} ${symbol.label} ${symbol.sectorName ?? ""}`.toLowerCase();
        return symbolText.includes(normalizedQuery);
      });
    });

    return { visibleGroups: visibleGroupsFiltered, matchedSymbols: matched };
  }, [groups, query]);

  return (
    <div className="space-y-5">
      <label className="flex h-14 items-center gap-3 rounded-full border border-black/8 bg-[#fcfcf9] px-4">
        <Search className="h-4 w-4 text-black/42" />
        <Input
          className="h-full border-0 bg-transparent px-0 text-sm text-[#17181c] shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
          dir="rtl"
          placeholder="جستجو در گروه‌ها و نمادها"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {query.trim() ? (
        matchedSymbols.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {matchedSymbols.map((symbol) => (
              <a
                key={`${symbol.code}-${symbol.groupKey}`}
                href={symbolPath(symbol)}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-[1.6rem] border border-black/8 bg-[#fcfcf9] px-4 py-4 transition-colors hover:bg-[#f3f3ee]",
                  activeSymbol === symbol.code && "border-black/12 bg-[#efefe9]",
                )}
              >
                <span className="flex grow flex-col items-start gap-1">
                  <span className="text-sm font-semibold">{symbol.code}</span>
                  <span className="text-xs text-black/56">{symbol.label}</span>
                </span>
                <div className="text-right text-xs text-black/44">
                  <div>{symbol.groupLabel}</div>
                  {symbol.sectorName ? <div>{symbol.sectorName}</div> : null}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState />
        )
      ) : visibleGroups.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-8">
          {visibleGroups.map((group) => (
            <GroupDrawer
              key={group.key}
              activeSymbol={activeSymbol}
              group={group}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
