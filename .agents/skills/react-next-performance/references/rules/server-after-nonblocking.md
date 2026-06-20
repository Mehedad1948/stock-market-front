---
title: Use after() for Non-Critical Post-Response Work
impact: MEDIUM
impactDescription: keeps optional work off the response path
tags: server, async, logging, analytics, side-effects
---

## Use after() for Non-Critical Post-Response Work

Use Next.js `after()` for optional work that may safely execute after the response. Keep required
database writes, authorization, financial state changes, cache consistency, and durable audit
events on the main operation path.

```tsx
import { after } from "next/server";

export async function POST(request: Request) {
  const result = await performOperation(request);
  const requestId = result.requestId;

  after(async () => {
    await recordSanitizedPerformanceMetric({
      operation: "example",
      requestId
    });
  });

  return Response.json(result.body);
}
```

Never capture or log cookies, authorization headers, passwords, tokens, email addresses, full
payloads, or other sensitive data in the deferred callback. Remember that `after()` may run after
an error or redirect, so the callback must not assume success unless it receives an explicit
sanitized outcome.

Reference: [Next.js after](https://nextjs.org/docs/app/api-reference/functions/after)
