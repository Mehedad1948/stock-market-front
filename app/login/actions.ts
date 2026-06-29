"use server";

import { runTrustedAction } from "@/lib/actions/run-trusted-action";
import {
  clearPersistedSession,
  persistFederatedSession,
} from "@/lib/auth/session";
import { authService } from "@/services/http/auth.service";
import type {
  EmailOtpRequest,
  EmailOtpRequestResponse,
  EmailOtpVerifyRequest,
  FederatedAuthResponse,
  GoogleCallbackRequest,
  LogoutResponse,
  TelegramCallbackRequest,
} from "@/types/frontend-api.types";
import type { ApiActionResult } from "@/types/api";

async function persistAuthResponse(auth: FederatedAuthResponse) {
  await persistFederatedSession(auth);
  return auth;
}

export async function requestEmailOtpAction(
  input: EmailOtpRequest,
): Promise<ApiActionResult<EmailOtpRequestResponse>> {
  console.log('✅✅ requestEmailOtpAction', input);
  
  return runTrustedAction(() => authService.requestEmailOtp(input));
}

export async function verifyEmailOtpAction(
  input: EmailOtpVerifyRequest,
): Promise<ApiActionResult<FederatedAuthResponse>> {
  return runTrustedAction(async () => {
    const auth = await authService.verifyEmailOtp(input);
    return persistAuthResponse(auth);
  });
}

export async function authenticateWithGoogleAction(
  input: GoogleCallbackRequest,
): Promise<ApiActionResult<FederatedAuthResponse>> {
  return runTrustedAction(async () => {
    const auth = await authService.authenticateWithGoogle(input);
    return persistAuthResponse(auth);
  });
}

export async function authenticateWithTelegramAction(
  input: TelegramCallbackRequest,
): Promise<ApiActionResult<FederatedAuthResponse>> {
  return runTrustedAction(async () => {
    const auth = await authService.authenticateWithTelegram(input);
    return persistAuthResponse(auth);
  });
}

export async function logoutAction(): Promise<ApiActionResult<LogoutResponse>> {
  return runTrustedAction(async () => {
    try {
      await authService.logoutCurrentSession();
    } catch {
      // Clear the local session regardless of backend revocation state.
    } finally {
      await clearPersistedSession();
    }

    return {
      loggedOut: true,
      status: "OK",
    };
  });
}
