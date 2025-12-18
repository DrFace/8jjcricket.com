import type { Metadata } from "next";
import Scoreboard from "@/components/Scoreboard";
import MobileScoreboard from "@/components/mobile/MobileScoreboard";

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
      <h1 className="text-2xl font-bold mb-4">Scoreboard </h1>
      <MobileScoreboard id={params.id} />
    </div>
  );
}
