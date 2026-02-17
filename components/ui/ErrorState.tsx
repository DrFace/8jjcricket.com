export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => window.history.back()}
        className="text-amber-400 hover:text-amber-300 text-sm font-medium"
      >
        ← Back
      </button>
      <div className="mt-8 rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-xl p-6 shadow-2xl text-center">
        <p className="text-red-300 font-medium">{message}</p>
      </div>
    </div>
  );
}
