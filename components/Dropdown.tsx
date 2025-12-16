import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";

type DropdownItem = {
    key?: string;
    label: React.ReactNode;
    value?: any;
    onSelect?: (value?: any) => void;
    disabled?: boolean;
};

type DropdownModalProps = {
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
};

/* --- Calendar component and helpers (integrated into the dropdown) --- */

type CalendarProps = {
    selectedDate: string | null;
    onSelectDate: (date: string | null) => void;
    minDate?: string | null;
    maxDate?: string | null;
};

function toDateString(d: Date) {
    // YYYY-MM-DD
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function Calendar({
    selectedDate,
    onSelectDate,
    minDate,
    maxDate,
}: CalendarProps) {
    const initialMonth = selectedDate ? new Date(selectedDate) : new Date();
    const [viewMonth, setViewMonth] = useState<Date>(
        new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
    );

    const min = minDate ? new Date(minDate) : undefined;
    const max = maxDate ? new Date(maxDate) : undefined;

    const weeks = useMemo(() => {
        const startOfMonth = new Date(
            viewMonth.getFullYear(),
            viewMonth.getMonth(),
            1
        );
        const startDay = startOfMonth.getDay();
        const gridStart = new Date(startOfMonth);
        gridStart.setDate(startOfMonth.getDate() - startDay);

        const days: Date[] = [];
        for (let i = 0; i < 42; i += 1) {
            const d = new Date(gridStart);
            d.setDate(gridStart.getDate() + i);
            days.push(d);
        }

        const weekRows: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weekRows.push(days.slice(i, i + 7));
        }

        return { weekRows };
    }, [viewMonth]);

    const isDisabled = (day: Date) => {
        if (min && day < min) return true;
        if (max && day > max) return true;
        return false;
    };

    const handleDayClick = (day: Date) => {
        if (isDisabled(day)) return;
        const value = toDateString(day);
        onSelectDate(value);
    };

    const todayStr = toDateString(new Date());

    const monthIndex = viewMonth.getMonth();
    const yearValue = viewMonth.getFullYear();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const currentYear = new Date().getFullYear();
    const startYear = min ? min.getFullYear() : currentYear - 3;
    const endYear = max ? max.getFullYear() : currentYear + 3;
    const yearOptions: number[] = [];
    for (let y = startYear; y <= endYear; y += 1) {
        yearOptions.push(y);
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = Number(e.target.value);
        setViewMonth(new Date(yearValue, newMonth, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = Number(e.target.value);
        setViewMonth(new Date(newYear, monthIndex, 1));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
                <button
                    type="button"
                    className="rounded-md px-2 py-1 text-amber-300 hover:bg-white/10 transition-colors"
                    onClick={() =>
                        setViewMonth(
                            new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
                        )
                    }
                >
                    ‹
                </button>

                <div className="flex items-center gap-1">
                    <select
                        className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-amber-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-400 backdrop-blur-sm"
                        value={monthIndex}
                        onChange={handleMonthChange}
                    >
                        {monthNames.map((name, idx) => (
                            <option key={name} value={idx} className="bg-slate-900">
                                {name.slice(0, 3)}
                            </option>
                        ))}
                    </select>

                    <select
                        className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-amber-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-400 backdrop-blur-sm"
                        value={yearValue}
                        onChange={handleYearChange}
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y} className="bg-slate-900">
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    className="rounded-md px-2 py-1 text-amber-300 hover:bg-white/10 transition-colors"
                    onClick={() =>
                        setViewMonth(
                            new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
                        )
                    }
                >
                    ›
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-wide text-amber-300">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs">
                {weeks.weekRows.flat().map((day, idx) => {
                    const dayStr = toDateString(day);
                    const selected = selectedDate === dayStr;
                    const isToday = dayStr === todayStr;
                    const disabled = isDisabled(day);

                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDayClick(day)}
                            className={[
                                "h-7 w-7 rounded-md text-center leading-7 transition",
                                "text-white",
                                "hover:bg-white/10",
                                selected &&
                                    "bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black font-bold hover:brightness-110",
                                disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                                !selected && isToday && !disabled && "border border-amber-400 text-amber-300",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-1">
                <button
                    type="button"
                    onClick={() => {
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                        onSelectDate(toDateString(today));
                    }}
                    className="text-[11px] font-medium text-amber-300 hover:text-amber-200 transition-colors"
                >
                    Today
                </button>
                <button
                    type="button"
                    onClick={() => onSelectDate(null)}
                    className="text-[11px] font-medium text-sky-200 hover:text-white transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

/* --- Dropdown modal that renders the Calendar inside the portal overlay --- */

export default function DropdownModal(props: DropdownModalProps) {
    const {
        isOpen: isOpenControlled,
        onClose,
        defaultOpen = false,
        closeOnSelect = true,
        portalTarget = typeof document !== "undefined" ? document.body : null,
        setParentSelectedDate = () => {},
        fixtures = [],
    } = props;

    const [uncontrolledOpen, setUncontrolledOpen] =
        useState<boolean>(defaultOpen);
    const isControlled = typeof isOpenControlled === "boolean";
    const open = isControlled ? (isOpenControlled as boolean) : uncontrolledOpen;

      const sortedFixtures = useMemo(
        () =>
          [...fixtures].sort(
            (a, b) =>
              new Date(a.starting_at).getTime() -
              new Date(b.starting_at).getTime(),
          ),
        [fixtures],
      )

      const minDate =
    sortedFixtures.length > 0
      ? sortedFixtures[0].starting_at.slice(0, 10)
      : undefined
  const maxDate =
    sortedFixtures.length > 0
      ? sortedFixtures[sortedFixtures.length - 1].starting_at.slice(0, 10)
      : undefined

    const toggleOpen = (next?: boolean) => {
        const value = typeof next === "boolean" ? next : !open;
        if (!isControlled) setUncontrolledOpen(value);
        if (!value && onClose) onClose();
    };

    const contentRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    // local selected date state to show/track selection from calendar
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;

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
    }, [open]);

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

    const handleSelectDate = (date: string | null) => {
        setSelectedDate(date);
        setParentSelectedDate(date);
        if (date && closeOnSelect) {
            toggleOpen(false);
            if (onClose) onClose();
        }
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
                background: "rgba(0,0,0,0.25)",
                padding: 16,
            }}
        >
            <div
                ref={contentRef}
                className="bg-slate-900 rounded-xl p-4 shadow-2xl w-80"
                role="document"
            >
                <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    minDate={minDate}
                    maxDate={maxDate}
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
                    <div className="flex items-center justify-between w-full" >
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
