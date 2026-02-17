// src/i18n/useDictionary.ts
"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "./index";
import { useLanguage } from "./LanguageProvider";

export function useDictionary() {
  const { lang } = useLanguage();
  const [dict, setDict] = useState<Record<string, any>>({});

  useEffect(() => {
    let mounted = true;

    getDictionary(lang).then((d) => {
      if (mounted) setDict(d);
    });

    return () => {
      mounted = false;
    };
  }, [lang]);

  return dict;
}
