import Link from "next/link";

interface TabBarProps {
  tabs: { label: string; href: string; active: boolean }[];
}

export default function RankingsTabBar({ tabs }: TabBarProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="flex gap-4 border-india-gold/20 relative z-10 lg:justify-start justify-start overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative px-6 py-2.5 font-bold text-sm transition-all duration-300 rounded-xl whitespace-nowrap
                ${
                  tab.active
                    ? /* Active */
                      "text-india-gold bg-india-saffron/20 border border-india-saffron/40 shadow-[0_0_15px_rgba(255,153,51,0.2)]"
                    : /* Inactive */
                      "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
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
