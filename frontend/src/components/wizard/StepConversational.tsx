"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";
import { Mic, MicOff, UserCheck, MapPin, Briefcase, IndianRupee, ShieldCheck, CheckCircle2, User, Volume2, Save } from "lucide-react";
import { INDIAN_STATES } from "@/lib/api";
import { speakText as universalSpeakText, stopAllSpeech } from "@/lib/voice_utils";

interface StepConversationalProps {
  mode: "VOICE" | "TEXT";
  onComplete: (data: {
    applicantName: string;
    contactNumber: string;
    gender: string;
    stateCode: string;
    activityPurpose: string;
    projectCost: number;
    annualIncome: number;
    beneficiaryType: string;
  }) => void;
}

const VOICE_LANG_LOCALE: Record<LanguageCode, string> = {
  en: "en-IN",
  te: "te-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  gu: "gu-IN"
};

const SPOKEN_QUESTIONS: Record<LanguageCode, string[]> = {
  en: [
    "Please speak or enter your full applicant name and contact number.",
    "Question 1: Select beneficiary gender. Concessional interest rates apply for female applicants.",
    "Question 2: Select your target Indian State or Union Territory.",
    "Question 3: Select your project loan activity and business purpose.",
    "Question 4: Enter your total project cost in rupees.",
    "Question 5: Enter your annual family income in rupees.",
    "Question 6: Select your beneficiary category."
  ],
  te: [
    "దయచేసి మీ పూర్తి పేరు మరియు ఫోన్ నంబర్ చెప్పండి లేదా నమోదు చేయండి.",
    "ప్రశ్న 1: లబ్ధిదారు లింగం ఎంచుకోండి. మహిళలకు 5 శాతం అదనపు వడ్డీ రాయితీ వర్తిస్తుంది.",
    "ప్రశ్న 2: మీ రాష్ట్రాన్ని ఎంచుకోండి.",
    "ప్రశ్న 3: మీ వ్యాపార ప్రాజెక్ట్ రకాన్ని ఎంచుకోండి.",
    "ప్రశ్న 4: మీ మొత్తం ప్రాజెక్ట్ ఖర్చు రూపాయలలో చెప్పండి.",
    "ప్రశ్న 5: మీ కుటుంబ వార్షిక ఆదాయం రూపాయలలో చెప్పండి.",
    "ప్రశ్న 6: లబ్ధిదారు వర్గాన్ని ఎంచుకోండి."
  ],
  hi: [
    "कृपया अपना पूरा नाम और फोन नंबर बोलें या दर्ज करें।",
    "प्रश्न 1: लाभार्थी का लिंग चुनें। महिला लाभार्थियों के लिए विशेष 5 प्रतिशत रियायती ब्याज दर लागू है।",
    "प्रश्न 2: अपने राज्य का चयन करें।",
    "प्रश्न 3: अपने प्रोजेक्ट व्यवसाय का चयन करें।",
    "प्रश्न 4: अपनी कुल परियोजना लागत रुपये में बताएं।",
    "प्रश्न 5: अपनी वार्षिक पारिवारिक आय रुपये में बताएं।",
    "प्रश्न 6: लाभार्थी श्रेणी का चयन करें।"
  ],
  ta: [
    "தயவுசெய்து உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணைக் கூறவும்.",
    "கேள்வி 1: பயனாளியின் பாலினத்தைத் தேர்ந்தெடுக்கவும். பெண்களுக்கு சிறப்பு வட்டி சலுகை உண்டு.",
    "கேள்வி 2: உங்கள் மாநிலத்தைத் தேர்ந்தெடுக்கவும்.",
    "கேள்வி 3: உங்கள் திட்டத்தின் நோக்கத்தைத் தேர்ந்தெடுக்கவும்.",
    "கேள்வி 4: உங்கள் மொத்த திட்ட செலவைக் கூறவும்.",
    "கேள்வி 5: உங்கள் குடும்ப ஆண்டு வருமானத்தைக் கூறவும்.",
    "கேள்வி 6: பயனாளி பிரிவைத் தேர்ந்தெடுக்கவும்."
  ],
  kn: [
    "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ.",
    "ಪ್ರಶ್ನೆ 1: ಫಲಾನುಭವಿಯ ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಮಹಿಳೆಯರಿಗೆ ವಿಶೇಷ ರಿಯಾಯಿತಿ ಬಡ್ಡಿ ದರ ಅನ್ವಯಿಸುತ್ತದೆ.",
    "ಪ್ರಶ್ನೆ 2: ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    "ಪ್ರಶ್ನೆ 3: ನಿಮ್ಮ ಯೋಜನೆಯ ಉದ್ದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    "ಪ್ರಶ್ನೆ 4: ನಿಮ್ಮ ಒಟ್ಟು ಯೋಜನೆ ವೆಚ್ಚವನ್ನು ಹೇಳಿ.",
    "ಪ್ರಶ್ನೆ 5: ನಿಮ್ಮ ಕೌಟುಂಬಿಕ ವಾರ್ಷಿಕ ಆದಾಯವನ್ನು ಹೇಳಿ.",
    "ಪ್ರಶ್ನೆ 6: ಫಲಾನುಭವಿ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ."
  ],
  mr: [
    "कृपया आपले नाव आणि फोन नंबर सांगा.",
    "प्रश्न 1: लाभार्थ्याचे लिंग निवडा. महिलांसाठी विशेष सवलतीचा व्याजदर लागू आहे.",
    "प्रश्न 2: आपले राज्य निवडा.",
    "प्रश्न 3: आपल्या योजनेचा व्यवसाय प्रकार निवडा.",
    "प्रश्न 4: आपली एकूण प्रकल्प किंमत सांगा.",
    "प्रश्न 5: आपले कौटुंबिक वार्षिक उत्पन्न सांगा.",
    "प्रश्न 6: लाभार्थी वर्ग निवडा."
  ],
  bn: [
    "দয়া করে আপনার নাম এবং ফোন নম্বর বলুন।",
    "প্রশ্ন ১: আবেদনকারীর লিঙ্গ নির্বাচন করুন। মহিলাদের জন্য বিশেষ সুদের ছাড় রয়েছে।",
    "প্রশ্ন ২: আপনার রাজ্য নির্বাচন করুন।",
    "প্রশ্ন ৩: আপনার প্রকল্প ব্যবসায় নির্বাচন করুন।",
    "প্রশ্ন ৪: আপনার মোট প্রকল্প খরচ বলুন।",
    "প্রশ্ন ৫: আপনার পারিবারিক বার্ষিক আয় বলুন।",
    "প্রশ্ন ৬: সুবিধাভোগীর শ্রেণী নির্বাচন করুন।"
  ],
  gu: [
    "કૃપા કરીને તમારું નામ અને ફોન નંબર જણાવો.",
    "પ્રશ્ન 1: લાભાર્થીનું લિંગ પસંદ કરો. મહિલાઓ માટે વિશેષ રાહત દરે વ્યાજ દર લાગુ છે.",
    "પ્રશ્ન 2: તમારું રાજ્ય પસંદ કરો.",
    "પ્રશ્ન 3: તમારા પ્રોજેક્ટનો વ્યવસાય પસંદ કરો.",
    "પ્રશ્ન 4: તમારો કુલ પ્રોજેક્ટ ખર્ચ જણાવો.",
    "પ્રશ્ન 5: તમારી વાર્ષિક કૌટુંબિક આવક જણાવો.",
    "પ્રશ્ન 6: લાભાર્થી શ્રેણી પસંદ કરો."
  ]
};

const CONFIRM_TEXTS: Record<LanguageCode, { female: string; male: string; cost: (c: number) => string; income: (i: number) => string }> = {
  en: {
    female: "Got it! Selected Female Beneficiary with 5% interest rate.",
    male: "Got it! Selected Male Beneficiary.",
    cost: (c) => `Got it! Set project cost to ${c.toLocaleString()} rupees.`,
    income: (i) => `Got it! Set annual family income to ${i.toLocaleString()} rupees.`
  },
  te: {
    female: "సరే! మహిళా లబ్ధిదారు 5 శాతం వడ్డీ రేటు ఎంపిక చేయబడింది.",
    male: "సరే! పురుష లబ్ధిదారు ఎంపిక చేయబడింది.",
    cost: (c) => `సరే! ప్రాజెక్ట్ ఖర్చు ${c.toLocaleString()} రూపాయలుగా నమోదయింది.`,
    income: (i) => `సరే! కుటుంబ ఆదాయం ${i.toLocaleString()} రూపాయలుగా నమోదయింది.`
  },
  hi: {
    female: "ठीक है! 5 प्रतिशत ब्याज दर के साथ महिला लाभार्थी चुना गया।",
    male: "ठीक है! पुरुष लाभार्थी चुना गया।",
    cost: (c) => `ठीक है! परियोजना लागत ${c.toLocaleString()} रुपये दर्ज की गई।`,
    income: (i) => `ठीक है! पारिवारिक आय ${i.toLocaleString()} रुपये दर्ज की गई।`
  },
  ta: {
    female: "சரி! 5 சதவீத வட்டி விகிதத்தில் பெண் பயனாளி தேர்ந்தெடுக்கப்பட்டார்.",
    male: "சரி! ஆண் பயனாளி தேர்ந்தெடுக்கப்பட்டார்.",
    cost: (c) => `சரி! திட்ட செலவு ${c.toLocaleString()} ரூபாயாக பதிவு செய்யப்பட்டது.`,
    income: (i) => `சரி! குடும்ப வருமானம் ${i.toLocaleString()} ரூபாயாக பதிவு செய்யப்பட்டது.`
  },
  kn: {
    female: "ಸರಿ! 5 ಪ್ರತಿಶತ ಬಡ್ಡಿ ದರದೊಂದಿಗೆ ಮಹಿಳಾ ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.",
    male: "ಸರಿ! ಪುರುಷ ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.",
    cost: (c) => `ಸರಿ! ಯೋಜನೆ ವೆಚ್ಚ ${c.toLocaleString()} ರೂಪಾಯಿ ಎಂದು ದಾಖಲಿಸಲಾಗಿದೆ.`,
    income: (i) => `ಸರಿ! ಕೌಟುಂಬಿಕ ಆದಾಯ ${i.toLocaleString()} ರೂಪಾಯಿ ಎಂದು ದಾಖಲಿಸಲಾಗಿದೆ.`
  },
  mr: {
    female: "ठीक आहे! 5 टक्के व्याजदरासह महिला लाभार्थी निवडली आहे.",
    male: "ठीक आहे! पुरुष लाभार्थी निवडला आहे.",
    cost: (c) => `ठीक आहे! प्रकल्प किंमत ${c.toLocaleString()} रुपये नोंदवली गेली.`,
    income: (i) => `ठीक आहे! कौटुंबिक उत्पन्न ${i.toLocaleString()} रुपये नोंदवले गेले.`
  },
  bn: {
    female: "ঠিক আছে! ৫ শতাংশ সুদের হারে মহিলা সুবিধাভোগী নির্বাচিত হয়েছেন।",
    male: "ঠিক আছে! পুরুষ সুবিধাভোগী নির্বাচিত হয়েছেন।",
    cost: (c) => `ঠিক আছে! প্রকল্প খরচ ${c.toLocaleString()} টাকা রেকর্ড করা হয়েছে।`,
    income: (i) => `ঠিক আছে! পারিবারিক আয় ${i.toLocaleString()} টাকা রেকর্ড করা হয়েছে।`
  },
  gu: {
    female: "બરાબર! 5 ટકા વ્યાજ દર સાથે મહિલા લાભાર્થીની પસંદગી કરવામાં આવી.",
    male: "બરાબર! પુરુષ લાભાર્થીની પસંદગી કરવામાં આવી.",
    cost: (c) => `બરાબર! પ્રોજેક્ટ ખર્ચ ${c.toLocaleString()} રૂપિયા નોંધાયો.`,
    income: (i) => `બરાબર! કૌટુંબિક આવક ${i.toLocaleString()} રૂપિયા નોંધાઈ.`
  }
};

export const StepConversational: React.FC<StepConversationalProps> = ({ mode, onComplete }) => {
  const { t, currentLang } = useLanguage();

  const [currentStep, setCurrentStep] = useState(0); // 0 = Identity, 1-6 = Questions

  // Basic Identity
  const [applicantName, setApplicantName] = useState("Ramesh Kumar SC");
  const [contactNumber, setContactNumber] = useState("+91 98480 12345");

  // Intake Answers
  const [gender, setGender] = useState<"FEMALE" | "MALE" | "TRANSGENDER">("FEMALE");
  const [stateCode, setStateCode] = useState("AP");
  const [activityPurpose, setActivityPurpose] = useState("RETAIL");
  const [projectCost, setProjectCost] = useState(140000);
  const [annualIncome, setAnnualIncome] = useState(180000);
  const [beneficiaryType, setBeneficiaryType] = useState("INDIVIDUAL");

  // Voice Recognition & Speech Synthesis State
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceParsedAnswer, setVoiceParsedAnswer] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Auto Voice Prompt when step changes in VOICE mode
  useEffect(() => {
    if (mode === "VOICE") {
      speakCurrentQuestion();
    }
  }, [currentStep, mode, currentLang]);

  const getSpeechLangCode = () => {
    return VOICE_LANG_LOCALE[currentLang] || "en-IN";
  };

  const speakText = (text: string) => {
    universalSpeakText(
      text,
      currentLang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const speakCurrentQuestion = () => {
    const questionList = SPOKEN_QUESTIONS[currentLang] || SPOKEN_QUESTIONS.en;
    const text = questionList[currentStep] || questionList[0];
    if (text) {
      speakText(text);
    }
  };

  const startVoiceRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Speech Recognition not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLangCode();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setSpeechTranscript(currentTranscript);
      parseSpokenAnswer(currentTranscript);
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const parseSpokenAnswer = (text: string) => {
    const lower = text.toLowerCase();
    const confirms = CONFIRM_TEXTS[currentLang] || CONFIRM_TEXTS.en;

    // =========================================================================
    // STEP 0: Identity Details Parsing
    // =========================================================================
    if (currentStep === 0) {
      if (text.trim().length > 3) {
        setApplicantName(text.trim());
        setVoiceParsedAnswer(`Applicant Name: ${text.trim()}`);
      }
    }

    // =========================================================================
    // QUESTION 1: Gender Parsing (Multi-Lingual)
    // =========================================================================
    else if (currentStep === 1) {
      if (
        lower.includes("female") ||
        lower.includes("woman") ||
        lower.includes("మహిళ") ||
        lower.includes("స్త్రీ") ||
        lower.includes("महिला") ||
        lower.includes("स्त्री") ||
        lower.includes("பெண்") ||
        lower.includes("ಮಹಿಳೆ") ||
        lower.includes("स्त्री")
      ) {
        setGender("FEMALE");
        setVoiceParsedAnswer("Female (5.0% Concessional Rate)");
        speakText(confirms.female);
      } else if (
        lower.includes("male") ||
        lower.includes("man") ||
        lower.includes("పురుషుడు") ||
        lower.includes("पुरुष") ||
        lower.includes("ஆண்") ||
        lower.includes("ಪುರುಷ")
      ) {
        setGender("MALE");
        setVoiceParsedAnswer("Male (6.5% Standard Concession)");
        speakText(confirms.male);
      }
    }

    // =========================================================================
    // QUESTION 2: State Code Parsing (Multi-Lingual)
    // =========================================================================
    else if (currentStep === 2) {
      if (lower.includes("andhra") || lower.includes("ఆంధ్ర") || lower.includes("आंध्र")) {
        setStateCode("AP");
        setVoiceParsedAnswer("Andhra Pradesh (AP)");
      } else if (lower.includes("telangana") || lower.includes("తెలంగాణ") || lower.includes("तेलंगाना")) {
        setStateCode("TS");
        setVoiceParsedAnswer("Telangana (TS)");
      } else if (lower.includes("maharashtra") || lower.includes("महाराष्ट्र") || lower.includes("మహారాష్ట్ర")) {
        setStateCode("MH");
        setVoiceParsedAnswer("Maharashtra (MH)");
      } else if (lower.includes("karnataka") || lower.includes("కర్ణాటక") || lower.includes("कर्नाटक")) {
        setStateCode("KA");
        setVoiceParsedAnswer("Karnataka (KA)");
      } else if (lower.includes("tamil") || lower.includes("తమిళ") || lower.includes("तमिल")) {
        setStateCode("TN");
        setVoiceParsedAnswer("Tamil Nadu (TN)");
      } else if (lower.includes("delhi") || lower.includes("ఢిల్లీ") || lower.includes("दिल्ली")) {
        setStateCode("DL");
        setVoiceParsedAnswer("Delhi NCR (DL)");
      } else if (lower.includes("uttar") || lower.includes("ఉత్తర") || lower.includes("उत्तर")) {
        setStateCode("UP");
        setVoiceParsedAnswer("Uttar Pradesh (UP)");
      } else if (lower.includes("gujarat") || lower.includes("గుజరాత్") || lower.includes("गुजरात")) {
        setStateCode("GJ");
        setVoiceParsedAnswer("Gujarat (GJ)");
      } else if (lower.includes("bengal") || lower.includes("బెంగాల్") || lower.includes("बंगाल")) {
        setStateCode("WB");
        setVoiceParsedAnswer("West Bengal (WB)");
      }
    }

    // =========================================================================
    // QUESTION 3: Project Activity Parsing
    // =========================================================================
    else if (currentStep === 3) {
      if (lower.includes("retail") || lower.includes("vending") || lower.includes("అమ్మకాలు") || lower.includes("दुकान")) {
        setActivityPurpose("RETAIL");
        setVoiceParsedAnswer("Small Retail / Vending");
      } else if (lower.includes("dairy") || lower.includes("farm") || lower.includes("పాలు") || lower.includes("डेयरी")) {
        setActivityPurpose("DAIRY");
        setVoiceParsedAnswer("Dairy & Farming");
      } else if (lower.includes("abroad") || lower.includes("foreign") || lower.includes("విదేశీ") || lower.includes("विदेश")) {
        setActivityPurpose("EDUCATION_ABROAD");
        setVoiceParsedAnswer("Higher Education Abroad");
      } else if (lower.includes("education") || lower.includes("study") || lower.includes("చదువు") || lower.includes("पढ़ाई")) {
        setActivityPurpose("EDUCATION_INDIA");
        setVoiceParsedAnswer("Higher Education India");
      } else if (lower.includes("green") || lower.includes("rickshaw") || lower.includes("రిక్షా") || lower.includes("रिक्शा")) {
        setActivityPurpose("GREEN");
        setVoiceParsedAnswer("Green Energy / E-Rickshaw");
      }
    }

    // =========================================================================
    // QUESTION 4 & 5: Numerical Amounts (Project Cost & Income)
    // =========================================================================
    else if (currentStep === 4 || currentStep === 5) {
      const numbers = text.match(/\d+[\d,.]*/g);
      let val: number | undefined;

      if (numbers && numbers.length > 0) {
        val = parseInt(numbers[0].replace(/,/g, ""), 10);
        if (val < 5000) val *= 1000;
      }

      if (lower.includes("lakh") || lower.includes("లక్ష") || lower.includes("लाख") || lower.includes("லட்சம்") || lower.includes("ಲಕ್ಷ")) {
        if (!val) val = currentStep === 4 ? 140000 : 180000;
      }

      if (val) {
        if (currentStep === 4) {
          setProjectCost(val);
          setVoiceParsedAnswer(`Project Cost Auto-Filled: ₹ ${val.toLocaleString()}`);
          speakText(confirms.cost(val));
        } else if (currentStep === 5) {
          setAnnualIncome(val);
          setVoiceParsedAnswer(`Annual Income Auto-Filled: ₹ ${val.toLocaleString()}`);
          speakText(confirms.income(val));
        }
      }
    }

    // =========================================================================
    // QUESTION 6: Beneficiary Type Parsing
    // =========================================================================
    else if (currentStep === 6) {
      if (lower.includes("shg") || lower.includes("group") || lower.includes("సంఘం") || lower.includes("समूह")) {
        setBeneficiaryType("SHG");
        setVoiceParsedAnswer("Self Help Group (SHG)");
      } else if (lower.includes("sanitation") || lower.includes("safai") || lower.includes("పారిశుధ్య") || lower.includes("सफाई")) {
        setBeneficiaryType("SANITATION_WORKER");
        setVoiceParsedAnswer("Safai Karamchari / Sanitation Worker");
      } else {
        setBeneficiaryType("INDIVIDUAL");
        setVoiceParsedAnswer("Individual Beneficiary");
      }
    }
  };

  const handleConfirmAndNext = () => {
    setSpeechTranscript("");
    setVoiceParsedAnswer(null);

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete({
        applicantName,
        contactNumber,
        gender,
        stateCode,
        activityPurpose,
        projectCost,
        annualIncome,
        beneficiaryType,
      });
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-lg space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gov-navy text-gov-gold rounded-xl flex items-center justify-center font-black">
            {mode === "VOICE" ? <Mic className="w-5 h-5 text-gov-saffron" /> : <Save className="w-5 h-5 text-gov-saffron" />}
          </div>
          <div>
            <h3 className="text-base font-black text-[#002147] flex items-center space-x-2">
              <span>{mode === "VOICE" ? `AI Multi-Lingual Voice Wizard` : `Text-Based Guided Wizard`}</span>
              <span className="bg-gov-saffron text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                {currentLang.toUpperCase()} Mode
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {mode === "VOICE" ? "Speak your answer naturally in your native language. The assistant auto-detects & fills it." : "Select your answers using keyboard or touch screen."}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {mode === "VOICE" && (
            <button
              type="button"
              onClick={speakCurrentQuestion}
              className="p-2 bg-gov-saffron/20 hover:bg-gov-saffron/40 text-slate-900 rounded-xl border border-gov-saffron font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
              title="Re-play Voice Prompt"
            >
              <Volume2 className="w-4 h-4 text-gov-navy" />
              <span className="hidden sm:inline">Listen Question 🔊</span>
            </button>
          )}

          <span className="bg-[#002147] text-white px-3 py-1.5 rounded-xl font-black text-xs">
            Step 0{currentStep} of 06
          </span>
        </div>
      </div>

      {/* STEP 0: BASIC IDENTIFICATION (NAME & PHONE) */}
      {currentStep === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <User className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">Applicant Identification Details</h3>
          </div>
          <p className="text-xs text-slate-600">Enter applicant name and contact phone number for real application lead generation.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t("apply.fullName")}</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
                placeholder="e.g. Ramesh Kumar SC"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t("apply.contactNumber")}</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
                placeholder="e.g. +91 98480 12345"
              />
            </div>
          </div>
        </div>
      )}

      {/* QUESTION 1: GENDER */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <UserCheck className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">{t("wizard.q1Title")}</h3>
          </div>
          <p className="text-xs text-slate-600">{t("wizard.q1Desc")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { id: "FEMALE", label: "Female (5.0% - 5.5% Concessional Rate)", sub: "Eligible for MSY 95% Share" },
              { id: "MALE", label: "Male (6.5% - 7.5% Standard Concession)", sub: "Standard Concessional Rate" },
              { id: "TRANSGENDER", label: "Transgender (Concessional Rate)", sub: "NSFDC Equity Quota" },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => { setGender(g.id as any); setVoiceParsedAnswer(g.label); }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  gender === g.id
                    ? "border-[#002147] bg-slate-50 ring-2 ring-[#002147]/20 font-bold shadow"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-sm font-black text-slate-900">{g.label}</div>
                <div className="text-xs text-slate-500 mt-1">{g.sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUESTION 2: STATE & DISTRICT */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <MapPin className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">{t("wizard.q2Title")}</h3>
          </div>
          <p className="text-xs text-slate-600">{t("wizard.q2Desc")}</p>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 block">Target Indian State / UT</label>
            <select
              value={stateCode}
              onChange={(e) => { setStateCode(e.target.value); setVoiceParsedAnswer(`State Code: ${e.target.value}`); }}
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none cursor-pointer"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* QUESTION 3: PROJECT ACTIVITY */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <Briefcase className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">{t("wizard.q3Title")}</h3>
          </div>
          <p className="text-xs text-slate-600">{t("wizard.q3Desc")}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { id: "RETAIL", label: "Small Retail / Vending" },
              { id: "DAIRY", label: "Dairy & Farming" },
              { id: "EDUCATION_INDIA", label: "Higher Education India" },
              { id: "EDUCATION_ABROAD", label: "Higher Education Abroad" },
              { id: "GREEN", label: "Green Energy / E-Rickshaw" },
              { id: "SANITATION", label: "Sanitation Vehicle" },
              { id: "ARTISAN", label: "Artisan Craft" },
              { id: "SMALL_BUSINESS", label: "Small Business Repair" },
            ].map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => { setActivityPurpose(act.id); setVoiceParsedAnswer(act.label); }}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  activityPurpose === act.id
                    ? "border-[#002147] bg-slate-50 font-bold text-[#002147] shadow"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="text-xs font-extrabold">{act.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUESTION 4: PROJECT COST */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <IndianRupee className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">{t("wizard.q4Title")}</h3>
          </div>
          <p className="text-xs text-slate-600">{t("wizard.q4Desc")}</p>

          <div className="pt-2 space-y-2">
            <input
              type="number"
              value={projectCost}
              onChange={(e) => { setProjectCost(Number(e.target.value)); setVoiceParsedAnswer(`Project Cost: ₹ ${e.target.value}`); }}
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            />
            <div className="text-xs text-slate-600 font-bold">
              Current Cost: <strong className="text-slate-900">₹ {projectCost.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION 5: ANNUAL FAMILY INCOME */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <ShieldCheck className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">{t("wizard.q5Title")}</h3>
          </div>
          <p className="text-xs text-slate-600">{t("wizard.q5Desc")}</p>

          <div className="pt-2 space-y-2">
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => { setAnnualIncome(Number(e.target.value)); setVoiceParsedAnswer(`Annual Income: ₹ ${e.target.value}`); }}
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            />
            {annualIncome > 500000 ? (
              <div className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                ⚠ Exceeds Statutory Income Gate (Must be ≤ ₹ 5,00,000)
              </div>
            ) : (
              <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✓ Valid Family Income (Statutory Hard Gate Passed)
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUESTION 6: BENEFICIARY CATEGORY */}
      {currentStep === 6 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-[#002147]">
            <CheckCircle2 className="w-6 h-6 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black">{t("wizard.q6Title")}</h3>
          </div>
          <p className="text-xs text-slate-600">{t("wizard.q6Desc")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: "INDIVIDUAL", label: "Individual Beneficiary" },
              { id: "SHG", label: "Self Help Group (SHG)" },
              { id: "SANITATION_WORKER", label: "Safai Karamchari / Sanitation Worker" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setBeneficiaryType(cat.id); setVoiceParsedAnswer(cat.label); }}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  beneficiaryType === cat.id
                    ? "border-[#002147] bg-slate-50 font-bold text-[#002147] shadow"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="text-xs font-black">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Assistant Microphone Box (VOICE Mode) */}
      {mode === "VOICE" && (
        <div className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#001529] text-white p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl border-2 border-gov-gold/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={startVoiceRecognition}
                className={`p-4 rounded-2xl font-black text-white shadow-xl transition-all cursor-pointer transform active:scale-95 ${
                  isListening ? "bg-red-600 animate-ping scale-105" : "bg-gov-saffron text-slate-950 hover:bg-amber-400"
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <div className="space-y-1">
                <div className="font-extrabold text-white text-sm flex items-center space-x-2">
                  <span>{isListening ? `🎙️ Listening Live in ${currentLang.toUpperCase()}...` : `Click Mic & Speak Your Answer (${currentLang.toUpperCase()})`}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {speechTranscript ? `Captured Audio Stream: "${speechTranscript}"` : `State your answer aloud in ${currentLang.toUpperCase()} locale.`}
                </div>
              </div>
            </div>
          </div>

          {/* Glowing Auto-Detected Spoken Answer Card */}
          {voiceParsedAnswer && (
            <div className="bg-emerald-950/80 border-2 border-emerald-400 p-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>✓ Auto-Detected Spoken Answer: <strong className="text-gov-gold text-sm">{voiceParsedAnswer}</strong></span>
              </div>

              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Field Updated
              </span>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg cursor-pointer"
          >
            ← Previous Question
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleConfirmAndNext}
          className="bg-[#002147] hover:bg-[#001529] text-white font-black px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-gov-saffron" />
          <span>{currentStep === 6 ? t("wizard.completeIntake") : "✓ Save Answer & Continue →"}</span>
        </button>
      </div>
    </div>
  );
};
