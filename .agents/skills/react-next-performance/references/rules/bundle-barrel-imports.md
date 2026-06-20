---
title: Avoid Expensive Barrel Imports
impact: CRITICAL
impactDescription: reduces module loading and broad bundle traces
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## Avoid Expensive Barrel Imports

Avoid broad third-party barrel imports when they cause measurable module-loading or bundle cost.
Do not bypass a package's documented exports or conflict with repository-required local index
files merely to remove every barrel import.

**Prefer a documented component subpath when the package provides one:**

```tsx
import { Button } from "@gold-on/fontend-common-package/components/button";
```

**Keep a supported root import when Next.js optimizes it:**

```tsx
import { Menu, Search, X } from "lucide-react";
```

Before changing imports, inspect the package `exports`, TypeScript declarations, current
`optimizePackageImports` behavior, and a bundle or build trace. Never use undocumented Lucide deep
paths that lose type declarations.

Reference: [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
