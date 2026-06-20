---
title: Use Reviewed Cross-Request Caching
impact: HIGH
impactDescription: avoids repeated public work without leaking request data
tags: server, cache, nextjs, cache-components, cross-request
---

## Use Reviewed Cross-Request Caching

React `cache()` deduplicates work within a server render. For cross-request caching in this
repository, use Next.js Cache Components and the established cache-tag conventions.

**Incorrect (process-local cache with unclear isolation and invalidation):**

```typescript
const cache = new Map<string, Article>();

export async function getArticle(slug: string) {
  if (cache.has(slug)) return cache.get(slug);
  const article = await fetchArticle(slug);
  cache.set(slug, article);
  return article;
}
```

**Correct (framework cache with an explicit tag):**

```typescript
export async function getArticle(slug: string) {
  "use cache";

  cacheTag(CACHE_KEYS.article(slug));
  return fetchArticle(slug);
}
```

Cache only public, request-independent data. Never put cookie-derived, authenticated, personalized,
or permission-dependent values in a cross-request cache. Mutations must invalidate the matching
tag through the project's established service or action flow.
