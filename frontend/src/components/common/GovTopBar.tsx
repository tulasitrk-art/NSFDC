"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/context/LanguageContext";

export const GovTopBar: React.FC = () => {
  const { currentLang, setLanguage } = useLanguage();
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("font-sm", "font-md", "font-lg");
    document.documentElement.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  return (
    <div className="w-full bg-[#001529] text-white border-b border-gov-saffron/40 text-xs py-1.5 px-4 sm:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left: Indian Tricolor Badge & Gov Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-3.5 w-6 rounded-sm overflow-hidden border border-white/20">
            <div className="w-1/3 bg-[#FF9933]"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>
          <span className="font-semibold tracking-wide text-slate-200">
            भारत सरकार | GOVERNMENT OF INDIA
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-gov-saffron font-medium">
            Ministry of Social Justice & Empowerment
          </span>
        </div>

        {/* Right: Accessibility Controls & 8-Language Selector */}
        <div className="flex items-center space-x-3">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:bg-gov-saffron focus:text-slate-950 px-2 py-0.5 rounded font-bold">
            Skip to Main Content
          </a>

          {/* Font Resizing Controls */}
          <div className="flex items-center space-x-1 bg-white/10 rounded-md p-0.5 border border-white/15">
            <button
              onClick={() => setFontSize("sm")}
              title="Decrease Font Size"
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === "sm" ? "bg-gov-saffron text-slate-900" : "hover:bg-white/20"}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("md")}
              title="Standard Font Size"
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === "md" ? "bg-gov-saffron text-slate-900" : "hover:bg-white/20"}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              title="Increase Font Size"
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === "lg" ? "bg-gov-saffron text-slate-900" : "hover:bg-white/20"}`}
            >
              A+
            </button>
          </div>

          {/* 8-Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1.5 bg-gov-saffron text-slate-950 font-bold px-2.5 py-1 rounded shadow-sm hover:bg-amber-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)?.label || "English"}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-slate-900 text-white rounded shadow-xl border border-gov-saffron/40 z-50 py-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gov-navy/80 flex items-center justify-between transition-colors"
                  >
                    <span>{lang.label}</span>
                    {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-gov-saffron" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

