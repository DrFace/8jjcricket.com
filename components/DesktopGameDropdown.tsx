"use client";

import React, { useState, useRef, useEffect } from "react";

interface Option {
  id: string | number;
  name: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "All Categories",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full mb-5" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/60 ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full rounded-xl bg-gradient-to-b from-[#FFD100] to-[#F97316] p-[1.5px] transition-all hover:shadow-[0_0_20px_rgba(255,209,0,0.25)] ${
            isOpen ? "ring-2 ring-yellow-400" : ""
          }`}
        >
          <div className="flex items-center justify-between rounded-[calc(0.75rem-1px)] bg-[#0B0E14] px-4 py-3">
            <span
              className={`text-sm font-bold ${
                value ? "text-white" : "text-gray-400"
              }`}
            >
              {value || placeholder}
            </span>
            <svg
              className={`h-4 w-4 text-[#FFD100] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Modal/Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-yellow-500/30 bg-[#0B0E14] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-yellow-500">
              {/* Default Empty Option */}
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
              >
                {placeholder}
              </button>

              {/* Dynamic Options */}
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.name);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold transition-all hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-transparent
                    ${
                      value === option.name
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "text-white"
                    }
                  `}
                >
                  {option.name}
                  {value === option.name && (
                    <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#FFD100]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
