import { z } from "zod";

const pendingAuthSchema = z.object({
  expiresAt: z.string(),
  identifier: z.string(),
  nextStep: z.enum(["EMAIL_OTP", "SMS_OTP", "GOOGLE_AUTHENTICATORE"])
});

const sessionCookieSchema = z.object({
  accessToken: z.string(),
  authenticatedAt: z.string(),
  expiresAt: z.string(),
  identifier: z.string()
});

export type PendingAuthCookie = z.infer<typeof pendingAuthSchema>;
export type SessionCookie = z.infer<typeof sessionCookieSchema>;

function encodeCookieValue(value: object) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeCookieValue<T>(value: string, schema: z.ZodSchema<T>) {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as unknown;
    return schema.parse(parsed);
  } catch {
    return null;
  }
}

export function encodePendingAuthCookie(value: PendingAuthCookie) {
  return encodeCookieValue(value);
}

export function encodeSessionCookie(value: SessionCookie) {
  return encodeCookieValue(value);
}

export function decodePendingAuthCookie(value: string) {
  return decodeCookieValue(value, pendingAuthSchema);
}

export function decodeSessionCookie(value: string) {
  return decodeCookieValue(value, sessionCookieSchema);
}
