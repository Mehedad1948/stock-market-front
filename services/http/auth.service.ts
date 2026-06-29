import "server-only";

import { WebService } from "@/services/http/server-client";
import type {
  CurrentAuthResponse,
  EmailOtpRequest,
  EmailOtpRequestResponse,
  EmailOtpVerifyRequest,
  FederatedAuthResponse,
  GoogleCallbackRequest,
  LogoutResponse,
  TelegramCallbackRequest,
} from "@/types/frontend-api.types";

const authWebService = new WebService("/auth");

export const authService = {
  getCurrentAuth() {
    return authWebService.get<CurrentAuthResponse>("/me", {
      withAuth: false,
    });
  },

  requestEmailOtp(body: EmailOtpRequest) {
    console.log('🚀🚀🚀 body', body);
    
    return authWebService.post<EmailOtpRequestResponse>("/email/request-otp", {
      body,
      rawResponse: true,
      withAuth: false,
    });
  },

  verifyEmailOtp(body: EmailOtpVerifyRequest) {
    return authWebService.post<FederatedAuthResponse>("/email/verify-otp", {
      body,
      rawResponse: true,
      withAuth: false,
    });
  },

  authenticateWithGoogle(body: GoogleCallbackRequest) {
    return authWebService.post<FederatedAuthResponse>("/google/callback", {
      body,
      withAuth: false,
    });
  },

  authenticateWithTelegram(body: TelegramCallbackRequest) {
    return authWebService.post<FederatedAuthResponse>("/telegram/callback", {
      body,
      withAuth: false,
    });
  },

  logoutCurrentSession() {
    return authWebService.post<LogoutResponse>("/logout");
  },
};

export const getCurrentAuth = authService.getCurrentAuth;
export const requestEmailOtp = authService.requestEmailOtp;
export const verifyEmailOtp = authService.verifyEmailOtp;
export const authenticateWithGoogle = authService.authenticateWithGoogle;
export const authenticateWithTelegram = authService.authenticateWithTelegram;
export const logoutCurrentSession = authService.logoutCurrentSession;
