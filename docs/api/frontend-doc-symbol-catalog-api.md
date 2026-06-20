# Frontend API Doc 2 — Symbol Catalog API

Frontend reference for grouped symbol listing, symbol search, and manual symbol import.

> Route paths are inferred from controller names. If your backend router uses different paths, update only the paths; the response contracts still come from the uploaded controllers/types.

---

## Purpose

The symbol catalog is the frontend entry point for choosing a market symbol. It does not run analysis. After the user picks a symbol, navigate to the stock analysis page and call the stock analysis endpoint.

Recommended frontend routes:

```text
/symbols
/analysis/:symbol
```

---

## Types

```ts
export type InstrumentType = 'STOCK' | 'ETF' | 'RIGHT' | 'BOND' | 'UNKNOWN';
export type SymbolGroupingMode = 'macro' | 'official';

export type CatalogSymbolItem = {
  code: string;
  label: string;
  isin: string | null;
  sectorId: string | null;
  sectorName: string | null;
  displaySector: string | null;
  instrumentType: InstrumentType;
  marketGroupKey?: string;
  marketGroupLabel?: string;
  marketGroupIcon?: string;
  baseCode?: string;
  isDuplicateBoard?: boolean;
};

export type CatalogChildGroup = {
  key: string;
  sectorId: string | null;
  label: string;
  displayLabel: string;
  symbolCount: number;
  symbols: CatalogSymbolItem[];
};

export type CatalogGroup = {
  key: string;
  label: string;
  symbolCount: number;
  icon?: string;
  sortOrder?: number;
  children?: CatalogChildGroup[];
  symbols?: CatalogSymbolItem[];
};

export type GroupedCatalogResponse = {
  status: 'OK';
  grouping: SymbolGroupingMode;
  updatedAt: string | null;
  groups: CatalogGroup[] | Record<string, CatalogGroup>;
};
```

---

## GET grouped symbols

Assumed route:

```http
GET /api/symbols/grouped
```

Controller export: `getGroupedSymbols`

Query params:

```ts
export type GroupedSymbolsQuery = {
  grouping?: 'macro' | 'official'; // default: macro
  hideDuplicateBoards?: boolean;   // default: true
  includeInactive?: boolean;       // default: false
  includeTypes?: string;           // comma-separated STOCK,ETF,RIGHT,BOND,UNKNOWN
  search?: string;
  format?: 'array' | 'object';     // default: array
};
```

Examples:

```http
GET /api/symbols/grouped
GET /api/symbols/grouped?grouping=macro
GET /api/symbols/grouped?grouping=official
GET /api/symbols/grouped?includeTypes=STOCK,ETF
GET /api/symbols/grouped?search=خودرو
GET /api/symbols/grouped?hideDuplicateBoards=false
GET /api/symbols/grouped?format=object
```

### Grouping modes

`grouping=macro` is the default and should be used for normal users. It returns broader EasyTrader-like categories such as:

```text
بانکی، شیمیایی، خودرویی، فلزات، سیمان، دارویی، بیمه، ساختمان، ETF
```

`grouping=official` keeps the narrower official BRS/TSETMC sector grouping.

### Duplicate board hiding

The backend defaults to `hideDuplicateBoards=true`, so duplicate board variants like symbols ending in `2` or `3` can be hidden if a base symbol exists. This gives a cleaner UX.

---

## Frontend API helper

```ts
export async function getGroupedSymbols(params?: {
  grouping?: SymbolGroupingMode;
  hideDuplicateBoards?: boolean;
  includeInactive?: boolean;
  includeTypes?: InstrumentType[];
  search?: string;
  format?: 'array' | 'object';
}) {
  const search = new URLSearchParams();

  if (params?.grouping) search.set('grouping', params.grouping);
  if (params?.hideDuplicateBoards !== undefined) {
    search.set('hideDuplicateBoards', String(params.hideDuplicateBoards));
  }
  if (params?.includeInactive !== undefined) {
    search.set('includeInactive', String(params.includeInactive));
  }
  if (params?.includeTypes?.length) {
    search.set('includeTypes', params.includeTypes.join(','));
  }
  if (params?.search) search.set('search', params.search);
  if (params?.format) search.set('format', params.format);

  const qs = search.toString();
  return apiGet<GroupedCatalogResponse>(`/api/symbols/grouped${qs ? `?${qs}` : ''}`);
}
```

React Query:

```ts
export function useGroupedSymbols(params?: {
  grouping?: SymbolGroupingMode;
  hideDuplicateBoards?: boolean;
  includeTypes?: InstrumentType[];
  search?: string;
}) {
  return useQuery({
    queryKey: ['symbols', 'grouped', params],
    queryFn: () => getGroupedSymbols(params),
    staleTime: 24 * 60 * 60 * 1000
  });
}
```

---

## Rendering macro groups

The backend can return `groups` as array or object. Prefer requesting `format=array` for easier rendering.

```tsx
function SymbolGroups({ groups }: { groups: CatalogGroup[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {groups.map((group) => (
        <button key={group.key}>
          <span>{group.label}</span>
          <span>{group.symbolCount}</span>
        </button>
      ))}
    </div>
  );
}
```

When a group is selected, render `group.symbols`. If a group has `children`, render child groups first or flatten children.

Suggested behavior:

```text
macro mode: show group cards, then list symbols in chosen group.
official mode: show exact sector groups for advanced filtering.
```

---

## Search symbols

Assumed route:

```http
GET /api/symbols/search?q=خودرو
```

Controller export: `searchSymbols`

Response:

```ts
export type SymbolSearchResponse = {
  status: 'OK';
  query: string;
  results: CatalogSymbolItem[];
};
```

Frontend helper:

```ts
export function searchSymbols(q: string) {
  return apiGet<SymbolSearchResponse>(`/api/symbols/search?q=${encodeURIComponent(q)}`);
}
```

Use this for server-side search. For small catalogs, frontend can also search locally after loading grouped symbols.

---

## Import symbols

Assumed route:

```http
POST /api/symbols/import
```

Controller export: `importSymbols`

This endpoint manually imports symbols from BRS into the backend database. Normal users do not need it.

Response:

```ts
export type SymbolImportResponse = {
  status: 'OK';
  source: 'brsapi';
  importedAt: string;
  summary: {
    fetched: number;
    upserted: number;
    stocks: number;
    etfs: number;
    rights: number;
    bonds: number;
    unknown: number;
    deactivated: number;
    sectors: number;
  };
};
```

Frontend recommendation:

```text
Do not expose this in normal public UI.
Optional: add a dev/admin-only button later.
```

---

## Navigation to analysis

When user clicks a symbol:

```ts
navigate(`/analysis/${encodeURIComponent(symbol.code)}`);
```

On the analysis page, decode/display the route param and call the Stock Analysis API.

---

## Notes for Codex frontend agent

1. Use `grouping=macro` by default.
2. Use `hideDuplicateBoards=true` by default.
3. Use `group.label` as visible category name.
4. Use `group.icon` as icon key if present; map it to frontend icon components.
5. Use `symbol.code` for API calls.
6. Use `symbol.label` for display.
7. Keep official sector details available in symbol detail cards.
8. Do not run analysis from the catalog page until user clicks a symbol.
