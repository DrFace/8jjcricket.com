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

  const filteredAudios = useMemo(() => {
    return audios.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [audios, search]);

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
    <div ref={containerRef} className="relative mt-4">
      <label
        className="mb-2 block text-xs font-semibold tracking-wider"
        style={{ color: "#FFD000" }}
      >
        Select Music
      </label>

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-full rounded-xl px-4 py-2 text-left text-sm text-white transition focus:outline-none"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 159, 67, 0.4)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <span className={selected ? "text-white" : "text-white/40"}>
          {selected ? selected.title : "Select a song..."}
        </span>
        <ChevronDown
          size={18}
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          style={{ color: "#FFD000" }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl shadow-2xl overflow-hidden"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 159, 67, 0.35)",
          }}
        >
          {/* Search Box */}
          <div
            className="relative"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#FF9F43" }}
            />
            <input
              type="text"
              placeholder="Search music..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="max-h-[40vh] overflow-y-auto">
            {filteredAudios.length === 0 ? (
              <div className="px-4 py-3 text-sm text-white/40">
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
                    className="w-full px-4 py-2 text-left text-sm transition-all duration-150"
                    style={{
                      color: active ? "#FFD000" : "rgba(255,255,255,0.85)",
                      background: active
                        ? "rgba(255, 208, 0, 0.12)"
                        : "transparent",
                      fontWeight: active ? 600 : 400,
                      borderLeft: active
                        ? "2px solid #FF9F43"
                        : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                    }}
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
