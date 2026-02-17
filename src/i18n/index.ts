// src/i18n/index.ts

export const DEFAULT_LANG = "en" as const;

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import("./dictionaries/en.json"),
  si: () => import("./dictionaries/si.json"),
  ta: () => import("./dictionaries/ta.json"),
};

// ✅ production-safe loader + hard fallback to English
export async function getDictionary(lang: string) {
  const loader = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
  try {
    const mod = await loader();
    return mod.default ?? mod;
  } catch {
    const mod = await dictionaries[DEFAULT_LANG]();
    return mod.default ?? mod;
  }
}
