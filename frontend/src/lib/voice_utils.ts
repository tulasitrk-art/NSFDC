import { LanguageCode } from "@/context/LanguageContext";

export const VOICE_LOCALE_MAP: Record<
  LanguageCode,
  { locale: string; name: string; nativePrefix: (qNum: number) => string }
> = {
  en: {
    locale: "en-IN",
    name: "English",
    nativePrefix: (n) => `Question ${n}: `,
  },
  te: {
    locale: "te-IN",
    name: "తెలుగు (Telugu)",
    nativePrefix: (n) => `ప్రశ్న ${n}: `,
  },
  hi: {
    locale: "hi-IN",
    name: "हिन्दी (Hindi)",
    nativePrefix: (n) => `प्रश्न ${n}: `,
  },
  ta: {
    locale: "ta-IN",
    name: "தமிழ் (Tamil)",
    nativePrefix: (n) => `கேள்வி ${n}: `,
  },
  kn: {
    locale: "kn-IN",
    name: "ಕನ್ನಡ (Kannada)",
    nativePrefix: (n) => `ಪ್ರಶ್ನೆ ${n}: `,
  },
  mr: {
    locale: "mr-IN",
    name: "मराठी (Marathi)",
    nativePrefix: (n) => `प्रश्न ${n}: `,
  },
  bn: {
    locale: "bn-IN",
    name: "বাংলা (Bengali)",
    nativePrefix: (n) => `প্রশ্ন ${n}: `,
  },
  gu: {
    locale: "gu-IN",
    name: "ગુજરાતી (Gujarati)",
    nativePrefix: (n) => `પ્રશ્ન ${n}: `,
  },
};

// Global audio element tracker
let activeAudioPlayer: HTMLAudioElement | null = null;
let activeKeepAliveTimer: any = null;

// Cached voices list
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

// Find best native voice matching target language if speech synthesis is used
export function getBestVoice(lang: LanguageCode): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  let voices = cachedVoices;
  if (!voices || voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
    cachedVoices = voices;
  }
  if (!voices || voices.length === 0) return null;

  const targetLocale = (VOICE_LOCALE_MAP[lang]?.locale || "en-IN").toLowerCase();
  const langPrefix = lang.toLowerCase();

  // Search by exact locale code (e.g. mr-IN, bn-IN, gu-IN, te-IN, hi-IN, ta-IN, kn-IN)
  let matched = voices.find(
    (v) =>
      v.lang.toLowerCase().replace("_", "-") === targetLocale ||
      v.lang.toLowerCase().startsWith(langPrefix)
  );
  if (matched) return matched;

  // Search by language name keywords
  const langNameKeywords: Record<LanguageCode, string[]> = {
    te: ["telugu", "te-in", "te_in", "chitra", "mohan"],
    hi: ["hindi", "hi-in", "hi_in", "swara", "heera", "kalpana", "madhav"],
    ta: ["tamil", "ta-in", "ta_in", "pallavi", "valluvar"],
    kn: ["kannada", "kn-in", "kn_in", "gagan", "sapna"],
    mr: ["marathi", "mr-in", "mr_in", "aarohi", "manohar"],
    bn: ["bengali", "bangla", "bn-in", "bn_in", "tanishaa", "bashkar"],
    gu: ["gujarati", "gu-in", "gu_in", "dhwani", "niranjan"],
    en: ["en-in", "indian", "ravi", "heera", "english", "neerja"],
  };

  const keywords = langNameKeywords[lang] || ["english"];
  for (const kw of keywords) {
    matched = voices.find(
      (v) =>
        v.name.toLowerCase().includes(kw) ||
        v.lang.toLowerCase().includes(kw)
    );
    if (matched) return matched;
  }

  return null;
}

// Clean text for speech to ensure natural, pleasant pronunciation
export function formatTextForSpeech(text: string, lang: LanguageCode, qNumber?: number): string {
  if (!text) return "";

  // Remove leading numbering like "1. ", "2. ", "1 / 6: "
  let cleaned = text.replace(/^\d+\.\s*/, "").replace(/^[0-9]+\s*[\/:]\s*[0-9]+[\s:]*/, "");

  // Clean emojis, icons, and special symbols
  cleaned = cleaned
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D/g, " ")
    .replace(/[#*`_~₹]/g, " ")
    .replace(/\s*•\s*/g, ". ")
    .replace(/\s+/g, " ")
    .trim();

  // If question number is provided, prepend natural localized prefix
  if (qNumber && qNumber > 0 && VOICE_LOCALE_MAP[lang]) {
    const prefix = VOICE_LOCALE_MAP[lang].nativePrefix(qNumber);
    cleaned = `${prefix}${cleaned}`;
  }

  return cleaned;
}

/**
 * Universal Multilingual Audio & Speech Synthesis
 * Plays crystal-clear native speech in Marathi, Bengali, Gujarati, Telugu, Hindi, Tamil, Kannada, and English.
 * Uses reliable Audio playback with fallback to Web Speech API.
 */
export function speakText(
  rawText: string,
  lang: LanguageCode = "en",
  onStart?: () => void,
  onEnd?: () => void,
  qNumber?: number
): () => void {
  if (typeof window === "undefined") {
    if (onEnd) onEnd();
    return () => {};
  }

  // 1. Stop any currently playing audio / synthesis
  stopAllSpeech();

  const textToSpeak = formatTextForSpeech(rawText, lang, qNumber);
  if (!textToSpeak) {
    if (onEnd) onEnd();
    return () => {};
  }

  let isEnded = false;
  const finish = () => {
    if (!isEnded) {
      isEnded = true;
      if (activeKeepAliveTimer) {
        clearInterval(activeKeepAliveTimer);
        activeKeepAliveTimer = null;
      }
      if (onEnd) onEnd();
    }
  };

  // 2. Audio playback with high-reliability regional TTS route
  const encodedText = encodeURIComponent(textToSpeak.slice(0, 1000));
  const audioUrls = [
    `/api/tts?lang=${lang}&text=${encodedText}`,
    `http://127.0.0.1:8000/api/v1/voice/tts?lang=${lang}&text=${encodedText}`
  ];

  let audioAttempted = false;

  const tryWebSpeechSynthesis = () => {
    if (!("speechSynthesis" in window)) {
      finish();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const targetLocale = VOICE_LOCALE_MAP[lang]?.locale || "en-IN";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLocale;
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      const bestVoice = getBestVoice(lang);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        finish();
      };
      utterance.onerror = (e) => {
        console.warn("Speech synthesis error:", e);
        finish();
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Web Speech API fallback failed:", e);
      finish();
    }
  };

  // Try HTML5 Audio
  const tryAudioUrl = (urlIndex: number) => {
    if (urlIndex >= audioUrls.length) {
      tryWebSpeechSynthesis();
      return;
    }

    try {
      const audio = new Audio(audioUrls[urlIndex]);
      activeAudioPlayer = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        activeAudioPlayer = null;
        finish();
      };

      audio.onerror = () => {
        // Try next audio source or fallback to Web Speech
        tryAudioUrl(urlIndex + 1);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio autoplay policy notice, falling back:", err);
          tryAudioUrl(urlIndex + 1);
        });
      }
    } catch (err) {
      tryAudioUrl(urlIndex + 1);
    }
  };

  tryAudioUrl(0);

  // Return cancel handler
  return () => {
    stopAllSpeech();
    finish();
  };
}

// Stop all active audio playback and speech synthesis immediately
export function stopAllSpeech() {
  if (typeof window === "undefined") return;

  // Stop HTML5 Audio
  if (activeAudioPlayer) {
    try {
      activeAudioPlayer.pause();
      activeAudioPlayer.currentTime = 0;
      activeAudioPlayer.src = "";
    } catch (e) {
      // ignore
    }
    activeAudioPlayer = null;
  }

  // Stop Web Speech Synthesis
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  if (activeKeepAliveTimer) {
    clearInterval(activeKeepAliveTimer);
    activeKeepAliveTimer = null;
  }
}

// Speech-to-Text Recognition Initializer for all 8 Indian languages
export function createSpeechRecognizer(
  lang: LanguageCode = "en",
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
): any {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = VOICE_LOCALE_MAP[lang]?.locale || "en-IN";

  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    const resultText = final || interim;
    onResult(resultText, Boolean(final));
  };

  recognition.onerror = (event: any) => {
    onError(event.error || "Speech recognition error");
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}

// Multilingual Number & Parameter Extractor supporting all 8 languages
export function extractNumberFromSpeech(text: string): number | null {
  if (!text) return null;
  const clean = text.toLowerCase();

  let multiplier = 1;
  // Crores
  if (
    clean.includes("crore") ||
    clean.includes("करोड़") ||
    clean.includes("कोटी") ||
    clean.includes("ಕೋಟಿ") ||
    clean.includes("கோடி") ||
    clean.includes("కోట్లు") ||
    clean.includes("కోటి") ||
    clean.includes("কোটি") ||
    clean.includes("કરોડ")
  ) {
    multiplier = 10000000;
  }
  // Lakhs
  else if (
    clean.includes("lakh") ||
    clean.includes("lac") ||
    clean.includes("लाख") ||
    clean.includes("లక్ష") ||
    clean.includes("లక్షల") ||
    clean.includes("லட்சம்") ||
    clean.includes("ಲಕ್ಷ") ||
    clean.includes("লাখ") ||
    clean.includes("লক্ষ") ||
    clean.includes("લાખ")
  ) {
    multiplier = 100000;
  }
  // Thousands
  else if (
    clean.includes("thousand") ||
    clean.includes("हज़ार") ||
    clean.includes("हजार") ||
    clean.includes("வேలు") ||
    clean.includes("வேల") ||
    clean.includes("ஆயிரம்") ||
    clean.includes("ಸಾವಿರ") ||
    clean.includes("হাজার") ||
    clean.includes("હજાર")
  ) {
    multiplier = 1000;
  }

  const digits = clean.match(/\d+[\d,.]*/g);
  if (digits && digits.length > 0) {
    const rawNum = parseFloat(digits[0].replace(/,/g, ""));
    if (multiplier > 1 && rawNum < 1000) {
      return rawNum * multiplier;
    }
    return rawNum;
  }

  // Word approximations across all 8 Indian Languages
  const wordMap: Record<string, number> = {
    // English
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    twenty: 20, thirty: 30, forty: 40, fifty: 50,
    // Hindi & Marathi
    एक: 1, दो: 2, दोन: 2, तीन: 3, चार: 4, पांच: 5, पाच: 5, छह: 6, सहा: 6, सात: 7, आठ: 8, नौ: 9, नऊ: 9,
    दस: 10, दहा: 10, बीस: 20, वीस: 20, तीस: 30, चालीस: 40, चाळीस: 40, पचास: 50, पन्नास: 50,
    // Telugu
    ఒకటి: 1, రెండు: 2, మూడు: 3, నాలుగు: 4, ఐదు: 5, ఆరు: 6, ఏడు: 7, ఎనిమిది: 8, తొమ్మిది: 9, పది: 10,
    ఇరవై: 20, ముప్పై: 30, నలభై: 40, యాభై: 50,
    // Bengali
    এক: 1, দুই: 2, তিন: 3, চার: 4, পাঁচ: 5, ছয়: 6, সাত: 7, আট: 8, নয়: 9, দশ: 10,
    কুড়ি: 20, ত্রিশ: 30, চল্লিশ: 40, পঞ্চাশ: 50,
    // Gujarati
    એક: 1, બે: 2, ત્રણ: 3, ચાર: 4, પાંચ: 5, છ: 6, સાત: 7, આઠ: 8, નવ: 9, દસ: 10,
    વીસ: 20, ત્રીસ: 30, ચાલીસ: 40, પચાસ: 50,
    // Tamil
    ஒன்று: 1, இரண்டு: 2, மூன்று: 3, நான்கு: 4, ஐந்து: 5, ஆறு: 6, ஏழு: 7, எட்டு: 8, ஒன்பது: 9, பத்து: 10,
    இருபது: 20, முப்பது: 30, நாற்பது: 40, ஐம்பது: 50,
    // Kannada
    ಒಂದು: 1, ಎರಡು: 2, ಮೂರು: 3, ನಾಲ್ಕು: 4, ಐದು: 5, ಆರು: 6, ಏಳು: 7, ಎಂಟು: 8, ಒಂಬತ್ತು: 9, ಹತ್ತು: 10,
    ಇಪ್ಪತ್ತು: 20, ಮೂವತ್ತು: 30, ನಲವತ್ತು: 40, ಐವತ್ತು: 50,
  };

  for (const [word, val] of Object.entries(wordMap)) {
    if (clean.includes(word)) {
      if (multiplier > 1) return val * multiplier;
      return val;
    }
  }

  return null;
}
