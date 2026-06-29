import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DashboardPanel({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "accent" | "amber" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border p-5 sm:p-6",
        tone === "default" &&
          "border-black/6 bg-[#fbfbf8] text-[#17181c]",
        tone === "muted" &&
          "border-[#e5eadf] bg-[#eef2ea] text-[#17181c]",
        tone === "accent" &&
          "border-[#dbe96d] bg-[#efff78] text-[#17181c]",
        tone === "amber" &&
          "border-[#efd3a2] bg-[#f7e6c5] text-[#17181c]",
        tone === "dark" &&
          "border-black/10 bg-[#1a1b20] text-white",
        className,
      )}
      {...props}
    />
  );
}

export function DashboardIconFrame({
  className,
  children,
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-black/6 bg-[#fbfbf8]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardDotMeter({
  total = 7,
  filled,
  tone = "dark",
}: {
  total?: number;
  filled: number;
  tone?: "dark" | "light";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const active = index < filled;

        return (
          <span
            key={index}
            className={cn(
              "h-16 w-10 rounded-full border",
              active
                ? tone === "dark"
                  ? "border-transparent bg-[#25231e]"
                  : "border-transparent bg-[#fbfbf8]"
                : "border-dashed border-black/16 bg-transparent",
            )}
          />
        );
      })}
    </div>
  );
}

export function DashboardSectionLabel({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm font-medium tracking-[-0.02em] text-black/55",
        className,
      )}
      {...props}
    />
  );
}
