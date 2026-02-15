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
    <div className="shadow-2xl backdrop-blur-xl bg-slate-900/40 rounded-2xl p-4 border border-india-gold/20">
      {/* Title */}
      <div className="mb-3 text-lg font-bold text-india-gold india-header-text border-b border-india-gold/20 pb-2">{title}</div>

      {/* Table wrapper for overflow */}
      <div className="overflow-x-auto rounded-xl border border-india-gold/30 shadow-inner">
        <table className="min-w-full border-collapse text-sm text-white">
          <thead className="text-black bg-gradient-to-r from-india-saffron via-india-gold to-india-orange shadow-lg">
            <tr>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Type</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Season</th>

              {kind === "batting" ? (
                <>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Runs</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Inns</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Avg</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">SR</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">HS</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Overs</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Runs</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Wkts</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Eco</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">SR</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {visibleItems.map((c, idx) => (
              <tr
                key={`${c.type}-${c.season_id ?? "na"}-${start + idx}`}
                className={`border-t border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
              >
                <td className="px-4 py-3 text-india-gold font-medium">{c.type ?? "-"}</td>
                <td className="px-4 py-3 text-sky-100/90">{c.season_id ?? "-"}</td>

                {kind === "batting" ? (
                  <>
                    <td className="px-4 py-3 text-white font-bold">
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
                    <td className="px-4 py-3 text-white font-bold">
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
                <td colSpan={7} className="px-4 py-6 text-center text-white/70 italic">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {items.length > PAGE_SIZE && (
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

export default CareerDetailsTable;
