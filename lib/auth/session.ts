import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { env } from "@/env";
import type {
  AuthenticatedUser,
  CurrentAuthResponse,
  FederatedAuthResponse,
} from "@/types/frontend-api.types";
import type { Session } from "@/types/auth";

import { decodeSessionCookie, encodeSessionCookie } from "./cookie-session";
import { getSessionCookieName } from "./cookies";
import { PERMISSIONS } from "./permissions";

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

function buildDisplayName(user: AuthenticatedUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  if (user.displayName) {
    return user.displayName;
  }

  if (fullName) {
    return fullName;
  }

  if (user.email) {
    return user.email;
  }

  if (user.phone) {
    return user.phone;
  }

  return user.id;
}

async function getSessionCookieValue() {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName(isProductionRuntime());

  return cookieStore.get(cookieName)?.value ?? null;
}

async function setSessionCookie(value: {
  accessToken: string;
  authenticatedAt: string;
  expiresAt: string | null;
  identifier: string;
}) {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName(isProductionRuntime());

  cookieStore.set(cookieName, encodeSessionCookie(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProductionRuntime(),
    path: "/",
    ...(value.expiresAt ? { expires: new Date(value.expiresAt) } : {}),
  });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName(isProductionRuntime());

  cookieStore.delete(cookieName);
}

async function fetchCurrentAuth(
  accessToken: string,
): Promise<CurrentAuthResponse | null> {
  const response = await fetch(new URL("/api/auth/me", env.BACKEND_API_URL), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json().catch(() => null)) as unknown;

  if (
    !payload ||
    typeof payload !== "object" ||
    !("status" in payload) ||
    (payload as { status?: unknown }).status !== "OK"
  ) {
    return null;
  }

  return payload as CurrentAuthResponse;
}

function buildSessionFromAuth(
  auth: CurrentAuthResponse,
  fallbackAuthenticatedAt: string,
): Session {
  const user = auth.user as AuthenticatedUser;
  const session = auth.session;

  return {
    accountId: user.id,
    authenticatedAt: session?.createdAt ?? fallbackAuthenticatedAt,
    displayName: buildDisplayName(user),
    expiresAt: session?.expiresAt ?? null,
    identifier: user.id,
    permissions: Object.values(PERMISSIONS),
    session,
    user,
    userId: user.id,
  };
}

export async function persistFederatedSession(
  auth: FederatedAuthResponse,
) {
  const authenticatedAt = auth.session?.createdAt ?? new Date().toISOString();
  const expiresAt = auth.session?.expiresAt ?? null;

  await setSessionCookie({
    accessToken: auth.token,
    authenticatedAt,
    expiresAt,
    identifier: auth.user.id,
  });
}

export async function clearPersistedSession() {
  await clearSessionCookie();
}

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieValue = await getSessionCookieValue();

  if (!cookieValue) {
    return null;
  }

  const parsed = decodeSessionCookie(cookieValue);

  if (!parsed) {
    await clearSessionCookie();
    return null;
  }

  if (parsed.expiresAt && Date.parse(parsed.expiresAt) <= Date.now()) {
    await clearSessionCookie();
    return null;
  }

  const currentAuth = await fetchCurrentAuth(parsed.accessToken);

  if (!currentAuth?.authenticated || !currentAuth.user) {
    await clearSessionCookie();
    return null;
  }

  return buildSessionFromAuth(
    currentAuth,
    parsed.authenticatedAt,
  );
});

export async function getBackendAccessToken() {
  const cookieValue = await getSessionCookieValue();

  if (!cookieValue) {
    return null;
  }

  const parsed = decodeSessionCookie(cookieValue);

  if (!parsed) {
    await clearSessionCookie();
    return null;
  }

  if (parsed.expiresAt && Date.parse(parsed.expiresAt) <= Date.now()) {
    await clearSessionCookie();
    return null;
  }

  return parsed.accessToken;
}
