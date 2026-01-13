export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-[#070D18] p-4 md:p-6",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
