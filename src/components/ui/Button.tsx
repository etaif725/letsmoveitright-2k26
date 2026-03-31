import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "outline" | "secondary";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wide transition-all";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-heading shadow-sm hover:bg-primary-dark hover:shadow-md active:scale-[0.98]",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-heading",
  secondary:
    "bg-heading text-white hover:bg-dark-accent active:scale-[0.98]",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    ComponentPropsWithoutRef<"button"> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, children, ...rest } = props;
    return (
      <Link to={href} className={cls} {...(rest as Record<string, unknown>)}>
        {children}
      </Link>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export const BTN = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold tracking-wide text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]",
  primaryLg:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-bold tracking-wide text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-bold tracking-wide text-primary transition-all hover:bg-primary hover:text-heading",
  back:
    "rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-500 transition-colors hover:border-gray-400 hover:text-heading",
} as const;
