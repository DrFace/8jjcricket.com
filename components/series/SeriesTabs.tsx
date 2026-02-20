import SecondaryButton from "../ui/SecondaryButton";

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
    <div className="border-t border-white/20 -mx-6 px-6 mt-4 pt-3">
      <div className="flex overflow-x-auto gap-2 -mx-6 px-6 pb-2">
        {seriesTabs.map((tab) => (
          <SecondaryButton
            key={tab.id}
            onClick={() => onChange(tab.id)}
            active={activeTab === tab.id}
            size="sm"
            className="whitespace-nowrap rounded-lg"
          >
            {tab.label}
          </SecondaryButton>
        ))}
      </div>
    </div>
  );
}
