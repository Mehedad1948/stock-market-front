import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-neon-200/20 text-neon-700 border border-neon-300/50 dark:bg-neon-200/15 dark:text-neon-200",
  primary: "bg-primary/15 text-primary border border-primary/30",
  secondary: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  accent: "bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300",
  premium: "bg-violet-600/15 text-violet-600 border border-violet-600/30 dark:bg-violet-600/10 dark:text-violet-300",
  dark: "bg-white/6 text-graphite-200 border border-white/10",
  success: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  warning: "bg-rose-500/15 text-rose-600 border border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  danger: "bg-rose-500/20 text-rose-600 border border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300",
  info: "bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300",
  muted: "bg-graphite-200/50 text-graphite-600 border border-graphite-300 dark:bg-graphite-700/50 dark:text-graphite-300",
  dashboard: "border border-black/6 bg-[#fbfbf8] text-[#17181c]",
  "dashboard-highlight": "border border-[#d9e777] bg-[#efff78] text-[#17181c]",
  "dashboard-dark": "border border-transparent bg-[#17181c] text-white",
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
