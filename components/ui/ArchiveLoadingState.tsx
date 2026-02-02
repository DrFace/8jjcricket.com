export const ArchiveLoadingState = ({
  description,
}: {
  description: string;
}) => {
  return (
    <>
      {/* Hero */}
      <div className="rounded-3xl border border-white/80 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-300">
              8JJCRICKET · ARCHIVE
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
              Cricket Archives
            </h1>
            <p className="mt-2 text-sm md:text-base text-sky-100/80 max-w-xl">
              {description}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-200">
              Loading archives…
            </span>
          </div>
        </div>
      </div>

      {/* Skeleton grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl animate-pulse"
          >
            <div className="h-3 w-20 rounded-full bg-amber-900/40 mb-3" />
            <div className="h-4 w-32 rounded-full bg-amber-900/40 mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-800/50" />
              <div className="h-3 w-5/6 rounded-full bg-slate-800/50" />
              <div className="h-3 w-2/3 rounded-full bg-slate-800/50" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
