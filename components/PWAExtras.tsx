// components/PWAExtras.tsx
"use client";

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

export default function PWAExtras() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker (Only in production to avoid dev issues)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('PWA: Service Worker registered', reg.scope))
        .catch((err) => console.error('PWA: Service Worker failed', err));
    }

    // 2. Listen for Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired');
      
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    // We only set the visibility state to false.
    // Since this component is in the RootLayout, it stays mounted across navigations.
    // This allows it to stay hidden as the user moves between pages.
    // A page refresh (hard refresh) will reset the state and show it again.
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] md:bottom-8 md:left-auto md:right-8 md:w-80">
      <div className="rounded-2xl border border-india-gold/40 bg-india-charcoal/95 p-4 shadow-2xl backdrop-blur-xl animate-slide-up">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-india-saffron to-india-gold">
              <Download className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Install 8JJCricket</h3>
              <p className="text-xs text-white/60">Get live scores and games on your home screen</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 rounded-full bg-gradient-to-r from-india-saffron to-india-gold py-2 text-xs font-bold text-black"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs font-bold text-white"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
