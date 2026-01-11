export default function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
      <p className="text-white font-medium">{title}</p>
      {subtitle && <p className="text-sm text-sky-100/70 mt-2">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
