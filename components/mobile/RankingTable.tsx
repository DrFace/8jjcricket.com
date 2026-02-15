import Image from "next/image";

interface TeamRanking {
  id: number;
  name: string;
  image_path: string;
  ranking: {
    position: number;
    matches: number;
    points: number;
    rating: number;
  };
}

interface RankingTableProps {
  data: TeamRanking[];
  title: string;
  onViewAll?: () => void;
}

export default function RankingTable({ data, title }: RankingTableProps) {
  if (data.length === 0) return null;

  return (
    <section className="p-[1px] rounded-2xl bg-gradient-to-b from-india-gold/50 to-transparent">
      <div className="bg-slate-900/80 rounded-2xl p-4 overflow-hidden backdrop-blur-md">
        <div className="flex justify-between items-center mb-4 border-b border-india-gold/20 pb-2">
          <h2 className="text-sm font-bold text-india-gold uppercase tracking-wider india-header-text">
            {title}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                {["Pos", "Team", "Matches", "Points", "Rating"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-[10px] font-bold text-sky-100/60 uppercase tracking-widest"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((team, index) => (
                <tr
                  key={team.id}
                  className={`transition-colors rounded-lg group hover:bg-white/5 ${
                    index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-india-gold first:rounded-l-lg">
                    {team.ranking.position}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-white/5 rounded-full border border-white/10 w-8 h-8 flex items-center justify-center overflow-hidden">
                        <Image
                          src={team.image_path}
                          alt={team.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-semibold text-white group-hover:text-india-gold transition-colors">
                        {team.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-100/70">
                    {team.ranking.matches}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-100/70">
                    {team.ranking.points}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-india-saffron last:rounded-r-lg">
                    {team.ranking.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
