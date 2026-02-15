import { GetTeamImageSrc } from "@/lib/teams";
import { TeamFromAPI } from "@/types/team";
import Image from "next/image";

type TeamsCardProps = {
  team: TeamFromAPI;
};

export default function TeamsCard({ team }: TeamsCardProps) {
  return (
    <div aria-label={`View team ${team.name}`} className="block cursor-default group">
      <div className="flex items-center h-full gap-3 rounded-xl india-card-gradient p-3 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,153,51,0.3)]">
        {/* Circle container */}
        <div className="relative w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0 border border-india-gold/20">
          <Image
            src={GetTeamImageSrc(team.image_path)}
            alt={team.name}
            fill
            className="object-cover"
          />
        </div>

        <span className="font-bold text-white truncate text-sm group-hover:text-india-gold transition-colors">
          {team.name}
        </span>
      </div>
    </div>
  );
}
