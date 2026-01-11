import Image from "next/image";
import Link from "next/link";
import type { Team } from "@/lib/cricket-types";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";

export default function TeamsGrid({
  loading,
  teams,
}: {
  loading: boolean;
  teams: Team[];
}) {
  if (loading) return <LoadingState label="Loading teams..." />;
  if (!teams.length) {
    return <EmptyState title="No teams data available for this series" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/teams/${team.id}`}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-center"
        >
          {team.image_path && (
            <Image
              src={team.image_path}
              alt={team.name}
              width={60}
              height={60}
              className="mx-auto mb-3 object-contain"
            />
          )}
          <p className="font-medium text-gray-900">{team.name}</p>
          {team.country?.name && (
            <p className="text-xs text-gray-500 mt-1">{team.country.name}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
