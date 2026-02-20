import SecondaryButton from "./ui/SecondaryButton";

interface TabBarProps {
  tabs: { label: string; href: string; active: boolean }[];
}

export default function RankingsTabBar({ tabs }: TabBarProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="flex gap-2 relative z-10 lg:justify-start justify-start overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <SecondaryButton
              key={tab.href}
              href={tab.href}
              active={tab.active}
              size="sm"
              className="px-6 whitespace-nowrap"
            >
              {tab.label}
            </SecondaryButton>
          ))}
        </div>
      </div>
    </div>
  );
}
