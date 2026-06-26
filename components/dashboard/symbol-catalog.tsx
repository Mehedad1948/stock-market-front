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
  ShieldCheck,
  Waves,
} from "lucide-react";

import {
  ResponsiveDrawer,
  ResponsiveDrawerContent,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerTrigger,
} from "@/components/ui/responsive-drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
          className="group flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-graphite-200 bg-white p-4 text-center transition-all duration-300 hover:border-graphite-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-graphite-700 dark:bg-graphite-800 dark:hover:border-graphite-600 dark:hover:shadow-xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-100 text-graphite-700 transition-all group-hover:bg-graphite-200 dark:bg-graphite-700 dark:text-graphite-300 dark:group-hover:bg-graphite-600">
            {renderGroupIcon(groupIconName, "h-6 w-6")}
          </div>
          <div className="space-y-1">
            <div className="line-clamp-2 text-sm font-semibold tracking-tight text-graphite-900 dark:text-graphite-100">
              {group.label}
            </div>
            <div className="text-xs text-graphite-500 dark:text-graphite-400">{group.symbolCount} نماد</div>
          </div>
        </button>
      </ResponsiveDrawerTrigger>

      <ResponsiveDrawerContent dir="rtl" className="p-0 dark:bg-graphite-800">
        <div className="border-b border-graphite-200 px-5 pt-5 pb-4 sm:px-6 sm:pt-6 dark:border-graphite-700 dark:bg-graphite-800">
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-graphite-100 text-graphite-700 dark:bg-graphite-700 dark:text-graphite-300">
                {renderGroupIcon(groupIconName, "h-5 w-5")}
              </span>
              <span className="text-graphite-900 dark:text-graphite-100">{group.label}</span>
            </ResponsiveDrawerTitle>
          </ResponsiveDrawerHeader>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid gap-2">
              {symbols.length ? (
                symbols.map((symbol) => (
                  <Button
                    key={symbol.code}
                    href={symbolPath(symbol)}
                    variant="outline"
                    className={cn(
                      "h-auto w-full items-start justify-start rounded-lg px-4 py-3 text-right transition-all border-graphite-200 text-graphite-700 hover:bg-graphite-50 dark:border-graphite-600 dark:text-graphite-200 dark:hover:bg-graphite-700",
                      activeSymbol === symbol.code
                        ? "bg-graphite-100 border-graphite-300 dark:bg-graphite-700 dark:border-graphite-500"
                        : "",
                    )}
                  >
                    <span className="flex flex-col items-start gap-1">
                      <span className="font-semibold text-sm text-graphite-900 dark:text-graphite-100">{symbol.code}</span>
                      <span className="text-xs text-graphite-600 dark:text-graphite-400">{symbol.label}</span>
                    </span>
                    <span className="text-xs text-graphite-500 dark:text-graphite-400">
                      {symbol.sectorName ?? "بدون گروه"}
                    </span>
                  </Button>
                ))
              ) : (
                <div className="rounded-lg border-2 border-dashed border-graphite-200 px-4 py-8 text-center text-sm text-graphite-500 dark:border-graphite-700 dark:text-graphite-400">
                  نتیجه‌ای پیدا نشد.
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveDrawerContent>
    </ResponsiveDrawer>
  );
}

export function SymbolCatalog({ groups, activeSymbol }: SymbolCatalogProps) {
  const [query, setQuery] = useState("");

  // Search results logic
  const { visibleGroups, matchedSymbols } = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return { visibleGroups: groups, matchedSymbols: [] };
    }

    // Get all symbols with their group info
    const allSymbols = groups.flatMap((group) =>
      flattenSymbols(group).map((symbol) => ({
        ...symbol,
        groupLabel: group.label,
        groupKey: group.key,
      }))
    );

    // Filter symbols that match query
    const matched = allSymbols.filter((symbol) => {
      const symbolText =
        `${symbol.code} ${symbol.label} ${symbol.sectorName ?? ""}`.toLowerCase();
      return symbolText.includes(normalizedQuery);
    });

    // Also return filtered groups for when no symbols match but group name does
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

  // Show search results (matched symbols) when query exists
  if (query.trim()) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Input
            className="h-12 rounded-xl bg-white border-graphite-200 text-graphite-900 placeholder:text-graphite-500 focus:border-graphite-400 focus:ring-graphite-400/20 dark:bg-graphite-800 dark:border-graphite-600 dark:text-graphite-100 dark:placeholder:text-graphite-400 dark:focus:border-graphite-500"
            dir="rtl"
            placeholder="جستجو در گروه‌ها و نمادها"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {matchedSymbols.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold text-graphite-700 dark:text-graphite-300">
                {matchedSymbols.length} نماد یافت شد
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {matchedSymbols.map((symbol) => (
                <Button
                  key={`${symbol.code}-${symbol.groupKey}`}
                  href={symbolPath(symbol)}
                  variant="outline"
                  className={cn(
                    "h-auto w-full items-center justify-between rounded-lg px-4 py-3 text-right transition-all border-graphite-200 text-graphite-700 hover:bg-graphite-50 dark:border-graphite-600 dark:text-graphite-200 dark:hover:bg-graphite-700",
                    activeSymbol === symbol.code
                      ? "bg-graphite-100 border-graphite-300 dark:bg-graphite-700 dark:border-graphite-500"
                      : "",
                  )}
                >
                  <span className="flex grow flex-col items-start gap-1">
                    <span className="font-semibold text-sm text-graphite-900 dark:text-graphite-100">
                      {symbol.code}
                    </span>
                    <span className="text-xs text-graphite-600 dark:text-graphite-400">{symbol.label}</span>
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-graphite-500 dark:text-graphite-400">
                      {symbol.groupLabel}
                    </div>
                    {symbol.sectorName && <div className="text-xs text-graphite-400 dark:text-graphite-500">
                      {symbol.sectorName}
                    </div>}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-graphite-200 bg-graphite-50 px-4 py-12 text-center text-sm text-graphite-500 dark:border-graphite-700 dark:bg-graphite-800 dark:text-graphite-400">
            <p className="font-medium">نتیجه‌ای پیدا نشد</p>
            <p className="text-xs mt-1">لطفاً جستجو خود را تغییر دهید</p>
          </div>
        )}
      </div>
    );
  }

  // Default view: show groups
  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          className="h-12 rounded-xl bg-white border-graphite-200 text-graphite-900 placeholder:text-graphite-500 focus:border-graphite-400 focus:ring-graphite-400/20 dark:bg-graphite-800 dark:border-graphite-600 dark:text-graphite-100 dark:placeholder:text-graphite-400 dark:focus:border-graphite-500"
          dir="rtl"
          placeholder="جستجو در گروه‌ها و نمادها"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {visibleGroups.map((group) => (
          <GroupDrawer
            key={group.key}
            activeSymbol={activeSymbol}
            group={group}
          />
        ))}
      </div>

      {!visibleGroups.length ? (
        <div className="rounded-xl border-2 border-dashed border-graphite-200 bg-graphite-50 px-4 py-12 text-center text-sm text-graphite-500 dark:border-graphite-700 dark:bg-graphite-800 dark:text-graphite-400">
          <p className="font-medium">نتیجه‌ای پیدا نشد</p>
          <p className="text-xs mt-1">لطفاً جستجو خود را تغییر دهید</p>
        </div>
      ) : null}
    </div>
  );
}
