import "server-only";

import { getBackendAccessToken } from "./session";

export async function getBackendAuthorizationHeader(): Promise<string | null> {
  const accessToken = await getBackendAccessToken();

  return accessToken ? `Bearer ${accessToken}` : null;
}
