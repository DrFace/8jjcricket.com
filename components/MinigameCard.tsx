// components/MinigameCard.tsx
import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  desc: string;
};

export default function MinigameCard({ slug, title, desc }: Props) {
  return (
    <Link
      href={`/minigames/${slug}`}
      className="group block h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
          {title}
        </h3>
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          Play
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{desc}</p>
      <p className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700">
        Start game
        <span className="ml-1">›</span>
      </p>
    </Link>
  );
}
