"use client";

type PaginationProps = {
  page: number;
  lastPage: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({
  page,
  lastPage,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const pagesToShow = 5;
  const half = Math.floor(pagesToShow / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(lastPage, start + pagesToShow - 1);
  start = Math.max(1, end - pagesToShow + 1);

  const numbers: number[] = [];
  for (let p = start; p <= end; p++) numbers.push(p);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition"
          >
            1
          </button>
          {start > 2 && <span className="text-slate-400 px-2">...</span>}
        </>
      )}

      {numbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 rounded-xl border border-white/10 transition ${
            p === page
              ? "bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black font-semibold shadow-md"
              : "bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          {p}
        </button>
      ))}

      {end < lastPage && (
        <>
          {end < lastPage - 1 && (
            <span className="text-slate-400 px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(lastPage)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition"
          >
            {lastPage}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(lastPage, page + 1))}
        disabled={page >= lastPage}
        className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
      >
        Next
      </button>
    </div>
  );
}
