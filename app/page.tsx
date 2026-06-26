import { Suspense } from "react";

import { ArrowUpLeft } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import BacktestReportSection, {
  BacktestReportSkeleton,
} from "@/components/landing/BacktestReportSection";
import CardSignals, {
  CardSignalsSkeleton,
} from "@/components/landing/CardSignals";
import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-white text-black"
    >
      <Image
        className="fixed bottom-0 left-10 w-28 opacity-50 sepia transition-all duration-500 hover:opacity-100 hover:sepia-0"
        src={"/images/colorful.png"}
        width={400}
        height={300}
        alt=""
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-[-6%] top-[-12%] h-[24rem] bg-[linear-gradient(90deg,rgba(186,170,255,0.78)_0%,rgba(181,217,255,0.72)_28%,rgba(255,231,120,0.78)_54%,rgba(244,171,197,0.68)_78%,rgba(229,177,214,0.64)_100%)] blur-[105px]" />
        <div className="absolute left-1/2 top-[5.5rem] h-[14rem] w-[44rem] -translate-x-1/2 rounded-full bg-white/84 blur-[90px]" />
        <div className="absolute left-[-2.5rem] top-[7rem] h-40 w-40 rounded-full bg-[#c2d9ff]/22 blur-[78px]" />
        <div className="absolute right-[-2rem] top-[6rem] h-44 w-44 rounded-full bg-[#ffd7c1]/22 blur-[78px]" />
      </div>

      <Container className="relative z-10 flex min-h-screen flex-col pt-5 pb-8 sm:pt-6">
        <header className="mx-auto w-full max-w-3xl rounded-full border border-black/15 bg-[#2d2b37]/92 p-2 text-white shadow-[0_18px_45px_-26px_rgba(0,0,0,0.65)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 rounded-full">
            <div className="px-4 text-[1.3rem] leading-none tracking-[-0.04em] text-white sm:px-5 sm:text-[1.5rem]">
              خیام پالس
            </div>
            <nav className="hidden items-center gap-6 text-[14.5px] text-white/90 md:flex">
              <a href="#cards" className="transition hover:text-white">
                بازار
              </a>
              <a href="#cards" className="transition hover:text-white">
                سهام
              </a>
              <a href="#cards" className="transition hover:text-white">
                سیگنال ها
              </a>
              <a href="#cards" className="transition hover:text-white">
                راهنما
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="hidden px-4 text-[13px] text-white/90 transition hover:text-white sm:inline-flex"
              >
                ورود
              </a>
              <Button
                href="#cards"
                variant="secondary"
                size="md"
                className="h-10 border border-white/20 bg-white px-5 text-sm text-black shadow-none hover:bg-white/90"
              >
                شروع
              </Button>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center px-4 pt-12 text-center sm:pt-14 lg:pt-16">
          <h1 className="mt-4 max-w-5xl text-4xl leading-[1.08] font-medium tracking-[-0.05em] text-black sm:text-5xl lg:text-[5rem] relative">
            <span className="relative">

              خیام پالس
            </span>
            <br />
            <span>تحلیل گر</span>
            <span className="mx-4 bg-[linear-gradient(90deg,#8b5cf6_0%,#ec4899_30%,#f97316_58%,#eab308_82%,#3b82f6_100%)] bg-clip-text text-transparent">
              خردمند
            </span>
            <span>بازارهای مالی</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-black/62 sm:text-[1.05rem]">
            خیام پالس کنار شماست تا شلوغی بازار را ساده تر ببینید. با تحلیل
            الگوریتمی، نشانه های مهم سهم ها را روشن تر می کند تا با آرامش بیشتر،
            سنجیده تر و هوشمندانه تر معامله کنید.
          </p>

          <div className="mt-7">
            <Button
              href="#cards"
              variant="secondary"
              size="lg"
              className="h-12 gap-4 border border-black/10 bg-white px-6 text-sm font-medium text-black shadow-[0_20px_35px_-18px_rgba(0,0,0,0.28),0_8px_0_rgba(0,0,0,0.08)] hover:bg-white/92"
            >
              شروع بررسی بازار
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f1f24] text-white">
                <ArrowUpLeft className="h-4 w-4 rotate-45" />
              </span>
            </Button>
          </div>
        </section>

        <section id="cards" className="mt-auto pt-6 sm:pt-8">
          <Suspense fallback={<CardSignalsSkeleton />}>
            <CardSignals />
          </Suspense>
        </section>
      </Container>
    </main>
  );
}
