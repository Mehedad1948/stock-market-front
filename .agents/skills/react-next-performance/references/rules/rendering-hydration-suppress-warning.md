---
title: Fix Hydration Mismatches at the Source
impact: LOW-MEDIUM
impactDescription: avoids hidden hydration defects
tags: rendering, hydration, ssr, deterministic
---

## Fix Hydration Mismatches at the Source

Produce deterministic markup. Pass stable timestamps, locale, and timezone inputs from the server;
use React's stable ID facilities; and isolate browser-only values behind a stable initial fallback.

**Incorrect (server and client render at different times):**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>;
}
```

**Correct (the server and client receive the same value):**

```tsx
function Timestamp({ isoDate }: { isoDate: string }) {
  return <time dateTime={isoDate}>{isoDate}</time>;
}
```

Use `suppressHydrationWarning` only for a narrowly documented mismatch that cannot be controlled,
such as browser-extension mutation or a framework-approved root theme attribute. It is an escape
hatch, not a performance optimization.
