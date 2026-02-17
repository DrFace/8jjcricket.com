// src/components/LanguageDropdown.tsx
"use client";

import React from "react";
import { useLanguage } from "@/src/i18n/LanguageProvider";
import { LANGUAGES } from "@/src/i18n";

export default function LanguageDropdown() {
  const { lang, setLang } = useLanguage();

  return (
    <select value={lang} onChange={(e) => setLang(e.target.value)}>
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
