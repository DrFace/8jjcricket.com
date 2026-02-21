// app/mobile/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";
import Script from "next/script";
import MobileFloatingSupport from "@/components/mobile/MobileFloatingSupport";

// ✅ Keep dropdown options constant (never in state, never mutated)
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "ur", label: "Urdu" },
  { value: "pa", label: "Punjabi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
] as const;

const LANG_STORAGE_KEY = "siteLang";

function normalizeLang(code: string | null | undefined) {
  const v = (code || "en").toLowerCase().trim();
  const ok = LANGUAGE_OPTIONS.some((o) => o.value === v);
  return ok ? v : "en";
}

// Read googtrans cookie language (e.g. "/en/hi" -> "hi")
function readGoogTransCookieLang(): string | null {
  if (typeof document === "undefined") return null;

  const cookieStr = `; ${document.cookie}`;
  const parts = cookieStr.split(`; googtrans=`);
  if (parts.length < 2) return null;

  const raw = parts.pop()?.split(";")[0] ?? ""; // e.g. "/en/hi"
  const segs = raw.split("/").filter(Boolean); // ["en","hi"]
  const last = segs[segs.length - 1];
  if (!last) return null;

  return last;
}

// Build cookie attributes (helps in production)
function cookieAttrs(path: string, domain?: string) {
  const attrs: string[] = [];
  attrs.push(`path=${path}`);
  if (domain) attrs.push(`domain=${domain}`);
  attrs.push("SameSite=Lax");
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    attrs.push("Secure");
  }
  return attrs.join("; ");
}

export default function MoblieLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // ✅ Determine initial language:
  // 1) googtrans cookie
  // 2) localStorage fallback (so it survives cookie quirks in prod)
  const [lang, setLang] = useState<string>(() => {
    if (typeof window === "undefined") return "en";

    const fromCookie = readGoogTransCookieLang();
    if (fromCookie) return normalizeLang(fromCookie);

    const fromStorage = window.localStorage.getItem(LANG_STORAGE_KEY);
    return normalizeLang(fromStorage);
  });

  // 3) Set up interaction listener
  useEffect(() => {
    const onFirstInteraction = () => {
      setHasInteracted(true);
    };

    // Listen for any user interaction
    const events = ["touchstart", "click", "keydown"];
    events.forEach((event) => {
      window.addEventListener(event, onFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onFirstInteraction);
      });
    };
  }, []);

  // Helper function to clear ALL googtrans cookies across domain/path variants
  const clearAllGoogTransCookies = () => {
    const hostname = window.location.hostname;
    const bare = hostname.replace("www.", "");

    const domainVariants = [
      undefined, // no domain attribute
      hostname,
      `.${hostname}`,
      bare,
      `.${bare}`,
    ];

    const pathVariants = ["/", "/minigames", "/mobile"];

    domainVariants.forEach((dom) => {
      pathVariants.forEach((p) => {
        const attrs = [
          `expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          cookieAttrs(p, dom),
        ].join("; ");
        document.cookie = `googtrans=; ${attrs}`;
      });
    });
  };

  // ✅ Force English in a production-safe way:
  // clear conflicts, set googtrans=/en/en across domain variants, save to localStorage, reload
  const forceEnglishCookie = () => {
    const hostname = window.location.hostname;
    const bare = hostname.replace("www.", "");
    const targetValue = `/en/en`;

    const domains = [undefined, hostname, `.${hostname}`, bare, `.${bare}`];

    domains.forEach((dom) => {
      const attrs = cookieAttrs("/", dom);
      document.cookie = `googtrans=${targetValue}; ${attrs}`;
    });
  };

  const setGoogTransCookie = (targetValue: string) => {
    const hostname = window.location.hostname;
    const bare = hostname.replace("www.", "");
    const domains = [undefined, hostname, `.${hostname}`, bare, `.${bare}`];

    domains.forEach((dom) => {
      const attrs = cookieAttrs("/", dom);
      document.cookie = `googtrans=${targetValue}; ${attrs}`;
    });
  };

  const handleLanguageChange = (selectedLang: string) => {
    const next = normalizeLang(selectedLang);

    // ✅ Save selection (helps in production if cookie is blocked/misread)
    window.localStorage.setItem(LANG_STORAGE_KEY, next);

    // ✅ English: force reset to /en/en
    if (next === "en") {
      clearAllGoogTransCookies();

      setTimeout(() => {
        forceEnglishCookie();
        setLang("en");

        setTimeout(() => {
          window.location.reload();
        }, 80);
      }, 50);

      return;
    }

    // ✅ Other languages: set /en/{lang}
    clearAllGoogTransCookies();

    setTimeout(() => {
      const targetValue = `/en/${next}`;
      setGoogTransCookie(targetValue);
      setLang(next);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 50);
  };

  return (
    <div className="min-h-screen w-screen max-w-none overflow-x-hidden">
      {/* Hidden audio player */}
      <audio ref={audioRef} preload="auto" playsInline />

      {/* TOP NAV BAR (GLOBAL) */}
      <header className="sticky top-0 z-[70] w-full border-b border-[var(--border-primary)] [background:var(--bg-primary)]">
        <div className="flex items-center justify-between px-3 py-2">
          {/* LEFT: Hamburger + Logo + Brand */}
          <div className="flex items-center gap-3">
            <MobileSidebar />

            <Link
              href="/mobile"
              className="flex items-center gap-2 relative active:scale-95"
              aria-label="Go to Home"
            >
              {/* Logo */}
              <div className="relative">
                <img
                  src="/8jjlogo.png"
                  alt="8JJCRICKET"
                  className="relative z-10 h-9 w-9 object-contain"
                />

                {/* Glow underneath */}
                <span
                  aria-hidden
                  className="
                    pointer-events-none
                    absolute inset-x-0 -bottom-1
                    mx-auto
                    h-2 w-10
                    rounded-full
                    bg-cyan-400/60
                    blur-lg
                    opacity-70
                  "
                />
              </div>

              <span
                className=" 
                          text-sm
                          font-extrabold 
                          tracking-wide 
                          bg-gradient-to-r 
                          from-blue-700 
                          via-green-500 
                          to-orange-400 
                          bg-clip-text 
                          text-transparent
                          drop-shadow-[2px_2px_0px_#1e3a8a]
                          "
              >
                8JJCRICKET
              </span>
            </Link>
          </div>

          <div className="ml-5 inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-9 bg-transparent text-[var(--text-primary)] outline-none [&>option]:text-black"
              aria-label="Google Translate language"
              translate="no"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="notranslate"
                  translate="no"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main
        className="
          h-[calc(100vh-56px)]
          w-full max-w-none
          overflow-y-auto overflow-x-hidden
          px-3 pt-3 pb-24
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
        <MobileFloatingSupport />
      </main>
      {/* BOTTOM NAV (GLOBAL) */}
      <BottomNav />
      {/* Google Translate */}
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,bn,ur,pa,ta,te,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              }, 'google_translate_element');
            }
          `}
      </Script>
    </div>
  );
}
