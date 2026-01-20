import { Career } from "@/types/player";
import { useMemo, useState, useEffect } from "react";

export function CareerDetailsTable({
  title,
  careers,
  kind,
}: {
  title: string;
  careers: Career[];
  kind: "batting" | "bowling";
}) {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const items = useMemo(
    () => careers.filter((c) => (kind === "batting" ? c.batting : c.bowling)),
    [careers, kind]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [kind, items.length]);

  const start = (page - 1) * PAGE_SIZE;
  const visibleItems = items.slice(start, start + PAGE_SIZE);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="shadow-lg backdrop-blur">
      {/* Title */}
      <div className="mb-3 text-lg font-semibold text-amber-300">{title}</div>

      {/* Table wrapper for overflow */}
      <div className="overflow-x-auto rounded-xl border border-amber-600">
        <table className="min-w-full border-collapse text-sm text-white">
          <thead className="text-black bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 shadow-lg">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Season</th>

              {kind === "batting" ? (
                <>
                  <th className="px-4 py-3 text-left font-semibold">Runs</th>
                  <th className="px-4 py-3 text-left font-semibold">Inns</th>
                  <th className="px-4 py-3 text-left font-semibold">Avg</th>
                  <th className="px-4 py-3 text-left font-semibold">SR</th>
                  <th className="px-4 py-3 text-left font-semibold">HS</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-left font-semibold">Overs</th>
                  <th className="px-4 py-3 text-left font-semibold">Runs</th>
                  <th className="px-4 py-3 text-left font-semibold">Wkts</th>
                  <th className="px-4 py-3 text-left font-semibold">Eco</th>
                  <th className="px-4 py-3 text-left font-semibold">SR</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {visibleItems.map((c, idx) => (
              <tr
                key={`${c.type}-${c.season_id ?? "na"}-${start + idx}`}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3 text-white">{c.type ?? "-"}</td>
                <td className="px-4 py-3 text-white">{c.season_id ?? "-"}</td>

                {kind === "batting" ? (
                  <>
                    <td className="px-4 py-3 text-white">
                      {c.batting?.runs_scored ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.batting?.innings ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.batting?.average ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.batting?.strike_rate ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.batting?.highest_inning_score ?? "-"}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-white">
                      {c.bowling?.overs ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.bowling?.runs ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.bowling?.wickets ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.bowling?.econ_rate ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {c.bowling?.strike_rate ?? "-"}
                    </td>
                  </>
                )}
              </tr>
            ))}

            {visibleItems.length === 0 && (
              <tr className="border-t border-white/10">
                <td colSpan={7} className="px-4 py-6 text-center text-white/70">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {items.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
            className={[
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              canPrev
                ? "border-amber-800 bg-white/5 text-amber-300 hover:bg-white/10"
                : "cursor-not-allowed border-white/10 bg-white/0 text-white/40",
            ].join(" ")}
          >
            Prev
          </button>

          <div className="text-sm text-white/80">
            Page <span className="font-semibold text-white">{page}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext}
            className={[
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              canNext
                ? "border-amber-800 bg-white/5 hover:bg-white/10 text-amber-300"
                : "cursor-not-allowed border-white/10 bg-white/0 text-white/40",
            ].join(" ")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CareerDetailsTable;
