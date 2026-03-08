"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

type MobileNewsCategoryDropdownProps = {
  categories: CategoryOption[];
  activeCategory: string | null;
  onChange: (slug: string | null) => void;
  disabled?: boolean;
};

export default function MobileNewsCategoryDropdown({
  categories,
  activeCategory,
  onChange,
  disabled = false,
}: MobileNewsCategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeLabel = useMemo(() => {
    if (!activeCategory) return "All Categories";
    const found = categories.find((cat) => cat.slug === activeCategory);
    return found?.name ?? "All Categories";
  }, [activeCategory, categories]);

  return (
    <div className="mb-4" ref={wrapperRef}>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/60">
        Category
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{activeLabel}</span>
        <svg
          className={[
            "h-4 w-4 text-white/80 transition-transform",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && !disabled ? (
        <div className="mt-2 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/50 shadow-xl h-72 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={[
              "block w-full px-4 py-3 text-left text-sm transition",
              activeCategory === null
                ? "bg-gradient-to-r from-amber-300/90 via-yellow-400/90 to-orange-500/90 text-black font-semibold"
                : "text-white/80 hover:bg-white/10",
            ].join(" ")}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.slug);
                  setOpen(false);
                }}
                className={[
                  "block w-full border-t border-white/10 px-4 py-3 text-left text-sm transition",
                  isActive
                    ? "bg-gradient-to-r from-amber-300/90 via-yellow-400/90 to-orange-500/90 text-black font-semibold"
                    : "text-white/80 hover:bg-white/10",
                ].join(" ")}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
