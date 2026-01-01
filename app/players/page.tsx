"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { debounce } from "@/lib/debounce";

type Country = { id: number; name: string };

type CareerRow = {
  id: number;
  type: string;
  matches?: number | null;
  innings?: number | null;
  runs_scored?: number | null;
  highest_inning_score?: number | null;
  strike_rate?: string | number | null;
  average?: string | number | null;
  hundreds?: number | null;
  fifties?: number | null;
};

type Player = {
  id: number;
  name?: string;
  fullname?: string;
  firstname?: string | null;
  lastname?: string | null;
  image_path?: string | null;

  country_id?: number | null;
  country?: { id: number; name: string } | null;

  position?: string | null;
  position_id?: number | null;

  careers?: CareerRow[];
};

type LaravelPaginator<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
};

const PAGE_SIZE = 20;
const DEFAULT_COUNTRY_NAME = "India";

function getPositionName(id?: number | null): string | null {
  if (!id) return null;
  switch (id) {
    case 1:
      return "Batsman";
    case 2:
      return "Bowler";
    case 3:
      return "Allrounder";
    case 4:
      return "Wicketkeeper";
    default:
      return "Unknown";
  }
}

function getDisplayName(p: Player): string {
  return (
    p.fullname ??
    p.name ??
    [p.firstname, p.lastname].filter(Boolean).join(" ") ??
    `Player #${p.id}`
  );
}

export default function PlayersPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [pager, setPager] = useState<LaravelPaginator<Player> | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [countryId, setCountryId] = useState<string>(""); // will be set to India after countries load
  const [role, setRole] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // ✅ ensure we only apply the default once
  const didSetDefaultCountry = useRef(false);

  const debouncedSetQ = useRef(
    debounce((val: string) => {
      setQ(val);
      setPage(1);
    }, 300)
  ).current;

  async function loadCatalog(p: number, query: string, cId: string) {
    setLoading(true);
    setErr(null);

    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("per_page", String(PAGE_SIZE));
    if (query.trim()) params.set("q", query.trim());
    if (cId) params.set("country_id", cId);

    try {
      const res = await fetch(`/api/catalog?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch catalog");

      const json = await res.json();

      const fetchedCountries: Country[] = json.countries ?? [];
      setCountries(fetchedCountries);

      // ✅ Set default country to India only once (and only if user hasn’t selected anything)
      if (!didSetDefaultCountry.current && !cId) {
        const india = fetchedCountries.find(
          (c) => c.name?.toLowerCase() === DEFAULT_COUNTRY_NAME.toLowerCase()
        );
        if (india) {
          didSetDefaultCountry.current = true;
          setCountryId(String(india.id));
          setPage(1);
          // Return early: changing countryId will trigger useEffect to reload with India
          setPlayers([]);
          setPager(null);
          setLoading(false);
          return;
        }
        didSetDefaultCountry.current = true; // prevent endless attempts even if India not found
      }

      setPlayers(json.players?.data ?? []);
      setPager(json.players ?? null);
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog(page, q, countryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, countryId]);

  const roleOptions = useMemo(() => {
    const set = new Set<string>();
    players.forEach((p) => {
      const name = p.position ?? getPositionName(p.position_id);
      if (name) set.add(name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [players]);

  const filteredByRole = useMemo(() => {
    if (!role) return players;
    const roleLower = role.toLowerCase();
    return players.filter((p) => {
      const name = (
        p.position ??
        getPositionName(p.position_id) ??
        ""
      ).toLowerCase();
      return name === roleLower;
    });
  }, [players, role]);

  const totalPages = pager?.last_page ?? 1;

  return (
    <>
      <title>Players | 8jjcricket</title>
      <meta
        name="description"
        content="Browse all cricket players, search by name and filter by country or role."
      />

      <TopNav />

      <div className="mx-auto px-4 py-8 md:py-10">
        <header className="mb-6 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white">Players</h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-amber-400">
            Browse players. Use search and filters to find them faster.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
                  value={countryId}
                  onChange={(e) => {
                    setCountryId(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  {countries.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <main className="md:col-span-3">
            {loading && (
              <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                Loading players…
                <div className="mt-4 mx-auto h-6 w-6 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
              </div>
            )}

            {err && !loading && (
              <div className="rounded-2xl border border-red-500/30 bg-black/70 p-6 text-sm text-red-300 backdrop-blur-xl">
                {err}
              </div>
            )}

            {!loading && !err && (
              <>
                {filteredByRole.length === 0 ? (
                  <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                    No players match your filters.
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-xs text-sky-100/60">
                      Showing{" "}
                      <span className="font-medium text-amber-300">
                        {filteredByRole.length}
                      </span>{" "}
                      players on this page.
                      {pager ? (
                        <>
                          {" "}
                          Total:{" "}
                          <span className="font-medium text-amber-300">
                            {pager.total}
                          </span>
                        </>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredByRole.map((p) => {
                        const fullname = getDisplayName(p);
                        const countryName = p.country?.name ?? null;
                        const position =
                          p.position ?? getPositionName(p.position_id);

                        return (
                          <PlayerCard
                            key={p.id}
                            id={p.id}
                            fullname={fullname}
                            position={position}
                            country={countryName}
                            image_path={p.image_path ?? null}
                          />
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((x) => Math.max(1, x - 1))}
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
                            setPage((x) => Math.min(totalPages, x + 1))
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

      <Footer />
    </>
  );
}
