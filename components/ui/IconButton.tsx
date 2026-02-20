import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type IconButtonProps = {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  ariaLabel: string;
};

export default function IconButton({
  icon,
  onClick,
  href,
  className,
  type = "button",
  disabled,
  size = "md",
  ariaLabel,
}: IconButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-all duration-300 hover:bg-amber-950/60 hover:border-amber-400/30 shadow-lg backdrop-blur-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, sizeStyles[size], className)}
        aria-label={ariaLabel}
      >
        {icon}
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
      {icon}
    </button>
  );
}
