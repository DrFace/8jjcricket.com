import type { Metadata } from "next";
import Scoreboard from "@/components/Scoreboard";
import MobileScoreboard from "@/components/mobile/MobileScoreboard";
import MobileBackButton from "@/components/mobile/MobileBackButton";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  return {
    title: `Scoreboard #${id}`,
    description: `Full scoreboard and ball-by-ball for fixture ${id}.`,
  };
}

export default function MatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div className="flex ">
        <MobileBackButton />
        <h1 className="text-2xl font-bold mb-4">Scoreboard </h1>
      </div>

      <MobileScoreboard id={params.id} />
    </div>
  );
}
