import Link from "next/link";

export default function ErrorState({
  message,
  backHref = "/series",
}: {
  message: string;
  backHref?: string;
}) {
  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="text-amber-400 hover:text-amber-300 text-sm font-medium"
      >
        ← Back
      </Link>
      <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
        <p className="text-red-300 font-medium">{message}</p>
      </div>
    </div>
  );
}
