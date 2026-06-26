import type { CSSProperties } from "react";

import { cacheLife, cacheTag } from "next/cache";

import mockResults from "@/data/mockResults.json";
import { SignalCardDialog } from "@/components/landing/SignalCardDialog";
import { CacheKeys } from "@/constants/cache-keys";
import { cn } from "@/lib/utils";
import type {
  CompositeBias,
  ExistingPositionAdvice,
  NewPositionAdvice,
  PresentedTimeframeComposite,
  TimeframeAction,
  TimeframeQuality,
} from "@/types/stock-analysis-api";

type TimeframeKey = "shortTerm" | "midTerm" | "longTerm";
type KnownAdvice = NewPositionAdvice | ExistingPositionAdvice;
type SignalResourceItem = (typeof mockResults.items)[number];

type AdviceUi = {
  label: string;
  dotClassName: string;
  pulseClassName: string;
  textClassName: string;
  softClassName: string;
};

type CardSignal = {
  symbol: string;
  latestDataDate: string;
  latestClosePrice: number | null;
  latestClosePriceChangePercent: number | null;
  summary: string;
  compositeScore: number;
  compositeBias: CompositeBias;
  timeframes: Record<TimeframeKey, PresentedTimeframeComposite>;
  midTerm: {
    score: number;
    newPosition: NewPositionAdvice;
    existingPosition: ExistingPositionAdvice;
  };
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const percentFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const waveDelayStepMs = 180;

const timeframeMeta: Array<{ key: TimeframeKey; label: string }> = [
  { key: "shortTerm", label: "کوتاه مدت" },
  { key: "midTerm", label: "میان مدت" },
  { key: "longTerm", label: "بلند مدت" },
];

const timeframeActionLabels: Record<TimeframeAction, string> = {
  BUY: "خرید",
  PROBABLE_BUY: "خرید محتمل",
  HOLD: "نگهداری",
  WAIT: "صبر",
  CAUTION: "احتیاط",
  REDUCE: "کاهش",
  EXIT: "خروج",
};

const timeframeQualityLabels: Record<TimeframeQuality, string> = {
  STRONG_BULLISH: "صعودی قوی",
  BULLISH: "صعودی",
  NEUTRAL: "خنثی",
  WEAK: "ضعیف",
  BEARISH: "نزولی",
};

const biasLabels: Record<CompositeBias, string> = {
  STRONG_BULLISH: "صعودی قوی",
  BULLISH: "صعودی",
  NEUTRAL: "خنثی",
  BEARISH: "نزولی",
  STRONG_BEARISH: "نزولی قوی",
};

const adviceUi = {
  BUY: {
    label: "خرید",
    dotClassName: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.42)]",
    pulseClassName: "bg-emerald-400/55",
    textClassName: "text-emerald-700",
    softClassName: "bg-emerald-50 border-emerald-100",
  },
  PROBABLE_BUY: {
    label: "خرید محتمل",
    dotClassName: "bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.4)]",
    pulseClassName: "bg-lime-400/55",
    textClassName: "text-lime-700",
    softClassName: "bg-lime-50 border-lime-100",
  },
  WAIT: {
    label: "صبر",
    dotClassName: "bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.4)]",
    pulseClassName: "bg-sky-400/55",
    textClassName: "text-sky-700",
    softClassName: "bg-sky-50 border-sky-100",
  },
  WAIT_FOR_ENTRY_TRIGGER: {
    label: "صبر برای ورود",
    dotClassName: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.42)]",
    pulseClassName: "bg-amber-400/55",
    textClassName: "text-amber-700",
    softClassName: "bg-amber-50 border-amber-100",
  },
  AVOID: {
    label: "عدم ورود",
    dotClassName: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.42)]",
    pulseClassName: "bg-red-400/55",
    textClassName: "text-red-700",
    softClassName: "bg-red-50 border-red-100",
  },
  HOLD: {
    label: "نگهداری",
    dotClassName: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.38)]",
    pulseClassName: "bg-emerald-400/50",
    textClassName: "text-emerald-700",
    softClassName: "bg-emerald-50 border-emerald-100",
  },
  HOLD_WITH_CAUTION: {
    label: "نگهداری با احتیاط",
    dotClassName: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)]",
    pulseClassName: "bg-yellow-400/55",
    textClassName: "text-yellow-700",
    softClassName: "bg-yellow-50 border-yellow-100",
  },
  REDUCE: {
    label: "کاهش",
    dotClassName: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.42)]",
    pulseClassName: "bg-orange-400/55",
    textClassName: "text-orange-700",
    softClassName: "bg-orange-50 border-orange-100",
  },
  EXIT: {
    label: "خروج",
    dotClassName: "bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.45)]",
    pulseClassName: "bg-red-500/55",
    textClassName: "text-red-700",
    softClassName: "bg-red-50 border-red-100",
  },
  MONITOR: {
    label: "زیر نظر",
    dotClassName: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.38)]",
    pulseClassName: "bg-blue-400/55",
    textClassName: "text-blue-700",
    softClassName: "bg-blue-50 border-blue-100",
  },
} satisfies Record<KnownAdvice, AdviceUi>;

function isKnownAdvice(value: string): value is KnownAdvice {
  return value in adviceUi;
}

function toKnownAdvice<TAdvice extends KnownAdvice>(value: string): TAdvice {
  if (isKnownAdvice(value)) {
    return value as TAdvice;
  }

  return "MONITOR" as TAdvice;
}

function getAdviceUi(value: KnownAdvice): AdviceUi {
  return adviceUi[value];
}

function getBiasTone(value: CompositeBias) {
  switch (value) {
    case "STRONG_BULLISH":
    case "BULLISH":
      return "text-emerald-700 bg-emerald-50 border-emerald-100";
    case "NEUTRAL":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "BEARISH":
    case "STRONG_BEARISH":
      return "text-red-700 bg-red-50 border-red-100";
  }
}

function getQualityTone(value: TimeframeQuality) {
  switch (value) {
    case "STRONG_BULLISH":
    case "BULLISH":
      return "text-emerald-700 bg-emerald-50 border-emerald-100";
    case "NEUTRAL":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "WEAK":
      return "text-amber-700 bg-amber-50 border-amber-100";
    case "BEARISH":
      return "text-red-700 bg-red-50 border-red-100";
  }
}

function formatSignedPercent(value: number | null) {
  if (value === null) {
    return "بدون داده";
  }

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${percentFormatter.format(Math.abs(value))}%`;
}

function formatNumber(value: number | null) {
  if (value === null) {
    return "بدون داده";
  }

  return numberFormatter.format(value);
}

function normalizeTimeframe(
  timeframe: SignalResourceItem["composite"]["timeframes"][TimeframeKey],
): PresentedTimeframeComposite {
  return {
    ...timeframe,
    action: {
      ...timeframe.action,
      value: timeframe.action.value as TimeframeAction,
    },
    quality: {
      ...timeframe.quality,
      value: timeframe.quality.value as TimeframeQuality,
    },
    positionAdvice: {
      forNewPosition: {
        ...timeframe.positionAdvice.forNewPosition,
        value: toKnownAdvice<NewPositionAdvice>(
          timeframe.positionAdvice.forNewPosition.value,
        ),
      },
      forExistingPosition: {
        ...timeframe.positionAdvice.forExistingPosition,
        value: toKnownAdvice<ExistingPositionAdvice>(
          timeframe.positionAdvice.forExistingPosition.value,
        ),
      },
    },
  };
}

async function getSignalCards(): Promise<CardSignal[]> {
  "use cache";

  cacheLife({
    stale: 60 * 60,
    revalidate: 60 * 60,
    expire: 60 * 60 + 1,
  });
  cacheTag(CacheKeys.stockSignalCards);

  return mockResults.items.map((item) => {
    const midTermAdvice = item.composite.timeframes.midTerm.positionAdvice;

    return {
      symbol: item.symbol,
      latestDataDate: item.latestDataDate,
      latestClosePrice:
        typeof item.latestClosePrice === "number" ? item.latestClosePrice : null,
      latestClosePriceChangePercent:
        typeof item.latestClosePriceChangePercent === "number"
          ? item.latestClosePriceChangePercent
          : null,
      summary: item.persianSummary,
      compositeScore: item.composite.score,
      compositeBias: item.composite.bias.value as CompositeBias,
      timeframes: {
        shortTerm: normalizeTimeframe(item.composite.timeframes.shortTerm),
        midTerm: normalizeTimeframe(item.composite.timeframes.midTerm),
        longTerm: normalizeTimeframe(item.composite.timeframes.longTerm),
      },
      midTerm: {
        score: item.composite.timeframes.midTerm.score,
        newPosition: toKnownAdvice<NewPositionAdvice>(
          midTermAdvice.forNewPosition.value,
        ),
        existingPosition: toKnownAdvice<ExistingPositionAdvice>(
          midTermAdvice.forExistingPosition.value,
        ),
      },
    };
  });
}

function AdviceStatus({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: KnownAdvice;
  compact?: boolean;
}) {
  const ui = getAdviceUi(value);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-full border px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
        compact ? ui.softClassName : "border-black/8 bg-white/72",
      )}
    >
      <span className="text-[11px] font-medium tracking-[-0.01em] text-black/45">
        {label}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-2 text-[11px] font-bold tracking-[-0.01em]",
          ui.textClassName,
        )}
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-35",
              ui.pulseClassName,
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2.5 w-2.5 rounded-full ring-1 ring-white/85",
              ui.dotClassName,
            )}
          />
        </span>
        {ui.label}
      </span>
    </div>
  );
}

function DetailMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white/72 px-4 py-3">
      <div className="text-[11px] font-medium text-black/45">{label}</div>
      <div className={cn("mt-1 text-sm font-semibold text-black/78", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

function TimeframeDetails({
  label,
  timeframe,
}: {
  label: string;
  timeframe: PresentedTimeframeComposite;
}) {
  const newPosition = toKnownAdvice<NewPositionAdvice>(
    timeframe.positionAdvice.forNewPosition.value,
  );
  const existingPosition = toKnownAdvice<ExistingPositionAdvice>(
    timeframe.positionAdvice.forExistingPosition.value,
  );

  return (
    <section className="rounded-[1.5rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] p-4 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.2)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-black/82">{label}</h3>
          <p className="mt-1 text-xs text-black/48">
            ارزیابی روند و موقعیت این بازه
          </p>
        </div>
        <div className="rounded-full border border-black/6 bg-white/80 px-3 py-1 text-xs font-bold text-black/72">
          امتیاز {numberFormatter.format(timeframe.score)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DetailMetric
          label="اقدام"
          value={timeframeActionLabels[timeframe.action.value]}
        />
        <DetailMetric
          label="کیفیت"
          value={timeframeQualityLabels[timeframe.quality.value]}
          valueClassName={getQualityTone(timeframe.quality.value)}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <AdviceStatus label="ورود جدید" value={newPosition} compact />
        <AdviceStatus label="دارنده سهم" value={existingPosition} compact />
      </div>
    </section>
  );
}

function SignalCardDetails({ card }: { card: CardSignal }) {
  const changeTone =
    card.latestClosePriceChangePercent === null
      ? "text-black/56"
      : card.latestClosePriceChangePercent > 0
        ? "text-emerald-700"
        : card.latestClosePriceChangePercent < 0
          ? "text-red-700"
          : "text-slate-600";

  return (
    <div className="space-y-5 pt-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <DetailMetric
          label="سوگیری کلی"
          value={biasLabels[card.compositeBias]}
          valueClassName={getBiasTone(card.compositeBias)}
        />
        <DetailMetric
          label="امتیاز ترکیبی"
          value={numberFormatter.format(card.compositeScore)}
        />
        <DetailMetric label="تاریخ داده" value={card.latestDataDate} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DetailMetric
          label="آخرین قیمت"
          value={formatNumber(card.latestClosePrice)}
        />
        <DetailMetric
          label="تغییر قیمت"
          value={formatSignedPercent(card.latestClosePriceChangePercent)}
          valueClassName={changeTone}
        />
      </div>

      <section className="rounded-[1.5rem] border border-black/6 bg-white/72 p-4">
        <h3 className="text-sm font-semibold text-black/82">جمع بندی</h3>
        <p className="mt-2 text-sm leading-7 text-black/60">{card.summary}</p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {timeframeMeta.map(({ key, label }) => (
          <TimeframeDetails
            key={key}
            label={label}
            timeframe={card.timeframes[key]}
          />
        ))}
      </div>
    </div>
  );
}

function SignalCardButton({ card }: { card: CardSignal }) {
  return (
    <button
      type="button"
      className="group w-full text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <article className=" flex flex-col gap-3">
        <div className="rounded-full border border-white/80 bg-white/55 px-4 py-2.5 text-center text-sm font-medium tracking-[-0.02em] text-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] backdrop-blur">
          {card.symbol}
        </div>

        <div className=" rounded-[1.25rem] border border-white/80 bg-white/60 p-3 shadow-[0_18px_28px_-28px_rgba(0,0,0,0.28)] backdrop-blur transition-transform duration-200 group-hover:-translate-y-1">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-[1rem] border border-white/80 bg-white/50 px-3 py-2">
            <span className="text-[11px] font-semibold tracking-[0.02em] text-black/42">
              میان مدت
            </span>
            <span className="text-xs font-bold text-black/70">
              {numberFormatter.format(card.midTerm.score)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <AdviceStatus label="ورود جدید" value={card.midTerm.newPosition} />
            <AdviceStatus
              label="دارنده سهم"
              value={card.midTerm.existingPosition}
            />
          </div>
        </div>
      </article>
    </button>
  );
}

export function CardSignalsSkeleton() {
  return (
    <div className="stock-wave-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }, (_, index) => {
        const waveStyle = {
          "--wave-delay": `${index * waveDelayStepMs}ms`,
        } as CSSProperties;

        return (
          <article
            key={index}
            style={waveStyle}
            className="stock-wave-card flex flex-col gap-3"
          >
            <div className="h-10 animate-pulse rounded-full border border-white/80 bg-white/50 backdrop-blur" />
            <div className="stock-wave-card__panel h-36 animate-pulse rounded-[1.25rem] border border-white/80 bg-white/50 shadow-[0_24px_40px_-32px_rgba(0,0,0,0.45)] backdrop-blur" />
          </article>
        );
      })}
    </div>
  );
}

export default async function CardSignals() {
  const cards = await getSignalCards();

  return (
    <div
      dir="rtl"
      className=" grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
    >
      {cards.map((card, index) => {
        const waveStyle = {
          "--wave-delay": `${index * waveDelayStepMs}ms`,
        } as CSSProperties;

        return (
          <div key={`${card.symbol}-${index}`} style={waveStyle}>
            <SignalCardDialog
              title={card.symbol}
              description={`جزئیات تحلیل در سه بازه زمانی بر اساس داده ${card.latestDataDate}`}
              trigger={<SignalCardButton card={card} />}
            >
              <SignalCardDetails card={card} />
            </SignalCardDialog>
          </div>
        );
      })}
    </div>
  );
}
