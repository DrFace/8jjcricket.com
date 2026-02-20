import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

export default function SecondaryButton({
  children,
  onClick,
  href,
  className,
  type = "button",
  disabled,
  size = "md",
  active = false,
  target,
  rel,
  ariaLabel,
}: ButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-xl border transition-all duration-300 backdrop-blur-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
    active
      ? "bg-amber-300/20 border-amber-400/50 text-amber-200 shadow-lg shadow-amber-500/10"
      : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-amber-400/30 hover:text-amber-100"
  );

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  if (href) {
    return (
      <Link 
        href={href} 
        className={cn(baseStyles, sizeStyles[size], className)}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, sizeStyles[size], className)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
