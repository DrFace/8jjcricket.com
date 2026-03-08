import Link from "next/link";

const LoadingPlayerSkelition = () => {
  return (
    <div className="relative space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80 animate-pulse">
      <div className="flex flex-col items-center gap-8 md:flex-row mt-3 rounded-3xl border border-india-gold/30 bg-gradient-to-br from-india-charcoal via-slate-900 to-india-blue/20 p-8 shadow-2xl backdrop-blur-xl">
        <Link
          href="/players"
          className="absolute top-5 right-5 text-xs font-semibold inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black font-semibold shadow-lg shadow-amber-500/30 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-50 px-4 py-3 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Players
        </Link>
        <div className="h-40 w-40 rounded-2xl bg-white/5 border border-india-gold/20 shadow-lg" />

        <div className="w-full">
          <div className="mb-2 h-10 w-72 rounded bg-white/10" />
          <div className="h-6 w-44 rounded bg-india-gold/30" />

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2">
              <div className="h-4 w-36 rounded bg-white/10" />
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2">
              <div className="h-4 w-40 rounded bg-white/10" />
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2">
              <div className="h-4 w-40 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 h-8 w-60 rounded bg-india-gold/30" />

        <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl">
          <div className="grid grid-cols-6 gap-2 border-b border-white/10 p-4">
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
          </div>

          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 gap-2 border-b border-white/5 p-4 last:border-b-0"
            >
              <div className="h-4 rounded bg-sky-100/20" />
              <div className="h-4 rounded bg-sky-100/20" />
              <div className="h-4 rounded bg-sky-100/20" />
              <div className="h-4 rounded bg-sky-100/20" />
              <div className="h-4 rounded bg-sky-100/20" />
              <div className="h-4 rounded bg-sky-100/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPlayerSkelition;
