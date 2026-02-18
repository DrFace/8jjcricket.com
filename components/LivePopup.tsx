// ...existing code...
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useSWR from "swr";
import LiveScoreCardForFloating from "./LiveScoreCardForFloating";

export type AudioItem = {
  id: number;
  title: string;
  file_path: string;
};

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function LivePopup(props: {
  open: boolean;
  onClose: () => void;
}) {
  const { open, onClose } = props;

  const liveRes = useSWR("/api/live", fetcher);

  const liveMatches = liveRes.data?.data?.live ?? [];
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panelRef = useRef<HTMLDivElement | null>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-end pr-10 "
      onMouseDown={(e) => {
        const target = e.target as Node;
        if (panelRef.current && !panelRef.current.contains(target)) onClose();
      }}
    >
      {/* Gradient Border Wrapper */}
      <div
        ref={panelRef}
        className="relative w-[92vw] max-w-md max-h-[90vh] shadow-2xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Inner */}
        <div className="rounded-2xl  p-5 text-white max-h-[86vh] overflow-y-auto">
          <div className="mb-10">
            {liveMatches.length > 0 ? (
              <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-4">
                {liveMatches.map((match: any, i: number) => (
                  <LiveScoreCardForFloating
                    key={match.id}
                    f={match}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-400 italic text-center py-10 india-card-gradient rounded-xl">
                No live matches available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
