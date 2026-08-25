"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

interface SlideItem {
  id: number;
  image: string;
  objectFit: string;
}

const CAROUSEL_IMAGES: SlideItem[] = [
  { id: 1, image: "/hero/slide1.jpg", objectFit: "object-cover object-center" },
  { id: 2, image: "/hero/slide2.jpg", objectFit: "object-contain object-center" },
  { id: 3, image: "/hero/slide3.jpg", objectFit: "object-contain object-[center_top]" },
  { id: 4, image: "/hero/slide4.jpg", objectFit: "object-contain object-[center_top]" },
  { id: 5, image: "/hero/slide5.jpg", objectFit: "object-contain object-[center_top]" }
];

const SLIDE_TRANSLATIONS: Record<string, Array<{ title: string; subtitle: string; tag: string }>> = {
  en: [
    { title: "Constituent Assembly of India (1947)", subtitle: "Drafting the Constitution of India for Social Equality & Elimination of Caste Discrimination", tag: "HISTORICAL CONSTITUTIONAL ASSEMBLY" },
    { title: "Caste Census & Social Empowerment in India", subtitle: "Targeted Credit & Concessional Welfare Schemes for Scheduled Caste (SC) Beneficiaries", tag: "STATUTORY DEMOGRAPHIC IMPACT" },
    { title: "Dr. B. R. Ambedkar — Chief Architect of Indian Constitution", subtitle: "Champion of Equality, Social Justice, and Legal Safeguards for Marginalized Communities", tag: "FOUNDATIONAL VISIONARY" },
    { title: "Life Should Be Great Rather Than Long", subtitle: "Empowering SC Entrepreneurs & Youth through Direct Financial Credit & Skill Development", tag: "HISTORICAL STATUTORY QUOTE" },
    { title: "National Leadership & Social Inclusion Mandate", subtitle: "Ministry of Social Justice & Empowerment — National Scheduled Castes Finance & Development Corporation", tag: "GOVT. OF INDIA MANDATE" }
  ],
  te: [
    { title: "భారత రాజ్యాంగ పరిషత్ (1947)", subtitle: "సామాజిక సమానత్వం మరియు కుల వివక్ష నిర్మూలన కోసం భారత రాజ్యాంగ రచన", tag: "చారిత్రక రాజ్యాంగ పరిషత్" },
    { title: "భారతదేశంలో కుల గణన & సామాజిక సాధికారత", subtitle: "షెడ్యూల్డ్ కులాల (SC) లబ్ధిదారుల కోసం లక్ష్యిత రాయితీ సంక్షేమ పథకాలు", tag: "చట్టబద్ధమైన జనాభా ప్రభావం" },
    { title: "డాక్టర్ బి. ఆర్. అంబేడ్కర్ — భారత రాజ్యాంగ శిల్పి", subtitle: "సమానత్వం, సామాజిక న్యాయం మరియు బలహీన వర్గాల హక్కుల రక్షకుడు", tag: "స్థాపక దార్శనికుడు" },
    { title: "జీవితం సుదీర్ఘంగా ఉండటం కంటే గొప్పగా ఉండాలి", subtitle: "నేరుగా ఆర్థిక రుణాలు మరియు నైపుణ్యాభివృద్ధి ద్వారా ఎస్సీ యువత సాధికారత", tag: "చారిత్రక రాజ్యాంగ సూక్తి" },
    { title: "జాతీయ నాయకత్వం & సామాజిక సమ్మేళనం", subtitle: "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ — నేషనల్ ఎస్సీ ఫైనాన్స్ అండ్ డెవలప్‌మెంట్ కార్పొరేషన్", tag: "భారత ప్రభుత్వ ఆదేశం" }
  ],
  hi: [
    { title: "भारत की संविधान सभा (1947)", subtitle: "सामाजिक समानता और जातिगत भेदभाव के उन्मूलन के लिए संविधान निर्माण", tag: "ऐतिहासिक संविधान सभा" },
    { title: "भारत में जाति जनगणना और सामाजिक सशक्तिकरण", subtitle: "अनुसूचित जाति (SC) लाभार्थियों के लिए लक्षित रियायती कल्याणकारी योजनाएं", tag: "वैधानिक जनसांख्यिकी प्रभाव" },
    { title: "डॉ. बी. आर. अम्बेडकर — भारतीय संविधान के मुख्य शिल्पकार", subtitle: "समानता, सामाजिक न्याय और वंचित वर्गों के कानूनी संरक्षण के अग्रदूत", tag: "संस्थापक दृष्टा" },
    { title: "जीवन लंबा होने के बजाय महान होना चाहिए", subtitle: "प्रत्यक्ष वित्तीय ऋण और कौशल विकास के माध्यम से एससी युवाओं का सशक्तिकरण", tag: "ऐतिहासिक वैधानिक उद्धरण" },
    { title: "राष्ट्रीय नेतृत्व और सामाजिक समावेशन जनादेश", subtitle: "सामाजिक न्याय और अधिकारिता मंत्रालय — राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम", tag: "भारत सरकार का जनादेश" }
  ],
  ta: [
    { title: "இந்திய அரசியல் நிர்ணய சபை (1947)", subtitle: "சமூக சமத்துவம் மற்றும் சாதி ஒழிப்புக்கான இந்திய அரசியலமைப்பு வரைவு", tag: "வரலாற்று அரசியலமைப்பு சபை" },
    { title: "சாதி மக்கள் தொகை கணக்கெடுப்பு & சமூக மேம்பாடு", subtitle: "பட்டியல் சாதி (SC) பயனாளிகளுக்கான இலக்கு சலுகை நலத்திட்டங்கள்", tag: "சட்டப்பூர்வ மக்கள்தொகை தாக்கம்" },
    { title: "டாக்டர் பி. ஆர். அம்பேத்கர் — இந்திய அரசியலமைப்பின் தலைமை சிற்பி", subtitle: "சமத்துவம் மற்றும் சமூக நீதியின் காவலர்", tag: "அடித்தள தொலைநோக்காளர்" },
    { title: "வாழ்க்கை நீண்டதாக இருப்பதை விட சிறந்ததாக இருக்க வேண்டும்", subtitle: "நேரடி கடன் உதவி மற்றும் திறன் மேம்பாடு மூலம் எஸ்சி இளைஞர்கள் மேம்பாடு", tag: "வரலாற்று சட்டப்பூர்வ பொன்மொழி" },
    { title: "தேசிய தலைமை & சமூக சேர்க்கை ஆணை", subtitle: "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் — எஸ்சி மேம்பாட்டு கழகம்", tag: "இந்திய அரசு ஆணை" }
  ],
  kn: [
    { title: "ಭಾರತದ ಸಂವಿಧಾನ ಸಭೆ (1947)", subtitle: "ಸಾಮಾಜಿಕ ಸಮಾನತೆ ಮತ್ತು ಜಾತಿ ನಿರ್ಮೂಲನೆಗಾಗಿ ಭಾರತೀಯ ಸಂವಿಧಾನ ರಚನೆ", tag: "ಐತಿಹಾಸಿಕ ಸಾಂವಿಧಾನಿಕ ಸಭೆ" },
    { title: "ಭಾರತದಲ್ಲಿ ಜಾತಿ ಗಣತಿ ಮತ್ತು ಸಾಮಾಜಿಕ ಸಬಲೀಕರಣ", subtitle: "ಪರಿಶಿಷ್ಟ ಜಾತಿ (SC) ಫಲಾನುಭವಿಗಳಿಗೆ ರಿಯಾಯಿತಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು", tag: "ಶಾಸನಬದ್ಧ ಜನಸಂಖ್ಯಾ ಪ್ರಭಾವ" },
    { title: "ಡಾ. ಬಿ. ಆರ್. ಅಂಬೇಡ್ಕರ್ — ಭಾರತೀಯ ಸಂವಿಧಾನದ ಮುಖ್ಯ ಶಿಲ್ಪಿ", subtitle: "ಸಮಾನತೆ, ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಕಾನೂನು ರಕ್ಷಣೆಯ ನಾಯಕ", tag: "ಸಂಸ್ಥಾಪಕ ದಾರ್ಶನಿಕ" },
    { title: "ಜೀವನವು ಸುದೀರ್ಘವಾಗಿರುವುದಕ್ಕಿಂತ ಶ್ರೇಷ್ಠವಾಗಿರಬೇಕು", subtitle: "ನೇರ ಆರ್ಥಿಕ ಸಾಲ ಮತ್ತು ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿಯ ಮೂಲಕ ಎಸ್‌ಸಿ ಯುವಕರ ಸಬಲೀಕರಣ", tag: "ಐತಿಹಾಸಿಕ ಶಾಸನಬದ್ಧ ಉಲ್ಲೇಖ" },
    { title: "ರಾಷ್ಟ್ರೀಯ ನಾಯಕತ್ವ ಮತ್ತು ಸಾಮಾಜಿಕ ಸೇರ್ಪಡೆ ಆದೇಶ", subtitle: "ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ — NSFDC ಕಾರ್ಪೊರೇಷನ್", tag: "ಭಾರತ ಸರ್ಕಾರದ ಆದೇಶ" }
  ],
  mr: [
    { title: "भारताची संविधान सभा (1947)", subtitle: "सामाजिक समता आणि अस्पृश्यता निर्मूलनासाठी भारतीय राज्यघटनेची निर्मिती", tag: "ऐतिहासिक संविधान सभा" },
    { title: "भारतातील जात जनगणना आणि सामाजिक सक्षमीकरण", subtitle: "अनुसूचित जाती (SC) लाभार्थ्यांसाठी सवलतीच्या कल्याणकारी योजना", tag: "वैधानिक लोकसंख्या प्रभाव" },
    { title: "डॉ. बी. आर. आंबेडकर — भारतीय राज्यघटनेचे मुख्य शिल्पकार", subtitle: "समता, सामाजिक न्याय आणि वंचित घटकांचे कायदेशीर रक्षक", tag: "संस्थापक विचारवंत" },
    { title: "आयुष्य मोठे असण्यापेक्षा महान असले पाहिजे", subtitle: "थेट आर्थिक कर्ज आणि कौशल्य विकासाद्वारे एससी तरुणांचे सक्षमीकरण", tag: "ऐतिहासिक वैधानिक विचार" },
    { title: "राष्ट्रीय नेतृत्व आणि सामाजिक समावेश जनादेश", subtitle: "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय — NSFDC महामंडळ", tag: "भारत सरकारचा जनादेश" }
  ],
  bn: [
    { title: "ভারতের গণপরিষদ (১৯৪৭)", subtitle: "সামাজিক সমতা ও বৈষম্য দূরীকরণে ভারতীয় সংবিধান রচনা", tag: "ঐতিহাসিক সাংবিধানিক পরিষদ" },
    { title: "ভারতে বর্ণ শুমারি ও সামাজিক ক্ষমতায়ন", subtitle: "তফসিলি জাতি (SC) উপকারভোগীদের জন্য বিশেষ ঋণ ও কল্যাণমূলক প্রকল্প", tag: "সংবিধিবদ্ধ জনসংখ্যা প্রভাব" },
    { title: "ডঃ বি. আর. আম্বেদকর — ভারতীয় সংবিধানের প্রধান স্থপতি", subtitle: "সমতা, সামাজিক ন্যায়বিচার ও অনগ্রসর শ্রেণীর অধিকারের রক্ষক", tag: "প্রতিষ্ঠাতা দিশারী" },
    { title: "জীবন দীর্ঘ হওয়ার চেয়ে মহান হওয়া উচিত", subtitle: "সরাসরি আর্থিক ঋণ ও দক্ষতা উন্নয়নের মাধ্যমে এসসি যুবকদের ক্ষমতায়ন", tag: "ঐতিহাসিক সংবিধিবদ্ধ বাণী" },
    { title: "জাতীয় নেতৃত্ব ও সামাজিক অন্তর্ভুক্তির অঙ্গীকার", subtitle: "সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক — NSFDC কর্পোরেশন", tag: "ভারত সরকারের অঙ্গীকার" }
  ],
  gu: [
    { title: "ભારતની બંધારણ સભા (1947)", subtitle: "સામાજિક સમાનતા અને જાતિગત ભેદભાવ નાબૂદી માટે બંધારણનું ઘડતર", tag: "ઐતિહાસિક બંધારણ સભા" },
    { title: "ભારતમાં જાતિ વસ્તી ગણતરી અને સામાજિક સશક્તિકરણ", subtitle: "અનુસૂચિત જાતિ (SC) લાભાર્થીઓ માટે રાહત દરે કલ્યાણકારી યોજનાઓ", tag: "વૈધાનિક જનસંખ્યા પ્રભાવ" },
    { title: "ડૉ. બી. આર. આંબેડકર — ભારતીય બંધારણના મુખ્ય શિલ્પી", subtitle: "સમાનતા, સામાજિક ન્યાય અને કાનૂની રક્ષણના પ્રણેતા", tag: "સ્થાપક વિચારક" },
    { title: "જીવન લાંબુ હોવાને બદલે મહાન હોવું જોઈએ", subtitle: "પ્રત્યક્ષ નાણાકીય લોન અને કૌશલ્ય વિકાસ દ્વારા એસસી યુવાનોનું સશક્તિકરણ", tag: "ઐતિહાસિક વૈધાનિક વિચાર" },
    { title: "રાષ્ટ્રીય નેતૃત્વ અને સામાજિક સમાવેશન આદેશ", subtitle: "સામાજિક ન્યાય અને અધિકારિતા મંત્રાલય — NSFDC નિગમ", tag: "ભારત સરકારનો આદેશ" }
  ]
};

export const HeroCarousel: React.FC = () => {
  const { currentLang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideTexts = SLIDE_TRANSLATIONS[currentLang] || SLIDE_TRANSLATIONS.en;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
      }, 3000); // 3 seconds auto-slide
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1));
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 group shadow-2xl border-b-4 border-gov-saffron"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Full-Width Edge-to-Edge Container */}
      <div className="relative h-[360px] sm:h-[520px] md:h-[620px] lg:h-[700px] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {CAROUSEL_IMAGES.map((imgItem, index) => {
          const isActive = index === currentIndex;
          const textItem = slideTexts[index] || slideTexts[0];
          return (
            <div
              key={imgItem.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={imgItem.image}
                alt={textItem.title}
                className={`w-full h-full ${imgItem.objectFit} transition-all duration-700`}
              />
              {/* Gradient Overlay for Text Clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-12 md:p-16">
                <div className="max-w-6xl mx-auto w-full space-y-3 animate-fadeIn">
                  <span className="inline-flex items-center space-x-1.5 bg-gov-saffron text-slate-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-md">
                    <span>{textItem.tag}</span>
                  </span>
                  <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg leading-tight">
                    {textItem.title}
                  </h3>
                  <p className="text-xs sm:text-base md:text-lg text-slate-200 font-semibold drop-shadow-md max-w-4xl leading-relaxed">
                    {textItem.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Back & Next Controls */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-slate-900/85 hover:bg-gov-saffron hover:text-slate-950 text-white p-3.5 sm:p-4 rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all transform active:scale-90 flex items-center space-x-1.5 font-bold text-xs cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-black">Back</span>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-slate-900/85 hover:bg-gov-saffron hover:text-slate-950 text-white p-3.5 sm:p-4 rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all transform active:scale-90 flex items-center space-x-1.5 font-bold text-xs cursor-pointer"
      >
        <span className="hidden sm:inline text-xs font-black">Next</span>
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Auto-Slide Play/Pause & Slide Indicators */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause Auto-Slide" : "Resume 3s Auto-Slide"}
          className="text-gov-saffron hover:text-white transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center space-x-2">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? "w-8 bg-gov-saffron" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
