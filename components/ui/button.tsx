import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    // Primary - Neon accent
    default:
      "bg-primary text-primary-foreground hover:bg-neon-300 shadow-lg shadow-neon-200/20 hover:shadow-neon-200/40 active:shadow-neon-200/20",
    primary:
      "bg-primary text-primary-foreground hover:bg-neon-300 shadow-lg shadow-neon-200/20 hover:shadow-neon-200/40",
    
    // Secondary - Emerald
    secondary:
      "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40",
    
    // Accent - Cyan/Interactive
    accent:
      "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40",
    
    // Violet - Premium/Special
    premium:
      "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40",
    
    // Ghost - Transparent
    ghost:
      "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary",
    
    // Outline - Border
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 bg-transparent",
    
    // Dark - Glass effect
    dark:
      "bg-white/8 text-white border border-white/10 hover:bg-white/12 backdrop-blur",
    
    // Destructive - Rose/Error
    destructive:
      "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40",
    
    // Muted - Subtle
    muted:
      "bg-muted text-muted-foreground hover:bg-muted/80",
  },
  size: {
    xs: "h-8 px-3 text-xs",
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm font-medium",
    lg: "h-12 px-6 text-base font-semibold",
    xl: "h-14 px-8 text-base font-semibold",
    icon: "h-10 w-10",
    "icon-sm": "h-8 w-8",
    "icon-lg": "h-12 w-12",
  },
} as const;

type Variant = keyof typeof buttonVariants.variant;
type Size = keyof typeof buttonVariants.size;

function getButtonClasses(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-95",
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
