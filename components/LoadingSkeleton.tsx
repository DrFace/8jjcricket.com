// components/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export default function LoadingSkeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: LoadingSkeletonProps) {
  const baseClasses = animation === 'pulse' 
    ? 'animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800'
    : 'animate-shimmer bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-[length:200%_100%]';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
