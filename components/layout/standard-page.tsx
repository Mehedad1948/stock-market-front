import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StandardPageProps = HTMLAttributes<HTMLElement>;

export function StandardPage({
  className,
  children,
  ...props
}: StandardPageProps) {
  return (
    <main
      className={cn(
        "min-h-screen pt-24 sm:pt-28 lg:pt-32",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
