---
title: Keep Initial Hydration Deterministic
impact: MEDIUM
impactDescription: avoids visual flicker and hydration errors
tags: rendering, ssr, hydration, deterministic, flicker
---

## Keep Initial Hydration Deterministic

Render the same initial markup on the server and client. Derive request-visible preferences from a
server-readable cookie or render a stable fallback until browser-only state is available.

**Incorrect (reads browser storage during server rendering):**

```tsx
function Preference() {
  const preference = localStorage.getItem("display-preference");
  return <PreferenceView value={preference} />;
}
```

**Correct (stable initial output with browser behavior isolated):**

```tsx
function ClientPreference() {
  const [preference, setPreference] = useState<string | null>(null);

  useEffect(() => {
    setPreference(localStorage.getItem("display-preference"));
  }, []);

  return <PreferenceView value={preference} />;
}
```

For themes, use the repository's existing theme provider and server-compatible setup. Do not inject
an inline script or use `dangerouslySetInnerHTML` without a reviewed CSP nonce and a demonstrated
need. Authentication state must come from the server, not browser storage.
