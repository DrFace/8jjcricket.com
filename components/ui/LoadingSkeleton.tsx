export default function LoadingSkeleton({
  num,
  col,
}: {
  num: number;
  col: number;
}) {
  return (
    <div
      className={`grid grid-cols-${col} sm:grid-cols-2 lg:grid-cols-${col} gap-4`}
    >
      {Array.from({ length: num }).map((_, i) => (
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
  );
}
