import { ArrowUpLeft } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stockCards = [
  "Foolad",
  "Fars",
  "Shasta",
  "Khodro",
  "Fameli",
  "Shepna",
  "Tamin",
  "Nouri",
];

export default function Page() {
  return (
    <main
      dir="ltr"
      className="relative min-h-screen overflow-hidden bg-[#f6f3ee] text-black"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[38vh] bg-[linear-gradient(90deg,rgba(186,170,255,0.85)_0%,rgba(181,217,255,0.82)_34%,rgba(255,231,120,0.9)_58%,rgba(244,171,197,0.78)_82%,rgba(229,177,214,0.75)_100%)] blur-3xl" />
        <div className="absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[48vh] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.88),rgba(246,243,238,0.7)_44%,rgba(246,243,238,0.96)_100%)]" />
        <div className="absolute left-[-8%] top-[32%] h-64 w-64 rounded-full bg-[#c2d9ff]/35 blur-3xl" />
        <div className="absolute right-[-6%] top-[20%] h-72 w-72 rounded-full bg-[#ffd7c1]/35 blur-3xl" />
      </div>

      <Container className="relative z-10 flex min-h-screen flex-col pt-6 pb-10 sm:pt-8">
        <header className="mx-auto w-full max-w-3xl rounded-full border border-black/15 bg-[#2d2b37]/92 p-2 text-white shadow-[0_18px_45px_-26px_rgba(0,0,0,0.65)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 rounded-full">
            <div className="px-4 text-[2rem] leading-none tracking-[-0.04em] text-white sm:px-5">
              boursekala
            </div>
            <nav className="hidden items-center gap-7 text-sm text-white/90 md:flex">
              <a href="#features" className="transition hover:text-white">
                Market
              </a>
              <a href="#cards" className="transition hover:text-white">
                Stocks
              </a>
              <a href="#cards" className="transition hover:text-white">
                Signals
              </a>
              <a href="#cards" className="transition hover:text-white">
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="#cards"
                className="hidden px-4 text-sm text-white/90 transition hover:text-white sm:inline-flex"
              >
                Log In
              </a>
              <Button
                href="#cards"
                variant="secondary"
                size="md"
                className="h-11 border border-white/20 bg-white text-black shadow-none hover:bg-white/90"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center px-4 pt-16 text-center sm:pt-20 lg:pt-24">
          <Badge
            variant="secondary"
            className="rounded-full border border-black/8 bg-white/55 px-4 py-2 text-sm font-medium tracking-normal text-black/85 shadow-[0_12px_35px_-28px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            IRAN STOCK MARKET
          </Badge>

          <h1 className="mt-5 max-w-5xl text-6xl leading-[0.95] font-light tracking-[-0.07em] text-black sm:text-7xl lg:text-[7.5rem]">
            Trading tools
            <br />
            worthy of{" "}
            <span className="bg-[linear-gradient(90deg,#9b5de5_0%,#f15bb5_28%,#fb5607_52%,#ffbe0b_76%,#3a86ff_100%)] bg-clip-text text-transparent">
              your edge
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/62 sm:text-[1.35rem]">
            A clean market landing page for Iranian equities, rebuilt from the
            provided layout with stock-focused cards and blank media slots.
          </p>

          <div className="mt-9">
            <Button
              href="#cards"
              variant="dark"
              size="lg"
              className="h-14 gap-4 border border-white/35 bg-[#2b2b2f] px-7 text-base font-medium text-white shadow-[0_20px_35px_-18px_rgba(0,0,0,0.75),0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#232329]"
            >
              Get Started
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpLeft className="h-4 w-4 rotate-45" />
              </span>
            </Button>
          </div>
        </section>

        <section id="cards" className="mt-auto pt-10 sm:pt-14">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
            {stockCards.map((stock) => (
              <article key={stock} className="flex flex-col gap-3">
                <div className="rounded-full border border-white/80 bg-white/55 px-4 py-3 text-center text-sm font-medium uppercase tracking-[-0.02em] text-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] backdrop-blur">
                  {stock}
                </div>

                <div className="rounded-[1.4rem] border border-white/80 bg-white/60 p-2 shadow-[0_24px_40px_-32px_rgba(0,0,0,0.45)] backdrop-blur">
                  <div className="flex aspect-[4/5] items-center justify-center rounded-[1.1rem] border border-dashed border-black/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(231,233,237,0.78))] text-center text-sm font-medium text-black/28">
                    Empty
                    <br />
                    Placeholder
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
