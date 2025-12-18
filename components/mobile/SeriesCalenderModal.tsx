import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiX } from "react-icons/fi";
import { SeriesCalender } from "./SeriesCalender";

type DropdownItem = {
  key?: string;
  label: React.ReactNode;
  value?: any;
  onSelect?: (value?: any) => void;
  disabled?: boolean;
};

type CalenderModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  defaultOpen?: boolean;
  trigger?: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  title?: string;
  closeOnSelect?: boolean;
  className?: string;
  portalTarget?: Element | null;
  setParentSelectedDate?: (date: string | null) => void;
  fixtures?: { starting_at: string }[];
  closeOnOutsideClick?: boolean;
  minDate?: string;
  maxDate?: string;
  setOpen?: (open: boolean) => void;
  selectedDate?: string | null;
  setSelectedDate?: (date: string | null) => void;
};

function toDateString(d: Date) {
  // YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* --- Dropdown modal that renders the Calendar inside the portal overlay --- */

export default function SeriesCalenderModal(props: CalenderModalProps) {
  const {
    isOpen: isOpenControlled,
    onClose,
    defaultOpen = false,
    portalTarget = typeof document !== "undefined" ? document.body : null,
    minDate,
    maxDate,
    closeOnOutsideClick = false,
    setOpen,
    selectedDate,
    setSelectedDate,
  } = props;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState<boolean>(defaultOpen);
  const isControlled = typeof isOpenControlled === "boolean";
  const open = isControlled ? (isOpenControlled as boolean) : uncontrolledOpen;

  const toggleOpen = (next?: boolean) => {
    const value = typeof next === "boolean" ? next : !open;
    if (!isControlled) setUncontrolledOpen(value);
    if (!value && onClose) onClose();
    setOpen && setOpen(!open);
  };

  const contentRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = contentRef.current;
      const trg = triggerRef.current;
      const target = e.target as Node | null;

      if (!el) return;
      if (el.contains(target)) return;
      if (trg && trg.contains(target)) return;

      toggleOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, closeOnOutsideClick]);

  // Lock scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleTriggerClick = () => {
    toggleOpen();
  };

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      className={`dropdown-modal-overlay`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        WebkitBackdropFilter: "blur(6px)",
        padding: 16,
      }}
    >
      <div
        ref={contentRef}
        className="relative bg-slate-900 rounded-xl p-4 shadow-2xl w-80"
      >
        <button
          type="button"
          onClick={() => toggleOpen(false)}
          className="absolute right-3 top-3 rounded-full p-1 text-amber-200 hover:bg-white/10"
        >
          <FiX size={16} />
        </button>
        <div className="mb-6" />
        <SeriesCalender
          selectedDate={selectedDate ?? null}
          onSelectDate={
            setSelectedDate
              ? (date) => {
                  setSelectedDate(date);
                  toggleOpen(false);
                }
              : () => {}
          }
          minDate={minDate}
          maxDate={maxDate}
          setOpen={setOpen}
        />
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-4 shadow-2xl flex items-center justify-between w-full"
      >
        <div>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold tracking-tight text-amber-200 text-left">
              Filter by date
            </h2>
            <span className="ml-4 flex items-center">
              <span className="text-xs font-medium text-amber-100/90">
                {selectedDate ?? toDateString(new Date())}
              </span>
            </span>
          </div>

          <p className="mt-1 text-xs text-sky-100/70">
            Pick a day to see matches scheduled on that date.
          </p>
        </div>

        <div className="ml-4 flex-shrink-0">
          <FiChevronDown
            className={`text-amber-200 transition-transform duration-150 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            size={20}
            aria-hidden="true"
          />
        </div>
      </button>

      {open && portalTarget ? createPortal(content, portalTarget) : null}
    </>
  );
}
