"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";
import { speakText } from "@/lib/voice_utils";

interface VoiceReadoutProps {
  textToRead: string;
  lang?: LanguageCode | string;
  label?: string;
  className?: string;
}

const LISTEN_LABELS: Record<LanguageCode, { play: string; stop: string }> = {
  en: { play: "🔊 Listen Audio", stop: "⏹ Stop Audio" },
  te: { play: "🔊 ఆడియో వినండి", stop: "⏹ ఆపండి" },
  hi: { play: "🔊 ऑडियो सुनें", stop: "⏹ रोकें" },
  ta: { play: "🔊 ஆடியோ கேளுங்கள்", stop: "⏹ நிறுத்து" },
  kn: { play: "🔊 ಆಡಿಯೋ ಕೇಳಿ", stop: "⏹ ನಿಲ್ಲಿಸಿ" },
  mr: { play: "🔊 ऑडिओ ऐका", stop: "⏹ थांबवा" },
  bn: { play: "🔊 অডিও শুনুন", stop: "⏹ থামুন" },
  gu: { play: "🔊 ઑડિઓ સાંભળો", stop: "⏹ રોકો" },
};

export const VoiceReadout: React.FC<VoiceReadoutProps> = ({
  textToRead,
  lang,
  label,
  className = "",
}) => {
  const { currentLang } = useLanguage();
  const activeLang = (lang as LanguageCode) || currentLang || "en";
  const [isPlaying, setIsPlaying] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const labels = LISTEN_LABELS[activeLang] || LISTEN_LABELS.en;

  const handleSpeech = () => {
    if (isPlaying) {
      if (cancelRef.current) cancelRef.current();
      setIsPlaying(false);
      return;
    }

    if (cancelRef.current) cancelRef.current();

    setIsPlaying(true);
    cancelRef.current = speakText(
      textToRead,
      activeLang,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  return (
    <button
      type="button"
      onClick={handleSpeech}
      className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer ${
        isPlaying
          ? "bg-red-600 text-white animate-pulse"
          : "bg-gov-saffron hover:bg-amber-400 text-slate-950 border border-yellow-300"
      } ${className}`}
      title={isPlaying ? labels.stop : labels.play}
    >
      {isPlaying ? <VolumeX className="w-4 h-4 shrink-0" /> : <Volume2 className="w-4 h-4 shrink-0" />}
      <span>{isPlaying ? labels.stop : (label || labels.play)}</span>
    </button>
  );
};

