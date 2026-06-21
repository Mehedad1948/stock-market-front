import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default:
      "bg-primary text-primary-foreground hover:bg-brand-400 shadow-glass",
    secondary:
      "bg-card text-foreground border border-border hover:border-brand-400/30 hover:bg-muted",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
    premium:
      "bg-premium text-premium-foreground hover:bg-gold-400 shadow-glass",
    dark:
      "bg-white/8 text-white border border-white/10 hover:bg-white/12",
  },
  size: {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-sm",
    icon: "h-10 w-10",
  },
} as const;

type Variant = keyof typeof buttonVariants.variant;
type Size = keyof typeof buttonVariants.size;

function getButtonClasses(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    className,
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: false;
  };

type ButtonLinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps | ButtonLinkProps) {
  const classes = getButtonClasses(variant, size, className);

  if ("href" in props) {
    const { href, ...anchorProps } = props;

    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
