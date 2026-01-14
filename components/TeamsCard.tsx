import { GetTeamImageSrc } from "@/lib/teams";
import { TeamFromAPI } from "@/types/team";
import Image from "next/image";
import Link from "next/link";

type TeamsCardProps = {
  team: TeamFromAPI;
};

export default function TeamsCard({ team }: TeamsCardProps) {
  return (
    <Link
      href={`/teams/${team.id}`}
      aria-label={`View team ${team.name}`}
      className="block"
    >
      <div className="flex items-center h-full gap-3 rounded-xl border border-white/20 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-xl p-3 shadow-lg">
        <Image
          src={GetTeamImageSrc(team.image_path)}
          alt={team.name}
          width={36}
          height={36}
          className="object-cover rounded-full"
        />
        <span className="font-semibold text-white truncate text-sm">
          {team.name}
        </span>
      </div>
    </Link>
  );
}
