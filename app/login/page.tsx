import { Suspense } from "react";
import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import { LoginPanel } from "@/components/auth/login-panel";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "ورود | KhayyamPulse",
  description: "ورود به حساب کاربری KhayyamPulse.",
};

export default async function LoginPage() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_26%),linear-gradient(180deg,#f7f7fb_0%,#edf0f7_100%)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[-7rem] h-72 w-72 rounded-full bg-indigo-300/15 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[-6rem] h-80 w-80 rounded-full bg-sky-300/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Suspense fallback={null}>
          <Providers>
            <div className="w-full">
              <LoginPanel
                googleClientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? null}
                telegramBotUsername={env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? null}
              />
            </div>
          </Providers>
        </Suspense>
      </div>
    </main>
  );
}
