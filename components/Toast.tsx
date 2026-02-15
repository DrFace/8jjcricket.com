// components/Toast.tsx
"use client";

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  const styles = {
    success: 'bg-gradient-to-r from-india-green to-green-600 text-white',
    error: 'bg-gradient-to-r from-india-red to-red-600 text-white',
    info: 'bg-gradient-to-r from-india-blue to-blue-600 text-white',
    warning: 'bg-gradient-to-r from-india-saffron to-india-gold text-black',
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl backdrop-blur-xl border border-white/20 ${styles[type]} animate-slide-up`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
