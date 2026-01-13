export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  const cls =
    tone === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : tone === "warning"
      ? "border-[#F7B731]/30 bg-[#F7B731]/10 text-[#F7B731]"
      : "border-white/15 bg-white/5 text-white/75";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-right",
        cls,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
