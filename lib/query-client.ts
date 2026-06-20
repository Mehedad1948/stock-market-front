import { isServer, QueryClient } from "@tanstack/react-query";

import { ApiClientError } from "@/services/http/errors";

function shouldRetry(failureCount: number, error: Error) {
  if (failureCount >= 2) {
    return false;
  }

  if (error instanceof ApiClientError) {
    return ![400, 401, 403, 404].includes(error.status) && error.status >= 500;
  }

  return true;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false
      },
      queries: {
        refetchOnWindowFocus: true,
        retry: shouldRetry,
        staleTime: 15_000
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
