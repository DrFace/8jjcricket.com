// components/SkeletonCard.tsx
import LoadingSkeleton from './LoadingSkeleton';

interface SkeletonCardProps {
  variant?: 'default' | 'compact' | 'detailed';
}

export default function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  if (variant === 'compact') {
    return (
      <div className="rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <LoadingSkeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton width="60%" height={16} />
            <LoadingSkeleton width="40%" height={12} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <LoadingSkeleton variant="circular" width={64} height={64} />
          <div className="flex-1 space-y-3">
            <LoadingSkeleton width="70%" height={20} />
            <LoadingSkeleton width="50%" height={16} />
            <LoadingSkeleton width="90%" height={14} />
            <div className="flex gap-2 mt-4">
              <LoadingSkeleton width={80} height={32} className="rounded-full" />
              <LoadingSkeleton width={80} height={32} className="rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md p-4 shadow-lg">
      <LoadingSkeleton height={150} className="mb-3" />
      <LoadingSkeleton width="80%" height={20} className="mb-2" />
      <LoadingSkeleton width="60%" height={16} />
    </div>
  );
}
