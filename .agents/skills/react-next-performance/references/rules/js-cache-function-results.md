---
title: Cache Expensive Pure Function Results
impact: MEDIUM
impactDescription: avoids repeated deterministic computation
tags: javascript, cache, memoization, performance
---

## Cache Expensive Pure Function Results

Cache repeated pure computations only after showing that they are meaningful on a hot path. The
cache key must fully describe the result, and the cache must have bounded growth or a lifecycle
that naturally releases it.

**Incorrect (repeats an expensive pure transformation):**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return projects.map((project) => ({
    ...project,
    searchIndex: buildSearchIndex(project)
  }));
}
```

**Correct (memoize at an appropriate ownership boundary):**

```typescript
const buildProjectIndex = cache((project: Project) => buildSearchIndex(project));

function ProjectList({ projects }: { projects: Project[] }) {
  return projects.map((project) => ({
    ...project,
    searchIndex: buildProjectIndex(project)
  }));
}
```

Choose React `cache`, `useMemo`, a bounded cache, or precomputation according to the runtime and
lifetime. Never cache authentication state, cookie-derived values, mutable server responses, or
customer-specific data in module scope.
