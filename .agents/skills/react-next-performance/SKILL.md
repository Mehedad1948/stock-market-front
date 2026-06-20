---
name: react-next-performance
description: Review, write, or refactor React 19 and Next.js 16 code for measurable rendering, data-fetching, hydration, bundle, and server performance. Use for React components, App Router pages and layouts, Server or Client Components, route handlers, server actions, bundle analysis, waterfalls, rerenders, and performance-focused code review. Do not trigger for content-only edits or unrelated backend work.
---

# React and Next.js Performance

Apply performance guidance without overriding repository architecture, security, accessibility, or
correctness rules.

## Workflow

1. Read the root `AGENTS.md` and inspect the affected code, dependencies, and Next.js configuration.
2. Identify the actual performance surface: async waterfall, bundle size, server work, client data,
   rerendering, hydration, rendering, or a JavaScript hot path.
3. Search `references/rules` by filename, title, or tags and read only the relevant rule files.
4. Confirm that each recommendation matches the installed React and Next.js versions and the
   project's existing libraries.
5. Prefer structural improvements over speculative memoization or micro-optimization.
6. Preserve behavior and run the narrowest relevant validation. Use profiling or bundle evidence
   when claiming a meaningful performance improvement.

Example reference discovery:

```powershell
rg -l "waterfall|Suspense|parallel" .agents/skills/react-next-performance/references/rules
rg -l "hydration|serialization" .agents/skills/react-next-performance/references/rules
```

## Priority Order

Use this order unless measurements show a different bottleneck:

1. Eliminate avoidable async waterfalls (`async-*`).
2. Reduce client bundle and defer non-critical code (`bundle-*`).
3. Improve Server Component and route-handler work (`server-*`).
4. Deduplicate client server-state requests (`client-*`).
5. Reduce expensive rerenders (`rerender-*`).
6. Fix rendering and hydration costs (`rendering-*`).
7. Apply JavaScript micro-optimizations only to demonstrated hot paths (`js-*`).
8. Use advanced hook patterns only when simpler code is insufficient (`advanced-*`).

## Project Adaptations

- TanStack Query is the approved client server-state library. Do not introduce SWR.
- Prefer Server Components and direct `WebServices` calls for request-independent server data.
- Cache Components are enabled. Use the repository's `"use cache"`, `cacheTag`, and `CACHE_KEYS`
  conventions only for request-independent data.
- Never cache authenticated or request-specific data across users.
- Do not add process-local LRU caches for application data without a reviewed invalidation and
  deployment-consistency design.
- Use `Suspense` to preserve streaming and partial prerendering where the execution path permits it.
- Keep Client Component boundaries small and serialize only data required by the client island.
- Use `@gold-on/fontend-common-package` component subpaths where practical. Preserve root imports
  when the package API or project convention makes them clearer.
- Keep `lucide-react` imports supported by the package typings and existing Next.js optimization.
  Do not use undocumented deep paths.
- Do not use inline scripts, `dangerouslySetInnerHTML`, or `suppressHydrationWarning` as a routine
  hydration fix. Produce deterministic server and client markup first.
- Browser storage is for non-sensitive preferences only. Follow the repository cookie helpers and
  never move authentication data into browser storage.
- Repository-specific architecture and validation rules take precedence over any reference rule.

## Review Standard

For performance reviews, report findings in severity order with file and line references. Explain
the observed cost, the conditions under which it occurs, and the smallest reliable fix. Do not
present theoretical micro-optimizations as defects without evidence that the code is on a hot path.

For implementation tasks, make the change and verify it. Do not stop after listing possible
optimizations.

## Attribution

The reference rules were adapted from the Vercel Engineering React Best Practices skill, version
1.0.0 (January 2026). Project-specific adaptations in this repository take precedence.
