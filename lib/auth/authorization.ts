import "server-only";

import { redirect } from "next/navigation";



import type { Permission } from "./permissions";
import { hasPermission } from "./permissions";
import { getSession } from "./session";


export class RecentAuthenticationRequiredError extends Error {
  constructor() {
    super("Recent authentication is required.");
    this.name = "RecentAuthenticationRequiredError";
  }
}

export function isRecentAuthentication(authenticatedAt: string, maxAgeMs = 10 * 60 * 1000) {
  return Date.now() - Date.parse(authenticatedAt) <= maxAgeMs;
}

export async function requireSession() {
  const session = await getSession();



  return session;
}

export async function requirePermission(permission: Permission, ) {
  const session = await requireSession();

  if (!hasPermission(session.permissions, permission)) {
    redirect(`/unauthorized`);
  }

  return session;
}

export async function requireRecentAuthentication(maxAgeMs = 10 * 60 * 1000) {
  const session = await getSession();

  if (!session || !isRecentAuthentication(session.authenticatedAt, maxAgeMs)) {
    throw new RecentAuthenticationRequiredError();
  }

  return session;
}
