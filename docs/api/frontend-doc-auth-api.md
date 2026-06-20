# Frontend API Doc 1 — Auth API

Frontend reference for authentication/session endpoints.

> Route paths are inferred from controller names. If your backend router uses different paths, update only the paths; the response contracts still come from the uploaded controllers/types.

---

## Base client assumptions

```env
VITE_API_BASE_URL=http://localhost:3000
```

Use a small API wrapper:

```ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, public payload: unknown) {
    super(`API Error ${status}`);
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
    credentials: 'include'
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}
```

If auth uses bearer tokens instead of cookies, adjust `credentials` and headers accordingly.

---

## Shared error handling

Backend `AppError` can include Persian `message` and optional `englishMessage`.

```ts
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object') {
    const payload = error.payload as { message?: string; englishMessage?: string };
    return payload.message ?? payload.englishMessage ?? 'خطای نامشخص رخ داد.';
  }
  return 'خطای نامشخص رخ داد.';
}
```

---

## Types

```ts
export type AuthenticatedUser = {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  telegramUserId: string | null;
  telegramUsername: string | null;
  isActive: boolean;
  trialUsed: boolean;
  lastLoginAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type CurrentAuthResponse = {
  status: 'OK';
  authenticated: boolean;
  user: AuthenticatedUser | null;
  session: {
    id: string;
    expiresAt: string | Date;
    createdAt: string | Date;
  } | null;
};

export type LogoutResponse = {
  status: 'OK';
  loggedOut: true;
};
```

---

## GET current auth

Assumed route:

```http
GET /api/auth/me
```

Controller export: `getCurrentAuth`

Response:

```json
{
  "status": "OK",
  "authenticated": true,
  "user": {},
  "session": {
    "id": "session-id",
    "expiresAt": "2026-07-01T00:00:00.000Z",
    "createdAt": "2026-06-20T00:00:00.000Z"
  }
}
```

Frontend use:

```ts
export function getCurrentAuth() {
  return apiGet<CurrentAuthResponse>('/api/auth/me');
}
```

React Query:

```ts
export function useCurrentAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentAuth,
    staleTime: 60_000,
    retry: false
  });
}
```

UI rule:

```text
authenticated=false → show login/register entry
authenticated=true  → show user menu/logout
```

---

## POST logout

Assumed route:

```http
POST /api/auth/logout
```

Controller export: `logoutCurrentSession`

Requires authenticated user. If session is missing, backend can return 401 with Persian message.

Response:

```json
{
  "status": "OK",
  "loggedOut": true
}
```

Frontend use:

```ts
export function logoutCurrentSession() {
  return apiPost<LogoutResponse>('/api/auth/logout');
}
```

React Query:

```ts
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutCurrentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.clear();
    }
  });
}
```

---

## Frontend pages affected

- App layout/header: call `GET /api/auth/me`.
- User menu: show logout when authenticated.
- Login/signup pages are not documented here because corresponding controller endpoints were not included.

---

## Notes for Codex frontend agent

1. Do not invent login/register endpoints.
2. Only implement current-auth and logout integration from this doc.
3. Keep route path constants centralized so paths can be changed easily if backend router differs.
4. Use `user.displayName ?? user.firstName ?? user.email ?? user.phone` for display fallback.
