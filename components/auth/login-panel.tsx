"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  LoaderCircle,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";

import {
  authenticateWithGoogleAction,
  authenticateWithTelegramAction,
  requestEmailOtpAction,
  verifyEmailOtpAction,
} from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { unwrapActionResult } from "@/lib/actions/unwrap-action-result";
import { cn } from "@/lib/utils";
import type {
  EmailOtpRequest,
  EmailOtpRequestResponse,
  EmailOtpVerifyRequest,
  GoogleCallbackRequest,
  TelegramCallbackRequest,
} from "@/types/frontend-api.types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void | Promise<void>;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          cancel: () => void;
        };
      };
    };
    onTelegramAuth?: (user: TelegramCallbackRequest) => void;
  }
}

type LoginPanelProps = {
  googleClientId: string | null;
  telegramBotUsername: string | null;
};

const DASHBOARD_PATH = "/dashboard";

function providerErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "خطا در ورود.";
}

function formatOtpExpiry(expiresAt: string) {
  const date = new Date(expiresAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function BrandMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.45)]">
      <Image alt="" aria-hidden src="/window.svg" width={22} height={22} />
    </div>
  );
}

function SocialDivider() {
  return (
    <div className="flex items-center gap-4 py-2 text-xs text-black/35">
      <span className="h-px flex-1 bg-black/10" />
      <span>یا</span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

export function LoginPanel({
  googleClientId,
  telegramBotUsername,
}: LoginPanelProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const telegramButtonRef = useRef<HTMLDivElement>(null);
  const [googleScriptReady, setGoogleScriptReady] = useState(
    () =>
      typeof window !== "undefined" && Boolean(window.google?.accounts.id),
  );
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailOtpMeta, setEmailOtpMeta] =
    useState<EmailOtpRequestResponse | null>(null);
  const [googleMounted, setGoogleMounted] = useState(false);
  const [telegramMounted, setTelegramMounted] = useState(false);

  const handleAuthSuccess = async () => {
    queryClient.clear();
    router.replace(DASHBOARD_PATH);
    router.refresh();
  };

  const emailOtpRequestMutation = useMutation({
    mutationFn: (input: EmailOtpRequest) =>
      unwrapActionResult(requestEmailOtpAction(input)),
    onSuccess: (response) => {
      setEmail(response.email);
      setEmailCode("");
      setEmailOtpMeta(response);
    },
  });

  const emailOtpVerifyMutation = useMutation({
    mutationFn: (input: EmailOtpVerifyRequest) =>
      unwrapActionResult(verifyEmailOtpAction(input)),
    onSuccess: handleAuthSuccess,
  });

  const googleMutation = useMutation({
    mutationFn: (input: GoogleCallbackRequest) =>
      unwrapActionResult(authenticateWithGoogleAction(input)),
    onSuccess: handleAuthSuccess,
  });

  const telegramMutation = useMutation({
    mutationFn: (input: TelegramCallbackRequest) =>
      unwrapActionResult(authenticateWithTelegramAction(input)),
    onSuccess: handleAuthSuccess,
  });

  const requestEmailOtp = emailOtpRequestMutation.mutate;
  const verifyEmailOtp = emailOtpVerifyMutation.mutate;
  const googleLogin = googleMutation.mutate;
  const telegramLogin = telegramMutation.mutate;

  const handleEmailRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    requestEmailOtp({ email: normalizedEmail });
  };

  const handleEmailVerifySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailOtpMeta) {
      return;
    }

    verifyEmailOtp({
      code: emailCode.trim(),
      email: emailOtpMeta.email,
    });
  };

  const handleEditEmail = () => {
    setEmailCode("");
    setEmailOtpMeta(null);
    emailOtpRequestMutation.reset();
    emailOtpVerifyMutation.reset();
  };

  const emailRequestError = emailOtpRequestMutation.error
    ? providerErrorMessage(emailOtpRequestMutation.error)
    : null;
  const emailVerifyError = emailOtpVerifyMutation.error
    ? providerErrorMessage(emailOtpVerifyMutation.error)
    : null;
  const googleError = googleMutation.error
    ? providerErrorMessage(googleMutation.error)
    : null;
  const telegramError = telegramMutation.error
    ? providerErrorMessage(telegramMutation.error)
    : null;

  const emailPending =
    emailOtpRequestMutation.isPending || emailOtpVerifyMutation.isPending;
  const otpExpiresAtLabel = useMemo(
    () => (emailOtpMeta ? formatOtpExpiry(emailOtpMeta.expiresAt) : null),
    [emailOtpMeta],
  );

  useEffect(() => {
    if (!googleScriptReady || !googleClientId || !googleButtonRef.current) {
      return;
    }

    const container = googleButtonRef.current;
    container.innerHTML = "";

    window.google?.accounts.id.initialize({
      callback: (response) => {
        if (!response.credential) {
          return;
        }

        googleLogin({ idToken: response.credential });
      },
      client_id: googleClientId,
    });

    window.google?.accounts.id.renderButton(container, {
      locale: "fa",
      shape: "pill",
      size: "large",
      text: "signin_with",
      theme: "outline",
    });

    setGoogleMounted(true);

    return () => {
      container.innerHTML = "";
      setGoogleMounted(false);
    };
  }, [googleClientId, googleLogin, googleScriptReady]);

  useEffect(() => {
    if (!telegramBotUsername || !telegramButtonRef.current) {
      return;
    }

    const container = telegramButtonRef.current;
    container.innerHTML = "";

    window.onTelegramAuth = (user: TelegramCallbackRequest) => {
      telegramLogin(user);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", telegramBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    container.appendChild(script);

    setTelegramMounted(true);

    return () => {
      container.innerHTML = "";
      delete window.onTelegramAuth;
      setTelegramMounted(false);
    };
  }, [telegramBotUsername, telegramLogin]);

  const googleDisabled = !googleClientId || googleMutation.isPending;
  const telegramDisabled = !telegramBotUsername || telegramMutation.isPending;

  return (
    <section className="grid w-full overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_30px_90px_-40px_rgba(15,23,42,0.25)] lg:grid-cols-[1.08fr_0.92fr]">
      <aside className="relative min-h-[24rem] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.28),transparent_30%),linear-gradient(180deg,#060816_0%,#0b1024_55%,#070a16_100%)] p-6 text-white sm:p-8 lg:min-h-[40rem] lg:p-10">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-8%] top-[14%] h-72 w-72 rounded-full bg-sky-400/35 blur-3xl" />
          <div className="absolute right-[-8%] top-[8%] h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute bottom-[-12%] left-[10%] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative flex h-full min-h-[20rem] flex-col justify-between rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="text-lg font-semibold tracking-tight">KhayyamPulse</div>
              <div className="text-xs text-white/65">ورود امن به حساب کاربری</div>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-x-0 top-8 mx-auto h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.32)_0%,rgba(124,58,237,0.18)_36%,rgba(59,130,246,0.08)_60%,transparent_72%)] blur-[2px] sm:h-72 sm:w-72 lg:top-10 lg:h-[24rem] lg:w-[24rem]" />
            <div className="absolute bottom-10 left-4 h-44 w-44 rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.35),rgba(110,231,183,0.08)_30%,rgba(37,99,235,0.14)_55%,rgba(15,23,42,0.2)_100%)] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.75)] sm:bottom-14 sm:left-10 sm:h-56 sm:w-56 lg:bottom-16 lg:left-8 lg:h-72 lg:w-72" />
            <div className="absolute bottom-16 right-6 h-36 w-36 rounded-[2rem] border border-white/20 bg-[linear-gradient(145deg,rgba(167,139,250,0.22),rgba(59,130,246,0.08),rgba(255,255,255,0.04))] shadow-[0_24px_80px_-30px_rgba(124,58,237,0.65)] sm:right-10 sm:h-44 sm:w-44 lg:bottom-20 lg:right-14 lg:h-52 lg:w-52" />
            <div className="absolute bottom-14 left-1/2 h-28 w-48 -translate-x-1/2 rotate-6 rounded-[2rem] border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(168,85,247,0.28),rgba(255,255,255,0.04))] shadow-[0_18px_60px_-28px_rgba(168,85,247,0.9)] sm:h-32 sm:w-56 lg:bottom-24 lg:h-40 lg:w-64" />
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
              تحلیل بازار،
              <br />
              در یک نگاه.
            </div>
            <div className="max-w-sm text-sm leading-7 text-white/68">
              دسترسی سریع به حساب KhayyamPulse.
            </div>

            <div className="flex items-center gap-2 pt-4">
              <span className="h-2.5 w-7 rounded-full bg-white/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
            </div>
          </div>
        </div>
      </aside>

      <div className="bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfe_100%)] p-5 sm:p-7 lg:p-10">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <BrandMark />
              <div>
                <div className="text-base font-semibold text-black/90">KhayyamPulse</div>
                <div className="text-xs text-black/50">ورود امن به حساب کاربری</div>
              </div>
            </div>

            <div className="ml-auto hidden rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-black/60 shadow-sm lg:block">
              ورود
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 lg:py-0">
            <div className="mb-8">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-black/90">
                ورود به حساب
              </div>
              <div className="mt-2 text-sm text-black/52">KhayyamPulse</div>
            </div>

            <form className="space-y-5" onSubmit={emailOtpMeta ? handleEmailVerifySubmit : handleEmailRequestSubmit}>
              {!emailOtpMeta ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/72" htmlFor="email">
                    ایمیل
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/28" />
                    <input
                      autoComplete="email"
                      className="h-12 w-full rounded-2xl border border-black/10 bg-white px-11 text-sm text-black/88 outline-none transition placeholder:text-black/30 focus:border-black/20 focus:ring-4 focus:ring-black/5"
                      dir="ltr"
                      id="email"
                      inputMode="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  {emailRequestError ? (
                    <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{emailRequestError}</span>
                    </div>
                  ) : null}
                  <Button
                    className="h-12 w-full rounded-2xl bg-black text-white hover:bg-black/92"
                    disabled={emailPending || !email.trim()}
                    type="submit"
                  >
                    {emailOtpRequestMutation.isPending ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        ارسال کد
                      </>
                    ) : (
                      "ارسال کد"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/70">
                    <div className="min-w-0">
                      <div className="truncate font-medium" dir="ltr">
                        {emailOtpMeta.email}
                      </div>
                      <div className="mt-1 text-xs text-black/45">
                        {otpExpiresAtLabel ? `کد تا ساعت ${otpExpiresAtLabel} معتبر است` : "کد ارسال شد"}
                      </div>
                    </div>
                    <button
                      className="shrink-0 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                      onClick={handleEditEmail}
                      type="button"
                    >
                      ویرایش
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black/72" htmlFor="code">
                      کد تایید
                    </label>
                    <input
                      autoComplete="one-time-code"
                      className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-center text-base tracking-[0.35em] text-black/88 outline-none transition placeholder:text-black/25 focus:border-black/20 focus:ring-4 focus:ring-black/5"
                      dir="ltr"
                      id="code"
                      inputMode="numeric"
                      onChange={(event) =>
                        setEmailCode(event.target.value.replace(/\D/g, ""))
                      }
                      pattern="[0-9]{4,8}"
                      placeholder="123456"
                      required
                      type="text"
                      value={emailCode}
                    />
                  </div>

                  {emailOtpMeta.otpCode ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      <div className="text-xs font-medium text-emerald-700">
                        OTP debug code
                      </div>
                      <div
                        className="mt-1 font-mono text-lg tracking-[0.3em]"
                        dir="ltr"
                      >
                        {emailOtpMeta.otpCode}
                      </div>
                    </div>
                  ) : null}

                  {emailVerifyError ? (
                    <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{emailVerifyError}</span>
                    </div>
                  ) : null}

                  <Button
                    className="h-12 w-full rounded-2xl bg-black text-white hover:bg-black/92"
                    disabled={emailPending || emailCode.trim().length < 4}
                    type="submit"
                  >
                    {emailOtpVerifyMutation.isPending ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        ورود
                      </>
                    ) : (
                      "ورود"
                    )}
                  </Button>

                  <Button
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white text-black hover:bg-black/[0.02]"
                    disabled={emailPending}
                    onClick={() => requestEmailOtp({ email: emailOtpMeta.email })}
                    type="button"
                    variant="secondary"
                  >
                    {emailOtpRequestMutation.isPending ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        ارسال دوباره کد
                      </>
                    ) : (
                      "ارسال دوباره کد"
                    )}
                  </Button>
                </div>
              )}
            </form>

            <div className="mt-7">
              <SocialDivider />

              <div className="space-y-3">
                <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                  {googleClientId ? (
                    <Script
                      src="https://accounts.google.com/gsi/client"
                      strategy="afterInteractive"
                      onLoad={() => setGoogleScriptReady(true)}
                    />
                  ) : null}
                  <div
                    ref={googleButtonRef}
                    className={cn(
                      "min-h-12",
                      googleDisabled ? "pointer-events-none opacity-70" : "",
                    )}
                  />
                  {!googleClientId ? (
                    <div className="mt-1 text-xs text-amber-700">
                      ورود با گوگل فعال نیست.
                    </div>
                  ) : null}
                  {googleScriptReady && !googleMounted ? (
                    <div className="mt-1 text-xs text-black/45">
                      در حال آماده‌سازی...
                    </div>
                  ) : null}
                  {googleError ? (
                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{googleError}</span>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                  <div
                    ref={telegramButtonRef}
                    className={cn(
                      telegramDisabled ? "pointer-events-none opacity-70" : "",
                    )}
                  />
                  {!telegramBotUsername ? (
                    <div className="mt-1 text-xs text-amber-700">
                      ورود با تلگرام فعال نیست.
                    </div>
                  ) : null}
                  {telegramMounted ? (
                    <div className="mt-1 text-xs text-black/45">
                      گزینه تلگرام آماده است.
                    </div>
                  ) : null}
                  {telegramError ? (
                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{telegramError}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-black/45">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ورود امن</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
