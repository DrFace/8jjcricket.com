"use client";

import { useMemo, useState } from "react";

type CalendarProps = {
  selectedDate: string | null;
  onSelectDate: (value: string | null) => void;
  minDate?: string;
  maxDate?: string;
  setOpen?: (open: boolean) => void;
};

// Calendar helper functions
function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const mm = month < 10 ? `0${month}` : `${month}`;
  const dd = day < 10 ? `0${day}` : `${day}`;
  return `${year}-${mm}-${dd}`;
}

export function SeriesCalender({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  setOpen,
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
    setOpen && setOpen(false);
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
                disabled &&
                  "cursor-not-allowed opacity-40 hover:bg-transparent",
                !selected &&
                  isToday &&
                  !disabled &&
                  "border border-amber-400 text-amber-300",
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
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
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
