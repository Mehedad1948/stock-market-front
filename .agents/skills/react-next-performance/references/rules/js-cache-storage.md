---
title: Minimize Browser Storage Reads Safely
impact: LOW-MEDIUM
impactDescription: avoids repeated synchronous storage work
tags: javascript, localStorage, storage, caching, performance
---

## Minimize Browser Storage Reads Safely

Browser storage APIs are synchronous. Minimize repeated reads in demonstrated hot paths, while
keeping cached values synchronized with writes and cross-tab storage events.

Do not:

- Read authentication cookies directly.
- Cache sensitive values in module state.
- Assume an in-memory value remains correct after another tab updates storage.
- Add a storage abstraction to optimize a path that has not been measured.

Prefer the repository's Zustand persistence pattern for harmless preferences and the cookie helper
for approved client-readable cookies. A stale cache is worse than a storage read when correctness
depends on current data.
