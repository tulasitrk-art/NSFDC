import json
import os

DIRECTORIES = [
    r"c:\Users\TRK\OneDrive\Documents\NSFDC(SIH2026)\nsfdc-concessional-portal\frontend\src\lib\i18n",
    r"c:\Users\TRK\OneDrive\Documents\NSFDC(SIH2026)\nsfdc-concessional-portal\frontend\src\locales"
]

translations = {
    "en": {
        "viewDocs": "View Required Documents (Flip Card 🔄)",
        "flipBack": "↺ Flip Back",
        "mandatoryDocs": "Mandatory Documents Checklist",
        "certificatesRequired": "Required Statutory Certificates",
        "importantNotes": "Important Scheme Guidelines & Moratorium",
        "applyForThisScheme": "Apply for this Scheme →",
        "note_dbt": "Direct DBT Bank Disbursement",
        "note_zero_fee": "Zero Processing Fee",
        "note_moratorium": "Includes repayment moratorium before EMI starts.",
        "docs": {
            "doc_caste": "SC Caste Certificate (Revenue Dept / Tahsildar)",
            "doc_aadhaar": "Aadhaar Card (Linked with Active Mobile)",
            "doc_income": "Income Certificate / Self-Declaration (Family Income ≤ ₹5.00 Lakh)",
            "doc_bank": "Bank Account Passbook / Cancelled Cheque (DBT-Enabled)",
            "doc_residence": "Proof of Residence (Ration Card / Electricity Bill / Voter ID)",
            "doc_edu": "Admission Offer Letter & Fee Schedule from Recognized College",
            "doc_marksheets": "10th, 12th & Degree Marksheets / Transcripts",
            "doc_visa": "Valid Student Visa & Passport (For Overseas Studies)",
            "doc_shg": "SHG Group Resolution / Female Entrepreneur Declaration",
            "doc_quotation": "Trade Quotation / Machinery Equipment Estimate",
            "doc_sanitation": "Sanitation Worker ID / Municipality ULB Certificate",
            "doc_green": "Solar / E-Vehicle Quotation & Commercial Driving License",
            "doc_dpr": "Detailed Project Report (DPR) & Machinery Vendor Quotations",
            "doc_premises": "Commercial Premises Lease / Ownership Agreement",
            "doc_artisan": "Artisan Pehchan Card / Handicraft Board Registration",
            "doc_agri": "Land Record (7/12 / Patta) or Vet Certificate"
        }
    },
    "hi": {
        "viewDocs": "आवश्यक दस्तावेज देखें (कार्ड पलटें 🔄)",
        "flipBack": "↺ वापस पलटें",
        "mandatoryDocs": "अनिवार्य दस्तावेजों की चेकलिस्ट",
        "certificatesRequired": "आवश्यक वैधानिक प्रमाण पत्र",
        "importantNotes": "महत्वपूर्ण योजना दिशानिर्देश और मोराटोरियम",
        "applyForThisScheme": "इस योजना के लिए आवेदन करें →",
        "note_dbt": "डीबीटी द्वारा बैंक खाते में सीधा वितरण",
        "note_zero_fee": "शून्य प्रोसेसिंग शुल्क",
        "note_moratorium": "ईएमआई शुरू होने से पहले पुनर्भुगतान मोराटोरियम शामिल है।",
        "docs": {
            "doc_caste": "अनुसूचित जाति (SC) प्रमाण पत्र (तहसीलदार / राजस्व विभाग)",
            "doc_aadhaar": "आधार कार्ड (सक्रिय मोबाइल नंबर से लिंक)",
            "doc_income": "आय प्रमाण पत्र (पारिवारिक आय ≤ ₹ 5,00,000 / वर्ष)",
            "doc_bank": "बैंक पासबुक / रद्द चेक (डीबीटी सक्षम)",
            "doc_residence": "निवास प्रमाण (राशन कार्ड / बिजली बिल / मतदाता पहचान पत्र)",
            "doc_edu": "मान्यता प्राप्त संस्थान से प्रवेश पत्र एवं शुल्क विवरण",
            "doc_marksheets": "10वीं, 12वीं एवं डिग्री अंकतालिकाएं / प्रमाण पत्र",
            "doc_visa": "वैध छात्र वीजा एवं पासपोर्ट (विदेश अध्ययन हेतु)",
            "doc_shg": "एसएचजी समूह संकल्प / महिला उद्यमी घोषणा पत्र",
            "doc_quotation": "व्यापार कोटेशन / मशीनरी और उपकरण अनुमान",
            "doc_sanitation": "सफाई कर्मचारी पहचान पत्र / नगर पालिका प्रमाण पत्र",
            "doc_green": "सोलर / ई-वाहन कोटेशन एवं वाणिज्यिक ड्राइविंग लाइसेंस",
            "doc_dpr": "विस्तृत परियोजना रिपोर्ट (DPR) एवं मशीनरी कोटेशन",
            "doc_premises": "व्यावसायिक परिसर किराया / स्वामित्व अनुबंध",
            "doc_artisan": "कारीगर पहचान पत्र / हस्तशिल्प बोर्ड पंजीकरण",
            "doc_agri": "कृषि भूमि रिकॉर्ड (खसरा/खतौनी) या पशुपालन चिकित्सा प्रमाण पत्र"
        }
    },
    "te": {
        "viewDocs": "కావలసిన పత్రాలు చూడండి (కార్డు తిప్పండి 🔄)",
        "flipBack": "↺ వెనక్కి తిప్పండి",
        "mandatoryDocs": "తప్పనిసరి పత్రాల చెక్‌లిస్ట్",
        "certificatesRequired": "అవసరమైన చట్టబద్ధమైన సర్టిఫికెట్లు",
        "importantNotes": "ముఖ్యమైన పథక మార్గదర్శకాలు మరియు మొరటోరియం",
        "applyForThisScheme": "ఈ పథకం కింద దరఖాస్తు చేయండి →",
        "note_dbt": "నేరుగా బ్యాంక్ ఖాతాకు DBT జమ",
        "note_zero_fee": "జీరో ప్రాసెసింగ్ ఫీజు",
        "note_moratorium": "EMI ప్రారంభమయ్యే ముందు మొరటోరియం సౌకర్యం కలదు.",
        "docs": {
            "doc_caste": "షెడ్యూల్డ్ కుల (SC) ధృవీకరణ పత్రం (తహశీల్దార్ / మీసేవ)",
            "doc_aadhaar": "ఆధార్ కార్డు (మొబైల్ నంబర్‌తో లింక్ చేయబడింది)",
            "doc_income": "ఆదాయ ధృవీకరణ పత్రం (కుటుంబ ఆదాయం ≤ ₹ 5,00,000 / సం.)",
            "doc_bank": "బ్యాంక్ పాస్‌బుక్ / చెక్కు (DBT అనుసంధానించబడింది)",
            "doc_residence": "నివాస ధృవీకరణ (రేషన్ కార్డు / కరెంట్ బిల్లు / ఓటర్ ఐడీ)",
            "doc_edu": "గుర్తింపు పొందిన కళాశాల అడ్మిషన్ లెటర్ మరియు ఫీజు వివరాలు",
            "doc_marksheets": "10వ, 12వ తరగతి మరియు డిగ్రీ మార్కుల పత్రాలు",
            "doc_visa": "విద్యార్థి వీసా మరియు పాస్‌పోర్ట్ (విదేశీ విద్య కొరకు)",
            "doc_shg": "SHG మహిళా సంఘం తీర్మానం / స్వయం ఉపాధి ప్రకటన",
            "doc_quotation": "వ్యాపార కొటేషన్ / యంత్ర పరికరాల అంచనా",
            "doc_sanitation": "పారిశుద్ధ్య కార్మికుల గుర్తింపు కార్డు / మున్సిపల్ ధృవీకరణ",
            "doc_green": "సోలార్ / ఈ-వాహనం కొటేషన్ మరియు డ్రైవింగ్ లైసెన్స్",
            "doc_dpr": "ప్రాజెక్ట్ నివేదిక (DPR) మరియు మెషినరీ కొటేషన్లు",
            "doc_premises": "వ్యాపార స్థల లీజు / యాజమాన్య పత్రాలు",
            "doc_artisan": "చేతివృత్తుల గుర్తింపు కార్డు (పెహచాన్ కార్డ్)",
            "doc_agri": "వ్యవసాయ భూమి రికార్డు (పట్టాదారు పాస్‌బుక్ / అడంగల్)"
        }
    },
    "ta": {
        "viewDocs": "தேவையான ஆவணங்களைக் காண்க (அட்டையைத் திருப்புங்கள் 🔄)",
        "flipBack": "↺ பின்னால் திருப்பவும்",
        "mandatoryDocs": "கட்டாய ஆவணங்களின் பட்டியல்",
        "certificatesRequired": "தேவையான சான்றிதழ்கள்",
        "importantNotes": "திட்டத்தின் முக்கிய குறிப்புகள் மற்றும் சலுகைக் காலம்",
        "applyForThisScheme": "இத்திட்டத்திற்கு விண்ணப்பிக்கவும் →",
        "note_dbt": "வங்கி கணக்கில் நேரடி DBT வரவு",
        "note_zero_fee": "பூஜ்ஜிய செயலாக்க கட்டணம்",
        "note_moratorium": "EMI தொடங்குவதற்கு முன் தவணைக்கால சலுகை உண்டு.",
        "docs": {
            "doc_caste": "பட்டியலின (SC) சாதி சான்றிதழ் (வட்டாட்சியர் / வருவாய்த்துறை)",
            "doc_aadhaar": "ஆதார் அட்டை (மொபைல் எண்ணுடன் இணைக்கப்பட்டது)",
            "doc_income": "வருமானச் சான்றிதழ் (குடும்ப வருமானம் ≤ ₹ 5,00,000 / ஆண்டு)",
            "doc_bank": "வங்கி கணக்கு புத்தக நகல் (DBT இணைக்கப்பட்டது)",
            "doc_residence": "இருப்பிடச் சான்று (குடும்ப அட்டை / மின்சாரக் கட்டணம்)",
            "doc_edu": "கல்லூரி சேர்க்கை கடிதம் மற்றும் கட்டண விவரங்கள்",
            "doc_marksheets": "10, 12 ஆம் வகுப்பு மற்றும் பட்டப்படிப்பு மதிப்பெண் சான்றிதழ்கள்",
            "doc_visa": "மாணவர் விசா மற்றும் பாஸ்போர்ட் (வெளிநாட்டு படிப்புக்கு)",
            "doc_shg": "சுயஉதவிக் குழு தீர்மானம் / பெண் தொழில்முனைவோர் உறுதிமொழி",
            "doc_quotation": "தொழில் மதிப்பீடு மற்றும் இயந்திரக் கொள்முதல் விலைப்பட்டியல்",
            "doc_sanitation": "தூய்மைப் பணியாளர் அடையாள அட்டை / நகராட்சி சான்று",
            "doc_green": "சூரிய மின்சக்தி / மின்சார வாகன விலைப்பட்டியல் & ஓட்டுநர் உரிமம்",
            "doc_dpr": "திட்ட அறிக்கை (DPR) மற்றும் இயந்திர விலைப்பட்டியல்",
            "doc_premises": "வணிக வளாக வாடகை ஒப்பந்தம்",
            "doc_artisan": "கைவினைஞர் அடையாள அட்டை (பெஹ்சான் அட்டை)",
            "doc_agri": "நில ஆவணம் (பட்டா / சிட்டா) அல்லது கால்நடை மருத்துவ சான்று"
        }
    },
    "kn": {
        "viewDocs": "ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ (ಕಾರ್ಡ್ ಫ್ಲಿಪ್ ಮಾಡಿ 🔄)",
        "flipBack": "↺ ಹಿಂದಕ್ಕೆ ತಿರುಗಿಸಿ",
        "mandatoryDocs": "ಕಡ್ಡಾಯ ದಾಖಲೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
        "certificatesRequired": "ಅಗತ್ಯವಿರುವ ಶಾಸನಬದ್ಧ ಪ್ರಮಾಣಪತ್ರಗಳು",
        "importantNotes": "ಪ್ರಮುಖ ಯೋಜನಾ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಮೊರಟೋರಿಯಂ",
        "applyForThisScheme": "ಈ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ →",
        "note_dbt": "ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ DBT ಜಮೆ",
        "note_zero_fee": "ಶೂನ್ಯ ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ",
        "note_moratorium": "ಇಎಂಐ ಪ್ರಾರಂಭವಾಗುವ ಮುನ್ನ ಮರುಪಾವತಿ ಮೊರಟೋರಿಯಂ ಲಭ್ಯವಿದೆ.",
        "docs": {
            "doc_caste": "ಪರಿಶಿಷ್ಟ ಜಾತಿ (SC) ಪ್ರಮಾಣಪತ್ರ (ತಹಶೀಲ್ದಾರ್ / ಕಂದಾಯ ಇಲಾಖೆ)",
            "doc_aadhaar": "ಆಧಾರ್ ಕಾರ್ಡ್ (ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಲಿಂಕ್ ಆಗಿದೆ)",
            "doc_income": "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (ಕುಟುಂಬ ಆದಾಯ ≤ ₹ 5,00,000 / ವರ್ಷ)",
            "doc_bank": "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ / ರದ್ದಾದ ಚೆಕ್ (DBT ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ)",
            "doc_residence": "ವಾಸಸ್ಥಳ ದೃಢೀಕರಣ (ರೇಷನ್ ಕಾರ್ಡ್ / ವಿದ್ಯುತ್ ಬಿಲ್ / ವೋಟರ್ ಐಡಿ)",
            "doc_edu": "ಅಂಗೀಕೃತ ಕಾಲೇಜು ಪ್ರವೇಶ ಪತ್ರ ಮತ್ತು ಶುಲ್ಕದ ವಿವರ",
            "doc_marksheets": "10ನೇ, 12ನೇ ಮತ್ತು ಪದವಿ ಅಂಕಪಟ್ಟಿಗಳು",
            "doc_visa": "ವಿದ್ಯಾರ್ಥಿ ವೀಸಾ ಮತ್ತು ಪಾಸ್‌ಪೋರ್ಟ್ (ವಿದೇಶಿ ವ್ಯಾಸಂಗಕ್ಕೆ)",
            "doc_shg": "ಸ್ವಸಹಾಯ ಗುಂಪಿನ ನಿರ್ಣಯ / ಮಹಿಳಾ ಉದ್ಯಮಿ ಘೋಷಣೆ",
            "doc_quotation": "ವ್ಯಾಪಾರ ಕೊಟೇಶನ್ / ಯಂತ್ರೋಪಕರಣಗಳ ಅಂದಾಜು ಪಟ್ಟಿ",
            "doc_sanitation": "ಪೌರಕಾರ್ಮಿಕರ ಗುರುತಿನ ಚೀಟಿ / ಪುರಸಭೆಯ ಪ್ರಮಾಣಪತ್ರ",
            "doc_green": "ಸೌರ / ಇ-ವಾಹನ ಕೊಟೇಶನ್ ಮತ್ತು ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್",
            "doc_dpr": "ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR) ಮತ್ತು ಯಂತ್ರೋಪಕರಣ ಕೊಟೇಶನ್",
            "doc_premises": "ವಾಣಿಜ್ಯ ಸ್ಥಳದ ಬಾಡಿಗೆ ಒಪ್ಪಂದ",
            "doc_artisan": "ಕುಶಲಕರ್ಮಿ ಗುರುತಿನ ಚೀಟಿ (ಪೆಹಚಾನ್ ಕಾರ್ಡ್)",
            "doc_agri": "ಕೃಷಿ ಭೂಮಿ ದಾಖಲೆ (ಪಹಣಿ / ಆರ್‌ಟಿಸಿ) ಅಥವಾ ಪಶುವೈದ್ಯಕೀಯ ಪ್ರಮಾಣಪತ್ರ"
        }
    },
    "bn": {
        "viewDocs": "প্রয়োজনীয় নথি দেখুন (কার্ড ফ্লিপ করুন 🔄)",
        "flipBack": "↺ পিছনে উল্টান",
        "mandatoryDocs": "বাধ্যতামূলক নথির চেকলিস্ট",
        "certificatesRequired": "প্রয়োজনীয় সংবিধিবদ্ধ শংসাপত্র",
        "importantNotes": "গুরুত্বপূর্ণ নির্দেশিকা ও মোরেটোরিয়াম",
        "applyForThisScheme": "এই প্রকল্পে আবেদন করুন →",
        "note_dbt": "সরাসরি ব্যাঙ্ক অ্যাকাউন্টে DBT প্রদান",
        "note_zero_fee": "শূন্য প্রসেসিং ফি",
        "note_moratorium": "ইএমআই শুরুর আগে ঋণ পরিশোধের মোরেটোরিয়াম সুবিধা রয়েছে।",
        "docs": {
            "doc_caste": "তফসিলি জাতি (SC) শংসাপত্র (তহশিলদার / রাজস্ব দপ্তর)",
            "doc_aadhaar": "আধার কার্ড (মোবাইল নম্বরের সাথে যুক্ত)",
            "doc_income": "আয় শংসাপত্র (পারিবারিক আয় ≤ ₹ ৫,০০,০০০ / বছর)",
            "doc_bank": "ব্যাঙ্ক পাসবুক / বাতিল চেক (DBT সক্রিয়)",
            "doc_residence": "বাসস্থানের প্রমাণ (রেশন কার্ড / বিদ্যুৎ বিল / ভোটার আইডি)",
            "doc_edu": "অনুমোদিত কলেজ থেকে ভর্তি পত্র ও ফি কাঠামো",
            "doc_marksheets": "১০ম, ১২ম এবং ডিগ্রি মার্কশিট / শংসাপত্র",
            "doc_visa": "বৈধ ছাত্র ভিসা ও পাসপোর্ট (বিদেশি শিক্ষার জন্য)",
            "doc_shg": "স্বনির্ভর গোষ্ঠী (SHG) রেজোলিউশন / মহিলা উদ্যোক্তা ঘোষণা",
            "doc_quotation": "ব্যবসায়িক কোটেশন / যন্ত্রপাতি ক্রয়ের অনুমান",
            "doc_sanitation": "পরিচ্ছন্নতাকর্মী পরিচয়পত্র / পুরসভা শংসাপত্র",
            "doc_green": "সৌর শক্তি / ই-যানবাহন কোটেশন এবং ড্রাইভিং লাইসেন্স",
            "doc_dpr": "বিস্তারিত প্রকল্প রিপোর্ট (DPR) এবং মেশিনারি কোটেশন",
            "doc_premises": "বাণিজ্যিক স্থানের ভাড়ার চুক্তিপত্র",
            "doc_artisan": "কারিগর পরিচয়পত্র (পহেচান কার্ড)",
            "doc_agri": "কৃষি জমির রেকর্ড (পর্চা / খতিয়ান) বা পশুচিকিৎসা শংসাপত্র"
        }
    },
    "mr": {
        "viewDocs": "आवश्यक कागदपत्रे पहा (कार्ड उलटा 🔄)",
        "flipBack": "↺ मागे उलटा",
        "mandatoryDocs": "अनिवार्य कागदपत्रांची चेकलिस्ट",
        "certificatesRequired": "आवश्यक वैधानिक प्रमाणपत्रे",
        "importantNotes": "महत्त्वपूर्ण योजना मार्गदर्शक तत्त्वे आणि मोरेटोरियम",
        "applyForThisScheme": "या योजनेसाठी अर्ज करा →",
        "note_dbt": "थेट डीबीटीद्वारे बँक खात्यात वितरण",
        "note_zero_fee": "शून्य प्रक्रिया शुल्क",
        "note_moratorium": "ईएमआय सुरू होण्यापूर्वी परतफेड मोरेटोरियम कालावधी.",
        "docs": {
            "doc_caste": "अनुसूचित जाती (SC) जात प्रमाणपत्र (तहसीलदार / महसूल विभाग)",
            "doc_aadhaar": "आधार कार्ड (सक्रिय मोबाईल नंबरशी लिंक)",
            "doc_income": "उत्पन्न प्रमाणपत्र (कौटुंबिक उत्पन्न ≤ ₹ ५,००,০০০ / वर्ष)",
            "doc_bank": "बँक पासबुक / रद्द केलेला धनादेश (DBT सक्षम)",
            "doc_residence": "रहिवासी पुरावा (रेशन कार्ड / वीज बिल / मतदान ओळखपत्र)",
            "doc_edu": "मान्यताप्राप्त महाविद्यालयाचे प्रवेश पत्र व फी तपशील",
            "doc_marksheets": "१० वी, १२ वी व पदवी गुणपत्रिका",
            "doc_visa": "वैध विद्यार्थी व्हिसा व पासपोर्ट (परदेशी शिक्षणासाठी)",
            "doc_shg": "महिला बचत गट ठराव / महिला उद्योजक घोषणापत्र",
            "doc_quotation": "व्यवसाय कोटेशन / यंत्रसामग्री अंदाजपत्रक",
            "doc_sanitation": "सफाई कामगार ओळखपत्र / पालिका प्रमाणपत्र",
            "doc_green": "सौर ऊर्जा / ई-वाहन कोटेशन आणि व्यावसायिक ड्रायव्हिंग लायसन्स",
            "doc_dpr": "तपशीलवार प्रकल्प अहवाल (DPR) आणि मशिनरी कोटेशन",
            "doc_premises": "व्यावसायिक जागेचा भाडे करारनामा",
            "doc_artisan": "कारागीर ओळखपत्र (पहचान कार्ड)",
            "doc_agri": "शेतजमीन उतारा (७/१२ / ८-अ) किंवा पशुसंवर्धन प्रमाणपत्र"
        }
    },
    "gu": {
        "viewDocs": "જરૂરી દસ્તાવેજો જુઓ (કાર્ડ ફ્લિપ કરો 🔄)",
        "flipBack": "↺ પાછા ફ્લિપ કરો",
        "mandatoryDocs": "ફરજિયાત દસ્તાવેજોની યાદી",
        "certificatesRequired": "જરૂરી કાનૂની પ્રમાણપત્રો",
        "importantNotes": "મહત્વપૂર્ણ યોજના માર્ગદર્શિકા અને મોરેટોરિયમ",
        "applyForThisScheme": "આ યોજના માટે અરજી કરો →",
        "note_dbt": "સીધા બેંક ખાતામાં DBT જમા",
        "note_zero_fee": "ઝીરો પ્રોસેસિંગ ફી",
        "note_moratorium": "EMI શરૂ થતાં પહેલાં મોરેટોરિયમ સમયગાળો સામેલ.",
        "docs": {
            "doc_caste": "અનુસૂચિત જાતિ (SC) જાતિ પ્રમાણપત્ર (મામલતદાર / મહેસૂલ વિભાગ)",
            "doc_aadhaar": "આધાર કાર્ડ (મોબાઇલ નંબર સાથે લિંક)",
            "doc_income": "આવકનું પ્રમાણપત્ર (વાર્ષિક કૌટુંબિક આવક ≤ ₹ ૫,૦૦,૦૦૦)",
            "doc_bank": "બેંક પાસબુક / રદ કરેલ ચેક (DBT સક્ષમ)",
            "doc_residence": "રહેઠાણનો પુરાવો (રેશનકાર્ડ / લાઈટ બિલ / ચૂંટણી કાર્ડ)",
            "doc_edu": "માન્યતા પ્રાપ્ત સંસ્થાનો પ્રવેશ પત્ર અને ફી માળખું",
            "doc_marksheets": "ધોરણ ૧૦, ૧૨ અને ડિગ્રી માર્કશીટ્સ",
            "doc_visa": "વિદ્યાર્થી વિઝા અને પાસપોર્ટ (વિદેશ અભ્યાસ માટે)",
            "doc_shg": "સ્વસહાય જૂથ (SHG) ઠરાવ / મહિલા સાહસિક ઘોષણા",
            "doc_quotation": "વેપાર ક્વોટેશન / મશીનરી અને સાધનસામગ્રી અંદાજ",
            "doc_sanitation": "સફાઈ કામદાર ઓળખકાર્ડ / નગરપાલિકા પ્રમાણપત્ર",
            "doc_green": "સોલાર / ઈ-વાહન ક્વોટેશન અને ડ્રાઇવિંગ લાયસન્સ",
            "doc_dpr": "વિગતવાર પ્રોજેક્ટ રિપોર્ટ (DPR) અને મશીનરી ક્વોટેશન",
            "doc_premises": "વાણિજ્યિક સ્થળ ભાડા કરાર",
            "doc_artisan": "કારીગર ઓળખકાર્ડ (પહેચાન કાર્ડ)",
            "doc_agri": "જમીન રેકોર્ડ (૭/૧૨ નો ઉતારો) અથવા પશુપાલન પ્રમાણપત્ર"
        }
    }
}

def sync_all():
    for dir_path in DIRECTORIES:
        for lang, data in translations.items():
            filepath = os.path.join(dir_path, f"{lang}.json")
            if not os.path.exists(filepath):
                print(f"File not found: {filepath}")
                continue
            
            with open(filepath, "r", encoding="utf-8") as f:
                locale_json = json.load(f)
                
            if "schemes" not in locale_json:
                locale_json["schemes"] = {}
                
            for k, v in data.items():
                if k == "docs":
                    if "docs" not in locale_json["schemes"]:
                        locale_json["schemes"]["docs"] = {}
                    locale_json["schemes"]["docs"].update(v)
                else:
                    locale_json["schemes"][k] = v
                    
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(locale_json, f, ensure_ascii=False, indent=2)
                
            print(f"Successfully synced {dir_path} -> {lang}.json")

if __name__ == "__main__":
    sync_all()
