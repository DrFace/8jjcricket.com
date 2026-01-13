import Link from "next/link";

interface TabBarProps {
  tabs: { label: string; href: string; active: boolean }[];
}

export default function RankingsTabBar({ tabs }: TabBarProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="flex gap-6 border-amber-500/40 relative z-10 lg:justify-start justify-start">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative px-4 py-2 font-bold text-lg transition-all duration-300 overflow-hidden group pb-4 rounded-2xl
                ${
                  tab.active
                    ? /* Active: top border highlight with amber color */
                      "text-amber-400 border-b-2 border-b-amber-400 bg-gradient-to-b from-amber-400/10 to-transparent"
                    : /* Inactive: subtle text with hover effect */
                      "text-gray-400 border-b-2 border-b-transparent hover:text-gray-200 hover:border-b-amber-300/50"
                }
              `}
            >
              <span className="relative z-10">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
