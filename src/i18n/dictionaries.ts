// src/i18n/dictionaries.ts

export const DEFAULT_LANG = "en" as const;

// ✅ Keep the language list as a constant (do NOT put this into React state)
export const LANGUAGES = [
  { code: "en", label: "English" },
  // Add your real languages here:
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

// ✅ Static import map (production-safe)
const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import("./dictionaries/en.json"),
  si: () => import("./dictionaries/si.json"),
  ta: () => import("./dictionaries/ta.json"),
};

// ✅ Always fallback to English if requested lang fails in production
export async function getDictionary(lang: string) {
  const loader = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];

  try {
    const mod = await loader();
    return mod.default ?? mod;
  } catch (e) {
    // Hard fallback to English if anything fails
    const mod = await dictionaries[DEFAULT_LANG]();
    return mod.default ?? mod;
  }
}
