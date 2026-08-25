"use client";

import React from "react";
import { Mic, FileText, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IntakeModeSelectorProps {
  onSelectMode: (mode: "VOICE" | "TEXT") => void;
}

export const IntakeModeSelector: React.FC<IntakeModeSelectorProps> = ({ onSelectMode }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/50 text-gov-saffron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Select Preferred Intake Method</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#002147]">How Would You Like to Apply?</h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Choose between interactive AI Voice Assistance or sequential translated Text Q&A.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 max-w-4xl mx-auto">
        {/* MODE A: AI VOICE ASSISTANCE */}
        <button
          type="button"
          onClick={() => onSelectMode("VOICE")}
          className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 hover:border-[#002147] bg-white hover:bg-slate-50 transition-all text-left space-y-4 shadow-sm hover:shadow-md group relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-gov-saffron text-slate-950 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-gov-saffron uppercase tracking-wider block">
              Option A • Illiteracy Assisted
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#002147]">
              🎙️ AI Voice Assistance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Speak naturally in your preferred language (English, Telugu, Hindi, etc.). The AI assistant speaks questions out loud and listens to your responses.
            </p>
          </div>

          <div className="pt-2 text-xs font-bold text-[#002147] flex items-center space-x-1">
            <span>Start Voice Intake →</span>
          </div>
        </button>

        {/* MODE B: TEXT WIZARD */}
        <button
          type="button"
          onClick={() => onSelectMode("TEXT")}
          className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 hover:border-[#002147] bg-white hover:bg-slate-50 transition-all text-left space-y-4 shadow-sm hover:shadow-md group relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-[#002147] text-white rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-gov-navy uppercase tracking-wider block">
              Option B • Step-by-Step
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#002147]">
              📝 Text-Based Wizard
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fill in your details using sequential translated Q&A cards with clear choices in your selected language.
            </p>
          </div>

          <div className="pt-2 text-xs font-bold text-[#002147] flex items-center space-x-1">
            <span>Start Text Wizard →</span>
          </div>
        </button>
      </div>
    </div>
  );
};
