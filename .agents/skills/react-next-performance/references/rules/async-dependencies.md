---
title: Dependency-Aware Parallelization
impact: CRITICAL
impactDescription: starts independent work as early as possible
tags: async, parallelization, dependencies, promises
---

## Dependency-Aware Parallelization

Start each operation as soon as its own dependencies are available. Do not add a dependency solely
to express a promise graph that is clear with native promises.

**Incorrect (profile waits for unrelated config):**

```typescript
const [user, config] = await Promise.all([fetchUser(), fetchConfig()]);
const profile = await fetchProfile(user.id);
```

**Correct (start native promises at the earliest valid point):**

```typescript
const userPromise = fetchUser();
const profilePromise = userPromise.then((user) => fetchProfile(user.id));

const [user, config, profile] = await Promise.all([userPromise, fetchConfig(), profilePromise]);
```

Avoid this pattern when starting work early changes observable behavior, consumes a limited
resource unnecessarily, or makes cancellation and error handling less reliable.
