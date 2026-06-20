import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import type { Session } from "@/types/auth";

import { decodePendingAuthCookie, decodeSessionCookie } from "./cookie-session";
import { getPendingAuthCookieName, getSessionCookieName } from "./cookies";
import { PERMISSIONS } from "./permissions";

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

function buildDisplayName(identifier: string) {
  return identifier;
}

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName(isProductionRuntime());
  const cookieValue = cookieStore.get(cookieName)?.value;

  if (!cookieValue) {
    return null;
  }

  const parsed = decodeSessionCookie(cookieValue);

  if (!parsed || Date.parse(parsed.expiresAt) <= Date.now()) {
    return null;
  }

  return {
    accountId: parsed.identifier,
    authenticatedAt: parsed.authenticatedAt,
    displayName: buildDisplayName(parsed.identifier),
    expiresAt: parsed.expiresAt,
    identifier: parsed.identifier,
    permissions: Object.values(PERMISSIONS),
    userId: parsed.identifier
  };
});

export async function getBackendAccessToken() {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName(isProductionRuntime());
  const cookieValue = cookieStore.get(cookieName)?.value;

  if (!cookieValue) {
    return null;
  }

  const parsed = decodeSessionCookie(cookieValue);

  if (!parsed || Date.parse(parsed.expiresAt) <= Date.now()) {
    return null;
  }

  return parsed.accessToken;
}

export async function getPendingAuthState() {
  const cookieStore = await cookies();
  const cookieName = getPendingAuthCookieName(isProductionRuntime());
  const cookieValue = cookieStore.get(cookieName)?.value;

  if (!cookieValue) {
    return null;
  }

  const parsed = decodePendingAuthCookie(cookieValue);

  if (!parsed || Date.parse(parsed.expiresAt) <= Date.now()) {
    return null;
  }

  return parsed;
}
