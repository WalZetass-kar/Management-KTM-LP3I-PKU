import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface SharedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonAsButton = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/92",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85",
  outline: "border border-border bg-transparent text-foreground hover:bg-secondary/65",
  ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/92",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10",
};

function getButtonClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";

  if ("href" in props && props.href) {
    const { children, className, href, variant: _variant, size: _size, ...rest } = props;

    return (
      <Link href={href} className={getButtonClassName(variant, size, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    children,
    className,
    variant: _variant,
    size: _size,
    type,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button type={type ?? "button"} className={getButtonClassName(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
