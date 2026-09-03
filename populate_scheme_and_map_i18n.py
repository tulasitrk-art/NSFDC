import json
import os

languages_data = {
    "en": {
        "schemes": {
            "badge": "Statutory Guidelines & Scheme Directory",
            "heading": "Official NSFDC Concessional Loan Schemes & Rules",
            "subheading": "Governed by statutory guidelines under the Ministry of Social Justice and Empowerment, Government of India.",
            "rulesTitle": "Statutory Eligibility Rules & Gate Criteria",
            "gate1Title": "1. Income Gate Limit",
            "gate1Desc": "Annual family income must not exceed ₹ 5,00,000.00 per annum. Verified via Income Certificate.",
            "gate2Title": "2. Caste Authenticity",
            "gate2Desc": "Must belong to Scheduled Caste (SC) community. Authenticated via Revenue Dept OCR parsing.",
            "gate3Title": "3. Concessional Rates",
            "gate3Desc": "Female beneficiaries receive additional interest concession across all schemes.",
            "matrixTitle": "NSFDC Statutory Schemes Comparison Matrix",
            "catalogSize": "Catalog Size:",
            "activeSchemes": "Active Schemes",
            "repositoryTitle": "National & State Concessional Loan Repository",
            "directoryTitle": "Comprehensive Statutory Scheme Directory (330+ Schemes)",
            "directoryDesc": "Explore 10 Core NSFDC Schemes, 20 Central Apex Corporation Programs, and 300 State Channelizing Agency (SCDC) subsidized loans across 30 States & Union Territories for FY 2026-27.",
            "totalSchemes": "Total Schemes",
            "totalPrograms": "Programs",
            "interestRates": "Interest Rates",
            "interestRange": "4.0% - 7.5% p.a.",
            "maxLoanCap": "Max Loan Cap",
            "maxCapValue": "Up to ₹ 50.00 Lakhs",
            "govtShare": "Govt Share",
            "govtFunding": "Up to 95% Funding",
            "rulesAlertTitle": "Statutory Eligibility & Hard Gate Protocols (Enforced Pan-India)",
            "rule1Title": "1. Income Ceiling Rule",
            "rule1Desc": "Annual family income must be ≤ ₹ 5,00,000.00 per annum (enforced via API Hard Gate).",
            "rule2Title": "2. Caste Verification Rule",
            "rule2Desc": "Must belong to Scheduled Caste (SC) or target beneficiary community verified via OCR.",
            "rule3Title": "3. Women Concession Rule",
            "rule3Desc": "Special 0.5% - 1.0% interest rebate and up to 95% government funding for female entrepreneurs.",
            "searchPlaceholder": "Search across 330+ schemes by keyword, sector, or scheme name...",
            "clear": "Clear",
            "allIndia": "All India (National & State)",
            "categories": {
                "ALL": "All Schemes",
                "MICRO": "Micro Credit",
                "MICRO_WOMEN": "Women Special",
                "TERM": "Term Capex",
                "EDU_DOMESTIC": "Higher Education",
                "GREEN_ENERGY": "Green & Solar",
                "SANITATION": "Sanitation",
                "ARTISAN": "Artisan & Crafts",
                "SMALL_BUSINESS": "Small Business",
                "AGRI_WOMEN": "Agri & Dairy"
            },
            "found": "Found",
            "matchingSchemes": "matching schemes",
            "inState": "in",
            "underCat": "under",
            "page": "Page",
            "of": "of",
            "noSchemesFound": "No matching schemes found",
            "noSchemesDesc": "Try adjusting your search query, selecting 'All India', or resetting category filters.",
            "resetFilters": "Reset All Filters",
            "state": "State",
            "femaleRate": "Female Rate",
            "maleRate": "Male Rate",
            "femaleOnly": "N/A (Female Only)",
            "pa": "p.a.",
            "moratorium": "Moratorium",
            "tenure": "Tenure",
            "mos": "Mos",
            "yrs": "Yrs",
            "applyUnderScheme": "Apply Under Scheme",
            "schemeDetails": "Scheme Details",
            "category": "Category",
            "action": "Action",
            "apply": "Apply",
            "previous": "Previous",
            "next": "Next",
            "backToPrevious": "Back to Previous Step",
            "interest": "Interest",
            "govtFundingLabel": "Govt. Funding",
            "maxProjectLimit": "Max Project Limit",
            "items": {
                "NSFDC_MCF": {
                    "title": "Micro Credit Finance Scheme (MCF)",
                    "description": "Direct micro-credit loans for small business, vending, artisans, and rural micro-enterprises."
                },
                "NSFDC_MSY": {
                    "title": "Mahila Samriddhi Yojana (MSY)",
                    "description": "Specialized concessional loan for Scheduled Caste female entrepreneurs with maximum government share."
                },
                "NSFDC_TL": {
                    "title": "Term Loan Scheme (General)",
                    "description": "Capital expenditure financing for commercial transport, manufacturing, and agro-processing units."
                },
                "NSFDC_ELS_D": {
                    "title": "Educational Loan Scheme (Domestic)",
                    "description": "Higher professional education financing in India (Engineering, Medicine, Law, Management)."
                },
                "NSFDC_ELS_O": {
                    "title": "Overseas Educational Loan Scheme",
                    "description": "Concessional credit for post-graduate and doctoral studies in foreign universities."
                },
                "NSFDC_GBS": {
                    "title": "Green Business Scheme (GBS)",
                    "description": "Financial assistance for eco-friendly business activities (Battery Rickshaws, Solar Energy, Waste Mgmt)."
                },
                "NSFDC_SWSS": {
                    "title": "Sanitation Workers Special Scheme",
                    "description": "Concessional credit for sanitation workers and liberated manual scavengers for alternative dignified livelihoods."
                },
                "NSFDC_SKYS": {
                    "title": "Shilpi Samriddhi Yojana (Artisan Scheme)",
                    "description": "Subsidized term loan assistance for traditional SC artisans, handicrafts, and handloom weavers."
                },
                "NSFDC_VBS": {
                    "title": "Vending & Micro Business Scheme",
                    "description": "Working capital financing for urban street vendors, hawkers, and weekly market traders."
                },
                "NSFDC_DAIRY": {
                    "title": "Dairy & Animal Husbandry Scheme",
                    "description": "Concessional loans for milch cattle purchase, poultry farming, goat rearing, and milk chilling infrastructure."
                }
            }
        },
        "map": {
            "routerTitle": "Pan-India Channel Partner Bank & SCA Spatial Router",
            "routerSubtitle": "Select any Indian State or UT to view interactive map pins and detailed branch credit metrics.",
            "selectState": "Select State:",
            "allStates": "All 28 States & UTs (Pan-India)",
            "osmTitle": "Interactive OpenStreetMap Visualizer",
            "stateCode": "State Code:",
            "updatingPins": "Updating Map Pins for",
            "loadingMap": "Loading Pan-India Interactive Leaflet Map...",
            "branchesInState": "Branches in Selected State",
            "branchDesks": "Branch Desks",
            "rScore": "R_score:",
            "npaRate": "Branch NPA Rate",
            "healthyNpa": "(Healthy <15%)",
            "creditQuota": "Available Credit Quota",
            "officer": "Officer:",
            "selectedAddress": "📍 Selected Branch Detailed Address:",
            "physicalAddress": "Physical Branch Address:",
            "selectedForDispatch": "Selected Branch for Dispatch ✓",
            "selectForDispatch": "Select Branch for Dispatch →",
            "noBranches": "No active branch desks found for state code:",
            "noBranchesPrompt": "Select another state or 'All Pan-India'.",
            "legendTitle": "R_score Pin Index Legend",
            "legendGreen": "Green: Top Route (R_score ≥ 0.70)",
            "legendYellow": "Yellow: Valid Alternative (0.50 ≤ R_score < 0.70)",
            "legendRed": "Red: Pruned / High NPA / Low Quota",
            "applicantLocation": "Applicant Center Location",
            "spatialSearchCenter": "Spatial Search Center",
            "distance": "Distance:",
            "kmAway": "KM away",
            "status": "Status:",
            "backStep": "← Back to Previous Step",
            "partnerLocator": "Channel Partner Bank & SCA Locator",
            "postgisRouter": "Pan-India PostGIS Health Router",
            "routerDesc": "Geodesic spatial routing engine evaluating lending quotas, NPA filters (< 15%), and distance across all 28 States & UTs.",
            "dispatchSuccess": "Application Lead Dispatched Successfully!",
            "trackRefNumber": "Tracking Reference Number:",
            "trackLifecycle": "Track Application Lifecycle →",
            "rankedDesks": "Ranked Branch Desks",
            "routesFound": "Routes",
            "detailedAddress": "📍 Detailed Address:"
        }
    },
    "hi": {
        "schemes": {
            "badge": "वैधानिक दिशानिर्देश एवं योजना निर्देशिका",
            "heading": "आधिकारिक NSFDC रियायती ऋण योजनाएं एवं नियम",
            "subheading": "सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार के वैधानिक दिशानिर्देशों द्वारा संचालित।",
            "rulesTitle": "वैधानिक पात्रता नियम एवं हार्ड गेट मानदंड",
            "gate1Title": "1. आय सीमा नियम",
            "gate1Desc": "पारिवारिक वार्षिक आय ₹ 5,00,000.00 प्रति वर्ष से अधिक नहीं होनी चाहिए। आय प्रमाण पत्र द्वारा सत्यापित।",
            "gate2Title": "2. जाति प्रमाणिकता",
            "gate2Desc": "अनुसूचित जाति (SC) समुदाय से संबंधित होना चाहिए। राजस्व विभाग OCR द्वारा सत्यापित।",
            "gate3Title": "3. रियायती दरें",
            "gate3Desc": "महिला लाभार्थियों को सभी योजनाओं में अतिरिक्त ब्याज रियायत मिलती है।",
            "matrixTitle": "NSFDC वैधानिक योजना तुलना तालिका",
            "catalogSize": "कैटलॉग आकार:",
            "activeSchemes": "सक्रिय योजनाएं",
            "repositoryTitle": "राष्ट्रीय एवं राज्य रियायती ऋण भंडार",
            "directoryTitle": "व्यापक वैधानिक योजना निर्देशिका (330+ योजनाएं)",
            "directoryDesc": "वित्तीय वर्ष 2026-27 के लिए 30 राज्यों और केंद्र शासित प्रदेशों में 10 मुख्य NSFDC योजनाएं, 20 केंद्रीय एपेक्स निगम कार्यक्रम और 300 राज्य चैनलाइजिंग एजेंसी (SCDC) सब्सिडी वाले ऋण देखें।",
            "totalSchemes": "कुल योजनाएं",
            "totalPrograms": "कार्यक्रम",
            "interestRates": "ब्याज दरें",
            "interestRange": "4.0% - 7.5% प्रति वर्ष",
            "maxLoanCap": "अधिकतम ऋण सीमा",
            "maxCapValue": "₹ 50.00 लाख तक",
            "govtShare": "सरकारी हिस्सा",
            "govtFunding": "95% तक सरकारी सहायता",
            "rulesAlertTitle": "वैधानिक पात्रता एवं हार्ड गेट प्रोटोकॉल (अखिल भारतीय)",
            "rule1Title": "1. आय सीमा नियम",
            "rule1Desc": "पारिवारिक वार्षिक आय ≤ ₹ 5,00,000.00 प्रति वर्ष होनी चाहिए (API हार्ड गेट द्वारा सत्यापित)।",
            "rule2Title": "2. जाति सत्यापन नियम",
            "rule2Desc": "अनुसूचित जाति (SC) या लक्षित लाभार्थी वर्ग से संबंधित होना चाहिए (OCR द्वारा सत्यापित)।",
            "rule3Title": "3. महिला रियायत नियम",
            "rule3Desc": "महिला उद्यमियों के लिए विशेष 0.5% - 1.0% ब्याज छूट और 95% तक सरकारी वित्तपोषण।",
            "searchPlaceholder": "कीवर्ड, क्षेत्र या योजना के नाम से 330+ योजनाओं में खोजें...",
            "clear": "साफ करें",
            "allIndia": "अखिल भारतीय (राष्ट्रीय एवं राज्य)",
            "categories": {
                "ALL": "सभी योजनाएं",
                "MICRO": "माइक्रो क्रेडिट",
                "MICRO_WOMEN": "महिला विशेष",
                "TERM": "टर्म लोन (पूंजीगत)",
                "EDU_DOMESTIC": "उच्च शिक्षा",
                "GREEN_ENERGY": "हरित व सौर ऊर्जा",
                "SANITATION": "स्वच्छता कार्य",
                "ARTISAN": "शिल्पकार एवं कारीगर",
                "SMALL_BUSINESS": "लघु व्यवसाय",
                "AGRI_WOMEN": "कृषि एवं डेयरी"
            },
            "found": "कुल",
            "matchingSchemes": "योजनाएं मिलीं",
            "inState": "राज्य:",
            "underCat": "श्रेणी:",
            "page": "पृष्ठ",
            "of": "का",
            "noSchemesFound": "कोई मिलती-जुलती योजना नहीं मिली",
            "noSchemesDesc": "अपनी खोज बदलें, 'अखिल भारतीय' चुनें, या श्रेणी फ़िल्टर रीसेट करें।",
            "resetFilters": "सभी फ़िल्टर रीसेट करें",
            "state": "राज्य",
            "femaleRate": "महिला ब्याज दर",
            "maleRate": "पुरुष ब्याज दर",
            "femaleOnly": "लागू नहीं (केवल महिला)",
            "pa": "प्रति वर्ष",
            "moratorium": "मोराटोरियम",
            "tenure": "अवधि",
            "mos": "महीने",
            "yrs": "वर्ष",
            "applyUnderScheme": "योजना के तहत आवेदन करें",
            "schemeDetails": "योजना विवरण",
            "category": "श्रेणी",
            "action": "कार्रवाई",
            "apply": "आवेदन करें",
            "previous": "पिछला",
            "next": "अगला",
            "backToPrevious": "पिछला कदम",
            "interest": "ब्याज",
            "govtFundingLabel": "सरकारी सहायता",
            "maxProjectLimit": "अधिकतम परियोजना लागत",
            "items": {
                "NSFDC_MCF": {
                    "title": "माइक्रो क्रेडिट वित्त योजना (MCF)",
                    "description": "छोटे व्यवसायों, वेंडिंग, कारीगरों और ग्रामीण सूक्ष्म उद्यमों के लिए प्रत्यक्ष रियायती ऋण।"
                },
                "NSFDC_MSY": {
                    "title": "महिला समृद्धि योजना (MSY)",
                    "description": "अधिकतम सरकारी हिस्सेदारी के साथ अनुसूचित जाति की महिला उद्यमियों के लिए विशेष रियायती ऋण।"
                },
                "NSFDC_TL": {
                    "title": "सावधि ऋण सामान्य योजना (Term Loan)",
                    "description": "वाणिज्यिक परिवहन, विनिर्माण और कृषि-प्रसंस्करण इकाइयों के लिए पूंजीगत व्यय वित्तपोषण।"
                },
                "NSFDC_ELS_D": {
                    "title": "शिक्षा ऋण योजना (देशीय)",
                    "description": "भारत में उच्च व्यावसायिक शिक्षा (इंजीनियरिंग, चिकित्सा, विधि, प्रबंधन) हेतु रियायती ऋण।"
                },
                "NSFDC_ELS_O": {
                    "title": "विदेश शिक्षा ऋण योजना (Abroad)",
                    "description": "विदेशी विश्वविद्यालयों में स्नातकोत्तर एवं डॉक्टरेट अध्ययन के लिए रियायती ऋण।"
                },
                "NSFDC_GBS": {
                    "title": "हरित व्यवसाय योजना (GBS)",
                    "description": "पर्यावरण अनुकूल व्यावसायिक गतिविधियों (ई-रिक्शा, सौर ऊर्जा, अपशिष्ट प्रबंधन) हेतु वित्तीय सहायता।"
                },
                "NSFDC_SWSS": {
                    "title": "स्वच्छता कार्यकर्ता विशेष योजना",
                    "description": "स्वच्छता कर्मियों एवं विमुक्त सफाई कामगारों के सम्मानजनक वैकल्पिक आजीविका हेतु रियायती ऋण।"
                },
                "NSFDC_SKYS": {
                    "title": "शिल्पी समृद्धि योजना (दस्तकार योजना)",
                    "description": "पारंपरिक अनुसूचित जाति के शिल्पकारों, हस्तशिल्प और हथकरघा बुनकरों के लिए रियायती सावधि ऋण।"
                },
                "NSFDC_VBS": {
                    "title": "वेंडिंग एवं सूक्ष्म व्यवसाय योजना",
                    "description": "शहरी रेहड़ी-पटरी वालों, फेरीवालों और साप्ताहिक बाजार व्यापारियों के लिए कार्यशील पूंजी वित्तपोषण।"
                },
                "NSFDC_DAIRY": {
                    "title": "डेयरी एवं पशुपालन योजना",
                    "description": "दुधारू पशु खरीद, मुर्गी पालन, बकरी पालन और दुग्ध प्रशीतन अवसंरचना हेतु रियायती ऋण।"
                }
            }
        },
        "map": {
            "routerTitle": "अखिल भारतीय चैनल पार्टनर बैंक एवं एससीए स्थानिक राउटर",
            "routerSubtitle": "इंटरैक्टिव मानचित्र पिन और विस्तृत शाखा क्रेडिट मेट्रिक्स देखने के लिए किसी भी भारतीय राज्य या केंद्र शासित प्रदेश का चयन करें।",
            "selectState": "राज्य चुनें:",
            "allStates": "सभी 28 राज्य और केंद्र शासित प्रदेश (अखिल भारत)",
            "osmTitle": "इंटरैक्टिव ओपनस्ट्रीटमैप विज़ुअलाइज़र",
            "stateCode": "राज्य कोड:",
            "updatingPins": "मानचित्र पिन अपडेट किए जा रहे हैं:",
            "loadingMap": "अखिल भारतीय इंटरैक्टिव लीफ़लेट मानचित्र लोड हो रहा है...",
            "branchesInState": "चयनित राज्य में शाखाएं",
            "branchDesks": "शाखा डेस्क",
            "rScore": "R_score सूचकांक:",
            "npaRate": "शाखा एनपीए दर",
            "healthyNpa": "(स्वस्थ <15%)",
            "creditQuota": "उपलब्ध क्रेडिट कोटा",
            "officer": "अधिकारी:",
            "selectedAddress": "📍 चयनित शाखा का विस्तृत पता:",
            "physicalAddress": "शाखा का भौतिक पता:",
            "selectedForDispatch": "डिस्पैच के लिए चयनित शाखा ✓",
            "selectForDispatch": "डिस्पैच के लिए शाखा चुनें →",
            "noBranches": "इस राज्य कोड के लिए कोई सक्रिय शाखा डेस्क नहीं मिली:",
            "noBranchesPrompt": "अन्य राज्य या 'अखिल भारत' चुनें।",
            "legendTitle": "R_score पिन इंडेक्स लेजेंड",
            "legendGreen": "हरा: शीर्ष मार्ग (R_score ≥ 0.70)",
            "legendYellow": "पीला: मान्य विकल्प (0.50 ≤ R_score < 0.70)",
            "legendRed": "लाल: प्रून्ड / उच्च एनपीए / कम कोटा",
            "applicantLocation": "आवेदक का केंद्र स्थान",
            "spatialSearchCenter": "स्थानिक खोज केंद्र",
            "distance": "दूरी:",
            "kmAway": "किमी दूर",
            "status": "स्थिति:",
            "backStep": "← पिछले चरण पर वापस जाएं",
            "partnerLocator": "चैनल पार्टनर बैंक एवं एससीए लोकेटर",
            "postgisRouter": "अखिल भारतीय पोस्टजीआईएस स्वास्थ्य राउटर",
            "routerDesc": "सभी 28 राज्यों और केंद्र शासित प्रदेशों में ऋण कोटा, एनपीए फिल्टर (< 15%) और दूरी का मूल्यांकन करने वाला भू-स्थानिक रूटिंग इंजन।",
            "dispatchSuccess": "आवेदन लीड सफलतापूर्वक डिस्पैच किया गया!",
            "trackRefNumber": "ट्रैकिंग संदर्भ संख्या:",
            "trackLifecycle": "आवेदन जीवनचक्र ट्रैक करें →",
            "rankedDesks": "रैंक की गई शाखा डेस्क",
            "routesFound": "मार्ग",
            "detailedAddress": "📍 विस्तृत पता:"
        }
    },
    "te": {
        "schemes": {
            "badge": "చట్టబద్ధమైన మార్గదర్శకాలు & పథకాల డైరెక్టరీ",
            "heading": "అధికారిక NSFDC రాయితీ రుణ పథకాలు & నిబంధనలు",
            "subheading": "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ, భారత ప్రభుత్వ చట్టబద్ధమైన మార్గదర్శకాల ప్రకారం.",
            "rulesTitle": "చట్టబద్ధమైన అర్హత నిబంధనలు & హార్డ్ గేట్ ప్రమాణాలు",
            "gate1Title": "1. ఆదాయ పరిమితి నిబంధన",
            "gate1Desc": "కుటుంబ వార్షిక ఆదాయం ₹ 5,00,000.00 దాటకూడదు. ఆదాయ ధృవీకరణ పత్రం ద్వారా తనిఖీ చేయబడుతుంది.",
            "gate2Title": "2. కుల దృవీకరణ",
            "gate2Desc": "షెడ్యూల్డ్ కులానికి (SC) చెందినవారై ఉండాలి. రెవెన్యూ శాఖ OCR ద్వారా ధృవీకరించబడుతుంది.",
            "gate3Title": "3. రాయితీ రేట్లు",
            "gate3Desc": "మహిళా లబ్ధిదారులకు అన్ని పథకాలలో అదనపు వడ్డీ రాయితీ లభిస్తుంది.",
            "matrixTitle": "NSFDC చట్టబద్ధమైన పథకాల పోలిక పట్టిక",
            "catalogSize": "కేటలాగ్ పరిమాణం:",
            "activeSchemes": "సక్రియ పథకాలు",
            "repositoryTitle": "జాతీయ & రాష్ట్ర రాయితీ రుణాల నిధి",
            "directoryTitle": "సమగ్ర చట్టబద్ధమైన పథకాల డైరెక్టరీ (330+ పథకాలు)",
            "directoryDesc": "ఆర్థిక సంవత్సరం 2026-27 కోసం 30 రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలలో 10 ప్రధాన NSFDC పథకాలు, 20 కేంద్ర అపెక్స్ కార్పొరేషన్ ప్రోగ్రామ్‌లు మరియు 300 రాష్ట్ర ఛానలైజింగ్ ఏజెన్సీ (SCDC) రాయితీ రుణాలను అన్వేషించండి.",
            "totalSchemes": "మొత్తం పథకాలు",
            "totalPrograms": "కార్యక్రమాలు",
            "interestRates": "వడ్డీ రేట్లు",
            "interestRange": "4.0% - 7.5% వార్షికం",
            "maxLoanCap": "గరిష్ట రుణ పరిమితి",
            "maxCapValue": "₹ 50.00 లక్షల వరకు",
            "govtShare": "ప్రభుత్వ వాటా",
            "govtFunding": "95% వరకు నిధులు",
            "rulesAlertTitle": "చట్టబద్ధమైన అర్హత & హార్డ్ గేట్ ప్రోటోకాల్స్ (అఖిల భారత)",
            "rule1Title": "1. ఆదాయ పరిమితి నిబంధన",
            "rule1Desc": "కుటుంబ వార్షిక ఆదాయం ≤ ₹ 5,00,000.00 ఉండాలి (API హార్డ్ గేట్ ద్వారా ధృవీకరణ).",
            "rule2Title": "2. కుల ధృవీకరణ నిబంధన",
            "rule2Desc": "షెడ్యూల్డ్ కులం (SC) లేదా లక్షిత లబ్ధిదారు వర్గానికి చెందినవారై ఉండాలి (OCR ద్వారా ధృవీకరణ).",
            "rule3Title": "3. మహిళా రాయితీ నిబంధన",
            "rule3Desc": "మహిళా వ్యాపారవేత్తలకు ప్రత్యేక 0.5% - 1.0% వడ్డీ రాయితీ మరియు 95% వరకు ప్రభుత్వ నిధులు.",
            "searchPlaceholder": "కీవర్డ్, రంగం లేదా పథకం పేరు ద్వారా 330+ పథకాల్లో శోధించండి...",
            "clear": "క్లియర్",
            "allIndia": "అఖిల భారతదేశం (జాతీయ & రాష్ట్ర)",
            "categories": {
                "ALL": "అన్ని పథకాలు",
                "MICRO": "మైక్రో క్రెడిట్",
                "MICRO_WOMEN": "మహిళా ప్రత్యేక",
                "TERM": "టర్మ్ లోన్ (కాపెక్స్)",
                "EDU_DOMESTIC": "ఉన్నత విద్య",
                "GREEN_ENERGY": "గ్రీన్ & సోలార్",
                "SANITATION": "పారిశుధ్యం",
                "ARTISAN": "చేతివృత్తులు & కళలు",
                "SMALL_BUSINESS": "చిన్న వ్యాపారం",
                "AGRI_WOMEN": "వ్యవసాయం & పాడి"
            },
            "found": "కనుగొనబడింది",
            "matchingSchemes": "సరిపోలిన పథకాలు",
            "inState": "రాష్ట్రం:",
            "underCat": "వర్గం:",
            "page": "పేజీ",
            "of": "/",
            "noSchemesFound": "సరిపోలిన పథకాలు కనుగొనబడలేదు",
            "noSchemesDesc": "శోధన పదాన్ని మార్చండి, 'అఖిల భారతదేశం' ఎంచుకోండి లేదా ఫిల్టర్‌లను రీసెట్ చేయండి.",
            "resetFilters": "అన్ని ఫిల్టర్‌లను రీసెట్ చేయండి",
            "state": "రాష్ట్రం",
            "femaleRate": "మహిళల వడ్డీ రేటు",
            "maleRate": "పురుషుల వడ్డీ రేటు",
            "femaleOnly": "వర్తించదు (మహిళలకు మాత్రమే)",
            "pa": "వార్షికం",
            "moratorium": "మొరటోరియం",
            "tenure": "కాలపరిమితి",
            "mos": "నెలలు",
            "yrs": "సంవత్సరాలు",
            "applyUnderScheme": "పథకం కింద దరఖాస్తు చేయండి",
            "schemeDetails": "పథకం వివరాలు",
            "category": "వర్గం",
            "action": "చర్య",
            "apply": "దరఖాస్తు",
            "previous": "మునుపటి",
            "next": "తరువాతి",
            "backToPrevious": "మునుపటి దశకు వెళ్ళండి",
            "interest": "వడ్డీ",
            "govtFundingLabel": "ప్రభుత్వ నిధులు",
            "maxProjectLimit": "గరిష్ట ప్రాజెక్ట్ పరిమితి",
            "items": {
                "NSFDC_MCF": {
                    "title": "మైక్రో క్రెడిట్ ఫైనాన్స్ పథకం (MCF)",
                    "description": "చిన్న వ్యాపారాలు, వీధి వ్యాపారులు, కళాకారులు మరియు గ్రామీణ సూక్ష్మ సంస్థలకు ప్రత్యక్ష మైక్రో-క్రెడిట్ రుణాలు."
                },
                "NSFDC_MSY": {
                    "title": "మహిళా సమృద్ధి యోజన (MSY)",
                    "description": "గరిష్ట ప్రభుత్వ వాటాతో షెడ్యూల్డ్ కులాల మహిళా పారిశ్రామికవేత్తల కోసం ప్రత్యేక రాయితీ రుణం."
                },
                "NSFDC_TL": {
                    "title": "టర్మ్ లోన్ పథకం (సాధారణ)",
                    "description": "వాణిజ్య రవాణా, తయారీ మరియు వ్యవసాయ ప్రాసెసింగ్ యూనిట్ల కోసం మూలధన వ్యయ నిధులు."
                },
                "NSFDC_ELS_D": {
                    "title": "విద్యా రుణ పథకం (దేశీయ)",
                    "description": "భారతదేశంలో ఉన్నత వృత్తి విద్యా కోర్సులకు నిధులు (ఇంజనీరింగ్, మెడిసిన్, లా, మేనేజ్‌మెంట్)."
                },
                "NSFDC_ELS_O": {
                    "title": "విదేశీ విద్యా రుణ పథకం",
                    "description": "విదేశీ విశ్వవిద్యాలయాలలో పోస్ట్-గ్రాడ్యుయేట్ మరియు డాక్టోరల్ అధ్యయనాలకు రాయితీ రుణం."
                },
                "NSFDC_GBS": {
                    "title": "గ్రీన్ బిజినెస్ పథకం (GBS)",
                    "description": "పర్యావరణ అనుకూల వ్యాపార కార్యకలాపాలకు ఆర్థిక సహాయం (బ్యాటరీ రిక్షాలు, సౌర శక్తి, వ్యర్థాల నిర్వహణ)."
                },
                "NSFDC_SWSS": {
                    "title": "పారిశుధ్య కార్మికుల ప్రత్యేక పథకం",
                    "description": "గౌరవప్రదమైన ప్రత్యామ్నాయ జీవనోపాధి కోసం పారిశుధ్య కార్మికులు మరియు మాన్యువల్ స్కావెంజర్లకు రాయితీ రుణాలు."
                },
                "NSFDC_SKYS": {
                    "title": "శిల్పి సమృద్ధి యోజన (కళాకారుల పథకం)",
                    "description": "సాంప్రదాయ ఎస్సీ కళాకారులు, హస్తకళలు మరియు చేనేత కార్మికులకు రాయితీ టర్మ్ లోన్ సహాయం."
                },
                "NSFDC_VBS": {
                    "title": "వెండింగ్ & సూక్ష్మ వ్యాపార పథకం",
                    "description": "పట్టణ వీధి వ్యాపారులు, చిరువ్యాపారులు మరియు వారపు సంతల వ్యాపారులకు వర్కింగ్ క్యాపిటల్ ఫైనాన్సింగ్."
                },
                "NSFDC_DAIRY": {
                    "title": "డైరీ & పశుసంవర్ధక పథకం",
                    "description": "పాడి పశువుల కొనుగోలు, పౌల్ట్రీ, గొర్రెల పెంపకం మరియు పాల శీతలీకరణ మౌలిక సదుపాయాలకు రాయితీ రుణాలు."
                }
            }
        },
        "map": {
            "routerTitle": "అఖిల భారత ఛానల్ భాగస్వామ్య బ్యాంక్ & SCA స్పేషియల్ రూటర్",
            "routerSubtitle": "ఇంటరాక్టివ్ మ్యాప్ పిన్‌లు మరియు వివరణాత్మక బ్రాంచ్ క్రెడిట్ కొలమానాలను చూడటానికి ఏదైనా భారతీయ రాష్ట్రం లేదా UTని ఎంచుకోండి.",
            "selectState": "రాష్ట్రాన్ని ఎంచుకోండి:",
            "allStates": "అన్ని 28 రాష్ట్రాలు & UTలు (అఖిల భారత్)",
            "osmTitle": "ఇంటరాక్టివ్ ఓపెన్‌స్ట్రీట్‌మ్యాప్ విజువలైజర్",
            "stateCode": "రాష్ట్ర కోడ్:",
            "updatingPins": "మ్యాప్ పిన్‌లు అప్‌డేట్ అవుతున్నాయి:",
            "loadingMap": "అఖిల భారత ఇంటరాక్టివ్ లీఫ్‌లెట్ మ్యాప్ లోడ్ అవుతోంది...",
            "branchesInState": "ఎంచుకున్న రాష్ట్రంలోని శాఖలు",
            "branchDesks": "బ్రాంచ్ డెస్క్‌లు",
            "rScore": "R_score సూచిక:",
            "npaRate": "బ్రాంచ్ NPA రేటు",
            "healthyNpa": "(ఆరోగ్యకరమైన <15%)",
            "creditQuota": "అందుబాటులో ఉన్న క్రెడిట్ కోటా",
            "officer": "అధికారి:",
            "selectedAddress": "📍 ఎంచుకున్న శాఖ వివరణాత్మక చిరునామా:",
            "physicalAddress": "శాఖ భౌతిక చిరునామా:",
            "selectedForDispatch": "డిస్పాచ్ కోసం ఎంచుకున్న శాఖ ✓",
            "selectForDispatch": "డిస్పాచ్ కోసం శాఖను ఎంచుకోండి →",
            "noBranches": "ఈ రాష్ట్ర కోడ్‌కి క్రియాశీల శాఖలు కనుగొనబడలేదు:",
            "noBranchesPrompt": "మరొక రాష్ట్రాన్ని లేదా 'అఖిల భారత్'ని ఎంచుకోండి.",
            "legendTitle": "R_score పిన్ ఇండెక్స్ లెజెండ్",
            "legendGreen": "ఆకుపచ్చ: ఉత్తమ మార్గం (R_score ≥ 0.70)",
            "legendYellow": "పసుపు: సరైన ప్రత్యామ్నాయం (0.50 ≤ R_score < 0.70)",
            "legendRed": "ఎరుపు: అధిక NPA / తక్కువ కోటా",
            "applicantLocation": "దరఖాస్తుదారు కేంద్ర స్థానం",
            "spatialSearchCenter": "స్పేషియల్ శోధన కేంద్రం",
            "distance": "దూరం:",
            "kmAway": "కి.మీ దూరంలో",
            "status": "స్థితి:",
            "backStep": "← మునుపటి దశకు వెళ్ళండి",
            "partnerLocator": "ఛానల్ భాగస్వామ్య బ్యాంక్ & SCA లొకేటర్",
            "postgisRouter": "పాన్-ఇండియా పోస్ట్‌జిఐఎస్ హెల్త్ రూటర్",
            "routerDesc": "అన్ని 28 రాష్ట్రాలు & UTలలో రుణ కోటాలు, NPA ఫిల్టర్‌లు (< 15%) మరియు దూరాన్ని అంచనా వేసే జియోడెసిక్ స్పేషియల్ రూటింగ్ ఇంజిన్.",
            "dispatchSuccess": "దరఖాస్తు లీడ్ విజయవంతంగా డిస్పాచ్ చేయబడింది!",
            "trackRefNumber": "ట్రాకింగ్ రిఫరెన్స్ నంబర్:",
            "trackLifecycle": "దరఖాస్తు స్థితిని ట్రాక్ చేయండి →",
            "rankedDesks": "ర్యాంక్ చేయబడిన బ్రాంచ్ డెస్క్‌లు",
            "routesFound": "మార్గాలు",
            "detailedAddress": "📍 వివరణాత్మక చిరునామా:"
        }
    },
    "ta": {
        "schemes": {
            "badge": "சட்டப்பூர்வ வழிகாட்டுதல்கள் & திட்ட அடைவு",
            "heading": "அதிகாரப்பூர்வ NSFDC மானியக் கடன் திட்டங்கள் & விதிகள்",
            "subheading": "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம், இந்திய அரசின் சட்டப்பூர்வ வழிகாட்டுதல்களின் கீழ் நிர்வகிக்கப்படுகிறது.",
            "rulesTitle": "சட்டப்பூர்வ தகுதி விதிகள் & நுழைவு அளவுகோல்கள்",
            "gate1Title": "1. வருமான வரம்பு விதி",
            "gate1Desc": "குடும்ப ஆண்டு வருமானம் ₹ 5,00,000.00 மிகாமல் இருக்க வேண்டும். வருமானச் சான்றிதழ் மூலம் சரிபார்க்கப்பட்டது.",
            "gate2Title": "2. சாதி உண்மைத்தன்மை",
            "gate2Desc": "பட்டியலின (SC) சமூகத்தைச் சேர்ந்தவராக இருக்க வேண்டும். வருவாய்த்துறை OCR மூலம் அங்கீகரிக்கப்பட்டது.",
            "gate3Title": "3. மானிய விகிதங்கள்",
            "gate3Desc": "அனைத்து திட்டங்களிலும் பெண் பயனாளிகளுக்கு கூடுதல் வட்டிச் சலுகை வழங்கப்படுகிறது.",
            "matrixTitle": "NSFDC சட்டப்பூர்வ திட்டங்கள் ஒப்பீட்டு அட்டவணை",
            "catalogSize": "திட்டங்களின் எண்ணிக்கை:",
            "activeSchemes": "செயலில் உள்ள திட்டங்கள்",
            "repositoryTitle": "தேசிய & மாநில மானியக் கடன் களஞ்சியம்",
            "directoryTitle": "விரிவான சட்டப்பூர்வ திட்ட அடைவு (330+ திட்டங்கள்)",
            "directoryDesc": "2026-27 நிதியாண்டிற்கான 30 மாநிலங்கள் & யூனியன் பிரதேசங்களில் 10 முதன்மை NSFDC திட்டங்கள், 20 மத்திய அரசு திட்டங்கள் மற்றும் 300 மாநில சேனலைசிங் ஏஜென்சி (SCDC) மானியக் கடன்களைப் பாருங்கள்.",
            "totalSchemes": "மொத்த திட்டங்கள்",
            "totalPrograms": "திட்டங்கள்",
            "interestRates": "வட்டி விகிதங்கள்",
            "interestRange": "ஆண்டுக்கு 4.0% - 7.5%",
            "maxLoanCap": "அதிகபட்ச கடன் வரம்பு",
            "maxCapValue": "₹ 50.00 லட்சம் வரை",
            "govtShare": "அரசு பங்கு",
            "govtFunding": "95% வரை அரசு நிதி",
            "rulesAlertTitle": "சட்டப்பூர்வ தகுதி & வழிகாட்டு நெறிமுறைகள் (அகில இந்தியா)",
            "rule1Title": "1. வருமான உச்சவரம்பு விதி",
            "rule1Desc": "குடும்ப ஆண்டு வருமானம் ≤ ₹ 5,00,000.00 ஆக இருக்க வேண்டும் (API மூலம் சரிபார்க்கப்படுகிறது).",
            "rule2Title": "2. சாதிச் சான்றிதழ் சரிபார்ப்பு விதி",
            "rule2Desc": "பட்டியலின (SC) சமூகத்தைச் சேர்ந்தவராக இருக்க வேண்டும் (OCR மூலம் சரிபார்க்கப்படுகிறது).",
            "rule3Title": "3. பெண்கள் சலுகை விதி",
            "rule3Desc": "பெண் தொழில்முனைவோருக்கு சிறப்பு 0.5% - 1.0% வட்டித் தள்ளுபடி மற்றும் 95% வரை அரசு நிதி.",
            "searchPlaceholder": "முக்கிய சொல், துறை அல்லது திட்டப் பெயர் மூலம் 330+ திட்டங்களைத் தேடுங்கள்...",
            "clear": "அழி",
            "allIndia": "அனைத்து இந்தியா (தேசிய & மாநிலம்)",
            "categories": {
                "ALL": "அனைத்து திட்டங்கள்",
                "MICRO": "மைக்ரோ கிரெடிட்",
                "MICRO_WOMEN": "பெண்கள் சிறப்பு",
                "TERM": "காலக் கடன் (கேபெக்ஸ்)",
                "EDU_DOMESTIC": "உயர் கல்வி",
                "GREEN_ENERGY": "பசுமை & சூரிய ஒளி",
                "SANITATION": "துப்புரவுப் பணி",
                "ARTISAN": "கைவினைஞர்கள் & கலை",
                "SMALL_BUSINESS": "சிறு வணிகம்",
                "AGRI_WOMEN": "விவசாயம் & பால்பண்ணை"
            },
            "found": "கண்டறியப்பட்டது",
            "matchingSchemes": "பொருந்தும் திட்டங்கள்",
            "inState": "மாநிலத்தில்:",
            "underCat": "பிரிவில்:",
            "page": "பக்கம்",
            "of": "/",
            "noSchemesFound": "பொருந்தும் திட்டங்கள் எதுவும் கிடைக்கவில்லை",
            "noSchemesDesc": "உங்கள் தேடலை மாற்றவும், 'அனைத்து இந்தியா'வைத் தேர்ந்தெடுக்கவும் அல்லது வடிப்பான்களை மீட்டமைக்கவும்.",
            "resetFilters": "அனைத்து வடிப்பான்களையும் மீட்டமை",
            "state": "மாநிலம்",
            "femaleRate": "பெண்கள் வட்டி விகிதம்",
            "maleRate": "ஆண்கள் வட்டி விகிதம்",
            "femaleOnly": "பொருந்தாது (பெண்களுக்கு மட்டும்)",
            "pa": "ஆண்டுக்கு",
            "moratorium": "தவணை ஒத்திவைப்பு",
            "tenure": "கடன் காலம்",
            "mos": "மாதங்கள்",
            "yrs": "ஆண்டுகள்",
            "applyUnderScheme": "திட்டத்தின் கீழ் விண்ணப்பிக்கவும்",
            "schemeDetails": "திட்ட விவரங்கள்",
            "category": "பிரிவு",
            "action": "செயல்",
            "apply": "விண்ணப்பி",
            "previous": "முந்தைய",
            "next": "அடுத்த",
            "backToPrevious": "முந்தைய படிக்குச் செல்லவும்",
            "interest": "வட்டி",
            "govtFundingLabel": "அரசு நிதி",
            "maxProjectLimit": "அதிகபட்ச திட்ட வரம்பு",
            "items": {
                "NSFDC_MCF": {
                    "title": "மைக்ரோ கிரெடிட் நிதித் திட்டம் (MCF)",
                    "description": "சிறு வணிகங்கள், விற்பனையாளர்கள், கைவினைஞர்கள் மற்றும் கிராமப்புற நுண் நிறுவனங்களுக்கான நேரடி மைக்ரோ-கடன்."
                },
                "NSFDC_MSY": {
                    "title": "மகிளா சம்ரித்தி யோஜனா (MSY)",
                    "description": "அதிகபட்ச அரசுப் பங்குடன் பட்டியலின பெண் தொழில்முனைவோருக்கான சிறப்பு மானியக் கடன்."
                },
                "NSFDC_TL": {
                    "title": "காலக் கடன் பொதுத் திட்டம் (Term Loan)",
                    "description": "வணிகப் போக்குவரத்து, உற்பத்தி மற்றும் வேளாண் பதப்படுத்தும் அலகுகளுக்கான மூலதனச் செலவு நிதி."
                },
                "NSFDC_ELS_D": {
                    "title": "கல்விக் கடன் திட்டம் (உள்நாடு)",
                    "description": "இந்தியாவில் உயர் தொழிற்கல்விக்கான (பொறியியல், மருத்துவம், சட்டம், மேலாண்மை) மானியக் கடன்."
                },
                "NSFDC_ELS_O": {
                    "title": "வெளிநாட்டுக் கல்விக் கடன் திட்டம்",
                    "description": "வெளிநாட்டுப் பல்கலைக்கழகங்களில் முதுகலை மற்றும் முனைவர் பட்டப் படிப்புகளுக்கான மானியக் கடன்."
                },
                "NSFDC_GBS": {
                    "title": "பசுமை வணிகத் திட்டம் (GBS)",
                    "description": "சுற்றுச்சூழல் நட்பு வணிக நடவடிக்கைகளுக்கான (பேட்டரி ரிக்ஷாக்கள், சூரிய ஆற்றல், கழிவு மேலாண்மை) நிதி உதவி."
                },
                "NSFDC_SWSS": {
                    "title": "துப்புரவுப் பணியாளர்கள் சிறப்புத் திட்டம்",
                    "description": "துப்புரவுப் பணியாளர்கள் மற்றும் துப்புரவுத் தொழிலாளர்களின் கண்ணியமான மாற்று வாழ்வாதாரத்திற்கான மானியக் கடன்."
                },
                "NSFDC_SKYS": {
                    "title": "சில்பி சம்ரித்தி யோஜனா (கைவினைஞர் திட்டம்)",
                    "description": "பாரம்பரிய பட்டியலின கைவினைஞர்கள், கைவினைப் பொருட்கள் மற்றும் கைத்தறி நெசவாளர்களுக்கான மானியக் கடன்."
                },
                "NSFDC_VBS": {
                    "title": "விற்பனை & நுண் வணிகத் திட்டம்",
                    "description": "நகர்ப்புற தெருவோர வியாபாரிகள் மற்றும் வாராந்திர சந்தை வியாபாரிகளுக்கான செயல்பாட்டு மூலதன நிதி."
                },
                "NSFDC_DAIRY": {
                    "title": "பால்பண்ணை & கால்நடை வளர்ப்புத் திட்டம்",
                    "description": "கறவை மாடுகள் வாங்குதல், கோழிப்பண்ணை, ஆடு வளர்ப்பு மற்றும் பால் குளிரூட்டும் கட்டமைப்புக்கான மானியக் கடன்."
                }
            }
        },
        "map": {
            "routerTitle": "அகில இந்திய சேனல் பார்ட்னர் வங்கி & SCA இடஞ்சார்ந்த ரூட்டர்",
            "routerSubtitle": "வரைபடக் குறிகள் மற்றும் விரிவான கிளையின் கடன் அளவீடுகளைக் காண ஏதேனும் ஒரு இந்திய மாநிலம் அல்லது யூனியன் பிரதேசத்தைத் தேர்ந்தெடுக்கவும்.",
            "selectState": "மாநிலத்தைத் தேர்ந்தெடுக்கவும்:",
            "allStates": "அனைத்து 28 மாநிலங்கள் & யூனியன் பிரதேசங்கள் (அகில இந்தியா)",
            "osmTitle": "ஊடாடும் ஓபன்ஸ்ட்ரீட்மேப் விஷுவலைசர்",
            "stateCode": "மாநில குறியீடு:",
            "updatingPins": "வரைபடக் குறிகள் புதுப்பிக்கப்படுகின்றன:",
            "loadingMap": "அகில இந்திய வரைபடம் ஏற்றப்படுகிறது...",
            "branchesInState": "தேர்ந்தெடுக்கப்பட்ட மாநிலத்திலுள்ள கிளைகள்",
            "branchDesks": "கிளை மேசைகள்",
            "rScore": "R_score மதிப்பீடு:",
            "npaRate": "கிளை NPA விகிதம்",
            "healthyNpa": "(நலமானது <15%)",
            "creditQuota": "கிடைக்கக்கூடிய கடன் ஒதுக்கீடு",
            "officer": "அதிகாரி:",
            "selectedAddress": "📍 தேர்ந்தெடுக்கப்பட்ட கிளையின் விரிவான முகவரி:",
            "physicalAddress": "கிளையின் முகவரி:",
            "selectedForDispatch": "அனுப்புவதற்குத் தேர்ந்தெடுக்கப்பட்ட கிளை ✓",
            "selectForDispatch": "அனுப்புவதற்கு கிளையைத் தேர்ந்தெடுக்கவும் →",
            "noBranches": "இந்த மாநிலக் குறியீட்டிற்கு செயலில் உள்ள கிளைகள் எதுவும் கிடைக்கவில்லை:",
            "noBranchesPrompt": "வேறு மாநிலத்தைத் தேர்ந்தெடுக்கவும் அல்லது 'அகில இந்தியா'வைத் தேர்ந்தெடுக்கவும்.",
            "legendTitle": "R_score குறியீட்டு விளக்கம்",
            "legendGreen": "பச்சை: சிறந்த வழி (R_score ≥ 0.70)",
            "legendYellow": "மஞ்சள்: மாற்று வழி (0.50 ≤ R_score < 0.70)",
            "legendRed": "சிவப்பு: அதிக NPA / குறைந்த ஒதுக்கீடு",
            "applicantLocation": "விண்ணப்பதாரர் இருப்பிடம்"
        }
    },
    "kn": {
        "schemes": {
            "badge": "ಶಾಸನಬದ್ಧ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ",
            "heading": "ಅಧಿಕೃತ NSFDC ರಿಯಾಯಿತಿ ಸಾಲ ಯೋಜನೆಗಳು ಮತ್ತು ನಿಯಮಗಳು",
            "subheading": "ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರದ ಶಾಸನಬದ್ಧ ಮಾರ್ಗಸೂಚಿಗಳ ಅಡಿಯಲ್ಲಿ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ.",
            "rulesTitle": "ಶಾಸನಬದ್ಧ ಅರ್ಹತಾ ನಿಯಮಗಳು ಮತ್ತು ಗೇಟ್ ಮಾನದಂಡಗಳು",
            "gate1Title": "1. ಆದಾಯ ಮಿತಿ ನಿಯಮ",
            "gate1Desc": "ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯವು ₹ 5,00,000.00 ಮೀರಬಾರದು. ಆದಾಯ ಪ್ರಮಾಣಪತ್ರದ ಮೂಲಕ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
            "gate2Title": "2. ಜಾತಿ ದೃಢೀಕರಣ",
            "gate2Desc": "ಪರಿಶಿಷ್ಟ ಜಾತಿ (SC) ಸಮುದಾಯಕ್ಕೆ ಸೇರಿರಬೇಕು. ಕಂದಾಯ ಇಲಾಖೆಯ OCR ಮೂಲಕ ದೃಢೀಕರಿಸಲಾಗಿದೆ.",
            "gate3Title": "3. ರಿಯಾಯಿತಿ ದರಗಳು",
            "gate3Desc": "ಮಹಿಳಾ ಫಲಾನುಭವಿಗಳಿಗೆ ಎಲ್ಲಾ ಯೋಜನೆಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ದೊರೆಯುತ್ತದೆ.",
            "matrixTitle": "NSFDC ಶಾಸನಬದ್ಧ ಯೋಜನೆಗಳ ಹೋಲಿಕೆ ಕೋಷ್ಟಕ",
            "catalogSize": "ಕ್ಯಾಟಲಾಗ್ ಗಾತ್ರ:",
            "activeSchemes": "ಸಕ್ರಿಯ ಯೋಜನೆಗಳು",
            "repositoryTitle": "ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ರಿಯಾಯಿತಿ ಸಾಲಗಳ ಭಂಡಾರ",
            "directoryTitle": "ಸಮಗ್ರ ಶಾಸನಬದ್ಧ ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ (330+ ಯೋಜನೆಗಳು)",
            "directoryDesc": "2026-27 ಆರ್ಥಿಕ ವರ್ಷಕ್ಕೆ 30 ರಾಜ್ಯಗಳು ಮತ್ತು ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ 10 ಪ್ರಮುಖ NSFDC ಯೋಜನೆಗಳು, 20 ಕೇಂದ್ರ ಅಪೆಕ್ಸ್ ನಿಗಮ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು 300 ರಾಜ್ಯ ಚಾನಲೈಸಿಂಗ್ ಏಜೆನ್ಸಿ (SCDC) ಸಬ್ಸಿಡಿ ಸಾಲಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
            "totalSchemes": "ಒಟ್ಟು ಯೋಜನೆಗಳು",
            "totalPrograms": "ಕಾರ್ಯಕ್ರಮಗಳು",
            "interestRates": "ಬಡ್ಡಿ ದರಗಳು",
            "interestRange": "ವಾರ್ಷಿಕ 4.0% - 7.5%",
            "maxLoanCap": "ಗರಿಷ್ಠ ಸಾಲದ ಮಿತಿ",
            "maxCapValue": "₹ 50.00 ಲಕ್ಷಗಳವರೆಗೆ",
            "govtShare": "ಸರ್ಕಾರದ ಪಾಲು",
            "govtFunding": "95% ವರೆಗೆ ಸರ್ಕಾರಿ ಧನಸಹಾಯ",
            "rulesAlertTitle": "ಶಾಸನಬದ್ಧ ಅರ್ಹತೆ ಮತ್ತು ಹಾರ್ಡ್ ಗೇಟ್ ನಿಯಮಗಳು (ಅಖಿಲ ಭಾರತ)",
            "rule1Title": "1. ಆದಾಯ ಮಿತಿ ನಿಯಮ",
            "rule1Desc": "ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯವು ≤ ₹ 5,00,000.00 ಇರಬೇಕು (API ಹಾರ್ಡ್ ಗೇಟ್ ಮೂಲಕ ಪರಿಶೀಲನೆ).",
            "rule2Title": "2. ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಪರಿಶೀಲನೆ ನಿಯಮ",
            "rule2Desc": "ಪರಿಶಿಷ್ಟ ಜಾತಿ (SC) ಅಥವಾ ಗುರಿ ಫಲಾನುಭವಿ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿರಬೇಕು (OCR ಮೂಲಕ ಪರಿಶೀಲನೆ).",
            "rule3Title": "3. ಮಹಿಳಾ ರಿಯಾಯಿತಿ ನಿಯಮ",
            "rule3Desc": "ಮಹಿಳಾ ಉದ್ಯಮಿಗಳಿಗೆ ವಿಶೇಷ 0.5% - 1.0% ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ಮತ್ತು 95% ವರೆಗೆ ಸರ್ಕಾರಿ ಧನಸಹಾಯ.",
            "searchPlaceholder": "ಕೀವರ್ಡ್, ವಲಯ ಅಥವಾ ಯೋಜನೆಯ ಹೆಸರಿನ ಮೂಲಕ 330+ ಯೋಜನೆಗಳಲ್ಲಿ ಹುಡುಕಿ...",
            "clear": "ತೆರವುಗೊಳಿಸಿ",
            "allIndia": "ಅಖಿಲ ಭಾರತ (ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ)",
            "categories": {
                "ALL": "ಎಲ್ಲಾ ಯೋಜನೆಗಳು",
                "MICRO": "ಮೈಕ್ರೋ ಕ್ರೆಡಿಟ್",
                "MICRO_WOMEN": "ಮಹಿಳಾ ವಿಶೇಷ",
                "TERM": "ಅವಧಿ ಸಾಲ (ಕ್ಯಾಪೆಕ್ಸ್)",
                "EDU_DOMESTIC": "ಉನ್ನತ ಶಿಕ್ಷಣ",
                "GREEN_ENERGY": "ಹಸಿರು ಮತ್ತು ಸೌರ",
                "SANITATION": "ನೈರ್ಮಲ್ಯ ಕಾರ್ಯ",
                "ARTISAN": "ಕುಶಲಕರ್ಮಿಗಳು ಮತ್ತು ಕಲೆ",
                "SMALL_BUSINESS": "ಸಣ್ಣ ವ್ಯಾಪಾರ",
                "AGRI_WOMEN": "ಕೃಷಿ ಮತ್ತು ಡೈರಿ"
            },
            "found": "ಕಂಡುಬಂದಿದೆ",
            "matchingSchemes": "ಹೊಂದಾಣಿಕೆಯಾಗುವ ಯೋಜನೆಗಳು",
            "inState": "ರಾಜ್ಯದಲ್ಲಿ:",
            "underCat": "ವಿಭಾಗದಲ್ಲಿ:",
            "page": "ಪುಟ",
            "of": "/",
            "noSchemesFound": "ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
            "noSchemesDesc": "ಹುಡುಕಾಟ ಪದವನ್ನು ಬದಲಾಯಿಸಿ, 'ಅಖಿಲ ಭಾರತ' ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ.",
            "resetFilters": "ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
            "state": "ರಾಜ್ಯ",
            "femaleRate": "ಮಹಿಳೆಯರ ಬಡ್ಡಿ ದರ",
            "maleRate": "ಪುರುಷರ ಬಡ್ಡಿ ದರ",
            "femaleOnly": "ಅನ್ವಯಿಸುವುದಿಲ್ಲ (ಮಹಿಳೆಯರಿಗೆ ಮಾತ್ರ)",
            "pa": "ವಾರ್ಷಿಕ",
            "moratorium": "ಮೊರಟೋರಿಯಂ",
            "tenure": "ಅವಧಿ",
            "mos": "ತಿಂಗಳುಗಳು",
            "yrs": "ವರ್ಷಗಳು",
            "applyUnderScheme": "ಯೋಜನೆಯಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
            "schemeDetails": "ಯೋಜನೆಯ ವಿವರಗಳು",
            "category": "ವರ್ಗ",
            "action": "ಕ್ರಮ",
            "apply": "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
            "previous": "ಹಿಂದಿನ",
            "next": "ಮುಂದಿನ",
            "backToPrevious": "ಹಿಂದಿನ ಹಂತಕ್ಕೆ ಹಿಂತಿರುಗಿ",
            "interest": "ಬಡ್ಡಿ",
            "govtFundingLabel": "ಸರ್ಕಾರಿ ಧನಸಹಾಯ",
            "maxProjectLimit": "ಗರಿಷ್ಠ ಯೋಜನಾ ವೆಚ್ಚ ಮಿತಿ",
            "items": {
                "NSFDC_MCF": {
                    "title": "ಮೈಕ್ರೋ ಕ್ರೆಡಿಟ್ ಫೈನಾನ್ಸ್ ಯೋಜನೆ (MCF)",
                    "description": "ಸಣ್ಣ ವ್ಯಾಪಾರಗಳು, ಮಾರಾಟಗಾರರು, ಕುಶಲಕರ್ಮಿಗಳು ಮತ್ತು ಗ್ರಾಮೀಣ ಸೂಕ್ಷ್ಮ ಉದ್ಯಮಗಳಿಗೆ ನೇರ ಮೈಕ್ರೋ-ಕ್ರೆಡಿಟ್ ಸಾಲಗಳು."
                },
                "NSFDC_MSY": {
                    "title": "ಮಹಿಳಾ ಸಮೃದ್ಧಿ ಯೋಜನೆ (MSY)",
                    "description": "ಗರಿಷ್ಠ ಸರ್ಕಾರದ ಪಾಲಿನೊಂದಿಗೆ ಪರಿಶಿಷ್ಟ ಜಾತಿಯ ಮಹಿಳಾ ಉದ್ಯಮಿಗಳಿಗೆ ವಿಶೇಷ ರಿಯಾಯಿತಿ ಸಾಲ."
                },
                "NSFDC_TL": {
                    "title": "ಅವಧಿ ಸಾಲ ಸಾಮಾನ್ಯ ಯೋಜನೆ (Term Loan)",
                    "description": "ವಾಣಿಜ್ಯ ಸಾರಿಗೆ, ಉತ್ಪಾದನೆ ಮತ್ತು ಕೃಷಿ-ಸಂಸ್ಕರಣಾ ಘಟಕಗಳಿಗೆ ಬಂಡವಾಳ ವೆಚ್ಚದ ಹಣಕಾಸು."
                },
                "NSFDC_ELS_D": {
                    "title": "ಶಿಕ್ಷಣ ಸಾಲ ಯೋಜನೆ (ದೇಶೀಯ)",
                    "description": "ಭಾರತದಲ್ಲಿ ಉನ್ನತ ವೃತ್ತಿಪರ ಶಿಕ್ಷಣಕ್ಕೆ (ಎಂಜಿನಿಯರಿಂಗ್, ವೈದ್ಯಕೀಯ, ಕಾನೂನು, ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್) ರಿಯಾಯಿತಿ ಸಾಲ."
                },
                "NSFDC_ELS_O": {
                    "title": "ವಿದೇಶಿ ಶಿಕ್ಷಣ ಸಾಲ ಯೋಜನೆ",
                    "description": "ವಿದೇಶಿ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳಲ್ಲಿ ಸ್ನಾತಕೋತ್ತರ ಮತ್ತು ಡಾಕ್ಟರೇಟ್ ಅಧ್ಯಯನಗಳಿಗೆ ರಿಯಾಯಿತಿ ಸಾಲ."
                },
                "NSFDC_GBS": {
                    "title": "ಹಸಿರು ವ್ಯಾಪಾರ ಯೋಜನೆ (GBS)",
                    "description": "ಪರಿಸರ ಸ್ನೇಹಿ ವ್ಯಾಪಾರ ಚಟುವಟಿಕೆಗಳಿಗೆ (ಬ್ಯಾಟರಿ ರಿಕ್ಷಾ, ಸೌರ ಶಕ್ತಿ, ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ) ಆರ್ಥಿಕ ನೆರವು."
                },
                "NSFDC_SWSS": {
                    "title": "ನೈರ್ಮಲ್ಯ ಕಾರ್ಮಿಕರ ವಿಶೇಷ ಯೋಜನೆ",
                    "description": "ನೈರ್ಮಲ್ಯ ಕಾರ್ಮಿಕರು ಮತ್ತು ಮ್ಯಾನುಯಲ್ ಸ್ಕ್ಯಾವೆಂಜರ್‌ಗಳ ಘನತೆಯ ಪರ್ಯಾಯ ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ರಿಯಾಯಿತಿ ಸಾಲ."
                },
                "NSFDC_SKYS": {
                    "title": "ಶಿಲ್ಪಿ ಸಮೃದ್ಧಿ ಯೋಜನೆ (ಕುಶಲಕರ್ಮಿಗಳ ಯೋಜನೆ)",
                    "description": "ಸಾಂಪ್ರದಾಯಿಕ ಪರಿಶಿಷ್ಟ ಜಾತಿಯ ಕುಶಲಕರ್ಮಿಗಳು, ಕರಕುಶಲ ಮತ್ತು ಕೈಮಗ್ಗ ನೇಕಾರರಿಗೆ ಸಬ್ಸಿಡಿ ಅವಧಿ ಸಾಲ."
                },
                "NSFDC_VBS": {
                    "title": "ಮಾರಾಟ ಮತ್ತು ಸೂಕ್ಷ್ಮ ವ್ಯಾಪಾರ ಯೋಜನೆ",
                    "description": "ನಗರ ಬೀದಿಬದಿ ವ್ಯಾಪಾರಿಗಳು, ಫೆರಿವಾಲಾಗಳು ಮತ್ತು ಸಾಪ್ತಾಹಿಕ ಮಾರುಕಟ್ಟೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ ದುಡಿಯುವ ಬಂಡವಾಳ ಹಣಕಾಸು."
                },
                "NSFDC_DAIRY": {
                    "title": "ಡೈರಿ ಮತ್ತು ಪಶುಸಂಗೋಪನೆ ಯೋಜನೆ",
                    "description": "ಹಾಲು ನೀಡುವ ಜಾನುವಾರುಗಳ ಖರೀದಿ, ಕೋಳಿ ಸಾಕಣೆ, ಕುರಿ ಸಾಕಣೆ ಮತ್ತು ಹಾಲು ಶೈತ್ಯೀಕರಣ ಮೂಲಸೌಕರ್ಯಕ್ಕೆ ರಿಯಾಯಿತಿ ಸಾಲ."
                }
            }
        },
        "map": {
            "routerTitle": "ಅಖಿಲ ಭಾರತ ಚಾನಲ್ ಪಾಲುದಾರ ಬ್ಯಾಂಕ್ ಮತ್ತು SCA ಸ್ಪೇಷಿಯಲ್ ರೂಟರ್",
            "routerSubtitle": "ನಕ್ಷೆಯ ಪಿನ್‌ಗಳು ಮತ್ತು ವಿವರವಾದ ಶಾಖೆಯ ಕ್ರೆಡಿಟ್ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಯಾವುದೇ ಭಾರತೀಯ ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
            "selectState": "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
            "allStates": "ಎಲ್ಲಾ 28 ರಾಜ್ಯಗಳು ಮತ್ತು ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶಗಳು (ಅಖಿಲ ಭಾರತ)",
            "osmTitle": "ಇಂಟರಾಕ್ಟಿವ್ ಓಪನ್‌ಸ್ಟ್ರೀಟ್‌ಮ್ಯಾಪ್ ವೀಕ್ಷಕ",
            "stateCode": "ರಾಜ್ಯ ಕೋಡ್:",
            "updatingPins": "ನಕ್ಷೆಯ ಪಿನ್‌ಗಳನ್ನು ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ:",
            "loadingMap": "ಅಖಿಲ ಭಾರತ ನಕ್ಷೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
            "branchesInState": "ಆಯ್ಕೆಮಾಡಿದ ರಾಜ್ಯದಲ್ಲಿನ ಶಾಖೆಗಳು",
            "branchDesks": "ಶಾಖಾ ಡೆಸ್ಕ್‌ಗಳು",
            "rScore": "R_score ಸೂಚ್ಯಂಕ:",
            "npaRate": "ಶಾಖೆಯ NPA ದರ",
            "healthyNpa": "(ಉತ್ತಮ <15%)",
            "creditQuota": "ಲಭ್ಯವಿರುವ ಕ್ರೆಡಿಟ್ ಕೋಟಾ",
            "officer": "ಅಧಿಕಾರಿ:",
            "selectedAddress": "📍 ಆಯ್ಕೆಮಾಡಿದ ಶಾಖೆಯ ವಿವರವಾದ ವಿಳಾಸ:",
            "physicalAddress": "ಶಾಖೆಯ ವಿಳಾಸ:",
            "selectedForDispatch": "ರವಾನೆಗಾಗಿ ಆಯ್ಕೆಮಾಡಿದ ಶಾಖೆ ✓",
            "selectForDispatch": "ರವಾನೆಗಾಗಿ ಶಾಖೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ →",
            "noBranches": "ಈ ರಾಜ್ಯ ಕೋಡ್‌ಗೆ ಯಾವುದೇ ಸಕ್ರಿಯ ಶಾಖೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ:",
            "noBranchesPrompt": "ಬೇರೆ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ 'ಅಖಿಲ ಭಾರತ' ಆಯ್ಕೆಮಾಡಿ.",
            "legendTitle": "R_score ಪಿನ್ ವಿವರಣೆ",
            "legendGreen": "ಹಸಿರು: ಅತ್ಯುತ್ತಮ ಮಾರ್ಗ (R_score ≥ 0.70)",
            "legendYellow": "ಹಳದಿ: ಪರ್ಯಾಯ ಮಾರ್ಗ (0.50 ≤ R_score < 0.70)",
            "legendRed": "ಕೆಂಪು: ಅಧಿಕ NPA / ಕಡಿಮೆ ಕೋಟಾ",
            "applicantLocation": "ಅರ್ಜಿದಾರರ ಕೇಂದ್ರ ಸ್ಥಳ"
        }
    },
    "mr": {
        "schemes": {
            "badge": "वैधानिक मार्गदर्शक तत्त्वे आणि योजना निर्देशिका",
            "heading": "अधिकृत NSFDC सवलत कर्ज योजना आणि नियम",
            "subheading": "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय, भारत सरकारच्या वैधानिक मार्गदर्शक तत्त्वांद्वारे संचलित.",
            "rulesTitle": "वैधानिक पात्रता नियम आणि हार्ड गेट निकष",
            "gate1Title": "1. उत्पन्न मर्यादा नियम",
            "gate1Desc": "कौटुंबिक वार्षिक उत्पन्न ₹ 5,00,000.00 पेक्षा जास्त नसावे. उत्पन्न प्रमाणपत्राद्वारे सत्यापित.",
            "gate2Title": "2. जात सत्यता",
            "gate2Desc": "अनुसूचित जाती (SC) प्रवर्गातील असावे. महसूल विभाग OCR द्वारे प्रमाणित.",
            "gate3Title": "3. सवलतीचे दर",
            "gate3Desc": "महिला लाभार्थ्यांना सर्व योजनांमध्ये अतिरिक्त व्याज सवलत मिळते.",
            "matrixTitle": "NSFDC वैधानिक योजना तुलना तक्ता",
            "catalogSize": "कॅटलॉग आकार:",
            "activeSchemes": "सक्रिय योजना",
            "repositoryTitle": "राष्ट्रीय आणि राज्य सवलत कर्ज भांडार",
            "directoryTitle": "सर्वसमावेशक वैधानिक योजना निर्देशिका (330+ योजना)",
            "directoryDesc": "आर्थिक वर्ष 2026-27 साठी 30 राज्ये आणि केंद्रशासित प्रदेशांमध्ये 10 मुख्य NSFDC योजना, 20 केंद्रीय अपेक्स महामंडळ कार्यक्रम आणि 300 राज्य चॅनेलाइजिंग एजन्सी (SCDC) अनुदानित कर्ज योजना एक्सप्लोर करा.",
            "totalSchemes": "एकूण योजना",
            "totalPrograms": "कार्यक्रम",
            "interestRates": "व्याजदर",
            "interestRange": "वार्षिक 4.0% - 7.5%",
            "maxLoanCap": "कमाल कर्ज मर्यादा",
            "maxCapValue": "₹ 50.00 लाखांपर्यंत",
            "govtShare": "शासकीय हिस्सा",
            "govtFunding": "95% पर्यंत शासकीय निधी",
            "rulesAlertTitle": "वैधानिक पात्रता आणि हार्ड गेट प्रोटोकॉल (अखिल भारतीय पातळीवर लागू)",
            "rule1Title": "1. उत्पन्न मर्यादा नियम",
            "rule1Desc": "कौटुंबिक वार्षिक उत्पन्न ≤ ₹ 5,00,000.00 असावे (API हार्ड गेटद्वारे अनिवार्य तपासणी).",
            "rule2Title": "2. जात पडताळणी नियम",
            "rule2Desc": "अनुसूचित जाती (SC) किंवा लक्ष्यित लाभार्थी प्रवर्गातील असावे (OCR द्वारे पडताळणी).",
            "rule3Title": "3. महिला सवलत नियम",
            "rule3Desc": "महिला उद्योजकांसाठी विशेष 0.5% - 1.0% व्याज सवलत आणि 95% पर्यंत शासकीय अर्थसहाय्य.",
            "searchPlaceholder": "कीवर्ड, क्षेत्र किंवा योजनेच्या नावाने 330+ योजनांमध्ये शोधा...",
            "clear": "साफ करा",
            "allIndia": "अखिल भारतीय (राष्ट्रीय आणि राज्य)",
            "categories": {
                "ALL": "सर्व योजना",
                "MICRO": "मायक्रो क्रेडिट",
                "MICRO_WOMEN": "महिला विशेष",
                "TERM": "मुदत कर्ज (कॅपिटल)",
                "EDU_DOMESTIC": "उच्च शिक्षण",
                "GREEN_ENERGY": "हरित आणि सौर ऊर्जा",
                "SANITATION": "स्वच्छता कार्य",
                "ARTISAN": "कारीगर आणि हस्तकला",
                "SMALL_BUSINESS": "लघु व्यवसाय",
                "AGRI_WOMEN": "कृषी आणि दुग्ध व्यवसाय"
            },
            "found": "एकूण",
            "matchingSchemes": "योजना आढळल्या",
            "inState": "राज्यात:",
            "underCat": "प्रवर्गात:",
            "page": "पृष्ठ",
            "of": "पैकी",
            "noSchemesFound": "कोणतीही योजना आढळली नाही",
            "noSchemesDesc": "तुमचा शोध बदला, 'अखिल भारतीय' निवडा किंवा श्रेणी फिल्टर रीसेट करा.",
            "resetFilters": "सर्व फिल्टर रीसेट करा",
            "state": "राज्य",
            "femaleRate": "महिला व्याजदर",
            "maleRate": "पुरुष व्याजदर",
            "femaleOnly": "लागू नाही (केवळ महिला)",
            "pa": "वार्षिक",
            "moratorium": "मोरेटोरियम",
            "tenure": "कर्ज कालावधी",
            "mos": "महिने",
            "yrs": "वर्षे",
            "applyUnderScheme": "योजनेअंतर्गत अर्ज करा",
            "schemeDetails": "योजना तपशील",
            "category": "प्रवर्ग",
            "action": "कृती",
            "apply": "अर्ज करा",
            "previous": "मागील",
            "next": "पुढील",
            "backToPrevious": "मागील पायरीवर जा",
            "interest": "व्याज",
            "govtFundingLabel": "शासकीय निधी",
            "maxProjectLimit": "कमाल प्रकल्प मर्यादा",
            "items": {
                "NSFDC_MCF": {
                    "title": "मायक्रो क्रेडिट वित्त योजना (MCF)",
                    "description": "लहान व्यवसाय, फेरीवाले, कारागीर आणि ग्रामीण सूक्ष्म उपक्रमांसाठी थेट मायक्रो-क्रेडिट कर्ज."
                },
                "NSFDC_MSY": {
                    "title": "महिला समृद्धी योजना (MSY)",
                    "description": "कमाल शासकीय हिश्श्यासह अनुसूचित जातीच्या महिला उद्योजकांसाठी विशेष सवलतीचे कर्ज."
                },
                "NSFDC_TL": {
                    "title": "मुदत कर्ज सामान्य योजना (Term Loan)",
                    "description": "व्यावसायिक वाहतूक, उत्पादन आणि कृषी-प्रक्रिया युनिट्ससाठी भांडवली खर्च वित्तपुरवठा."
                },
                "NSFDC_ELS_D": {
                    "title": "शैक्षणिक कर्ज योजना (देशांतर्गत)",
                    "description": "भारतातील उच्च व्यावसायिक शिक्षणासाठी (अभियांत्रिकी, वैद्यकीय, विधी, व्यवस्थापन) सवलतीचे कर्ज."
                },
                "NSFDC_ELS_O": {
                    "title": "परदेशी शैक्षणिक कर्ज योजना",
                    "description": "परदेशी विद्यापीठांमध्ये पदव्युत्तर आणि डॉक्टरेट अभ्यासासाठी सवलतीचे कर्ज."
                },
                "NSFDC_GBS": {
                    "title": "हरित व्यवसाय योजना (GBS)",
                    "description": "पर्यावरणपूरक व्यवसाय उपक्रमांसाठी (ई-रिक्षा, सौर ऊर्जा, कचरा व्यवस्थापन) आर्थिक सहाय्य."
                },
                "NSFDC_SWSS": {
                    "title": "स्वच्छता कामगार विशेष योजना",
                    "description": "स्वच्छता कामगार आणि मुक्ती मिळालेल्या सफाई कामगारांच्या सन्माननीय उपजीविकेसाठी सवलतीचे कर्ज."
                },
                "NSFDC_SKYS": {
                    "title": "शिल्पी समृद्धी योजना (कारागीर योजना)",
                    "description": "पारंपारिक अनुसूचित जातीचे कारागीर, हस्तकला आणि हातमाग विणकरांसाठी अनुदानित मुदत कर्ज सहाय्य."
                },
                "NSFDC_VBS": {
                    "title": "विक्रेते व सूक्ष्म व्यवसाय योजना",
                    "description": "शहरी फेरीवाले, छोटे विक्रेते आणि आठवडे बाजार व्यापाऱ्यांसाठी खेळते भांडवल वित्तपुरवठा."
                },
                "NSFDC_DAIRY": {
                    "title": "दुग्ध व पशुसंवर्धन योजना",
                    "description": "दुभती जनावरे खरेदी, कुक्कुटपालन, शेळीपालन आणि दूध शीतकरण पायाभूत सुविधांसाठी सवलतीचे कर्ज."
                }
            }
        },
        "map": {
            "routerTitle": "अखिल भारतीय चॅनेल भागीदार बँक आणि SCA स्थानिक राउटर",
            "routerSubtitle": "परस्परसंवादी नकाशा पिन आणि तपशीलवार शाखा क्रेडिट मेट्रिक्स पाहण्यासाठी कोणतेही भारतीय राज्य किंवा केंद्रशासित प्रदेश निवडा.",
            "selectState": "राज्य निवडा:",
            "allStates": "सर्व 28 राज्ये आणि केंद्रशासित प्रदेश (अखिल भारत)",
            "osmTitle": "इंटरअॅक्टिव्ह ओपनस्ट्रीटमॅप व्हिज्युअलायझर",
            "stateCode": "राज्य कोड:",
            "updatingPins": "नकाशा पिन अपडेट होत आहेत:",
            "loadingMap": "अखिल भारतीय नकाशा लोड होत आहे...",
            "branchesInState": "निवडलेल्या राज्यातील शाखा",
            "branchDesks": "शाखा डेस्क",
            "rScore": "R_score निर्देशांक:",
            "npaRate": "शाखा NPA दर",
            "healthyNpa": "(चांगला <15%)",
            "creditQuota": "उपलब्ध क्रेडिट कोटा",
            "officer": "अधिकारी:",
            "selectedAddress": "📍 निवडलेल्या शाखेचा तपशीलवार पत्ता:",
            "physicalAddress": "शाखेचा पत्ता:",
            "selectedForDispatch": "पाठवण्यासाठी निवडलेली शाखा ✓"
        }
    },
    "bn": {
        "schemes": {
            "badge": "সংবিধিবদ্ধ নির্দেশিকা ও প্রকল্প ডিরেক্টরি",
            "heading": "অফিসিয়াল NSFDC রেয়াতি ঋণ প্রকল্প ও নিয়মাবলী",
            "subheading": "সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক, ভারত সরকারের সংবিধিবদ্ধ নির্দেশিকা দ্বারা পরিচালিত।",
            "rulesTitle": "সংবিধিবদ্ধ যোগ্যতার নিয়ম ও প্রবেশদ্বার মানদণ্ড",
            "gate1Title": "১. আয় সীমা নিয়ম",
            "gate1Desc": "পারিবারিক বার্ষিক আয় ₹ ৫,০০,০০০.০০ এর বেশি হওয়া যাবে না। আয় শংসাপত্রের মাধ্যমে যাচাইকৃত।",
            "gate2Title": "২. জাতি সত্যতা",
            "gate2Desc": "তপশিলি জাতি (SC) সম্প্রদায়ের অন্তর্ভুক্ত হতে হবে। রাজস্ব বিভাগ OCR দ্বারা প্রমাণিত।",
            "gate3Title": "৩. রেয়াতি হার",
            "gate3Desc": "মহিলা সুবিধাভোগীরা সমস্ত প্রকল্পে অতিরিক্ত সুদের রেয়াত পান।",
            "matrixTitle": "NSFDC সংবিধিবদ্ধ প্রকল্প তুলনা সারণী",
            "catalogSize": "ক্যাটালগ আকার:",
            "activeSchemes": "সক্রিয় প্রকল্প",
            "repositoryTitle": "জাতীয় ও রাজ্য রেয়াতি ঋণ ভান্ডার",
            "directoryTitle": "বিস্তৃত সংবিধিবদ্ধ প্রকল্প নির্দেশিকা (৩৩০+ প্রকল্প)",
            "directoryDesc": "২০২৬-২৭ অর্থবর্ষের জন্য ৩০টি রাজ্য ও কেন্দ্রশাসিত অঞ্চলে ১০টি প্রধান NSFDC প্রকল্প, ২০টি কেন্দ্রীয় শীর্ষ সংস্থা কর্মসূচি এবং ৩০০টি রাজ্য চ্যানেল সংস্থা (SCDC) ভর্তুকিযুক্ত ঋণ অন্বেষণ করুন।",
            "totalSchemes": "মোট প্রকল্প",
            "totalPrograms": "কর্মসূচি",
            "interestRates": "সুদের হার",
            "interestRange": "বার্ষিক ৪.০% - ৭.৫%",
            "maxLoanCap": "সর্বোচ্চ ঋণ সীমা",
            "maxCapValue": "সর্বোচ্চ ₹ ৫০.০০ লক্ষ পর্যন্ত",
            "govtShare": "সরকারি অংশ",
            "govtFunding": "৯৫% পর্যন্ত সরকারি অর্থায়ন",
            "rulesAlertTitle": "সংবিধিবদ্ধ যোগ্যতা ও কঠোর মানদণ্ড প্রোটোকল (সর্বভারতীয়)",
            "rule1Title": "১. আয় সীমা নিয়ম",
            "rule1Desc": "পারিবারিক বার্ষিক আয় ≤ ₹ ৫,০০,০০০.০০ হতে হবে (API দ্বারা যাচাইকৃত)।",
            "rule2Title": "২. জাতি শংসাপত্র যাচাই নিয়ম",
            "rule2Desc": "তপশিলি জাতি (SC) বা নির্দিষ্ট সুবিধাভোগী সম্প্রদায়ের হতে হবে (OCR দ্বারা যাচাইকৃত)।",
            "rule3Title": "৩. মহিলা রেয়াত নিয়ম",
            "rule3Desc": "মহিলা উদ্যোক্তাদের জন্য বিশেষ ০.৫% - ১.০% সুদের ছাড় এবং ৯৫% পর্যন্ত সরকারি তহবিল।",
            "searchPlaceholder": "কীওয়ার্ড, ক্ষেত্র বা প্রকল্পের নাম দিয়ে ৩৩০+ প্রকল্পে অনুসন্ধান করুন...",
            "clear": "মুছুন",
            "allIndia": "সমগ্র ভারত (জাতীয় ও রাজ্য)",
            "categories": {
                "ALL": "সকল প্রকল্প",
                "MICRO": "মাইক্রো ক্রেডিট",
                "MICRO_WOMEN": "মহিলা বিশেষ",
                "TERM": "মেয়াদি ঋণ (ক্যাপেক্স)",
                "EDU_DOMESTIC": "উচ্চ শিক্ষা",
                "GREEN_ENERGY": "সবুজ ও সৌর শক্তি",
                "SANITATION": "পরিচ্ছন্নতা কাজ",
                "ARTISAN": "কারিগর ও হস্তশিল্প",
                "SMALL_BUSINESS": "ক্ষুদ্র ব্যবসা",
                "AGRI_WOMEN": "কৃষি ও দুগ্ধ খামার"
            },
            "found": "পাওয়া গেছে",
            "matchingSchemes": "টি প্রকল্প",
            "inState": "রাজ্যে:",
            "underCat": "বিভাগে:",
            "page": "পৃষ্ঠা",
            "of": "/",
            "noSchemesFound": "কোনো প্রকল্প পাওয়া যায়নি",
            "noSchemesDesc": "আপনার অনুসন্ধান পরিবর্তন করুন, 'সমগ্র ভারত' নির্বাচন করুন অথবা ফিল্টার রিসেট করুন।",
            "resetFilters": "সমস্ত ফিল্টার রিসেট করুন",
            "state": "রাজ্য",
            "femaleRate": "মহিলা সুদের হার",
            "maleRate": "পুরুষ সুদের হার",
            "femaleOnly": "প্রযোজ্য নয় (কেবলমাত্র মহিলা)",
            "pa": "বার্ষিক",
            "moratorium": "মোরেটোরিয়াম",
            "tenure": "মেয়াদ",
            "mos": "মাস",
            "yrs": "বছর",
            "applyUnderScheme": "প্রকল্পের অধীনে আবেদন করুন",
            "schemeDetails": "প্রকল্পের বিবরণ",
            "category": "বিভাগ",
            "action": "পদক্ষেপ",
            "apply": "আবেদন করুন",
            "previous": "পূর্ববর্তী",
            "next": "পরবর্তী",
            "backToPrevious": "পূর্ববর্তী ধাপে ফিরে যান",
            "interest": "সুদ",
            "govtFundingLabel": "সরকারি অর্থায়ন",
            "maxProjectLimit": "সর্বোচ্চ প্রকল্প সীমা",
            "items": {
                "NSFDC_MCF": {
                    "title": "মাইক্রো ক্রেডিট অর্থায়ন প্রকল্প (MCF)",
                    "description": "ক্ষুদ্র ব্যবসা, হকার, কারিগর এবং গ্রামীণ ক্ষুদ্র উদ্যোগের জন্য প্রত্যক্ষ মাইক্রো-ক্রেডিট ঋণ।"
                },
                "NSFDC_MSY": {
                    "title": "মহিলা সমৃদ্ধি যোজনা (MSY)",
                    "description": "সর্বোচ্চ সরকারি অংশীদারিত্ব সহ তপশিলি জাতির মহিলা উদ্যোক্তাদের জন্য বিশেষ রেয়াতি ঋণ।"
                },
                "NSFDC_TL": {
                    "title": "মেয়াদি ঋণ সাধারণ প্রকল্প (Term Loan)",
                    "description": "বাণিজ্যিক পরিবহন, উৎপাদন এবং কৃষি প্রক্রিয়াকরণ ইউনিটের জন্য মূলধনী ব্যয় অর্থায়ন।"
                },
                "NSFDC_ELS_D": {
                    "title": "শিক্ষা ঋণ প্রকল্প (দেশীয়)",
                    "description": "ভারতে উচ্চ পেশাগত শিক্ষার (ইঞ্জিনিয়ারিং, মেডিকেল, আইন, ম্যানেজমেন্ট) জন্য রেয়াতি ঋণ।"
                },
                "NSFDC_ELS_O": {
                    "title": "বিদেশি শিক্ষা ঋণ প্রকল্প",
                    "description": "বিদেশি বিশ্ববিদ্যালয়ে স্নাতকোত্তর ও ডক্টরেট অধ্যয়নের জন্য রেয়াতি ঋণ।"
                },
                "NSFDC_GBS": {
                    "title": "সবুজ ব্যবসা প্রকল্প (GBS)",
                    "description": "পরিবেশ-বান্ধব ব্যবসায়িক কার্যক্রমের (ব্যাটারি রিকশা, সৌর শক্তি, বর্জ্য ব্যবস্থাপনা) জন্য আর্থিক সহায়তা।"
                },
                "NSFDC_SWSS": {
                    "title": "পরিচ্ছন্নতা কর্মীদের বিশেষ প্রকল্প",
                    "description": "পরিচ্ছন্নতা কর্মী ও সাফাই কর্মচারীদের মর্যাদাপূর্ণ বিকল্প জীবিকার জন্য রেয়াতি ঋণ।"
                },
                "NSFDC_SKYS": {
                    "title": "শিল্পী সমৃদ্ধি যোজনা (কারিগর প্রকল্প)",
                    "description": "ঐতিহ্যবাহী তপশিলি জাতির কারিগর, হস্তশিল্প এবং তাঁতিদের জন্য ভর্তুকিযুক্ত মেয়াদি ঋণ সহায়তা।"
                },
                "NSFDC_VBS": {
                    "title": "ভেন্ডিং ও ক্ষুদ্র ব্যবসা প্রকল্প",
                    "description": "শহুরে হকার, ফেরিওয়ালা এবং সাপ্তাহিক বাজারের ব্যবসায়ীদের জন্য কার্যকরী মূলধন অর্থায়ন।"
                },
                "NSFDC_DAIRY": {
                    "title": "দুগ্ধ ও পশুপালন প্রকল্প",
                    "description": "দুগ্ধবতী পশু ক্রয়, হাঁস-মুরগি পালন, ছাগল পালন এবং দুধ শীতলীকরণ পরিকাঠামোর জন্য রেয়াতি ঋণ।"
                }
            }
        },
        "map": {
            "routerTitle": "সর্বভারতীয় চ্যানেল অংশীদার ব্যাংক ও SCA স্থানিক রাউটার",
            "routerSubtitle": "ইন্টারেক্টিভ মানচিত্র পিন এবং বিশদ শাখা ক্রেডিট মেট্রিক্স দেখতে যেকোনো ভারতীয় রাজ্য বা কেন্দ্রশাসিত অঞ্চল নির্বাচন করুন।",
            "selectState": "রাজ্য নির্বাচন করুন:",
            "allStates": "সমস্ত ২৮টি রাজ্য ও কেন্দ্রশাসিত অঞ্চল (সমগ্র ভারত)",
            "osmTitle": "ইন্টারেক্টিভ ওপেনস্ট্রিটম্যাপ ভিজ্যুয়ালাইজার",
            "stateCode": "রাজ্য কোড:",
            "updatingPins": "মানচিত্রের পিন আপডেট করা হচ্ছে:",
            "loadingMap": "সর্বভারতীয় ইন্টারেক্টিভ মানচিত্র লোড হচ্ছে...",
            "branchesInState": "নির্বাচিত রাজ্যের শাখাসমূহ",
            "branchDesks": "শাখা ডেস্ক",
            "rScore": "R_score সূচক:",
            "npaRate": "শাখা NPA হার",
            "healthyNpa": "(ভালো <১৫%)",
            "creditQuota": "উপলব্ধ ক্রেডিট কোটা",
            "officer": "কর্মকর্তা:",
            "selectedAddress": "📍 নির্বাচিত শাখার বিস্তারিত ঠিকানা:",
            "physicalAddress": "শাখার ঠিকানা:",
            "selectedForDispatch": "পাঠানোর জন্য নির্বাচিত শাখা ✓",
            "selectForDispatch": "পাঠানোর জন্য শাখা নির্বাচন করুন →",
            "noBranches": "এই রাজ্য কোডের জন্য কোনো সক্রিয় শাখা পাওয়া যায়নি:",
            "noBranchesPrompt": "অন্য রাজ্য বা 'সমগ্র ভারত' নির্বাচন করুন。",
            "legendTitle": "R_score পিন সূচক",
            "legendGreen": "সবুজ: সেরা পথ (R_score ≥ ০.৭০)",
            "legendYellow": "হলুদ: বিকল্প পথ (০.৫০ ≤ R_score < ০.৭০)",
            "legendRed": "লাল: উচ্চ NPA / কম কোটা",
            "applicantLocation": "আবেদনকারীর অবস্থান"
        }
    },
    "gu": {
        "schemes": {
            "badge": "વૈધાનિક માર્ગદર્શિકા અને યોજના ડિરેક્ટરી",
            "heading": "સત્તાવાર NSFDC રાહત દરે લોન યોજનાઓ અને નિયમો",
            "subheading": "સામાજિક ન્યાય અને અધિકારીતા મંત્રાલય, ભારત સરકારની વૈધાનિક માર્ગદર્શિકા હેઠળ સંચાલિત.",
            "rulesTitle": "વૈધાનિક પાત્રતા નિયમો અને હાર્ડ ગેટ માપદંડ",
            "gate1Title": "1. આવક મર્યાદા નિયમ",
            "gate1Desc": "કૌટુંબિક વાર્ષિક આવક ₹ 5,00,000.00 થી વધુ ન હોવી જોઈએ. આવકના દાખલા દ્વારા ચકાસાયેલ.",
            "gate2Title": "2. જાતિ અધિકૃતતા",
            "gate2Desc": "અનુસૂચિત જાતિ (SC) સમુદાયના હોવા જોઈએ. મહેસૂલ વિભાગ OCR દ્વારા પ્રમાણિત.",
            "gate3Title": "3. રાહત દરો",
            "gate3Desc": "મહિલા લાભાર્થીઓને તમામ યોજનાઓમાં વધારાની વ્યાજ રાહત મળે છે.",
            "matrixTitle": "NSFDC વૈધાનિક યોજના સરખામણી કોષ્ટક",
            "catalogSize": "કેટલોગ કદ:",
            "activeSchemes": "સક્રિય યોજનાઓ",
            "repositoryTitle": "રાષ્ટ્રીય અને રાજ્ય રાહત દરે ધિરાણ ભંડાર",
            "directoryTitle": "સર્વગ્રાહી વૈધાનિક યોજના ડિરેક્ટરી (330+ યોજનાઓ)",
            "directoryDesc": "નાણાકીય વર્ષ 2026-27 માટે 30 રાજ્યો અને કેન્દ્રશાસિત પ્રદેશોમાં 10 મુખ્ય NSFDC યોજનાઓ, 20 કેન્દ્રીય એપેક્સ કોર્પોરેશન કાર્યક્રમો અને 300 રાજ્ય ચેનલાઈઝિંગ એજન્સી (SCDC) સબસિડીવાળી લોન અન્વેષણ કરો.",
            "totalSchemes": "કુલ યોજનાઓ",
            "totalPrograms": "કાર્યક્રમો",
            "interestRates": "વ્યાજ દરો",
            "interestRange": "વાર્ષિક 4.0% - 7.5%",
            "maxLoanCap": "મહત્તમ લોન મર્યાદા",
            "maxCapValue": "₹ 50.00 લાખ સુધી",
            "govtShare": "સરકારી હિસ્સો",
            "govtFunding": "95% સુધી સરકારી સહાય",
            "rulesAlertTitle": "વૈધાનિક પાત્રતા અને હાર્ડ ગેટ પ્રોટોકોલ (અખિલ ભારત સ્તરે)",
            "rule1Title": "1. આવક મર્યાદા નિયમ",
            "rule1Desc": "કૌટુંબિક વાર્ષિક આવક ≤ ₹ 5,00,000.00 હોવી જોઈએ (API હાર્ડ ગેટ દ્વારા ચકાસણી).",
            "rule2Title": "2. જાતિ પ્રમાણપત્ર ચકાસણી નિયમ",
            "rule2Desc": "અનુસૂચિત જાતિ (SC) અથવા લક્ષિત લાભાર્થી સમુદાયના હોવા જોઈએ (OCR દ્વારા ચકાસણી).",
            "rule3Title": "3. મહિલા રાહત નિયમ",
            "rule3Desc": "મહિલા ઉદ્યોગસાહસિકો માટે વિશેષ 0.5% - 1.0% વ્યાજ રાહત અને 95% સુધી સરકારી ધિરાણ.",
            "searchPlaceholder": "કીવર્ડ, ક્ષેત્ર અથવા યોજનાના નામ દ્વારા 330+ યોજનાઓમાં શોધો...",
            "clear": "સાફ કરો",
            "allIndia": "સમગ્ર ભારત (રાષ્ટ્રીય અને રાજ્ય)",
            "categories": {
                "ALL": "બધી યોજનાઓ",
                "MICRO": "માઇક્રો ક્રેડિટ",
                "MICRO_WOMEN": "મહિલા વિશેષ",
                "TERM": "મુદત લોન (કેપેક્સ)",
                "EDU_DOMESTIC": "ઉચ્ચ શિક્ષણ",
                "GREEN_ENERGY": "ગ્રીન અને સોલર",
                "SANITATION": "સ્વચ્છતા કાર્ય",
                "ARTISAN": "કારીગરો અને હસ્તકલા",
                "SMALL_BUSINESS": "નાનો વ્યવસાય",
                "AGRI_WOMEN": "કૃષિ અને ડેરી"
            },
            "found": "મળેલ",
            "matchingSchemes": "યોજનાઓ",
            "inState": "રાજ્યમાં:",
            "underCat": "શ્રેણીમાં:",
            "page": "પૃષ્ઠ",
            "of": "માંથી",
            "noSchemesFound": "કોઈ યોજના મળી નથી",
            "noSchemesDesc": "તમારી શોધ બદલો, 'સમગ્ર ભારત' પસંદ કરો અથવા ફિલ્ટર રીસેટ કરો.",
            "resetFilters": "બધા ફિલ્ટર રીસેટ કરો",
            "state": "રાજ્ય",
            "femaleRate": "મહિલા વ્યાજ દર",
            "maleRate": "પુરુષ વ્યાજ દર",
            "femaleOnly": "લાગુ નથી (ફક્ત મહિલાઓ માટે)",
            "pa": "વાર્ષિક",
            "moratorium": "મોરેટોરિયમ",
            "tenure": "મુદત",
            "mos": "મહિના",
            "yrs": "વર્ષ",
            "applyUnderScheme": "યોજના હેઠળ અરજી કરો",
            "schemeDetails": "યોજનાની વિગતો",
            "category": "શ્રેણી",
            "action": "ક્રિયા",
            "apply": "અરજી કરો",
            "previous": "પાછલું",
            "next": "આગળનું",
            "backToPrevious": "પાછલા પગલા પર પાછા જાઓ",
            "interest": "વ્યાજ",
            "govtFundingLabel": "સરકારી સહાય",
            "maxProjectLimit": "મહત્તમ પ્રોજેક્ટ મર્યાદા",
            "items": {
                "NSFDC_MCF": {
                    "title": "માઇક્રો ક્રેડિટ ફાઇનાન્સ યોજના (MCF)",
                    "description": "નાના વ્યવસાયો, ફેરિયાઓ, કારીગરો અને ગ્રામીણ સૂક્ષ્મ સાહસો માટે સીધી માઇક્રો-ક્રેડિટ લોન."
                },
                "NSFDC_MSY": {
                    "title": "મહિલા સમૃદ્ધિ યોજના (MSY)",
                    "description": "મહત્તમ સરકારી હિસ્સા સાથે અનુસૂચિત જાતિની મહિલા ઉદ્યોગસાહસિકો માટે વિશેષ રાહત દરે ધિરાણ."
                },
                "NSFDC_TL": {
                    "title": "મુદત લોન સામાન્ય યોજના (Term Loan)",
                    "description": "વાણિજ્યિક પરિવહન, ઉત્પાદન અને કૃષિ પ્રક્રિયા એકમો માટે મૂડી ખર્ચ ધિરાણ."
                },
                "NSFDC_ELS_D": {
                    "title": "શિક્ષણ લોન યોજના (સ્થાનિક)",
                    "description": "ભારતમાં ઉચ્ચ વ્યાવસાયિક શિક્ષણ (એન્જિનિયરિંગ, મેડિકલ, કાયદો, મેનેજમેન્ટ) માટે રાહત દરે ધિરાણ."
                },
                "NSFDC_ELS_O": {
                    "title": "વિદેશ શિક્ષણ લોન યોજના",
                    "description": "વિદેશી યુનિવર્સિટીઓમાં અનુસ્નાતક અને ડોક્ટરલ અભ્યાસ માટે રાહત દરે લોન."
                },
                "NSFDC_GBS": {
                    "title": "ગ્રીન બિઝનેસ યોજના (GBS)",
                    "description": "પર્યાવરણને અનુકૂળ વ્યાપારિક પ્રવૃત્તિઓ (બેટરી રિક્ષા, સૌર ઊર્જા, કચરા વ્યવસ્થાપન) માટે નાણાકીય સહાય."
                },
                "NSFDC_SWSS": {
                    "title": "સફાઈ કામદારો વિશેષ યોજના",
                    "description": "સફાઈ કામદારો અને મુક્ત કરાયેલ સફાઈ કર્મચારીઓના સન્માનજનક વૈકલ્પિક આજીવિકા માટે રાહત દરે લોન."
                },
                "NSFDC_SKYS": {
                    "title": "શિલ્પી સમૃદ્ધિ યોજના (કારીગર યોજના)",
                    "description": "પરંપરાગત અનુસૂચિત જાતિના કારીગરો, હસ્તકલા અને હેન્ડલૂમ વણકરો માટે સબસિડીવાળી મુદત લોન સહાય."
                },
                "NSFDC_VBS": {
                    "title": "વેન્ડિંગ અને સૂક્ષ્મ વ્યવસાય યોજના",
                    "description": "શહેરી ફેરિયાઓ, લારીવાળાઓ અને સાપ્તાહિક બજારના વેપારીઓ માટે કાર્યકારી મૂડી ધિરાણ."
                },
                "NSFDC_DAIRY": {
                    "title": "ડેરી અને પશુપાલન યોજના",
                    "description": "દૂધાળા પશુઓની ખરીદી, મરઘા પાલન, બકરા પાલન અને દૂધ શીતલીકરણ માળખા માટે રાહત દરે લોન."
                }
            }
        },
        "map": {
            "routerTitle": "અખિલ ભારતીય ચેનલ પાર્ટનર બેંક અને SCA સ્થાનિક રાઉટર",
            "routerSubtitle": "ઇન્ટરેક્ટિવ નકશા પિન અને વિગતવાર શાખા ક્રેડિટ મેટ્રિક્સ જોવા માટે કોઈપણ ભારતીય રાજ્ય અથવા કેન્દ્રશાસિત પ્રદેશ પસંદ કરો.",
            "selectState": "રાજ્ય પસંદ કરો:",
            "allStates": "બધા 28 રાજ્યો અને કેન્દ્રશાસિત પ્રદેશો (સમગ્ર ભારત)",
            "osmTitle": "ઇન્ટરેક્ટિવ ઓપનસ્ટ્રીટમેપ વિઝ્યુલાઇઝર",
            "stateCode": "રાજ્ય કોડ:",
            "updatingPins": "નકશા પિન અપડેટ થઈ રહ્યા છે:",
            "loadingMap": "અખિલ ભારતીય નકશો લોડ થઈ રહ્યો છે...",
            "branchesInState": "પસંદ કરેલા રાજ્યમાં શાખાઓ",
            "branchDesks": "શાખા ડેસ્ક",
            "rScore": "R_score ઇન્ડેક્સ:",
            "npaRate": "શાખા NPA દર",
            "healthyNpa": "(તંદુરસ્ત <15%)",
            "creditQuota": "ઉપલબ્ધ ક્રેડિટ ક્વોટા",
            "officer": "અધિકારી:",
            "selectedAddress": "📍 પસંદ કરેલી શાખાનું વિગતવાર સરનામું:",
            "physicalAddress": "શાખાનું ભૌતિક સરનામું:",
            "selectedForDispatch": "મોકલવા માટે પસંદ કરેલી શાખા ✓"
        }
    }
}

# Ensure all map keys exist in all languages (fallback to translated or english where missing)
for lang, obj in languages_data.items():
    if "map" in obj:
        for k, v in languages_data["en"]["map"].items():
            if k not in obj["map"]:
                obj["map"][k] = v

def deep_update(d, u):
    for k, v in u.items():
        if isinstance(v, dict):
            d[k] = deep_update(d.get(k, {}), v)
        else:
            d[k] = v
    return d

dirs = [
    "frontend/src/lib/i18n",
    "frontend/src/locales"
]

for lang, extra in languages_data.items():
    for d in dirs:
        filepath = os.path.join(d, f"{lang}.json")
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            data = deep_update(data, extra)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {filepath}")
        else:
            print(f"File not found: {filepath}")

print("All translations updated successfully!")
