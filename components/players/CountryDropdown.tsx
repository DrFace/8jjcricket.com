"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CountryOption = {
  id: number;
  name: string;
};

type CountryDropdownProps = {
  countries: CountryOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function CountryDropdown({
  countries,
  value,
  onChange,
}: CountryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const activeLabel = useMemo(() => {
    if (!value) return "All";
    return countries.find((c) => String(c.id) === value)?.name ?? "All";
  }, [countries, value]);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, search]);

  return (
    <div className="relative z-50" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (!next) setSearch("");
            return next;
          });
        }}
        className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition-all hover:border-india-gold/40 focus:border-india-gold/50 focus:ring-2 focus:ring-india-gold/30"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{activeLabel}</span>
        <svg
          className={[
            "h-4 w-4 text-white/70 transition-transform",
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

      {open ? (
        <div
          className="absolute z-[60] mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/15 bg-slate-950/95 shadow-2xl"
          role="listbox"
        >
          <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-india-gold/50 focus:ring-2 focus:ring-india-gold/30"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onChange("");
              setSearch("");
              setOpen(false);
            }}
            className={[
              "block w-full px-3 py-2 text-left text-sm transition",
              value === ""
                ? "bg-gradient-to-r from-amber-300/90 via-yellow-400/90 to-orange-500/90 text-black font-semibold"
                : "text-white/70 hover:bg-white/10",
            ].join(" ")}
          >
            All
          </button>

          {filteredCountries.map((c) => {
            const optionValue = String(c.id);
            const isActive = optionValue === value;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setSearch("");
                  setOpen(false);
                }}
                className={[
                  "block w-full border-t border-white/10 px-3 py-2 text-left text-sm transition",
                  isActive
                    ? "bg-gradient-to-r from-amber-300/90 via-yellow-400/90 to-orange-500/90 text-black font-semibold"
                    : "text-white/70 hover:bg-white/10",
                ].join(" ")}
              >
                {c.name}
              </button>
            );
          })}

          {filteredCountries.length === 0 ? (
            <div className="border-t border-white/10 px-3 py-2 text-sm text-white/60">
              No country found.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
