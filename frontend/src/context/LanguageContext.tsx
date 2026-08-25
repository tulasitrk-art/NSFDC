"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/lib/i18n/en.json";
import hi from "@/lib/i18n/hi.json";
import te from "@/lib/i18n/te.json";
import ta from "@/lib/i18n/ta.json";
import kn from "@/lib/i18n/kn.json";
import mr from "@/lib/i18n/mr.json";
import bn from "@/lib/i18n/bn.json";
import gu from "@/lib/i18n/gu.json";

export type LanguageCode = "en" | "te" | "hi" | "ta" | "kn" | "mr" | "bn" | "gu";

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
];

const dictionaries: Record<LanguageCode, any> = {
  en,
  te,
  hi,
  ta,
  kn,
  mr,
  bn,
  gu,
};

interface LanguageContextType {
  currentLang: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("nsfdc_lang_code") as LanguageCode;
      if (savedLang && dictionaries[savedLang]) {
        setCurrentLangState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLangState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("nsfdc_lang_code", lang);
    }
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let currentDict = dictionaries[currentLang] || dictionaries.en;

    for (const key of keys) {
      if (currentDict && currentDict[key] !== undefined) {
        currentDict = currentDict[key];
      } else {
        // Fallback to English dictionary if key missing in target language
        let fallbackDict = dictionaries.en;
        for (const fk of keys) {
          if (fallbackDict && fallbackDict[fk] !== undefined) {
            fallbackDict = fallbackDict[fk];
          } else {
            return keyPath;
          }
        }
        return typeof fallbackDict === "string" ? fallbackDict : keyPath;
      }
    }

    return typeof currentDict === "string" ? currentDict : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
