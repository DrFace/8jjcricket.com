const PlayerLoadingSkeliton = () => {
  return (
    <div className="space-y-6 w-full animate-pulse pt-5">
      <div className="flex flex-col items-center gap-8 md:flex-row bg-white/5 p-6 rounded-3xl border border-white/15 shadow-lg">
        <div className="h-40 w-40 rounded-2xl bg-slate-800/80 shadow-md" />

        <div className="w-full">
          <div className="mx-auto h-8 w-52 rounded bg-white/10" />
          <div className="mx-auto mt-3 h-5 w-36 rounded bg-amber-300/20" />

          <div className="mt-4 space-y-2 w-full">
            <div className="flex justify-between items-center w-full">
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-4 w-28 rounded bg-sky-100/20" />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="h-4 w-28 rounded bg-white/10" />
              <div className="h-4 w-32 rounded bg-sky-100/20" />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="h-4 w-28 rounded bg-white/10" />
              <div className="h-4 w-32 rounded bg-sky-100/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto mb-4 h-7 w-52 rounded bg-white/10" />

        <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40">
          <div className="grid grid-cols-4 gap-2 border-b border-white/10 p-4">
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
          </div>

          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-2 border-b border-white/5 p-4 last:border-b-0"
            >
              <div className="h-4 rounded bg-sky-100/15" />
              <div className="h-4 rounded bg-sky-100/15" />
              <div className="h-4 rounded bg-sky-100/15" />
              <div className="h-4 rounded bg-sky-100/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerLoadingSkeliton;
