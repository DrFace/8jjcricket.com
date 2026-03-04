"use client";

import Link from "next/link";

type AnyRow = Record<string, any>;

interface BowlingTableProps {
  data: AnyRow[];
  players: Map<number, any>;
  teamId: number;
}

export default function BowlingTable({
  data,
  players,
  teamId,
}: BowlingTableProps) {
  const nameFor = (row: AnyRow) => {
    const pid = row.player_id ? Number(row.player_id) : undefined;
    const live = pid ? players.get(pid)?.fullname : undefined;
    return (
      live ??
      row.player_name ??
      row.fullname ??
      row.firstname ??
      row.player?.fullname ??
      row.player?.firstname ??
      (pid ? `Player ${pid}` : "—")
    );
  };

  return (
    <div className="table-scroll-x overflow-x-auto overflow-y-hidden">
      <table className="w-max min-w-full text-sm border-collapse">
        <thead className="text-left text-white bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 sticky top-0">
          <tr>
            <th className="py-1 px-2 w-max whitespace-nowrap">Bowler</th>
            <th className="py-1 px-2 text-center">O</th>
            <th className="py-1 px-2 text-center">M</th>
            <th className="py-1 px-2 text-center">R</th>
            <th className="py-1 px-2 text-center">W</th>
            <th className="py-1 px-2 text-center">ECO</th>
          </tr>
        </thead>
        <tbody>
          {data.length
            ? data.map((b: AnyRow) => {
                const label = nameFor(b);
                const pid = b.player_id ? Number(b.player_id) : undefined;

                return (
                  <tr
                    key={b.id ?? `${teamId}-bowl-${pid}-${b.overs}-${b.runs}`}
                    className="border-t"
                  >
                    <td className="py-1 px-2 w-max whitespace-nowrap">
                      {pid ? (
                        <Link
                          href={`/mobile/players/${pid}`}
                          className="text-white hover:underline"
                        >
                          {label}
                        </Link>
                      ) : (
                        label
                      )}
                    </td>
                    <td className="py-1 px-2 text-center">{b.overs ?? "–"}</td>
                    <td className="py-1 px-2 text-center">
                      {b.medians ?? "–"}
                    </td>
                    <td className="py-1 px-2 text-center">{b.runs ?? "–"}</td>
                    <td className="py-1 px-2 text-center">
                      {b.wickets ?? "–"}
                    </td>
                    <td className="py-1 px-2 text-center">{b.rate ?? "–"}</td>
                  </tr>
                );
              })
            : Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="py-1 px-2 w-max whitespace-nowrap">–</td>
                  <td className="py-1 px-2 text-center">–</td>
                  <td className="py-1 px-2 text-center">–</td>
                  <td className="py-1 px-2 text-center">–</td>
                  <td className="py-1 px-2 text-center">–</td>
                  <td className="py-1 px-2 text-center">–</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
