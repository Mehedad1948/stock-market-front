import { ArrowUpRight, Crown, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

import { badgeToneClassMap } from "@/lib/theme/signal-tone";

const signals = [
  {
    label: "Strong Buy",
    utilityClass: "bg-signal-strong-buy",
    toneClass: badgeToneClassMap.success,
    icon: TrendingUp,
  },
  {
    label: "Hold",
    utilityClass: "bg-signal-hold",
    toneClass: badgeToneClassMap.neutral,
    icon: ShieldCheck,
  },
  {
    label: "Confirmed Sell",
    utilityClass: "bg-signal-confirmed-sell",
    toneClass: badgeToneClassMap.danger,
    icon: TrendingDown,
  },
] as const;

const analysisCards = [
  {
    title: "Smart Liquidity Scan",
    value: "+12.4%",
    description: "AI-weighted signal confidence across high-volume Tehran exchange symbols.",
    toneClass: badgeToneClassMap.success,
  },
  {
    title: "Premium Insight",
    value: "Tier A",
    description: "Reserved for high-conviction setups and institution-style momentum alignment.",
    toneClass: badgeToneClassMap.premium,
  },
  {
    title: "Risk Window",
    value: "Elevated",
    description: "Distribution pressure detected in short-term breadth and market internals.",
    toneClass: badgeToneClassMap.warning,
  },
] as const;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10 lg:px-10">
        <div className="rounded-[28px] border border-border/80 bg-card/88 p-8 shadow-card backdrop-blur xl:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-primary-soft px-4 py-2 text-sm font-medium text-success">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Premium market intelligence for Iran equities
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Dark, credible signal interfaces built for analytical confidence.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  The theme is centered on graphite surfaces, emerald action states, restrained
                  premium gold, and semantic market tones that stay compatible with Tailwind v4
                  and shadcn-style components.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {signals.map(({ label, utilityClass, toneClass, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border/70 bg-muted/55 p-4 shadow-glass"
                >
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>
                      {label}
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${utilityClass}`} />
                    <span className="text-sm text-muted-foreground">{utilityClass}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-border/80 bg-card/88 p-7 shadow-card backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Analysis card examples
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-card-foreground">
                  Semantic usage samples
                </h2>
              </div>
              <span className={badgeToneClassMap.info + " rounded-full px-3 py-1 text-xs font-semibold"}>
                bg-card text-muted-foreground border-border
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {analysisCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-3xl border border-border/70 bg-background/70 p-5 shadow-glass"
                >
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.toneClass}`}>
                    {card.title}
                  </span>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold text-card-foreground">{card.value}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-border/80 bg-card/88 p-7 shadow-card backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gold-100 p-3 text-premium dark:bg-gold-400/12 dark:text-gold-300">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Token reference</p>
                <h2 className="text-2xl font-semibold text-card-foreground">
                  Tailwind utility examples
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-3xl border border-border/70 bg-background/70 p-5 font-mono text-sm text-muted-foreground">
              <p>`bg-background text-foreground`</p>
              <p>`bg-card text-card-foreground border-border`</p>
              <p>`bg-primary text-primary-foreground hover:bg-brand-600`</p>
              <p>`bg-primary-soft text-success`</p>
              <p>`bg-signal-strong-buy` and `bg-signal-confirmed-sell`</p>
            </div>

            <div className="mt-6 rounded-3xl border border-brand-500/20 bg-primary-soft p-5">
              <p className="text-sm font-medium text-success">Implementation note</p>
              <p className="mt-2 text-sm leading-7 text-card-foreground">
                The theme uses CSS variables in <code>globals.css</code> and exposes them through
                Tailwind v4 <code>@theme inline</code>, which is the correct direction for this
                project instead of reintroducing a legacy Tailwind config file.
              </p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
