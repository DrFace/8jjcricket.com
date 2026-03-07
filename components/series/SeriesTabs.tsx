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
    <div>
      <div className="flex overflow-x-auto gap-4">
        {seriesTabs.map((tab) => (
          <SecondaryButton
            key={tab.id}
            onClick={() => onChange(tab.id)}
            active={activeTab === tab.id}
            size="md"
            className="whitespace-nowrap rounded-lg w-full"
          >
            {tab.label}
          </SecondaryButton>
        ))}
      </div>
    </div>
  );
}
