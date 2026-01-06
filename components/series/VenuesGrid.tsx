import type { Venue } from "@/lib/cricket-types";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";

export default function VenuesGrid({
  loading,
  venues,
}: {
  loading: boolean;
  venues: Venue[];
}) {
  if (loading) return <LoadingState label="Loading venues..." />;
  if (!venues.length)
    return <EmptyState title="No venues data available for this series" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {venues.map((venue) => (
        <div key={venue.id} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{venue.name}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {venue.city && <p>📍 {venue.city}</p>}
            {typeof venue.capacity === "number" && (
              <p>👥 Capacity: {venue.capacity.toLocaleString()}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
