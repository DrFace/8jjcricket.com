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
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

export default function PrimaryButton({
  children,
  onClick,
  href,
  className,
  type = "button",
  disabled,
  size = "md",
  target,
  rel,
  ariaLabel,
}: ButtonProps) {
  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black font-semibold shadow-lg shadow-amber-500/30 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const shimmer = <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:animate-shimmer" />;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, sizeStyles[size], "group", className)}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, sizeStyles[size], "group", className)}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
