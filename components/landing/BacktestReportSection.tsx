import { AlertTriangle, ShieldAlert, Target } from "lucide-react";

import { BacktestGroupedSection } from "@/components/landing/BacktestGroupedSection";
import { getBacktestReport } from "@/services/http/backtest-report.service";
import { cn } from "@/lib/utils";
import type {
  GlobalReportSection,
  HorizonKey,
  HorizonMetrics,
  ReportGroup,
} from "@/types/backtest-report";

const reportQuery = {
  runId: "08f0845d-8bc2-4ca4-a5fe-5861a44d2c21",
  symbols: ["فملی"],
  timeframe: "midTerm",
  groupBy: "scoreBucket",
} as const;

const horizonOrder: HorizonKey[] = ["1d", "5d", "20d", "60d"];

const sectionLabels: Record<string, { title: string; description: string }> = {
  byCompositeAction: {
    title: "تفکیک بر اساس اقدام ترکیبی",
    description: "مشخص می‌کند مدل در چه نوع سیگنال‌های ترکیبی بهتر عمل می‌کند و کجا افت دارد.",
  },
  byScoreBucket: {
    title: "تفکیک بر اساس بازه امتیاز",
    description: "برای بررسی اینکه آیا شدت امتیازهای بالاتر واقعاً به بازده بهتر منجر می‌شود.",
  },
  byVolatilityRegime: {
    title: "تفکیک بر اساس رژیم نوسان",
    description: "برای سنجش اینکه محیط‌های آرام یا پرنوسان چگونه کیفیت سیگنال را تغییر می‌دهند.",
  },
  byLiquidityBucket: {
    title: "تفکیک بر اساس نقدشوندگی",
    description: "اثر سطح نقدشوندگی بر نتیجه سیگنال‌ها را نشان می‌دهد.",
  },
  byBias: {
    title: "تفکیک بر اساس سوگیری",
    description: "زمینه ثانویه برای درک تفاوت عملکرد میان وضعیت‌های صعودی، خنثی و نزولی.",
  },
  bySector: {
    title: "تفکیک بر اساس صنعت",
    description: "تنها زمانی نمایش داده می‌شود که داده بیش از یک صنعت را پوشش دهد.",
  },
  byEntryTiming: {
    title: "تفکیک بر اساس زمان ورود",
    description: "نمای تکمیلی از اثر آمادگی ورود بر نتیجه نهایی سیگنال‌ها.",
  },
};

const percentFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("fa-IR");

function formatPercent(value: number) {
  return `${percentFormatter.format(value * 100)}%`;
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${percentFormatter.format(Math.abs(value * 100))}%`;
}

function formatProfitFactor(value: number | null) {
  if (value === null) {
    return "معنی دار نیست";
  }

  return percentFormatter.format(value);
}

function getMetricTone(value: number) {
  if (value > 0) {
    return "text-emerald-700";
  }

  if (value < 0) {
    return "text-red-700";
  }

  return "text-slate-600";
}

function hasMultipleSectors(groups?: ReportGroup[]) {
  return Boolean(groups && new Set(groups.map((group) => group.key)).size > 1);
}

function getWorstDrawdownFlag(global: GlobalReportSection) {
  const arrays = Object.values(global).filter(Array.isArray) as ReportGroup[][];
  const allMetrics = arrays.flatMap((groups) =>
    groups.flatMap((group) => Object.values(group.horizons)),
  );

  const flaggedCount = allMetrics.filter(
    (metrics) => metrics.worstDrawdown <= -1,
  ).length;

  return flaggedCount >= 4;
}

function getNegativeKeySubgroups(global: GlobalReportSection) {
  const keys = [
    "byCompositeAction",
    "byScoreBucket",
    "byVolatilityRegime",
    "byLiquidityBucket",
  ] as const;

  return keys.flatMap((key) => {
    const groups = global[key] ?? [];

    return groups
      .filter(
        (group) =>
          (group.horizons["20d"]?.avgReturn ?? 0) < 0 ||
          (group.horizons["60d"]?.avgReturn ?? 0) < 0,
      )
      .slice(0, 2)
      .map((group) => `${sectionLabels[key].title}: ${group.key}`);
  });
}

function getCustomGroupEntries(global: GlobalReportSection) {
  if (!global.customGroups) {
    return [];
  }

  return Object.entries(global.customGroups).filter(
    (entry): entry is [string, ReportGroup[]] => Array.isArray(entry[1]),
  );
}

function OverviewKpi({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white/76 px-4 py-3">
      <div className="text-[11px] font-medium text-black/45">{label}</div>
      <div className={cn("mt-1 text-lg font-semibold text-black/82", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

function HorizonCard({
  horizon,
  metrics,
}: {
  horizon: HorizonKey;
  metrics: HorizonMetrics;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(246,248,251,0.94))] p-4 shadow-[0_20px_40px_-34px_rgba(15,23,42,0.22)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-black/82">{horizon}</h3>
        <span className="rounded-full border border-black/6 bg-white/86 px-2.5 py-1 text-[11px] font-semibold text-black/56">
          {numberFormatter.format(metrics.sampleCount)} نمونه
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <OverviewKpi
          label="میانگین بازده"
          value={formatSignedPercent(metrics.avgReturn)}
          valueClassName={getMetricTone(metrics.avgReturn)}
        />
        <OverviewKpi
          label="میانه بازده"
          value={formatSignedPercent(metrics.medianReturn)}
          valueClassName={getMetricTone(metrics.medianReturn)}
        />
        <OverviewKpi label="نرخ برد" value={formatPercent(metrics.winRate)} />
        <OverviewKpi
          label="نرخ بازده منفی"
          value={formatPercent(metrics.negativeReturnRate)}
        />
        <OverviewKpi
          label="نسبت سود به زیان"
          value={formatProfitFactor(metrics.profitFactorLikeRatio)}
        />
        <OverviewKpi
          label="میانگین افت سرمایه"
          value={formatSignedPercent(metrics.avgMaxDrawdown)}
          valueClassName="text-amber-700"
        />
      </div>
    </div>
  );
}

export function BacktestReportSkeleton() {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/75 bg-white/52 p-5 backdrop-blur">
      <div className="grid gap-4">
        <div className="h-28 animate-pulse rounded-[1.5rem] bg-white/70" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-[1.5rem] bg-white/70"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function BacktestReportSection() {
  const response = await getBacktestReport(reportQuery);
  const report = response.report.global;
  const overall = report.overall;
  const negativeSubgroups = getNegativeKeySubgroups(report);
  const showSector = hasMultipleSectors(report.bySector);
  const customGroups = getCustomGroupEntries(report);
  const hasWorstDrawdownRisk = getWorstDrawdownFlag(report);

  return (
    <section className="mt-10 space-y-8" dir="rtl">
      <div className="rounded-[2rem] border border-white/80 bg-white/58 p-5 shadow-[0_24px_46px_-34px_rgba(15,23,42,0.18)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/74 px-3 py-1.5 text-xs font-semibold text-black/56">
              <Target className="h-3.5 w-3.5" />
              مانیتورینگ کیفیت بک تست
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
              گزارش تشخیصی عملکرد سیگنال
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/60 sm:text-[0.95rem]">
              این گزارش فقط خلاصه نهایی نیست. عملکرد را به تفکیک افق زمانی و شرایط
              مختلف نشان می‌دهد تا مشخص شود مدل کجا جواب می‌دهد، کجا افت می‌کند و
              آیا شدت امتیاز، نقدشوندگی و نوسان واقعاً نتیجه را تغییر می‌دهند یا نه.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[28rem]">
            <OverviewKpi
              label="نماد"
              value={response.filters.symbols.join("، ")}
            />
            <OverviewKpi label="بازه" value={response.filters.timeframe} />
            <OverviewKpi
              label="نمونه کل"
              value={numberFormatter.format(overall.sampleCount)}
            />
            <OverviewKpi
              label="اسنپ شات گزارش"
              value={numberFormatter.format(response.returnedSnapshots)}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <OverviewKpi
            label="میانگین بازده 20 روزه"
            value={formatSignedPercent(overall.horizons["20d"].avgReturn)}
            valueClassName={getMetricTone(overall.horizons["20d"].avgReturn)}
          />
          <OverviewKpi
            label="میانگین بازده 60 روزه"
            value={formatSignedPercent(overall.horizons["60d"].avgReturn)}
            valueClassName={getMetricTone(overall.horizons["60d"].avgReturn)}
          />
          <OverviewKpi
            label="نسبت سود به زیان 60 روزه"
            value={formatProfitFactor(
              overall.horizons["60d"].profitFactorLikeRatio,
            )}
          />
        </div>

        {(negativeSubgroups.length > 0 || hasWorstDrawdownRisk) ? (
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {negativeSubgroups.length > 0 ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50/88 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  تعارض بین خلاصه کلی و زیرگروه‌ها
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-900/80">
                  با اینکه خلاصه کلی مثبت است، بعضی زیرگروه‌های کلیدی هنوز در افق
                  20 یا 60 روزه منفی هستند.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {negativeSubgroups.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-amber-200 bg-white/75 px-3 py-1 text-xs font-medium text-amber-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {hasWorstDrawdownRisk ? (
              <div className="rounded-[1.5rem] border border-red-200 bg-red-50/88 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
                  <ShieldAlert className="h-4 w-4" />
                  ریسک داده یا رخداد افت کامل
                </div>
                <p className="mt-2 text-sm leading-6 text-red-900/80">
                  مقدار `worstDrawdown = -1` در بخش‌های متعدد دیده می‌شود. این می‌تواند
                  به معنای رخداد افت کامل یا نیاز به بازبینی تعریف متریک باشد.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <section>
        <div className="mb-4">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-black/82">
            عملکرد در افق‌های زمانی
          </h3>
          <p className="mt-1 text-sm leading-6 text-black/56">
            افق‌های کوتاه و بلند جدا نگه داشته شده‌اند و به یک امتیاز واحد فشرده
            نشده‌اند.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {horizonOrder.map((horizon) => (
            <HorizonCard
              key={horizon}
              horizon={horizon}
              metrics={overall.horizons[horizon]}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-black/82">
            شکست و موفقیت در شرایط کلیدی
          </h3>
          <p className="mt-1 text-sm leading-6 text-black/56">
            این بخش‌ها برای تشخیص ناحیه‌های قابل اتکا و ناحیه‌های آسیب پذیر مدل طراحی
            شده‌اند.
          </p>
        </div>

        <BacktestGroupedSection
          title={sectionLabels.byCompositeAction.title}
          description={sectionLabels.byCompositeAction.description}
          groups={report.byCompositeAction ?? []}
          defaultSortMetric="sampleCount"
          defaultSortHorizon="20d"
        />
        <BacktestGroupedSection
          title={sectionLabels.byScoreBucket.title}
          description={sectionLabels.byScoreBucket.description}
          groups={report.byScoreBucket ?? []}
          defaultSortMetric="avgReturn"
          defaultSortHorizon="20d"
        />
        <BacktestGroupedSection
          title={sectionLabels.byVolatilityRegime.title}
          description={sectionLabels.byVolatilityRegime.description}
          groups={report.byVolatilityRegime ?? []}
          defaultSortMetric="avgReturn"
          defaultSortHorizon="20d"
        />
        <BacktestGroupedSection
          title={sectionLabels.byLiquidityBucket.title}
          description={sectionLabels.byLiquidityBucket.description}
          groups={report.byLiquidityBucket ?? []}
          defaultSortMetric="profitFactorLikeRatio"
          defaultSortHorizon="60d"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-black/82">
            زمینه‌های ثانویه
          </h3>
          <p className="mt-1 text-sm leading-6 text-black/56">
            این بخش‌ها کمک می‌کنند بدانیم آیا سوگیری بازار یا برش‌های گزارش سفارشی،
            رفتار متفاوتی نشان می‌دهند.
          </p>
        </div>

        {(report.byBias?.length ?? 0) > 0 ? (
          <BacktestGroupedSection
            title={sectionLabels.byBias.title}
            description={sectionLabels.byBias.description}
            groups={report.byBias ?? []}
            defaultSortMetric="avgReturn"
            defaultSortHorizon="60d"
          />
        ) : null}

        {showSector && report.bySector ? (
          <BacktestGroupedSection
            title={sectionLabels.bySector.title}
            description={sectionLabels.bySector.description}
            groups={report.bySector}
            defaultSortMetric="sampleCount"
            defaultSortHorizon="20d"
          />
        ) : null}

        {customGroups.map(([key, groups]) => (
          <BacktestGroupedSection
            key={key}
            title={key}
            description="این بخش به صورت خودکار از گروه بندی‌های گزارش محور رندر شده است."
            groups={groups}
            defaultSortMetric="sampleCount"
            defaultSortHorizon="20d"
          />
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-black/6 bg-white/74 p-5">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-black/82">
          یادداشت‌های ریسک و کیفیت داده
        </h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-black/6 bg-white/78 p-4 text-sm leading-6 text-black/62">
            ردیف‌هایی با کمتر از ۳۰ نمونه به عنوان کم اعتماد و با کمتر از ۱۰ نمونه
            به عنوان هشدار شدید علامت گذاری شده‌اند.
          </div>
          <div className="rounded-2xl border border-black/6 bg-white/78 p-4 text-sm leading-6 text-black/62">
            نسبت سود به زیان وقتی `null` است، به معنی عالی بودن نیست؛ معمولاً یعنی
            تعداد زیان‌ها برای محاسبه معنی دار کافی نبوده است.
          </div>
          <div className="rounded-2xl border border-black/6 bg-white/78 p-4 text-sm leading-6 text-black/62">
            این گزارش افق‌ها را با هم میانگین نمی‌گیرد. تصمیم گیری باید بر اساس هر
            افق و هر رژیم به صورت جداگانه انجام شود.
          </div>
        </div>
      </section>
    </section>
  );
}
