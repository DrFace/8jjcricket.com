"use client";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <button
        type="button"
        className="w-full p-3 rounded-xl border border-blue-400 bg-gradient-to-r from-blue-900/80 to-indigo-800/80 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected ? selected.label : "All Categories"}</span>
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-xl bg-gradient-to-r from-blue-900/90 to-indigo-800/90 shadow-lg border border-blue-400 animate-fadeIn">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`block w-full text-left px-4 py-2 text-white font-medium hover:bg-blue-700/60 focus:bg-blue-700/80 transition-colors rounded-xl ${
                value === opt.value ? "bg-blue-700/80" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
