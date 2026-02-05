// src/i18n/storage.ts

import { DEFAULT_LANG, LANGUAGES, type LangCode } from "./index";

export const LANG_STORAGE_KEY = "lang";

export function normalizeLang(input: string | null | undefined): LangCode {
  const candidate = (input || DEFAULT_LANG).toLowerCase();
  const ok = LANGUAGES.some((l) => l.code === candidate);
  return (ok ? candidate : DEFAULT_LANG) as LangCode;
}

export function getSavedLangClient(): LangCode {
  if (typeof window === "undefined") return DEFAULT_LANG;
  return normalizeLang(window.localStorage.getItem(LANG_STORAGE_KEY));
}

export function saveLangClient(lang: string) {
  if (typeof window === "undefined") return;
  const normalized = normalizeLang(lang);
  window.localStorage.setItem(LANG_STORAGE_KEY, normalized);
}
