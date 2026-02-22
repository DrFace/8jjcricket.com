// components/TopNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import NewsTicker from "@/components/NewsTicker";
import { Megaphone, VolumeOff, Music2 } from "lucide-react";
import { useState } from "react";
import IconButton from "./ui/IconButton";
import PrimaryButton from "./ui/PrimaryButton";
import { usePathname } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { GetGlobalAudio } from "@/lib/audio";
import { motion } from "framer-motion";


function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "relative px-1 py-1 transition-colors",
        active ? "text-amber-300" : "text-sky-100/90 hover:text-amber-300",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      <span
        className={[
          "pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] rounded-full transition-opacity",
          active ? "opacity-100 bg-amber-300" : "opacity-0 bg-amber-300",
        ].join(" ")}
      />
    </Link>
  );
}

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

export default function TopNav() {
  const pathname = usePathname();

  const { isMuted, setIsMuted, currentTrack } = useAudio();

  const toggleMute = () => {
    setIsMuted(!isMuted);

    // Optional: immediately update audio element (extra safety)
    // if (currentTrack) {
    //   const audio = GetGlobalAudio(currentTrack);
    //   if (audio) audio.muted = !isMuted;
    // }
  };

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

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="w-full border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="flex w-full items-center gap-4 px-4 py-2 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-india-saffron" />
          </div>
          <div className="flex-1">
            <NewsTicker />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-card)] backdrop-blur-xl shadow-lg">
        <div className="flex w-full items-center justify-between px-2 lg:px-4 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg lg:text-xl font-bold text-[var(--text-primary)] shrink-0"
          >
            <Image
              src="/8jjlogo.png"
              alt="8jjcricket logo"
              width={44}
              height={44}
              priority
            />
<motion.div
  className="logo3d-wrap"
  initial="initial"
  animate="animate"
  whileHover="hover"
>
  {/* Soft stadium glow behind */}
  <span className="logo3d-glow" aria-hidden="true" />

  {"8JJCRICKET".split("").map((letter, index) => (
    <motion.span
      key={index}
      data-char={letter}
      variants={{
        initial: { opacity: 0, y: 10, rotateX: -90 },
        animate: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: {
            delay: index * 0.05,
            type: "spring",
            stiffness: 220,
            damping: 14,
          },
        },
        hover: {
          y: -5,
          scale: 1.05,
          transition: { type: "spring", stiffness: 300, damping: 16 },
        },
      }}
      className="logo3d-letter"
    >
      {letter}
    </motion.span>
  ))}
</motion.div>

          </Link>

          <nav className="hidden gap-3 lg:gap-5 xl:gap-8 text-[13px] lg:text-[14px] xl:text-[15px] font-semibold md:flex whitespace-nowrap">
            <NavItem href="/" label="Home" active={isActive("/")} />
            <NavItem
              href="/livescore"
              label="Live Score"
              active={isActive("/livescore")}
            />
            <NavItem
              href="/archive"
              label="Archive"
              active={isActive("/archive")}
            />
            <NavItem
              href="/series"
              label="Series"
              active={isActive("/series")}
            />
            <NavItem
              href="/rankings/t20i"
              label="Team Rankings"
              active={isActive("/rankings/t20i")}
            />
            <NavItem
              href="/players"
              label="Players"
              active={isActive("/players")}
            />
            <NavItem
              href="/minigames"
              label="Mini Games"
              active={isActive("/minigames")}
            />
            <NavItem href="/news" label="News" active={isActive("/news")} />
            <NavItem
              href="/gallery"
              label="Gallery"
              active={isActive("/gallery")}
            />
          </nav>

          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
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
            {currentTrack && (
              <IconButton
                onClick={toggleMute}
                ariaLabel="Toggle music"
                className="bg-white/5 border-white/15"
                size="sm"
                icon={!isMuted ? <Music2 size={18} /> : <VolumeOff size={18} />}
              />
            )}
            <PrimaryButton
              href="/minigames"
              size="sm"
              className="px-4 py-2"
            >
              Play Now
            </PrimaryButton>
          </div>
        </div>
      </header>
    </>
  );
}
