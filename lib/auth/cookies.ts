export const DEVELOPMENT_SESSION_COOKIE = "goldon-session";
export const PRODUCTION_SESSION_COOKIE = "__Host-goldon-session";
export const DEVELOPMENT_PENDING_AUTH_COOKIE = "goldon-pending-auth";
export const PRODUCTION_PENDING_AUTH_COOKIE = "__Host-goldon-pending-auth";

export function getSessionCookieName(isProduction: boolean) {
  return isProduction ? PRODUCTION_SESSION_COOKIE : DEVELOPMENT_SESSION_COOKIE;
}

export function getPendingAuthCookieName(isProduction: boolean) {
  return isProduction ? PRODUCTION_PENDING_AUTH_COOKIE : DEVELOPMENT_PENDING_AUTH_COOKIE;
}
