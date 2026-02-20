"use client";

import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import PlayerCard from "@/components/games/PlayerCard";
import { debounce } from "@/lib/debounce";

type Country = { id: number; name: string };

type Player = {
  id: number;
  name?: string;
  fullname?: string;
  firstname?: string | null;
  lastname?: string | null;
  image_path?: string | null;
  country?: { id: number; name: string } | null;
  country_id?: number | null;
  position?: string | null;
  position_id?: number | null;
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

export default function PlayersPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [pager, setPager] = useState<LaravelPaginator<Player> | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("mobile-players-query") || "";
  });
  const [searchValue, setSearchValue] = useState(q);
  const [countryId, setCountryId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("mobile-players-country") || "";
  });
  const [page, setPage] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const p = sessionStorage.getItem("mobile-players-page");
    return p ? parseInt(p, 10) : 1;
  });
  const [isRestored, setIsRestored] = useState(false);

  // Sync searchValue with q initially and when q changes externally (e.g. restore)
  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  // Mark as restored on mount
  useEffect(() => {
    setIsRestored(true);
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    if (!isRestored) return;
    sessionStorage.setItem("mobile-players-query", q);
    sessionStorage.setItem("mobile-players-country", countryId);
    sessionStorage.setItem("mobile-players-page", String(page));
  }, [q, countryId, page, isRestored]);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isRestored) {
        sessionStorage.setItem("mobile-players-scroll-pos", window.scrollY.toString());
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRestored]);

  // Restore scroll position after players are loaded
  useEffect(() => {
    if (isRestored && !loading && players.length > 0) {
      const savedScroll = sessionStorage.getItem("mobile-players-scroll-pos");
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 100);
      }
    }
  }, [isRestored, loading, players.length]);

  // ensure default country set only once
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

      // default country India only once (only if user hasn't selected anything AND no session exists)
      const hasSavedCountry = typeof window !== "undefined" && sessionStorage.getItem("mobile-players-country") !== null;

      if (!didSetDefaultCountry.current && !cId && !hasSavedCountry) {
        const india = fetchedCountries.find(
          (c) => c.name?.toLowerCase() === DEFAULT_COUNTRY_NAME.toLowerCase()
        );
        if (india) {
          didSetDefaultCountry.current = true;
          setCountryId(String(india.id));
          setPage(1);

          // return early: countryId change triggers reload
          setPlayers([]);
          setPager(null);
          setLoading(false);
          return;
        }
        didSetDefaultCountry.current = true;
      }

      setPlayers(json.players?.data ?? []);
      setPager(json.players ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog(page, q, countryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, countryId]);

  const totalPages = pager?.last_page ?? 1;

  return (
    <>
      <title>Players | 8jjcricket</title>
      <meta
        name="description"
        content="Browse all cricket players, search by name and filter by country."
      />

      <BottomNav />

      <div className="mx-auto px-4 py-8 md:py-10">
        <header className="mb-6 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white">Players</h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-amber-400">
            Browse players. Use search and filters to find them faster.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Filters */}
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
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    debouncedSetQ(e.target.value);
                  }}
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
                    window.scrollTo({ top: 0, behavior: "smooth" });
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

          {/* Grid */}
          <main className="md:col-span-3">
            {loading && (
              <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                Loading players…
                <div className="mt-4 mx-auto h-6 w-6 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
              </div>
            )}

            {err && !loading && (
              <div className="rounded-2xl border border-red-500/30 bg-black/70 p-6 text-sm text-red-300 backdrop-blur-xl">
                {err}
              </div>
            )}

            {!loading && !err && (
              <>
                {players.length === 0 ? (
                  <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                    No players match your filters.
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-xs text-sky-100/60">
                      Showing{" "}
                      <span className="font-medium text-amber-300">
                        {players.length}
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
                      {players.map((p) => (
                        <PlayerCard
                          key={p.id}
                          id={p.id}
                          fullname={
                            p.fullname ??
                            p.name ??
                            [p.firstname, p.lastname]
                              .filter(Boolean)
                              .join(" ") ??
                            `Player #${p.id}`
                          }
                          position={p.position ?? null}
                          country={p.country?.name ?? null}
                          image_path={p.image_path ?? null}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                        <button
                          disabled={page === 1}
                          onClick={() => {
                            setPage((x) => Math.max(1, x - 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-full border border-amber-400/30 bg-slate-900/80 px-3 py-1.5 text-amber-200 backdrop-blur-sm hover:bg-slate-800/80 hover:border-amber-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Prev
                        </button>

                        <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-amber-300 backdrop-blur-xl">
                          Page {page} of {totalPages}
                        </span>

                        <button
                          disabled={page === totalPages}
                          onClick={() => {
                            setPage((x) => Math.min(totalPages, x + 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
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
