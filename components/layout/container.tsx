import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({
  className,
  children,
  id,
  ...props
}: ContainerProps) {
  return (
    <div id={id} className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
