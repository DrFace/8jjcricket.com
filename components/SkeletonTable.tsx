// components/SkeletonTable.tsx
import LoadingSkeleton from './LoadingSkeleton';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
  return (
    <div className="rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-india-saffron via-india-gold to-india-orange p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton key={`header-${i}`} height={16} className="bg-black/20" />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="p-4 hover:bg-slate-800/60">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <LoadingSkeleton 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  height={14}
                  width={colIndex === 0 ? '70%' : '90%'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
