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

export function MobileSummaryTable<T>({
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
    <div className="shadow-lg backdrop-blur">
      {/* Title */}
      <div className="mb-3 text-lg font-semibold text-amber-300">{title}</div>

      {/* Mobile hint */}
      <div className="mb-2 block text-xs text-white/60 md:hidden">
        Swipe left/right to see more →
      </div>

      {/* Table wrapper (horizontal scroll on small screens) */}
      <div
        className="rounded-xl border border-amber-600 inline-block w-fit overflow-hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="border-collapse text-sm text-white w-auto">
          {/* 👆 min-w-max forces horizontal scrolling when needed */}
          <thead className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 text-black shadow-lg">
            <tr className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 text-black shadow-lg">
              <th className="py-3 text-left font-semibold px-3" />

              {columns.map((c) => (
                <th
                  key={c}
                  className="py-3 px-0 mx-0 text-left font-semibold px-4"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((r) => (
              <tr
                key={r.label}
                className="border-t border-white/10 hover:bg-white/5 "
              >
                {/* sticky first column (optional but very useful on mobile) */}
                <td className="sticky left-0 z-10 w-24 min-w-24 max-w-28 py-3 px-2 font-medium text-white">
                  {r.label}
                </td>

                {columns.map((c) => (
                  <td
                    key={c}
                    className="py-3 px-3 text-white whitespace-nowrap"
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
                  className="py-6 text-center text-white/70"
                >
                  No data
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
              "rounded-full border py-2 text-sm font-semibold transition",
              canPrev
                ? "border-amber-800 bg-white/5 text-amber-300 hover:bg-white/10"
                : "cursor-not-allowed border-white/10 bg-transparent text-white/40",
            ].join(" ")}
          >
            Prev
          </button>

          <div className="text-xs text-white/80 sm:text-sm">
            Page <span className="font-semibold text-white">{page}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext}
            className={[
              "rounded-full border py-2 text-sm font-semibold transition",
              canNext
                ? "border-amber-800 bg-white/5 text-amber-300 hover:bg-white/10"
                : "cursor-not-allowed border-white/10 bg-transparent text-white/40",
            ].join(" ")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
