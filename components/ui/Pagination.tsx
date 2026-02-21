import SecondaryButton from "./SecondaryButton";

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
      <SecondaryButton
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        size="sm"
      >
        Prev
      </SecondaryButton>

      <span className="text-sm text-amber-200/80 font-semibold">
        Page {page} / {totalPages}
      </span>

      <SecondaryButton
        type="button"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        size="sm"
      >
        Next
      </SecondaryButton>
    </div>
  );
}
