// components/LiveIndicator.tsx
import React from 'react';

interface LiveIndicatorProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function LiveIndicator({
  text = 'LIVE',
  size = 'md',
  showText = true,
  className = '',
}: LiveIndicatorProps) {
  const sizes = {
    sm: { dot: 'h-2 w-2', text: 'text-xs', gap: 'gap-1.5' },
    md: { dot: 'h-2.5 w-2.5', text: 'text-sm', gap: 'gap-2' },
    lg: { dot: 'h-3 w-3', text: 'text-base', gap: 'gap-2.5' },
  };

  const config = sizes[size];

  return (
    <div className={`inline-flex items-center ${config.gap} ${className}`}>
      {/* Pulsing Dot */}
      <span className="relative flex">
        {/* Outer Pulse Ring */}
        <span
          className={`absolute inline-flex ${config.dot} rounded-full bg-india-saffron opacity-75 animate-pulse-ring`}
          aria-hidden="true"
        />
        {/* Inner Dot */}
        <span
          className={`relative inline-flex rounded-full ${config.dot} bg-india-gold shadow-lg shadow-india-gold/50`}
        />
      </span>

      {/* Text */}
      {showText && (
        <span className={`font-bold text-india-gold ${config.text} uppercase tracking-wide`}>
          {text}
        </span>
      )}
    </div>
  );
}
