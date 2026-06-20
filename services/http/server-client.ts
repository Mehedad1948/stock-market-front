import "server-only";

import { getBackendAccessToken } from "@/lib/auth/session";
import { env } from "@/env";
import {
  backendEnvelopeToApiError,
  createApiError,
  isBackendApiErrorEnvelope,
  isBackendApiSuccessEnvelope
} from "@/lib/api/api-errors";

interface ServerRequestOptions extends Omit<RequestInit, "body"> {
  accessToken?: string;
  body?: unknown;
  requestId?: string;
  timeoutMs?: number;
  withAuth?: boolean;
}

type ServiceRequestOptions = Omit<ServerRequestOptions, "method">;

async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function joinBackendUrl(path: `/${string}`): URL {
  const baseUrl = env.BACKEND_API_URL.endsWith("/")
    ? env.BACKEND_API_URL
    : `${env.BACKEND_API_URL}/`;

  return new URL(path.replace(/^\/+/, ""), baseUrl);
}

async function resolveAccessToken(options: {
  accessToken?: string | undefined;
  requestId: string;
  withAuth: boolean;
}): Promise<string | null> {
  if (!options.withAuth) {
    return null;
  }

  const accessToken = options.accessToken ?? (await getBackendAccessToken());

  if (!accessToken) {
    throw createApiError({
      code: "AUTH_REQUIRED",
      message: "Authentication is required.",
      requestId: options.requestId,
      status: 401
    });
  }

  return accessToken;
}

export async function serverRequest<TData>(
  path: `/${string}`,
  options: ServerRequestOptions = {}
): Promise<TData> {
  const {
    accessToken: providedAccessToken,
    body,
    requestId: providedRequestId,
    timeoutMs: providedTimeoutMs,
    withAuth = true,
    ...fetchOptions
  } = options;

  const requestId = providedRequestId ?? crypto.randomUUID();
  const timeoutMs = providedTimeoutMs ?? 8_000;
  const accessToken = await resolveAccessToken({
    accessToken: providedAccessToken ,
    requestId ,
    withAuth
  });

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Request-ID", requestId);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const requestOptions: RequestInit = {
    ...fetchOptions,
    cache: "no-store",
    headers,
    signal: AbortSignal.timeout(timeoutMs)
  };

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(joinBackendUrl(path), requestOptions);
  const payload = await readJson(response);

  if (!response.ok) {
    if (isBackendApiErrorEnvelope(payload)) {
      throw backendEnvelopeToApiError(payload, requestId);
    }

    throw createApiError({
      code: "BACKEND_REQUEST_FAILED",
      message: "Backend request failed.",
      requestId,
      status: response.status
    });
  }

  if (!isBackendApiSuccessEnvelope<TData>(payload)) {
    throw createApiError({
      code: "BACKEND_RESPONSE_INVALID",
      message: "Backend response was invalid.",
      requestId,
      status: 502
    });
  }

  return payload.data;
}

export class WebService {
  constructor(private readonly basePath: `/${string}`) {}

  delete<TData>(path: `/${string}`, options?: ServiceRequestOptions): Promise<TData> {
    return this.request<TData>(path, {
      ...options,
      method: "DELETE"
    });
  }

  get<TData>(path: `/${string}`, options?: ServiceRequestOptions): Promise<TData> {
    return this.request<TData>(path, {
      ...options,
      method: "GET"
    });
  }

  post<TData>(path: `/${string}`, options?: ServiceRequestOptions): Promise<TData> {
    return this.request<TData>(path, {
      ...options,
      method: "POST"
    });
  }

  put<TData>(path: `/${string}`, options?: ServiceRequestOptions): Promise<TData> {
    return this.request<TData>(path, {
      ...options,
      method: "PUT"
    });
  }

  private request<TData>(
    path: `/${string}`,
    options: ServerRequestOptions
  ): Promise<TData> {
    return serverRequest<TData>(this.buildPath(path), options);
  }

  private buildPath(path: `/${string}`): `/${string}` {
    return `${this.basePath}${path}` as `/${string}`;
  }
}

