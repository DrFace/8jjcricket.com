"use client";

import React from "react";
import IconButton from "./ui/IconButton";

type BackButtonProps = {
  className?: string;
};

export default function DesktopBackButton({ className = "" }: BackButtonProps) {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <IconButton
      onClick={handleBack}
      ariaLabel="Go back"
      className={className}
      icon={
        <svg
          className="w-5 h-5 text-amber-300 group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      }
    />
  );
}
