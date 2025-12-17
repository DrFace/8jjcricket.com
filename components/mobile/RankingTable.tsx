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
    <section className="p-[1px] rounded-2xl bg-gradient-to-b from-[#FFD100]/50 to-transparent">
      <div className="bg-[#0B0E14] rounded-2xl p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-[#FFD100] uppercase tracking-wider">
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
                      className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((team) => (
                <tr
                  key={team.id}
                  className="bg-[#161B22] hover:bg-[#1C222C] transition-colors rounded-lg group"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-[#FFD100] first:rounded-l-lg">
                    {team.ranking.position}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-[#0B0E14] rounded-md border border-gray-800">
                        <Image
                          src={team.image_path}
                          alt={team.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {team.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {team.ranking.matches}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {team.ranking.points}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-white last:rounded-r-lg">
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
