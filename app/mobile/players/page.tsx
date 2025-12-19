"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import PlayerCard from "@/components/games/PlayerCard";
import { debounce } from "@/lib/debounce";

type Player = {
  id: number;
  fullname: string;
  firstname?: string;
  lastname?: string;
  image_path?: string | null;
  country?: string | null;
  position?: string | null;
};

type Country = { id: number; name: string };
type Pagination = { current_page: number; total_pages: number };

const PAGE_SIZE = 20;

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [country, setCountry] = useState("India");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSetQ = useRef(
    debounce((val: string) => {
      setQ(val);
      setPage(1);
    }, 300)
  ).current;

  async function loadData(p = 1) {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/players?page=${p}`),
        fetch("/api/countries"),
      ]);
      if (!pRes.ok) throw new Error("Failed to fetch players");
      if (!cRes.ok) throw new Error("Failed to fetch countries");
      const pJson = await pRes.json();
      const cJson = await cRes.json();
      setPagination(pJson.pagination ?? null);
      setCountries(cJson.data ?? []);
      setPlayers(pJson.data ?? []);
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const countryOptions = useMemo(() => {
    const names = new Set<string>();
    players.forEach((p) => p.country && names.add(p.country));
    countries.forEach((c) => names.add(c.name));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [players, countries]);

  const roleOptions = useMemo(() => {
    const names = new Set<string>();
    players.forEach((p) => p.position && names.add(p.position));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [players]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return players.filter((p) => {
      const matchesQ =
        !qLower ||
        p.fullname.toLowerCase().includes(qLower) ||
        p.firstname?.toLowerCase().includes(qLower) ||
        p.lastname?.toLowerCase().includes(qLower);

      const matchesCountry =
        !country || (p.country ?? "").toLowerCase() === country.toLowerCase();

      const matchesRole =
        !role || (p.position ?? "").toLowerCase() === role.toLowerCase();

      return matchesQ && matchesCountry && matchesRole;
    });
  }, [players, q, country, role]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <title>Players | 8jjcricket</title>
      <meta
        name="description"
        content="Browse all cricket players, search by name and filter by country or role."
      />

      <BottomNav />

      <div className="mx-auto px-4 py-8 md:py-10">
        {/* Page Header */}
        <header className="mb-6 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white">Players</h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-amber-400">
            Browse all players. Use search and filters to find them faster.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="md:col-span-1">
            <div className="sticky top-4 space-y-4 rounded-2xl border border-white/15 bg-black/50 p-4 text-sm shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <label className="font-medium text-amber-200">
                  Search by name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed, Sharma..."
                  className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none focus:border-amber-400/50 focus:ring-amber-400/30"
                  onChange={(e) => debouncedSetQ(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-amber-200">Country</label>
                <select
                  className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-amber-400/30"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  {countryOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Players Grid */}
          <main className="md:col-span-3">
            {loading && (
              <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                Loading players…
                <div className="mt-4 h-6 w-6 animate-spin rounded-full border-4 border-amber-400 border-t-transparent mx-auto"></div>
              </div>
            )}

            {err && !loading && (
              <div className="rounded-2xl border border-red-500/30 bg-black/70 p-6 text-sm text-red-300 backdrop-blur-xl">
                {err}
              </div>
            )}

            {!loading && !err && (
              <>
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                    No players match your filters.
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-xs text-sky-100/60">
                      Showing{" "}
                      <span className="font-medium text-amber-300">
                        {paged.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-amber-300">
                        {filtered.length}
                      </span>{" "}
                      players
                      {q || country || role ? " (filtered)" : ""}.
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {paged.map((p) => (
                        <PlayerCard
                          key={p.id}
                          id={p.id}
                          fullname={p.fullname}
                          position={p.position}
                          country={p.country}
                          image_path={p.image_path}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="rounded-full border border-amber-400/30 bg-slate-900/80 px-3 py-1.5 text-amber-200 backdrop-blur-sm hover:bg-slate-800/80 hover:border-amber-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-amber-300 backdrop-blur-xl">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          disabled={page === totalPages}
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          className="rounded-full border border-amber-400/30 bg-slate-900/80 px-3 py-1.5 text-amber-200 backdrop-blur-sm hover:bg-slate-800/80 hover:border-amber-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>

    
    </>
  );
}
