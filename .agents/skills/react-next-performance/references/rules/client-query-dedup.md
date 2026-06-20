---
title: Deduplicate Client Server State with TanStack Query
impact: MEDIUM-HIGH
impactDescription: shares requests and cached results across consumers
tags: client, tanstack-query, deduplication, data-fetching
---

## Deduplicate Client Server State with TanStack Query

Use the project's shared TanStack Query client and stable query keys instead of fetching the same
server state independently in component effects.

**Incorrect (each component instance fetches independently):**

```tsx
function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    void fetchArticles().then(setArticles);
  }, []);

  return <ArticleItems articles={articles} />;
}
```

**Correct (consumers share the query):**

```tsx
function ArticleList() {
  const { data = [] } = useQuery({
    queryKey: articleKeys.list(),
    queryFn: fetchArticles,
    staleTime: 60_000
  });

  return <ArticleItems articles={data} />;
}
```

Use Server Components instead when the data is read-only, request-independent, and does not need
client refetching or interactive cache updates. Do not duplicate the same server state in Zustand.
