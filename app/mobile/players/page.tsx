"use client";

import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import PlayerCard from "@/components/games/PlayerCard";
import { debounce } from "@/lib/debounce";
import MobilePagination from "@/components/mobile/MobilePagination";

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

const PAGE_SIZE = 10;
const DEFAULT_COUNTRY_NAME = "India";

export default function PlayersPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [pager, setPager] = useState<LaravelPaginator<Player> | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("players-query") || "";
  });
  const [countryId, setCountryId] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("players-country") || "";
  });
  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const p = sessionStorage.getItem("players-page");
    return p ? parseInt(p, 10) : 1;
  });
  const [isRestored, setIsRestored] = useState(false);

  // Mark as restored on mount to enable saving
  useEffect(() => {
    setIsRestored(true);
  }, []);

  // ✅ ensure we only apply the default once
  const didSetDefaultCountry = useRef(false);

  const debouncedSetQ = useRef(
    debounce((val: string) => {
      setQ(val);
      setPage(1);
    }, 300),
  ).current;

  // Track the raw search input for the controlled component
  const [searchValue, setSearchValue] = useState("");

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

      // ✅ Set default country to India only once (and only if user hasn't selected anything)
      // ✅ Set default country to India only once (and only if user hasn't selected anything AND no session exists)
      const hasSavedCountry =
        typeof window !== "undefined" &&
        sessionStorage.getItem("players-country") !== null;

      if (!didSetDefaultCountry.current && !cId && !hasSavedCountry) {
        const india = fetchedCountries.find(
          (c) => c.name?.toLowerCase() === DEFAULT_COUNTRY_NAME.toLowerCase(),
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
      }
      didSetDefaultCountry.current = true; // prevent endless attempts

      setPlayers(json.players?.data ?? []);
      setPager(json.players ?? null);
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Save state to sessionStorage
  useEffect(() => {
    if (!isRestored) return;
    sessionStorage.setItem("players-query", q);
    sessionStorage.setItem("players-country", countryId);
    sessionStorage.setItem("players-page", String(page));
  }, [q, countryId, page, isRestored]);

  // Clear storage when navigating away from players section
  useEffect(() => {
    const clearPlayersStorage = () => {
      sessionStorage.removeItem("players-query");
      sessionStorage.removeItem("players-country");
      sessionStorage.removeItem("players-page");
      sessionStorage.removeItem("players-scroll-pos");
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link) {
        const href = link.getAttribute("href");
        // Keep storage if navigating to player detail pages (/players/*)
        // Clear if navigating anywhere else

        if (href && !href.includes("players")) {
          clearPlayersStorage();
        }
      }
    };

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const path = window.location.pathname;
      if (!path.includes("players")) {
        clearPlayersStorage();
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isRestored) {
        sessionStorage.setItem("players-scroll-pos", window.scrollY.toString());
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRestored]);

  // Restore scroll position after players are loaded
  useEffect(() => {
    if (isRestored && !loading && players.length > 0) {
      const savedScroll = sessionStorage.getItem("players-scroll-pos");
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 100);
      }
    }
  }, [isRestored, loading, players.length]);

  useEffect(() => {
    loadCatalog(page, q, countryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, countryId]);

  const totalPages = pager?.last_page ?? 1;

  return (
    <>
      <BottomNav />
      <div className="min-h-screen">
        <main className="w-[99%]  mx-auto py-1">
          <div className="space-y-4">
            <header className="">
              <div className="flex  items-center mb-4">
                <h1 className="m-h">Players</h1>
              </div>
              <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-amber-400">
                Browse players. Use search and filters to find them faster.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {/* Filters */}
              <aside className="md:col-span-1">
                <div className="sticky top-20 space-y-4 rounded-2xl border border-white/15 bg-black/50 p-4 text-sm shadow-2xl backdrop-blur-xl">
                  <div className="space-y-4">
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
                    <label className="font-medium text-amber-200">
                      Country
                    </label>
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
                        <div className="mb-3 text-center text-xs text-sky-100/60">
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

                        <MobilePagination
                          page={page}
                          totalPages={totalPages}
                          setPage={setPage}
                        />
                      </>
                    )}
                  </>
                )}
              </main>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
