import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

type AudioItem = {
  id: number;
  title: string;
};

type Props = {
  audios: AudioItem[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
};

export default function MusicSelector({ audios, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = audios.find((a) => a.id === selectedId);

  // Filtered list (performance optimized)
  const filteredAudios = useMemo(() => {
    return audios.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [audios, search]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mt-6">
      <label className="mb-2 block text-xs font-semibold text-white/60 tracking-wider">
        Select Music
      </label>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-full rounded-xl border border-white/10 
          bg-[#0f172a] px-4 py-3 text-left text-sm text-white 
          hover:border-[#FF9F43]/60 
          focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/40 
          transition"
      >
        {selected ? selected.title : "Select a song..."}
        <ChevronDown
          size={18}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#FFD000] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl 
          bg-[#111c44] border border-white/10 
          shadow-2xl overflow-hidden"
        >
          {/* Search box */}
          <div className="relative border-b border-white/10">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Search music..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-9 pr-3 py-3 text-sm text-white 
              placeholder:text-white/40 focus:outline-none"
            />
          </div>

          {/* Scrollable list */}
          <div className="max-h-[40vh] overflow-y-auto custom-scroll">
            {filteredAudios.length === 0 ? (
              <div className="px-4 py-4 text-sm text-white/60">
                No songs found
              </div>
            ) : (
              filteredAudios.map((a) => {
                const active = a.id === selectedId;

                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      onSelect(a.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition ${
                      active
                        ? "bg-gradient-to-r from-[#FF9F43]/20 to-[#FFD000]/20 text-[#FFD000] font-semibold"
                        : "hover:bg-white/5"
                    }`}
                  >
                    {a.title}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
