export const signalToneMap = {
  STRONG_BUY: "success",
  PROBABLE_BUY: "success",
  HOLD: "neutral",
  CAUTION: "warning",
  RISK_SELL: "danger",
  CONFIRMED_SELL: "danger",
} as const;

export const timeframeToneMap = {
  BUY: "success",
  PROBABLE_BUY: "success",
  HOLD: "neutral",
  WAIT: "neutral",
  CAUTION: "warning",
  REDUCE: "danger",
  EXIT: "danger",
} as const;

export const badgeToneClassMap = {
  success: "bg-primary-soft text-success ring-1 ring-inset ring-primary/20",
  neutral: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  warning: "bg-warning-soft text-warning ring-1 ring-inset ring-warning/20",
  danger: "bg-danger-soft text-danger ring-1 ring-inset ring-danger/20",
  info: "bg-info-soft text-info ring-1 ring-inset ring-info/20",
  premium: "bg-gold-100 text-premium ring-1 ring-inset ring-gold-300 dark:bg-gold-400/12 dark:text-gold-300 dark:ring-gold-400/20",
} as const;

export type BadgeTone = keyof typeof badgeToneClassMap;
