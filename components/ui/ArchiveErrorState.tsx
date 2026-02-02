export default function ArchiveErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-12 bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
      <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-8 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h1 className="text-xl font-semibold text-red-400 mb-2">
              Failed to load archives
            </h1>
            <p className="text-sm text-red-300/80 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/30"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
