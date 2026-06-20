---
title: Initialize Browser Infrastructure Deliberately
impact: LOW-MEDIUM
impactDescription: avoids duplicate initialization during remounts
tags: initialization, useEffect, app-startup, side-effects
---

## Initialize Browser Infrastructure Deliberately

Do not put app-wide browser infrastructure initialization in an arbitrary component effect.
Components can remount and development checks may run effects more than once.

Prefer an existing provider with idempotent setup and cleanup. A module-level guard is acceptable
only for non-sensitive browser infrastructure whose lifetime is intentionally the current page
load.

```tsx
let isMonitoringInitialized = false;

export function MonitoringProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (isMonitoringInitialized) return;
    isMonitoringInitialized = true;
    initializeMonitoring();
  }, []);

  return children;
}
```

Do not use this pattern for authentication, request state, user data, server initialization, or
anything that must reset when the active session changes. Initialization should be safe if invoked
more than once whenever possible.

Reference: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
