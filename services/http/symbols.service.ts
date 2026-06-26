import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { CacheKeys } from "@/constants/cache-keys";
import { WebService } from "@/services/http/server-client";
import type {
  CatalogGroup,
  GroupedSymbolsQuery,
  GroupedSymbolsResponse,
  SymbolImportResponse,
} from "@/types/frontend-api.types";

const symbolsWebService = new WebService("/symbols");

function buildSearchParams(query?: GroupedSymbolsQuery): string {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

function normalizeGroupedSymbols(
  groups: GroupedSymbolsResponse["groups"],
): CatalogGroup[] {
  if (Array.isArray(groups)) {
    return groups;
  }

  return Object.values(groups);
}

async function getCachedGroupedSymbols(
  query?: GroupedSymbolsQuery,
): Promise<CatalogGroup[]> {
  "use cache";

  const queryString = buildSearchParams(query);

  cacheLife({
    stale: 30 * 60,
    revalidate: 30 * 60,
    expire: 30 * 60 + 60,
  });
  cacheTag(CacheKeys.symbolCatalog);
  cacheTag(CacheKeys.symbolCatalogByQuery(queryString));

  const response = await symbolsWebService.get<GroupedSymbolsResponse>(
    `/grouped${queryString}`,
    {
      rawResponse: true,
      withAuth: false,
    },
  );

  return normalizeGroupedSymbols(response.groups);
}

export const symbolsService = {
  getGroupedSymbols(query?: GroupedSymbolsQuery) {
    return getCachedGroupedSymbols(query);
  },

  importSymbols() {
    return symbolsWebService.post<SymbolImportResponse>("/import", {
      rawResponse: true,
      withAuth: false,
    });
  },
};

export const getGroupedSymbols = symbolsService.getGroupedSymbols;
export const importSymbols = symbolsService.importSymbols;
