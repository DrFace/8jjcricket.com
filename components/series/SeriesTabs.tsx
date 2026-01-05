export type SeriesTabId = "matches" | "points";

export const seriesTabs: { id: SeriesTabId; label: string }[] = [
  { id: "matches", label: "Matches" },
  { id: "points", label: "Points Table" },
];

export default function SeriesTabs({
  activeTab,
  onChange,
}: {
  activeTab: SeriesTabId;
  onChange: (id: SeriesTabId) => void;
}) {
  return (
    <div className="border-t border-white/20 -mx-6 px-6 mt-4">
      <div className="flex overflow-x-auto -mx-6 px-6">
        {seriesTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-amber-400 text-amber-300 bg-amber-950/30"
                : "border-transparent text-sky-100/70 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
