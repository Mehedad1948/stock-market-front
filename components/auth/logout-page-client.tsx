"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logoutAction } from "@/app/login/actions";

export function LogoutPageClient() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await logoutAction();

      if (!cancelled) {
        router.replace("/login");
        router.refresh();
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(16,163,127,0.1),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef6f3_100%)] px-4"
    >
      <div className="rounded-[1.75rem] border border-black/8 bg-white/88 px-6 py-5 text-center shadow-[0_30px_70px_-46px_rgba(15,23,42,0.35)] backdrop-blur">
        <h1 className="text-lg font-semibold tracking-[-0.02em] text-black/84">
          در حال خروج از حساب
        </h1>
        <p className="mt-2 text-sm leading-6 text-black/56">
          نشست فعلی در حال پاک‌سازی است.
        </p>
      </div>
    </main>
  );
}
