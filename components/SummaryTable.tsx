import React, { useEffect, useMemo, useState } from "react";

type StatRow<T> = {
  label: string;
  get: (v: T | null) => React.ReactNode;
};

type SummaryTableProps<T> = {
  title: string;
  columns: string[];
  dataByColumn: Record<string, T | null>;
  rows: StatRow<T>[];
  pageSize?: number;
};

export function SummaryTable<T>({
  title,
  columns,
  dataByColumn,
  rows,
  pageSize = 10,
}: SummaryTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  useEffect(() => {
    setPage(1);
  }, [title, columns.join("|"), rows.length, pageSize]);

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  return (
    <div className="shadow-2xl backdrop-blur-xl bg-slate-900/40 rounded-2xl p-4 border border-india-gold/20">
      {/* Title */}
      <div className="mb-3 text-lg font-bold text-india-gold india-header-text border-b border-india-gold/20 pb-2">{title}</div>

      {/* Mobile hint */}
      <div className="mb-2 block text-xs text-sky-100/60 md:hidden font-medium">
        Swipe left/right to see more →
      </div>

      {/* Table wrapper (horizontal scroll on small screens) */}
      <div
        className="w-full overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-india-gold/30 shadow-inner"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="border-collapse text-sm text-white w-full">
          {/* 👆 min-w-max forces horizontal scrolling when needed */}
          <thead className="bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black shadow-lg">
            <tr className="bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black shadow-lg">
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs" />

              {columns.map((c) => (
                <th key={c} className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((r, i) => (
              <tr
                key={r.label}
                className={`border-t border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
              >
                {/* sticky first column (optional but very useful on mobile) */}
                <td className="sticky left-0 bg-slate-900/90 px-4 py-3 font-bold text-india-gold backdrop-blur-md border-r border-white/5 shadow-[4px_0_8px_rgba(0,0,0,0.2)]">
                  {r.label}
                </td>

                {columns.map((c) => (
                  <td
                    key={c}
                    className="px-4 py-3 text-white whitespace-nowrap font-medium"
                  >
                    {/* whitespace-nowrap keeps cell content from wrapping weirdly */}
                    {r.get(dataByColumn[c] ?? null)}
                  </td>
                ))}
              </tr>
            ))}

            {visibleRows.length === 0 && (
              <tr className="border-t border-white/10">
                <td
                  colSpan={Math.max(1, columns.length + 1)}
                  className="px-4 py-6 text-center text-white/70 italic"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {rows.length > pageSize && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
            className={[
              "rounded-full border px-4 py-2 text-sm font-bold transition-all shadow-md",
              canPrev
                ? "border-india-gold/50 bg-slate-900/60 text-india-gold hover:bg-india-gold/10 hover:border-india-gold"
                : "cursor-not-allowed border-white/5 bg-transparent text-white/20",
            ].join(" ")}
          >
            Prev
          </button>

          <div className="text-xs text-sky-100/80 sm:text-sm font-medium">
            Page <span className="font-bold text-india-gold">{page}</span> of{" "}
            <span className="font-bold text-india-gold">{totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext}
            className={[
              "rounded-full border px-4 py-2 text-sm font-bold transition-all shadow-md",
              canNext
                ? "border-india-gold/50 bg-slate-900/60 text-india-gold hover:bg-india-gold/10 hover:border-india-gold"
                : "cursor-not-allowed border-white/5 bg-transparent text-white/20",
            ].join(" ")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
