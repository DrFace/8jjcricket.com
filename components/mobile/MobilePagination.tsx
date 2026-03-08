type Props = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

const MobilePagination = ({ page, totalPages, setPage }: Props) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-xs text-white/70">
            Page <strong>{page}</strong> / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default MobilePagination;
