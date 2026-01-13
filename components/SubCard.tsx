export function SubCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-white/10 bg-[#060A12] p-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
