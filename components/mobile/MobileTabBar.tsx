import Link from "next/link"; // Import Link component

interface TabBarProps {
  tabs: { label: string; href: string; active: boolean }[];
}

export default function MobileTabBar({ tabs }: TabBarProps) {
  return (
    <div className="flex w-full gap-2 mb-4">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`w-full py-2 text-center font-bold transition-all duration-200 
            /* Pill Shape */
            rounded-full 
            ${
              tab.active
                ? /* Active State: Gradient + Glow */
                  "text-black bg-gradient-to-r from-[#FFD100] to-[#FF6B00] shadow-[0_0_15px_rgba(255,165,0,0.5)] border-t border-white/30"
                : /* Inactive State: Dark/Muted */
                  "text-gray-400 bg-gray-900 hover:text-white border border-gray-800"
            }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
