// src/i18n/LanguageProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_LANG, type LangCode } from "./index";
import { getSavedLangClient, saveLangClient, normalizeLang } from "./storage";

type I18nContextValue = {
  lang: LangCode;
  setLang: (lang: string) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  // load saved language once
  useEffect(() => {
    setLangState(getSavedLangClient());
  }, []);

  const setLang = (next: string) => {
    const normalized = normalizeLang(next);
    setLangState(normalized);
    saveLangClient(normalized);

    // ✅ simplest reliable way to ensure all content uses new dict
    // (avoids "stuck in old language" in prod due to cached server output)
    window.location.reload();
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
