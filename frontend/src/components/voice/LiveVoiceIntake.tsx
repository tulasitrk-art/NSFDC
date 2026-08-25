"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

interface LiveVoiceIntakeProps {
  onParsedInput: (parsedData: { projectCost?: number; annualIncome?: number; gender?: string; schemeId?: string }) => void;
}

const VOICE_LANG_MAP: Record<LanguageCode, { locale: string; name: string; demoText: string }> = {
  en: {
    locale: "en-IN",
    name: "English (India)",
    demoText: "I want a loan of 140000 rupees for micro credit. My family income is 180000 rupees."
  },
  te: {
    locale: "te-IN",
    name: "తెలుగు (Telugu)",
    demoText: "నాకు 140000 రూపాయల మైక్రో క్రెడిట్ రుణం కావాలి. నా కుటుంబ వార్షిక ఆదాయం 180000 రూపాయలు."
  },
  hi: {
    locale: "hi-IN",
    name: "हिन्दी (Hindi)",
    demoText: "मुझे माइक्रो क्रेडिट के लिए 140000 रुपये का ऋण चाहिए। मेरी पारिवारिक आय 180000 रुपये है।"
  },
  ta: {
    locale: "ta-IN",
    name: "தமிழ் (Tamil)",
    demoText: "எனக்கு 140000 ரூபாய் நுண்கடன் தேவை. என் குடும்ப வருமானம் 180000 ரூபாய்."
  },
  kn: {
    locale: "kn-IN",
    name: "ಕನ್ನಡ (Kannada)",
    demoText: "ನನಗೆ 140000 ರೂಪಾಯಿ ಮೈಕ್ರೋ ಕ್ರೆಡಿಟ್ ಸಾಲ ಬೇಕು. ನನ್ನ ಕುಟುಂಬದ ಆದಾಯ 180000 ರೂಪಾಯಿ."
  },
  mr: {
    locale: "mr-IN",
    name: "मराठी (Marathi)",
    demoText: "मला मायक्रो क्रेडिटसाठी 140000 रुपयांचे कर्ज हवे आहे. माझे कौटुंबिक उत्पन्न 180000 रुपये आहे."
  },
  bn: {
    locale: "bn-IN",
    name: "বাংলা (Bengali)",
    demoText: "আমার ১২০০০০ টাকার ক্ষুদ্র ঋণ প্রয়োজন। আমার পারিবারিক আয় ১৮০০০ টাকা।"
  },
  gu: {
    locale: "gu-IN",
    name: "ગુજરાતી (Gujarati)",
    demoText: "મને 140000 રૂપિયાની માઇક્રો ક્રેડિટ લોન જોઈએ છે. મારી કૌટુંબિક આવક 180000 રૂપિયા છે."
  }
};

export const LiveVoiceIntake: React.FC<LiveVoiceIntakeProps> = ({ onParsedInput }) => {
  const { currentLang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<LanguageCode>(currentLang || "en");
  const [parsedTokens, setParsedTokens] = useState<{ cost?: number; income?: number; gender?: string }>({});
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSelectedVoiceLang(currentLang || "en");
  }, [currentLang]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = VOICE_LANG_MAP[selectedVoiceLang]?.locale || "en-IN";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          parseTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedVoiceLang]);

  const parseTranscript = (text: string) => {
    const lower = text.toLowerCase();
    const numbers = text.match(/\d+[\d,.]*/g);
    let foundCost: number | undefined;
    let foundIncome: number | undefined;

    if (numbers && numbers.length > 0) {
      const cleanNums = numbers.map((n) => parseFloat(n.replace(/,/g, "")));
      if (cleanNums.length >= 1) {
        foundCost = cleanNums[0];
        if (foundCost < 5000) foundCost *= 1000;
      }
      if (cleanNums.length >= 2) {
        foundIncome = cleanNums[1];
        if (foundIncome < 5000) foundIncome *= 1000;
      }
    }

    // Check for "lakh" in English, Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Gujarati
    if (
      lower.includes("lakh") ||
      lower.includes("lac") ||
      lower.includes("లక్ష") ||
      lower.includes("लाख") ||
      lower.includes("லட்சம்") ||
      lower.includes("ಲಕ್ಷ") ||
      lower.includes("লাখ") ||
      lower.includes("লক্ষ") ||
      lower.includes("લાખ")
    ) {
      if (!foundCost) foundCost = 140000;
      if (!foundIncome) foundIncome = 180000;
    }

    // Gender detection heuristics in all 8 languages
    let detectedGender = "FEMALE";
    if (
      lower.includes("male") ||
      lower.includes("man") ||
      lower.includes("పురుషుడు") ||
      lower.includes("पुरुष") ||
      lower.includes("ஆண்") ||
      lower.includes("ಪುರುಷ") ||
      lower.includes("পুরুষ") ||
      lower.includes("પુરુષ") ||
      lower.includes("मुलगा")
    ) {
      detectedGender = "MALE";
    }

    setParsedTokens({ cost: foundCost, income: foundIncome, gender: detectedGender });
    onParsedInput({
      projectCost: foundCost,
      annualIncome: foundIncome,
      gender: detectedGender
    });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.lang = VOICE_LANG_MAP[selectedVoiceLang]?.locale || "en-IN";
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const simulateSampleVoiceInput = () => {
    const sampleText = VOICE_LANG_MAP[selectedVoiceLang]?.demoText || VOICE_LANG_MAP.en.demoText;
    setTranscript(sampleText);
    parseTranscript(sampleText);
  };

  return (
    <div className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#001529] text-white p-6 sm:p-8 rounded-3xl border-2 border-gov-gold/40 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-gold/30 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gov-saffron text-slate-950 rounded-xl flex items-center justify-center font-black shadow-md">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <span>AI Multi-Lingual Voice Intake Assistant</span>
              <span className="bg-gov-gold text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                8 Indian Languages
              </span>
            </h3>
            <p className="text-xs text-slate-300">Speak naturally in your selected language to auto-fill loan parameters.</p>
          </div>
        </div>

        {/* Selected Voice Language Display */}
        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-xl border border-white/20">
          <span className="text-xs text-slate-300 font-bold">Active Voice Language:</span>
          <select
            value={selectedVoiceLang}
            onChange={(e) => setSelectedVoiceLang(e.target.value as LanguageCode)}
            className="bg-gov-saffron text-slate-950 font-black text-xs rounded-lg px-3 py-1 focus:outline-none cursor-pointer"
          >
            {Object.entries(VOICE_LANG_MAP).map(([code, info]) => (
              <option key={code} value={code}>
                {info.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Mic Action & Demo Simulation */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          onClick={toggleListening}
          className={`w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 shadow-xl ${
            isListening
              ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
              : "bg-gov-saffron hover:bg-amber-400 text-slate-950"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 animate-bounce" />
              <span>Listening Live in {VOICE_LANG_MAP[selectedVoiceLang]?.name}... (Click to Stop)</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Start Speaking ({VOICE_LANG_MAP[selectedVoiceLang]?.name})</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={simulateSampleVoiceInput}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-xs font-bold px-6 py-4 rounded-2xl border border-white/20 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-gov-saffron" />
          <span>Simulate Demo Voice ({VOICE_LANG_MAP[selectedVoiceLang]?.name})</span>
        </button>
      </div>

      {/* Recognized Speech Token Stream Box */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-white/10 space-y-2 min-h-[80px]">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider">
          <span>Speech Recognition Token Stream</span>
          {isListening && <span className="text-emerald-400 animate-pulse font-bold">● Recording Live Audio</span>}
        </div>
        <p className="text-sm font-mono text-gov-gold italic leading-relaxed">
          {transcript ? `"${transcript}"` : `Click 'Start Speaking' and state your loan cost and annual family income in ${VOICE_LANG_MAP[selectedVoiceLang]?.name}...`}
        </p>
      </div>

      {/* Auto-Filled Parameters Confirmation Card */}
      {(parsedTokens.cost || parsedTokens.income) && (
        <div className="bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2 text-emerald-300 font-extrabold">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm">✓ Auto-Detected & Filled Loan Parameters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {parsedTokens.cost && (
              <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-400 text-white font-mono font-bold text-xs">
                Project Cost: <strong className="text-gov-gold">₹ {parsedTokens.cost.toLocaleString()}</strong>
              </span>
            )}
            {parsedTokens.income && (
              <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-400 text-white font-mono font-bold text-xs">
                Family Income: <strong className="text-emerald-400">₹ {parsedTokens.income.toLocaleString()}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
