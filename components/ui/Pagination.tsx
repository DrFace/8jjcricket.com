export function PaginationComponet({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl border text-sm font-semibold transition-all
        bg-black/30 border-white/15 text-sky-100/70 hover:text-sky-100 hover:border-amber-400/40
        disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <span className="text-sm text-amber-200/80 font-semibold">
        Page {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-xl border text-sm font-semibold transition-all
        bg-black/30 border-white/15 text-sky-100/70 hover:text-sky-100 hover:border-amber-400/40
        disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
