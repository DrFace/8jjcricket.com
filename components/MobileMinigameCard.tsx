// components/MinigameCard.tsx
import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
};

export default function MobileMinigameCard({ slug, title, desc, icon }: Props) {
  return (
    <Link
      href={`/minigames/${slug}`}
      className="group block h-full rounded-3xl border-2 border-yellow-100 bg-slate-900/80 px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-3 border-yellow-200 hover:shadow-md hover:border-yellow-400 hover:shadow-yellow-400/50 hover:animate-pulse"
    >
      <div className="flex items-start justify-between gap-2 w-full  h-full">
        <div className="flex items-start justify-between gap-2 w-full  h-full">
          <div className="w-3/5  h-full pt-2">
            <h3 className="text-base font-semibold text-white group-hover:text-yellow-600">
              {title}
            </h3>
            <p className="mt-1 text-sm text-yellow-100">{desc}</p>
            <div className="">
              <p className="mt-3 inline-flex text-xs font-semibold text-yellow-400 group-hover:text-blue-500">
                Start Game
                <svg
                  className="ml-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </p>
            </div>
          </div>
          <div className="w-2/5 h-full flex items-center justify-end">
            <div className="flex h-full items-center justify-end animate-pulse">
              <Image src={icon} alt={title} width={150} height={150} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
