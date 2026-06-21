import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-primary-soft text-success border border-brand-500/15",
  secondary: "bg-muted text-muted-foreground border border-border",
  premium: "bg-gold-100 text-premium border border-gold-200 dark:bg-gold-400/12 dark:text-gold-300 dark:border-gold-400/20",
  dark: "bg-white/6 text-graphite-200 border border-white/10",
  success: "bg-primary-soft text-success border border-brand-500/15",
  warning: "bg-warning-soft text-warning border border-warning/20",
  danger: "bg-danger-soft text-danger border border-danger/20",
  info: "bg-info-soft text-info border border-info/20",
} as const;

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof badgeVariants;
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
