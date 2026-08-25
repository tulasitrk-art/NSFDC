"use client";

import React from "react";
import { Landmark, Scale } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

const CONSTITUTION_TEXTS: Record<LanguageCode, { header: string; text: string; sub: string }> = {
  en: {
    header: "Statutory & Constitutional Heritage of Social Justice",
    text: "The Constituent Assembly of India, which drafted the Indian Constitution, was primarily composed of members from various social backgrounds, including different castes. B.R. Ambedkar was a key figure in this assembly, advocating for the elimination of caste-based discrimination. The assembly included representatives from diverse communities, reflecting the need to address caste issues in the Constitution, which was crucial for promoting social justice and equality.",
    sub: "— Historical Preamble & Constitutional Foundation of NSFDC Social Welfare Directives"
  },
  te: {
    header: "సామాజిక న్యాయం యొక్క చట్టబద్ధమైన మరియు రాజ్యాంగ వారసత్వం",
    text: "భారత రాజ్యాంగాన్ని రూపొందించిన భారత రాజ్యాంగ పరిషత్, వివిధ కులాలతో సహా వివిధ సామాజిక నేపథ్యాలకు చెందిన సభ్యులతో కూడి ఉంది. డాక్టర్ బి.ఆర్. అంబేడ్కర్ ఈ అసెంబ్లీలో కీలక వ్యక్తిగా ఉండి, కుల ఆధారిత వివక్ష నిర్మూలనకు గట్టిగా వాదించారు. సామాజిక న్యాయం మరియు సమానత్వాన్ని పెంపొందించడానికి రాజ్యాంగంలో కుల సమస్యలను పరిష్కరించడం అత్యంత అవసరం.",
    sub: "— NSFDC సామాజిక సంక్షేమ నిబంధనల చారిత్రక రాజ్యాంగ పునాది"
  },
  hi: {
    header: "सामाजिक न्याय की वैधानिक एवं संवैधानिक विरासत",
    text: "भारतीय संविधान का निर्माण करने वाली संविधान सभा में विभिन्न जातियों सहित विभिन्न सामाजिक पृष्ठभूमियों के सदस्य शामिल थे। डॉ. बी.आर. अम्बेडकर इस सभा में एक प्रमुख व्यक्ति थे, जिन्होंने जाति-आधारित भेदभाव के उन्मूलन की वकालत की। सामाजिक न्याय और समानता को बढ़ावा देने के लिए संविधान में जातिगत मुद्दों को संबोधित करना महत्वपूर्ण था।",
    sub: "— NSFDC सामाजिक कल्याण निर्देशों की ऐतिहासिक संवैधानिक नींव"
  },
  ta: {
    header: "சமூக நீதியின் சட்டப்பூர்வ மற்றும் அரசியலமைப்பு பாரம்பரியம்",
    text: "இந்திய அரசியலமைப்பை உருவாக்கிய இந்திய அரசியல் நிர்ணய சபை, பல்வேறு சமூக பின்னணிகள் மற்றும் சாதியைச் சேர்ந்த உறுப்பினர்களைக் கொண்டிருந்தது. டாக்டர் பி.ஆர். அம்பேத்கர் இந்த சபையில் ஒரு முக்கிய நபராக இருந்து, சாதி அடிப்படையிலான பாகுபாட்டை ஒழிக்க வாதிட்டார். சமூக நீதி மற்றும் சமத்துவத்தை மேம்படுத்த அரசியலமைப்பில் சாதிப் பிரச்சினைகளுக்குத் தீர்வு காண்பது மிகவும் அவசியமாக இருந்தது.",
    sub: "— NSFDC சமூக நல வழிகாட்டுதல்களின் வரலாற்று அரசியலமைப்பு அடித்தளம்"
  },
  kn: {
    header: "ಸಾಮಾಜಿಕ ನ್ಯಾಯದ ಶಾಸನಬದ್ಧ ಮತ್ತು ಸಾಂವಿಧಾನಿಕ ಪರಂಪರೆ",
    text: "ಭಾರತೀಯ ಸಂವಿಧಾನವನ್ನು ರಚಿಸಿದ ಭಾರತದ ಸಂವಿಧಾನ ಸಭೆಯು ವಿವಿಧ ಸಾಮಾಜಿಕ ಹಿನ್ನೆಲೆಯ ಮತ್ತು ಜಾತಿಗಳ ಸದಸ್ಯರನ್ನು ಒಳಗೊಂಡಿತ್ತು. ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಜಾತಿ ಆಧಾರಿತ ತಾರತಮ್ಯ ನಿರ್ಮೂಲನೆಗಾಗಿ ಪ್ರತಿಪಾದಿಸಿದ ಪ್ರಮುಖ ವ್ಯಕ್ತಿಯಾಗಿದ್ದರು. ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಮಾನತೆಯನ್ನು ಉತ್ತೇಜಿಸಲು ಸಂವಿಧಾನದಲ್ಲಿ ಜಾತಿ ಸಮಸ್ಯೆಗಳನ್ನು ಬಗೆಹರಿಸುವುದು ಅತ್ಯಂತ ಅಗತ್ಯವಾಗಿತ್ತು.",
    sub: "— NSFDC ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ ಮಾರ್ಗಸೂಚಿಗಳ ಐತಿಹಾಸಿಕ ಸಾಂವಿಧಾನಿಕ ತಳಹದಿ"
  },
  mr: {
    header: "सामाजिक न्यायाचा वैधानिक आणि घटनात्मक वारसा",
    text: "भारतीय राज्यघटनेचा मसुदा तयार करणारी भारताची संविधान सभा विविध सामाजिक पार्श्वभूमीतील सदस्यांची बनलेली होती. डॉ. बी.आर. आंबेडकर हे या सभेतील प्रमुख व्यक्तिमत्त्व होते, ज्यांनी जात-आधारित भेदभाव नष्ट करण्याचा पुरस्कार केला. सामाजिक न्याय आणि समतेला चालना देण्यासाठी घटनेत जातीच्या मुद्द्यांवर तोडगा काढणे अत्यंत महत्त्वाचे होते.",
    sub: "— NSFDC समाजकल्याण निर्देशांचा ऐतिहासिक घटनात्मक पाया"
  },
  bn: {
    header: "সামাজিক ন্যায়বিচারের সংবিধিবদ্ধ ও সাংবিধানিক ঐতিহ্য",
    text: "ভারতীয় সংবিধান প্রণয়নকারী ভারতীয় গণপরিষদ বিভিন্ন সামাজিক পটভূমি এবং বর্ণ থেকে আগত সদস্যদের নিয়ে গঠিত হয়েছিল। ডঃ বি.আর. আম্বেদকর ছিলেন এই পরিষদের এক অন্যতম প্রধান ব্যক্তিত্ব, যিনি বর্ণভিত্তিক বৈষম্য দূরীকরণের পক্ষে সওয়াল করেছিলেন। সামাজিক ন্যায়বিচার ও সমতা নিশ্চিত করতে সংবিধানে বর্ণ সংক্রান্ত সমস্যার সমাধান করা অত্যন্ত গুরুত্বপূর্ণ ছিল।",
    sub: "— NSFDC সমাজকল্যাণ নির্দেশিকাগুলির ঐতিহাসিক সাংবিধানিক ভিত্তি"
  },
  gu: {
    header: "સામાજિક ન્યાયનો વૈધાનિક અને બંધારણીય વારસો",
    text: "ભારતના બંધારણનું ઘડતર કરનાર ભારતની બંધારણ સભામાં વિવિધ સામાજિક પૃષ્ઠભૂમિના સભ્યો સામેલ હતા. ડૉ. બી.આર. આંબેડકર આ સભામાં એક અગ્રણી વ્યક્તિત્વ હતા, જેમણે જાતિ-આધારિત ભેદભાવ નાબૂદ કરવાની હિમાયત કરી હતી. સામાજિક ન્યાય અને સમાનતાને પ્રોત્સાહન આપવા માટે બંધારણમાં જાતિના મુદ્દાઓ ઉકેલવા અત્યંત મહત્વપૂર્ણ હતા.",
    sub: "— NSFDC સમાજ કલ્યાણ માર્ગદર્શિકાઓનો ઐતિહાસિક બંધારણીય પાયો"
  }
};

export const ConstitutionBanner: React.FC = () => {
  const { currentLang } = useLanguage();
  const content = CONSTITUTION_TEXTS[currentLang] || CONSTITUTION_TEXTS.en;

  return (
    <div className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#001529] text-white p-6 sm:p-8 rounded-2xl border-2 border-gov-gold/40 shadow-lg relative overflow-hidden space-y-4">
      {/* Decorative Gold Crest Border Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gold/30 pb-3">
        <div className="flex items-center space-x-2">
          <Landmark className="w-5 h-5 text-gov-saffron" />
          <h3 className="text-sm sm:text-base font-black text-gov-gold uppercase tracking-wider">
            {content.header}
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-300">
          <Scale className="w-4 h-4 text-gov-saffron" />
          <span>Constitution of India — Article 46 & Schedule Caste Orders</span>
        </div>
      </div>

      {/* Decorative Quote Text Box requested by user */}
      <div className="relative pl-4 border-l-4 border-gov-saffron space-y-2">
        <p className="text-xs sm:text-sm text-slate-100 font-serif leading-relaxed italic">
          "{content.text}"
        </p>
        <div className="text-[11px] font-bold text-gov-gold uppercase tracking-wide">
          {content.sub}
        </div>
      </div>
    </div>
  );
};
