import { useMemo, useState } from "react";
import { toDateString } from "@/lib/date";

type CalendarProps = {
  selectedDate: string | null;
  onSelectDate: (value: string | null) => void;
  minDate?: string;
  maxDate?: string;
};

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
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }

    const weekRows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7)
      weekRows.push(days.slice(i, i + 7));
    return { weekRows };
  }, [viewMonth]);

  const isDisabled = (day: Date) => {
    if (min && day < min) return true;
    if (max && day > max) return true;
    return false;
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
  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <button
          type="button"
          className="rounded-md px-2 py-1 text-india-gold hover:bg-white/10 transition-colors"
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
            className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-india-gold shadow-sm focus:outline-none focus:ring-1 focus:ring-india-gold backdrop-blur-sm"
            value={monthIndex}
            onChange={(e) =>
              setViewMonth(new Date(yearValue, Number(e.target.value), 1))
            }
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx} className="bg-slate-900">
                {name.slice(0, 3)}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-india-gold shadow-sm focus:outline-none focus:ring-1 focus:ring-india-gold backdrop-blur-sm"
            value={yearValue}
            onChange={(e) =>
              setViewMonth(new Date(Number(e.target.value), monthIndex, 1))
            }
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
          className="rounded-md px-2 py-1 text-india-gold hover:bg-white/10 transition-colors"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
            )
          }
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-wide text-india-gold">
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
              onClick={() => !disabled && onSelectDate(dayStr)}
              className={[
                "h-7 w-7 rounded-md text-center leading-7 transition",
                "text-white",
                "hover:bg-white/10",
                selected &&
                  "bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black font-bold hover:brightness-110",
                disabled &&
                  "cursor-not-allowed opacity-40 hover:bg-transparent",
                !selected &&
                  isToday &&
                  !disabled &&
                  "border border-india-gold text-india-gold",
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
            const today = new Date();
            const normalized = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
            setViewMonth(
              new Date(normalized.getFullYear(), normalized.getMonth(), 1)
            );
            onSelectDate(toDateString(normalized));
          }}
          className="text-[11px] font-medium text-india-gold hover:text-india-gold/80 transition-colors"
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

export default function MatchDateFilter({
  selectedDate,
  onChange,
  minDate,
  maxDate,
}: {
  selectedDate: string | null;
  onChange: (d: string | null) => void;
  minDate?: string;
  maxDate?: string;
}) {
  return (
    <div className="mb-6 max-w-sm mx-auto lg:float-right lg:ml-6 lg:mb-0">
      <div className="rounded-xl border border-india-gold/30 bg-slate-900/80 backdrop-blur-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-india-gold uppercase tracking-wide">
            Filter by Date
          </h3>
          {selectedDate && (
            <button
              onClick={() => onChange(null)}
              className="text-xs text-sky-200 hover:text-white transition-colors font-medium"
            >
              Show All
            </button>
          )}
        </div>

        <Calendar
          selectedDate={selectedDate}
          onSelectDate={onChange}
          minDate={minDate}
          maxDate={maxDate}
        />

        {selectedDate && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-india-gold/80">
              Showing matches for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
