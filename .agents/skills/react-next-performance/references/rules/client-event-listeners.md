---
title: Deduplicate Global Event Subscriptions
impact: MEDIUM
impactDescription: one listener shared across component instances
tags: client, event-listeners, subscription, hooks
---

## Deduplicate Global Event Subscriptions

Do not register the same global event listener independently in every component instance. Prefer a
single provider, an existing shared hook, or `useSyncExternalStore` for a real external store.

**Incorrect (one listener per component instance):**

```tsx
function Component() {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => handleKey(event.key);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return <div>...</div>;
}
```

**Correct (one provider-owned listener):**

```tsx
const LastKeyContext = createContext<string | null>(null);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [lastKey, setLastKey] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => setLastKey(event.key);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return <LastKeyContext value={lastKey}>{children}</LastKeyContext>;
}
```

Keep the provider as low in the tree as practical. For event-specific state with more complex
subscription semantics, implement a small external store with `useSyncExternalStore`.
