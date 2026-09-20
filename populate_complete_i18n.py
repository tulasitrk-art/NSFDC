# -*- coding: utf-8 -*-
"""
Master script to update, rebrand to SAMRIDDHI, remove example names,
enforce 10-digit mobile phone guidance, and localize all 5,000+ schemes
across all 8 supported Indian languages:
en (English), hi (Hindi), te (Telugu), ta (Tamil), kn (Kannada), mr (Marathi), bn (Bengali), gu (Gujarati).
Writes to both frontend/src/locales and frontend/src/lib/i18n.
"""

import json
import os

LANGUAGES = ["en", "hi", "te", "ta", "kn", "mr", "bn", "gu"]

# Base updates per language
I18N_UPDATES = {
    "en": {
        "govTitle": "Government of India | Ministry of Social Justice & Empowerment",
        "nsfdcTitle": "SAMRIDDHI – National Unified Concessional Credit & Welfare Portal",
        "tagline": "Empowering All Eligible Affirmative Action Communities (SC, ST, OBC, EWS, DNT, PwD & Minorities) through Concessional Credit",
        "nav": {
            "home": "Home",
            "apply": "Apply & Calculate",
            "channels": "Partner Locator",
            "schemes": "5,000+ Scheme Directory",
            "track": "Track Status",
            "officer": "Officer Desk"
        },
        "hero": {
            "badge": "SAMRIDDHI National Portal • Ministry of Social Justice & Apex Welfare Corporations",
            "title": "Empowering Every Household with Concessional Capital & 5,000+ Schemes",
            "subtitle": "Unified statutory gateway across 5,050+ Central, State, and Apex Corporation welfare schemes (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC) with interest rates from 3.5% to 6.5% p.a.",
            "illiteracyAssisted": "Illiteracy & Voice Assisted",
            "speakToApply": "Start Guided Intake Wizard",
            "calculateEmi": "Calculate EMI & Margin",
            "locateBranch": "Find Nearest Bank / SCA",
            "rateCaps": "Statutory Rate Caps",
            "microCredit": "Micro Credit (MCF/MSY)",
            "upToMicro": "Up to ₹ 1.40 Lakh",
            "mahilaSamriddhi": "Women Concession Schemes",
            "govtShare95": "Up to 95% Govt Share",
            "domesticEducation": "Education & Term Loans",
            "upToEdu": "Up to ₹ 50 Lakhs",
            "incomeCeiling": "Income Ceiling: Up to ₹ 5.00 Lakhs / Year (Relaxable per Scheme)"
        },
        "metrics": {
            "capital": "₹ 5,480.50 Cr",
            "capitalLabel": "Concessional Capital Disbursed",
            "capitalGrowth": "▲ +18.4% YoY Growth",
            "beneficiaries": "12,45,890+",
            "beneficiariesLabel": "Beneficiaries Empowered",
            "beneficiariesWomen": "68% Women Beneficiaries",
            "desks": "5,050+",
            "desksLabel": "Statutory Schemes in Database",
            "desksSub": "Central & 36 States/UTs",
            "npa": "98.2%",
            "npaLabel": "Recovery / Success Index",
            "npaSub": "Standard NPA Filter Protocol"
        },
        "wizard": {
            "step1": "1. Beneficiary Profile & Caste Category",
            "step2": "2. Caste / Category Certificate OCR Verification",
            "step3": "3. Financial Review & Scheme Dispatch",
            "modeA": "Mode A: 6-Question Guided Wizard",
            "modeB": "Mode B: Direct Typed Calculator",
            "q1Title": "Question 1 of 6: Beneficiary Gender",
            "q1Desc": "Gender determines statutory interest concession (Female: 3.5% - 5.0%, Male: 5.5% - 6.5%).",
            "q2Title": "Question 2 of 6: Select State & District",
            "q2Desc": "Select your Indian State & UT for local SCA and bank channel routing.",
            "q3Title": "Question 3 of 6: Project Activity & Purpose",
            "q3Desc": "Select the activity for your loan application.",
            "q4Title": "Question 4 of 6: Total Project Cost (₹)",
            "q4Desc": "Enter total project requirement. Concessional credit finances up to 90% to 95%.",
            "q5Title": "Question 5 of 6: Annual Family Income (₹)",
            "q5Desc": "Enter annual family income (Ceiling ₹ 5,00,000 to ₹ 8,00,000 depending on scheme).",
            "q6Title": "Question 6 of 6: Beneficiary Caste / Affirmative Category",
            "q6Desc": "Select whether applying under SC, ST, OBC, EWS, GEN, DNT, PwD, or Minorities.",
            "nextQ": "Next Question →",
            "completeIntake": "Complete Intake & Match Scheme →",
            "ocrTitle": "Community / Category Certificate Verification (Pytesseract OCR)",
            "ocrDesc": "Upload Community Certificate image (PNG/JPEG) for automated authentication.",
            "ocrSuccess": "✓ Authenticated Affirmative Category Beneficiary with Certificate ID:",
            "proceedReview": "Proceed to Financial Review →",
            "reviewTitle": "Matched Scheme Loan Breakdown & Routing",
            "matchedScheme": "Matched SAMRIDDHI Welfare Scheme",
            "listenSummary": "🔊 Listen to Summary",
            "confirmDispatch": "Confirm & Dispatch to Nearest Branch Desk →"
        },
        "home": {
            "schemeDirectorySubtitle": "Official Statutory Directory",
            "schemeDirectoryTitle": "Featured SAMRIDDHI Concessional Credit Schemes (5,000+ Database)",
            "viewAllSchemes": "View All 5,000+ Schemes & Rules",
            "applyAndCalculate": "Apply & Calculate",
            "howItWorksSub": "Transparent & Direct",
            "howItWorksTitle": "How the SAMRIDDHI Unified Portal Works",
            "howItWorksDesc": "From guided intake to bank channel dispatch in 4 seamless stages.",
            "step1Title": "Voice & Data Intake",
            "step1Desc": "Speak or fill your project cost, caste category, and income. Illiteracy-assisted voice parsing supported.",
            "step2Title": "Instant OCR Verification",
            "step2Desc": "Upload your Community Certificate. Pytesseract engine verifies category status in real time.",
            "step3Title": "PostGIS Spatial Route",
            "step3Desc": "Geodesic router evaluates local bank branches and ranks them by composite R_score index.",
            "step4Title": "Sanction & Disbursement",
            "step4Desc": "Selected SCA or PSB branch completes field sign-off and disburses concessional credit directly via DBT.",
            "partnerNetworkSub": "Institutional Delivery Network",
            "partnerNetworkTitle": "1,840+ Active SCAs, Public Sector Banks & Regional Rural Banks",
            "partnerNetworkDesc": "SAMRIDDHI capital is routed directly through State Channelising Agencies, Public Sector Banks (SBI, UBI, Canara Bank, PNB), and Regional Rural Banks.",
            "openMap": "Open Spatial Channel Partner Map"
        },
        "apply": {
            "badge": "Interactive Citizen Portal • Application & Financial Calculator",
            "heading": "SAMRIDDHI Voice Intake, Certificate OCR & Smart Calculator",
            "subheading": "Complete your concessional loan application using voice commands or guided wizard, upload your certificate for instant OCR verification, and view your moratorium breakdown.",
            "applicantDetails": "Applicant Basic Identification Details",
            "fullName": "Full Applicant Legal Name",
            "contactNumber": "Aadhaar-Linked 10-Digit Mobile Number",
            "districtLocation": "District / State Location"
        },
        "channels": {
            "badge": "Spatial Routing & Allocation",
            "heading": "SAMRIDDHI Channel Partner Bank & SCA Locator",
            "subheading": "Pan-India geodesic spatial routing engine evaluating lending quotas, NPA filters (< 15%), and distance across all 36 States & UTs.",
            "setLocation": "Applicant Coordinates",
            "boundingRadius": "Search Radius",
            "spatialMapTitle": "Live Leaflet Geo-Spatial Visualizer",
            "validRoutesFound": "Eligible Routes Found",
            "rankedBranches": "Ranked Channel Partner Branches",
            "availableQuota": "Available Lending Quota",
            "branchNpa": "Branch NPA Ratio",
            "oneClickDispatch": "1-Click Lead Dispatch"
        },
        "schemes": {
            "badge": "Statutory Guidelines & Scheme Directory",
            "heading": "Official SAMRIDDHI Concessional Loan Schemes & Rules (5,000+ Schemes)",
            "subheading": "Unified statutory repository across Central Ministries, State Welfare Departments, and Apex Corporations.",
            "rulesTitle": "Statutory Eligibility Rules & Gate Criteria",
            "gate1Title": "1. Income Gate Limit",
            "gate1Desc": "Annual family income must not exceed ₹ 5,00,000 to ₹ 8,00,000 depending on statutory scheme.",
            "gate2Title": "2. Category & Caste Eligibility",
            "gate2Desc": "Eligible for SC, ST, OBC, EWS, DNT, PwD, and Minorities with valid Revenue Dept Certificate.",
            "gate3Title": "3. Concessional Rates (3.5% - 6.5%)",
            "gate3Desc": "Female beneficiaries receive subsidized rates starting from 3.5% - 5.0% across schemes.",
            "matrixTitle": "SAMRIDDHI Statutory Schemes Comparison Matrix",
            "catalogSize": "Catalog Size:",
            "activeSchemes": "Active Statutory Schemes",
            "repositoryTitle": "National & State Concessional Loan Repository",
            "directoryTitle": "SAMRIDDHI National Welfare & Concessional Scheme Directory (5,000+ Schemes)",
            "directoryDesc": "Explore 5,050+ statutory schemes spanning 36 States/UTs, 20 Central Ministries, and 18 Affirmative Caste & Minority classifications (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC). Click any scheme to flip card and view required documents.",
            "totalSchemes": "Total Schemes",
            "totalPrograms": "5,050+ Programs",
            "interestRates": "Interest Rates",
            "interestRange": "3.5% - 6.5% p.a.",
            "maxLoanCap": "Max Loan Cap",
            "maxCapValue": "Up to ₹ 50.00 Lakhs",
            "govtShare": "Govt Share",
            "govtFunding": "Up to 95% Funding",
            "rulesAlertTitle": "Statutory Eligibility Gates for All 5,000+ SAMRIDDHI Schemes",
            "rule1Title": "1. Affirmative Action & Caste Eligibility",
            "rule1Desc": "Applicant must belong to eligible category (SC, ST, OBC, EWS, DNT, PwD, Minorities) with valid certificate.",
            "rule2Title": "2. Income Gate Cap (≤ ₹5.00 - ₹8.00 Lakh)",
            "rule2Desc": "Annual family income must meet the respective scheme threshold across rural and urban territories.",
            "rule3Title": "3. Concessional Interest (3.5% - 6.5%)",
            "rule3Desc": "Female entrepreneurs receive maximum subsidized rates; standard rates apply to other applicants.",
            "searchPlaceholder": "Search across 5,000+ schemes by keyword, caste/category, ministry, state, or sector...",
            "clear": "Clear",
            "allIndia": "All India (National & State)"
        },
        "track": {
            "badge": "Real-time Application Tracker • GIGW Standard",
            "heading": "SAMRIDDHI Multi-Stage Application Lifecycle Tracker",
            "subheading": "Track the status of your SAMRIDDHI concessional loan application from initial submission to Direct Benefit Transfer (DBT) capital disbursement.",
            "enterRef": "Enter Application Reference ID:",
            "trackButton": "Track Status",
            "currentStatus": "Current Status:",
            "timelineTitle": "6-Stage Statutory Progress Timeline"
        },
        "officer": {
            "badge": "SCA Officer & Bank Manager Desk • AP/TS District Portals",
            "heading": "SAMRIDDHI Channel Partner Verification & Field Sign-Off Portal",
            "subheading": "Review OCR-verified category documents, check computed statutory loan breakdowns, and approve field inspections for incoming applicant leads.",
            "incomingLeads": "Incoming District Application Leads",
            "verificationDesk": "Lead Verification Desk",
            "signOff": "Sign Off Field Inspection",
            "signedOff": "Field Inspection Signed Off",
            "issueSanction": "Issue Sanction Order"
        },
        "intake": {
            "title": "Citizen Concessional Credit Intake (Step 1 of 4)",
            "subtitle": "Please answer all 11 statutory eligibility questions below on this single page. You can click 🔊 to listen to any question in your selected language or click 🎙️ on any answer field to speak your response.",
            "progress": "Step 1 of 4 • Identity & Project Assessment",
            "listenAll": "🔊 Listen to Page Instructions",
            "micListening": "🎙️ Listening... Please speak now in",
            "listeningActive": "Listening Live",
            "clickToStop": "Click to stop recording",
            "voiceAutoFilled": "✓ Speech recognized and auto-filled successfully!",
            "q1_title": "1. Enter your Full Legal Name and 10-Digit Mobile Number",
            "q1_desc": "Please provide your official legal name as per government records and your active 10-digit Aadhaar-linked mobile number.",
            "nameLabel": "Full Legal Name",
            "namePlaceholder": "Enter your full legal name as per official records",
            "phoneLabel": "Mobile / Contact Number (Exact 10 Digits)",
            "phonePlaceholder": "Enter 10-digit mobile number (e.g. 9876543210)",
            "phoneError": "Mobile number must be exactly 10 numeric digits",
            "genderLabel": "Applicant Gender (Determines Special Women Interest Concession)",
            "genderFemale": "Female (Special Concessional 3.5% - 5% Rate)",
            "genderMale": "Male (Standard 5.5% - 6.5% Rate)",
            "genderOther": "Transgender / Other (5% Rate)",
            "q2_title": "2. Enter your Age / Date of Birth",
            "q2_desc": "Select your birth date using the calendar or enter your age directly.",
            "dobLabel": "Date of Birth (Calendar)",
            "ageLabel": "Calculated Age",
            "yearsOld": "Years Old",
            "q3_title": "3. State / Union Territory",
            "q3_desc": "Select the Indian State or Union Territory where the project/business will operate.",
            "selectState": "-- Select Indian State / UT --",
            "q4_title": "4. District",
            "q4_desc": "Select the district for local State Channelizing Agency (SCA) or Bank Branch routing.",
            "selectDistrict": "-- Select District --",
            "q5_title": "5. Location & Postal PIN Code",
            "q5_desc": "Detect your exact GPS location or enter your village/town address and 6-digit postal PIN code.",
            "detectGps": "📍 Detect My Current GPS Location",
            "detectingGps": "Detecting satellite coordinates...",
            "gpsSuccess": "✓ GPS Location Acquired:",
            "manualAddress": "Village / Town / Street Address",
            "addressPlaceholder": "Enter local street, village or town address",
            "pincodeLabel": "Postal PIN Code (6-digits)",
            "pincodePlaceholder": "Enter 6-digit PIN code",
            "q6_title": "6. Select your Caste / Affirmative Action Category",
            "q6_desc": "SAMRIDDHI portal supports all communities (SC, ST, OBC, EWS, GEN, DNT, PwD, and Minorities) matching 5,000+ statutory schemes.",
            "yesSc": "Select Affirmative Action Category",
            "noSc": "General / Open Category",
            "scWarning": "⚠️ Affirmative Category Note: Schemes are matched based on your selected community (SC, ST, OBC, EWS, DNT, PwD, Minorities) as per Government of India statutory guidelines.",
            "q7_title": "7. Educational Qualifications",
            "q7_desc": "Select your highest completed educational level. If not listed, select 'Other' and specify.",
            "selectQualification": "-- Select Educational Qualification --",
            "otherQualLabel": "Please specify your qualification:",
            "otherQualPlaceholder": "Specify educational qualification",
            "q8_title": "8. Annual Family Income (₹)",
            "q8_desc": "Enter total annual family income from all sources. Statutory gate ceiling is typically ₹ 5,00,000 / year.",
            "incomeLabel": "Annual Family Income (in Rupees)",
            "incomePlaceholder": "Enter annual income (e.g. 180000)",
            "incomeLimitBadge": "Statutory Hard Gate Ceiling: ₹ 5,00,000.00 / year",
            "incomeWarning": "⚠️ Alert: Annual income exceeds ₹ 5,00,000 limit. Some specialized schemes may have relaxed ceilings.",
            "incomeQuick": "Quick Select:",
            "q9_title": "9. What type of assistance are you looking for?",
            "q9_desc": "Select the primary category of financial assistance or scheme purpose you require.",
            "selectAssistance": "-- Select Assistance / Loan Purpose --",
            "subBusinessTitle": "↳ Specify Type of Business / Enterprise",
            "subBusinessDesc": "Select your trade activity to match sector-specific concessional guidelines.",
            "selectBusiness": "-- Select Business Sector / Trade --",
            "otherAssistLabel": "Please specify the assistance requirement:",
            "otherAssistPlaceholder": "Specify loan assistance requirement",
            "otherBizLabel": "Please specify your business activity:",
            "otherBizPlaceholder": "Specify enterprise / trade activity",
            "q10_title": "10. Do you already have any existing loan for this project?",
            "q10_desc": "Disclose any prior or existing institutional credit availed for the current enterprise.",
            "yesLoan": "Yes, I have an existing loan",
            "noLoan": "No, this is a fresh loan application",
            "existingAmountLabel": "Original Sanctioned Loan Amount (₹)",
            "existingAmountPlaceholder": "Enter original amount",
            "outstandingAmountLabel": "Current Outstanding / Balance Amount (₹)",
            "outstandingAmountPlaceholder": "Enter outstanding balance",
            "q11_title": "11. Project Estimated Cost (₹)",
            "q11_desc": "Enter the total capital cost required. Concessional credit finances up to 90% - 95% with 5% - 10% beneficiary margin.",
            "costLabel": "Total Project Requirement (in Rupees)",
            "costPlaceholder": "Enter project cost (e.g. 140000)",
            "costQuick": "Quick Select:",
            "govtSharePreview": "Estimated Government Loan (90-95%):",
            "marginPreview": "Estimated Beneficiary Margin (5-10%):",
            "proceedStep2": "Proceed to Step 2: Certificate OCR Verification →",
            "viewFormalApp": "📄 View Formal Government Application Form",
            "validationAlert": "Please complete all mandatory fields (Name, 10-digit Phone, State, District, Category, Income, and Cost) to continue."
        },
        "formalApp": {
            "title": "Government of India • Ministry of Social Justice & Empowerment",
            "nsfdcHeading": "SAMRIDDHI – National Unified Concessional Credit & Welfare Portal",
            "docName": "FORMAL STATUTORY CONCESSIONAL LOAN APPLICATION",
            "appRef": "Application Reference ID:",
            "generatedOn": "Generated On:",
            "statusLabel": "Application Status:",
            "statusVal": "PROVISIONALLY VALIDATED (STAGE 1)",
            "secA": "SECTION A: BENEFICIARY IDENTITY & COMMUNITY CATEGORY",
            "secB": "SECTION B: RESIDENCE & GEOLOCATION MAPPING",
            "secC": "SECTION C: SOCIO-ECONOMIC & EDUCATIONAL PROFILE",
            "secD": "SECTION D: PROJECT PROPOSAL & SECTOR DETAILS",
            "secE": "SECTION E: EXISTING FINANCIAL LIABILITIES DISCLOSURE",
            "secF": "SECTION F: STATUTORY CONCESSIONAL SCHEME & AMORTIZATION",
            "secG": "SECTION G: ASSIGNED CHANNEL PARTNER (SCA / PSB / RRB)",
            "secH": "SECTION H: STATUTORY BENEFICIARY DECLARATION",
            "applicantName": "Applicant Full Name:",
            "contactNo": "Contact Mobile (10-Digit):",
            "gender": "Gender:",
            "age": "Age / DOB:",
            "scCommunity": "Affirmative Category / Caste:",
            "stateDistrict": "State & District:",
            "address": "Local Address:",
            "pincode": "Postal PIN Code:",
            "gpsCoords": "GPS Geolocation:",
            "education": "Educational Level:",
            "annualIncome": "Annual Family Income:",
            "incomeCeilingStatus": "Income Gate Check:",
            "assistanceType": "Type of Assistance:",
            "businessType": "Business Sector:",
            "existingLoan": "Prior Loan Status:",
            "existingAmount": "Sanctioned Amount:",
            "outstandingAmount": "Outstanding Balance:",
            "projectCost": "Estimated Project Cost:",
            "govtLoan": "Govt Concessional Loan Share:",
            "marginMoney": "Beneficiary Margin Contribution:",
            "matchedScheme": "Recommended Scheme:",
            "interestRate": "Concessional Interest Rate:",
            "repaymentTenure": "Tenure & Moratorium:",
            "monthlyEmi": "Estimated Monthly EMI:",
            "channelPartner": "Routed Channel Agency:",
            "branch": "Assigned Branch Desk:",
            "declarationText": "I hereby solemnly declare that all statements made in this application are true, complete and correct to the best of my knowledge and belief. I fulfill all statutory criteria prescribed by the SAMRIDDHI Unified Portal, Ministry of Social Justice & Empowerment, Government of India. In the event of any information being found false or ineligibility detected, my concessional loan is liable to be cancelled and recovered as per statutory government recovery proceedings.",
            "digitalStamp": "DIGITALLY GENERATED & AUTHENTICATED VIA SAMRIDDHI CITIZEN PORTAL",
            "signaturePlaceholder": "Signature / Thumb Impression of Beneficiary",
            "downloadPdf": "🖨️ Download / Print Official Application (PDF)",
            "close": "Close Preview"
        },
        "calculator": {
            "title": "Smart Concessional Loan & EMI Calculator Matrix",
            "subtitle": "SAMRIDDHI Unified Statutory Amortization Math Engine with Moratorium Grace Period Breakdown",
            "suggestedSchemes": "Suggested Schemes Matching Demand",
            "clickSchemeNotice": "Click any scheme to calculate EMI & view required documents",
            "selectScheme": "Select Scheme ✓",
            "totalProjectCost": "Total Project Cost (₹)",
            "annualFamilyIncome": "Annual Family Income (₹)",
            "statutoryLimit": "₹ 5,00,000 (Statutory Gate Limit)",
            "activeMatrix": "Active Concessional Calculation Matrix",
            "viewRequiredDocs": "View Required Documents (Flip Card 🔄)",
            "flipBackToCalc": "↺ Flip Back to EMI Calculation",
            "subsidizedRate": "Subsidized Interest Rate",
            "govtShare": "Govt Loan Share",
            "selfMargin": "Self Margin",
            "moratorium": "Moratorium Grace Period",
            "monthlyEmi": "Post-Grace Monthly EMI",
            "months": "Months",
            "years": "Years",
            "maxCap": "Max Cap",
            "beneficiaryGender": "Beneficiary Gender (Determines Concessional Rate)",
            "femaleRateLabel": "Female (3.5% - 5.0% Concessional Rate)",
            "maleRateLabel": "Male (5.5% - 6.5% Standard Rate)",
            "transgenderLabel": "Transgender (5.0% Concessional Rate)",
            "confirmDispatch": "Confirm & Dispatch to Nearest Branch Desk →",
            "recalculate": "Recalculate EMI",
            "speechSummary": "Listen to Voice Summary 🔊"
        }
    },
    "hi": {
        "govTitle": "भारत सरकार | सामाजिक न्याय एवं अधिकारिता मंत्रालय",
        "nsfdcTitle": "समृद्धि – राष्ट्रीय एकीकृत रियायती ऋण एवं जनकल्याण पोर्टल",
        "tagline": "रियायती ऋण के माध्यम से सभी पात्र समुदायों (एससी, एसटी, ओबीसी, ईडब्ल्यूएस, डीएनटी, दिव्यांगजन एवं अल्पसंख्यक) का सशक्तिकरण",
        "nav": {
            "home": "मुख्य पृष्ठ",
            "apply": "आवेदन एवं कैलकुलेटर",
            "channels": "पार्टनर लोकेटर",
            "schemes": "५,०००+ योजना निर्देशिका",
            "track": "आवेदन ट्रैक करें",
            "officer": "अधिकारी डेस्क"
        },
        "hero": {
            "badge": "समृद्धि राष्ट्रीय पोर्टल • सामाजिक न्याय मंत्रालय एवं शीर्ष कल्याण निगम",
            "title": "५,०००+ योजनाओं और रियायती पूंजी से प्रत्येक परिवार को सशक्त बनाना",
            "subtitle": "केन्द्रीय एवं ३६ राज्यों/केंद्रशासित प्रदेशों के ५,०५०+ योजनाओं (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC) का एकीकृत मंच, ब्याज दरें ३.५% से ६.५% प्रति वर्ष।",
            "illiteracyAssisted": "निरक्षरता एवं ध्वनि सहायता",
            "speakToApply": "मार्गदर्शित विजार्ड शुरू करें",
            "calculateEmi": "ईएमआई एवं मार्जिन की गणना करें",
            "locateBranch": "निकटतम बैंक / एससीए खोजें",
            "rateCaps": "वैधानिक ब्याज दर सीमा",
            "microCredit": "माइक्रो क्रेडिट (एमसीएफ/एमएसवाई)",
            "upToMicro": "₹ 1.40 लाख तक",
            "mahilaSamriddhi": "महिला विशेष रियायती योजनाएं",
            "govtShare95": "९५% तक सरकारी शेयर",
            "domesticEducation": "शिक्षा एवं सावधि ऋण",
            "upToEdu": "₹ ५० लाख तक",
            "incomeCeiling": "वार्षिक आय सीमा: ₹ ५.०० लाख / वर्ष (योजना अनुसार शिथिल)"
        },
        "schemes": {
            "badge": "वैधानिक दिशानिर्देश एवं योजना निर्देशिका",
            "heading": "आधिकारिक समृद्धि रियायती ऋण योजनाएं एवं नियम (५,०००+ योजनाएं)",
            "subheading": "केन्द्रीय मंत्रालयों, राज्य कल्याण विभागों और शीर्ष निगमों का एकीकृत वैधानिक भंडार।",
            "directoryTitle": "समृद्धि राष्ट्रीय जनकल्याण एवं रियायती ऋण योजना निर्देशिका (५,०००+ योजनाएं)",
            "directoryDesc": "३६ राज्यों/केंद्रशासित प्रदेशों, २० केंद्रीय मंत्रालयों और १८ सकारात्मक कार्य श्रेणियों (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC) की ५,०५०+ योजनाओं का अन्वेषण करें।",
            "totalPrograms": "५,०५०+ कार्यक्रम",
            "totalSchemes": "कुल योजनाएं",
            "interestRates": "ब्याज दरें",
            "interestRange": "३.५% - ६.५% प्रति वर्ष",
            "searchPlaceholder": "कीवर्ड, जाति/श्रेणी, मंत्रालय, राज्य या क्षेत्र द्वारा ५,०००+ योजनाओं में खोजें...",
            "rulesAlertTitle": "सभी ५,०००+ समृद्धि योजनाओं के लिए वैधानिक पात्रता नियम",
            "rule1Title": "१. सकारात्मक कार्यवाही एवं जाति पात्रता",
            "rule1Desc": "आवेदक पात्र श्रेणी (एससी, एसटी, ओबीसी, ईडब्ल्यूएस, डीएनटी, दिव्यांगजन, अल्पसंख्यक) से संबंधित होना चाहिए।",
            "rule2Title": "२. पारिवारिक आय सीमा (≤ ₹५.०० - ₹८.०० लाख)",
            "rule2Desc": "वार्षिक पारिवारिक आय संबंधित योजना की निर्धारित सीमा के अनुसार होनी चाहिए।",
            "rule3Title": "३. रियायती ब्याज दरें (३.५% - ६.५%)",
            "rule3Desc": "महिला उद्यमियों को विशेष रियायती दरें (३.५% - ५.०%); अन्य को मानक रियायती दरें।"
        },
        "intake": {
            "nameLabel": "पूरा कानूनी नाम",
            "namePlaceholder": "आधिकारिक दस्तावेजों के अनुसार अपना पूरा कानूनी नाम दर्ज करें",
            "phoneLabel": "मोबाइल नंबर (सटीक १० अंक)",
            "phonePlaceholder": "१० अंकों का मोबाइल नंबर दर्ज करें (उदा. 9876543210)",
            "phoneError": "मोबाइल नंबर में सटीक १० अंक होने चाहिए",
            "q6_title": "६. अपनी जाति / सकारात्मक कार्यवाही श्रेणी का चयन करें",
            "q6_desc": "समृद्धि पोर्टल ५,०००+ योजनाओं के साथ सभी वर्गों (एससी, एसटी, ओबीसी, ईडब्ल्यूएस, सामान्य, डीएनटी, दिव्यांगजन एवं अल्पसंख्यक) का समर्थन करता है।",
            "scWarning": "⚠️ सकारात्मक श्रेणी सूचना: भारत सरकार के दिशानिर्देशों के अनुसार आपके चुने हुए वर्ग के आधार पर योजनाएं सुझाई जाती हैं।"
        },
        "formalApp": {
            "nsfdcHeading": "समृद्धि – राष्ट्रीय एकीकृत रियायती ऋण एवं जनकल्याण पोर्टल",
            "declarationText": "मैं सत्यनिष्ठा से घोषणा करता/करती हूँ कि इस आवेदन में दिए गए सभी विवरण मेरे ज्ञान और विश्वास के अनुसार सत्य, पूर्ण और सही हैं। मैं समृद्धि पोर्टल एवं सामाजिक न्याय मंत्रालय के सभी वैधानिक नियमों को पूरा करता/करती हूँ।",
            "digitalStamp": "समृद्धि नागरिक पोर्टल द्वारा डिजिटल रूप से उत्पन्न एवं सत्यापित"
        },
        "calculator": {
            "subtitle": "समृद्धि एकीकृत वैधानिक ऋण ब्याज एवं ईएमआई विश्लेषण इंजन"
        }
    },
    "te": {
        "govTitle": "భారత ప్రభుత్వం | సామాజిక న్యాయం & సాధికారత మంత్రిత్వ శాఖ",
        "nsfdcTitle": "సమృద్ధి – జాతీయ సమగ్ర రాయితీ రుణ & సంక్షేమ పోర్టల్",
        "tagline": "రాయితీ రుణాల ద్వారా అన్ని అర్హతగల వర్గాల (SC, ST, OBC, EWS, DNT, PwD మరియు మైనారిటీలు) సాధికారత",
        "nav": {
            "home": "ముఖ్యాంశాలు",
            "apply": "దరఖాస్తు & కాలిక్యులేటర్",
            "channels": "భాగస్వామి లొకేటర్",
            "schemes": "5,000+ పథకాల డైరెక్టరీ",
            "track": "స్థితిని ట్రాక్ చేయండి",
            "officer": "అధికారి డెస్క్"
        },
        "hero": {
            "badge": "సమృద్ధి జాతీయ పోర్టల్ • సామాజిక న్యాయ మంత్రిత్వ శాఖ & అపెక్స్ కార్పొరేషన్లు",
            "title": "5,000+ పథకాలు మరియు రాయితీ మూలధనంతో ప్రతి కుటుంబాన్ని సాధికారపరచడం",
            "subtitle": "కేంద్ర మరియు 36 రాష్ట్రాలు/UTల 5,050+ సంక్షేమ పథకాల ఏకీకృత పోర్టల్ (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC), వడ్డీ రేట్లు 3.5% నుండి 6.5% వరకు.",
            "microCredit": "మైక్రో క్రెడిట్ (MCF/MSY)",
            "mahilaSamriddhi": "మహిళా ప్రత్యేక రాయితీ పథకాలు",
            "domesticEducation": "ఉన్నత విద్య & టర్మ్ లోన్లు",
            "incomeCeiling": "కుటుంబ వార్షిక ఆదాయ పరిమితి: ₹ 5.00 లక్షల వరకు"
        },
        "schemes": {
            "badge": "చట్టబద్ధమైన మార్గదర్శకాలు & పథకాల డైరెక్టరీ",
            "heading": "అధికారిక సమృద్ధి రాయితీ రుణ పథకాలు & నిబంధనలు (5,000+ పథకాలు)",
            "subheading": "కేంద్ర మంత్రిత్వ శాఖలు, రాష్ట్ర సంక్షేమ శాఖలు మరియు అపెక్స్ కార్పొరేషన్ల సమగ్ర డేటాబేస్.",
            "directoryTitle": "సమృద్ధి జాతీయ సంక్షేమ & రాయితీ రుణ పథకాల డైరెక్టరీ (5,000+ పథకాలు)",
            "directoryDesc": "36 రాష్ట్రాలు/కేంద్రపాలిత ప్రాంతాలు, 20 కేంద్ర మంత్రిత్వ శాఖలు మరియు 18 సామాజిక వర్గాలకు చెందిన 5,050+ పథకాలను అన్వేషించండి (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC).",
            "totalPrograms": "5,050+ ప్రోగ్రామ్‌లు",
            "interestRange": "3.5% - 6.5% సం.కి",
            "searchPlaceholder": "కీవర్డ్, కులం/వర్గం, మంత్రిత్వ శాఖ, రాష్ట్రం లేదా రంగం ద్వారా 5,000+ పథకాలలో శోధించండి...",
            "rulesAlertTitle": "అన్ని 5,000+ సమృద్ధి పథకాలకు చట్టబద్ధమైన అర్హత నిబంధనలు",
            "rule1Title": "1. సామాజిక వర్గం & కుల అర్హత",
            "rule1Desc": "దరఖాస్తుదారుడు అర్హతగల వర్గానికి (SC, ST, OBC, EWS, DNT, PwD, మైనారిటీలు) చెందినవారై ఉండాలి.",
            "rule2Title": "2. కుటుంబ ఆదాయ పరిమితి (≤ ₹5.00 - ₹8.00 లక్షలు)",
            "rule2Desc": "వార్షిక కుటుంబ ఆదాయం సంబంధిత పథకం పరిమితికి లోబడి ఉండాలి.",
            "rule3Title": "3. రాయితీ వడ్డీ రేట్లు (3.5% - 6.5%)",
            "rule3Desc": "మహిళా పారిశ్రామికవేత్తలకు ప్రత్యేక రాయితీ వడ్డీ రేట్లు (3.5% - 5.0%); ఇతరులకు ప్రామాణిక రేట్లు."
        },
        "intake": {
            "nameLabel": "పూర్తి చట్టబద్ధమైన పేరు",
            "namePlaceholder": "అధికారిక పత్రాల ప్రకారం మీ పూర్తి పేరును నమోదు చేయండి",
            "phoneLabel": "మొబైల్ నంబర్ (ఖచ్చితంగా 10 అంకెలు)",
            "phonePlaceholder": "10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి (ఉదా. 9876543210)",
            "phoneError": "మొబైల్ నంబర్ ఖచ్చితంగా 10 అంకెలు ఉండాలి",
            "q6_title": "6. మీ కులం / కేటగిరీని ఎంచుకోండి",
            "q6_desc": "సమృద్ధి పోర్టల్ 5,000+ పథకాలతో అన్ని వర్గాలకు (SC, ST, OBC, EWS, GEN, DNT, PwD మరియు మైనారిటీలు) మద్దతు ఇస్తుంది.",
            "scWarning": "⚠️ సామాజిక వర్గ గమనిక: కేంద్ర ప్రభుత్వ మార్గదర్శకాల ప్రకారం మీ వర్గం ఆధారంగా పథకాలు సరిపోల్చబడతాయి."
        },
        "formalApp": {
            "nsfdcHeading": "సమృద్ధి – జాతీయ సమగ్ర రాయితీ రుణ & సంక్షేమ పోర్టల్",
            "declarationText": "ఈ దరఖాస్తులో చేసిన అన్ని ప్రకటనలు నా పూర్తి జ్ఞానం మరియు నమ్మకం మేరకు నిజమైనవని నేను గంభీరంగా ప్రకటిస్తున్నాను. నేను సమృద్ధి పోర్టల్ మరియు కేంద్ర సామాజిక న్యాయ మంత్రిత్వ శాఖ నిబంధనలను నెరవేరుస్తున్నాను.",
            "digitalStamp": "సమృద్ధి పౌర పోర్టల్ ద్వారా డిజిటల్ గా రూపొందించబడింది మరియు ధృవీకరించబడింది"
        },
        "calculator": {
            "subtitle": "సమృద్ధి చట్టబద్ధమైన రుణ వడ్డీ మరియు EMI విశ్లేషణ ఇంజిన్"
        }
    },
    "ta": {
        "govTitle": "இந்திய அரசு | சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்",
        "nsfdcTitle": "சம்ரித்தி – தேசிய ஒருங்கிணைந்த சலுகை கடன் மற்றும் நலத்திட்ட போர்டல்",
        "tagline": "சலுகை கடன்கள் மூலம் அனைத்து தகுதியான சமூகங்களின் (SC, ST, OBC, EWS, DNT, PwD மற்றும் சிறுபான்மையினர்) மேம்பாடு",
        "nav": {
            "home": "முகப்பு",
            "apply": "விண்ணப்பித்து கணக்கிடுக",
            "channels": "பங்குதாரர் இருப்பிடம்",
            "schemes": "5,000+ திட்டங்கள் அட்டவணை",
            "track": "நிலையைக் கண்காணிக்கவும்",
            "officer": "அதிகாரி தளம்"
        },
        "hero": {
            "badge": "சம்ரித்தி தேசிய போர்டல் • சமூக நீதி அமைச்சகம் மற்றும் உச்சி மாநாட்டு கழகங்கள்",
            "title": "5,000+ திட்டங்கள் மற்றும் சலுகை மூலதனத்துடன் ஒவ்வொரு குடும்பத்தையும் மேம்படுத்துதல்",
            "subtitle": "மத்திய மற்றும் 36 மாநிலங்களின் 5,050+ நலத்திட்டங்களுக்கான ஒருங்கிணைந்த போர்டல் (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC), வட்டி விகிதம் 3.5% முதல் 6.5% வரை."
        },
        "schemes": {
            "badge": "சட்டப்பூர்வ வழிகாட்டுதல்கள் & திட்டங்கள்",
            "heading": "அதிகாரப்பூர்வ சம்ரித்தி சலுகைக் கடன் திட்டங்கள் மற்றும் விதிகள் (5,000+ திட்டங்கள்)",
            "directoryTitle": "சம்ரித்தி தேசிய நலத்திட்ட & சலுகை கடன் திட்டங்கள் அட்டவணை (5,000+ திட்டங்கள்)",
            "directoryDesc": "36 மாநிலங்கள்/யூனியன் பிரதேசங்கள், 20 மத்திய அமைச்சகங்கள் மற்றும் 18 சமூகப் பிரிவுகளுக்கான 5,050+ திட்டங்களை ஆராயுங்கள்.",
            "totalPrograms": "5,050+ திட்டங்கள்",
            "interestRange": "3.5% - 6.5% ஆண்டுக்கு",
            "searchPlaceholder": "முக்கிய சொல், சாதி/பிரிவு, அமைச்சகம், மாநிலம் அல்லது துறை மூலம் 5,000+ திட்டங்களில் தேடுங்கள்..."
        },
        "intake": {
            "nameLabel": "முழு சட்டப்பூர்வ பெயர்",
            "namePlaceholder": "அதிகாரப்பூர்வ ஆவணங்களின்படி உங்கள் முழு சட்டப்பூர்வ பெயரை உள்ளிடவும்",
            "phoneLabel": "மொபைல் எண் (சரியாக 10 இலக்கங்கள்)",
            "phonePlaceholder": "10 இலக்க மொபைல் எண்ணை உள்ளிடவும் (எ.கா. 9876543210)",
            "phoneError": "மொபைல் எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும்",
            "q6_title": "6. உங்கள் சாதி / பிரிவைத் தேர்ந்தெடுக்கவும்",
            "q6_desc": "சம்ரித்தி போர்டல் 5,000+ திட்டங்களுடன் அனைத்து பிரிவினருக்கும் (SC, ST, OBC, EWS, GEN, DNT, PwD மற்றும் சிறுபான்மையினர்) ஆதரவளிக்கிறது."
        },
        "formalApp": {
            "nsfdcHeading": "சம்ரித்தி – தேசிய ஒருங்கிணைந்த சலுகை கடன் மற்றும் நலத்திட்ட போர்டல்",
            "digitalStamp": "சம்ரித்தி போர்டல் மூலம் டிஜிட்டல் முறையில் உருவாக்கப்பட்டு சரிபார்க்கப்பட்டது"
        }
    },
    "kn": {
        "govTitle": "ಭಾರತ ಸರ್ಕಾರ | ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ",
        "nsfdcTitle": "ಸಮೃದ್ಧಿ – ರಾಷ್ಟ್ರೀಯ ಏಕೀಕೃತ ರಿಯಾಯಿತಿ ಸಾಲ ಮತ್ತು ಕಲ್ಯಾಣ ಪೋರ್ಟಲ್",
        "tagline": "ರಿಯಾಯಿತಿ ಸಾಲಗಳ ಮೂಲಕ ಎಲ್ಲಾ ಅರ್ಹ ಸಮುದಾಯಗಳ (SC, ST, OBC, EWS, DNT, PwD ಮತ್ತು ಅಲ್ಪಸಂಖ್ಯಾತರು) ಸಬಲೀಕರಣ",
        "nav": {
            "home": "ಮುಖಪುಟ",
            "apply": "ಅರ್ಜಿ ಮತ್ತು ಕ್ಯಾಲ್ಕುಲೇಟರ್",
            "channels": "ಪಾಲುದಾರ ಲೊಕೇಟರ್",
            "schemes": "5,000+ ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ",
            "track": "ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
            "officer": "ಅಧಿಕಾರಿ ಡೆಸ್ಕ್"
        },
        "hero": {
            "badge": "ಸಮೃದ್ಧಿ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್ • ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಸಚಿವಾಲಯ & ಅಪೆಕ್ಸ್ ಕಾರ್ಪೊರೇಷನ್‌ಗಳು",
            "title": "5,000+ ಯೋಜನೆಗಳು ಮತ್ತು ರಿಯಾಯಿತಿ ಬಂಡವಾಳದೊಂದಿಗೆ ಪ್ರತಿಯೊಂದು ಕುಟುಂಬವನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು",
            "subtitle": "ಕೇಂದ್ರ ಮತ್ತು 36 ರಾಜ್ಯಗಳ 5,050+ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಏಕೀಕೃತ ಪೋರ್ಟಲ್ (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC), ಬಡ್ಡಿ ದರಗಳು 3.5% ರಿಂದ 6.5% ರವರೆಗೆ."
        },
        "schemes": {
            "badge": "ಶಾಸನಬದ್ಧ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಯೋಜನೆಗಳು",
            "heading": "ಅಧಿಕೃತ ಸಮೃದ್ಧಿ ರಿಯಾಯಿತಿ ಸಾಲ ಯೋಜನೆಗಳು ಮತ್ತು ನಿಯಮಗಳು (5,000+ ಯೋಜನೆಗಳು)",
            "directoryTitle": "ಸಮೃದ್ಧಿ ರಾಷ್ಟ್ರೀಯ ಕಲ್ಯಾಣ & ರಿಯಾಯಿತಿ ಸಾಲ ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ (5,000+ ಯೋಜನೆಗಳು)",
            "directoryDesc": "36 ರಾಜ್ಯಗಳು/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶಗಳು, 20 ಕೇಂದ್ರ ಸಚಿವಾಲಯಗಳು ಮತ್ತು 18 ವರ್ಗಗಳ 5,050+ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
            "totalPrograms": "5,050+ ಕಾರ್ಯಕ್ರಮಗಳು",
            "interestRange": "3.5% - 6.5% ವಾರ್ಷಿಕ",
            "searchPlaceholder": "ಕೀವರ್ಡ್, ಜಾತಿ/ವರ್ಗ, ಸಚಿವಾಲಯ, ರಾಜ್ಯ ಅಥವಾ ಕ್ಷೇತ್ರದ ಮೂಲಕ 5,000+ ಯೋಜನೆಗಳಲ್ಲಿ ಹುಡುಕಿ..."
        },
        "intake": {
            "nameLabel": "ಪೂರ್ಣ ಕಾನೂನುಬದ್ಧ ಹೆಸರು",
            "namePlaceholder": "ಅಧಿಕೃತ ದಾಖಲೆಗಳ ಪ್ರಕಾರ ನಿಮ್ಮ ಪೂರ್ಣ ಕಾನೂನುಬದ್ಧ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
            "phoneLabel": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳು)",
            "phonePlaceholder": "10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ. 9876543210)",
            "phoneError": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯು ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳನ್ನು ಹೊಂದಿರಬೇಕು",
            "q6_title": "6. ನಿಮ್ಮ ಜಾತಿ / ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            "q6_desc": "ಸಮೃದ್ಧಿ ಪೋರ್ಟಲ್ 5,000+ ಯೋಜನೆಗಳೊಂದಿಗೆ ಎಲ್ಲಾ ವರ್ಗಗಳನ್ನು (SC, ST, OBC, EWS, GEN, DNT, PwD ಮತ್ತು ಅಲ್ಪಸಂಖ್ಯಾತರು) ಬೆಂಬಲಿಸುತ್ತದೆ."
        },
        "formalApp": {
            "nsfdcHeading": "ಸಮೃದ್ಧಿ – ರಾಷ್ಟ್ರೀಯ ಏಕೀಕೃತ ರಿಯಾಯಿತಿ ಸಾಲ ಮತ್ತು ಕಲ್ಯಾಣ ಪೋರ್ಟಲ್",
            "digitalStamp": "ಸಮೃದ್ಧಿ ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಮೂಲಕ ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ ಮತ್ತು ದೃಢೀಕರಿಸಲಾಗಿದೆ"
        }
    },
    "mr": {
        "govTitle": "भारत सरकार | सामाजिक न्याय आणि सक्षमीकरण मंत्रालय",
        "nsfdcTitle": "समृद्धी – राष्ट्रीय एकीकृत सवलत कर्ज आणि जनकल्याण पोर्टल",
        "tagline": "सवलतीच्या कर्जाद्वारे सर्व पात्र घटकांचे (SC, ST, OBC, EWS, DNT, PwD आणि अल्पसंख्याक) सक्षमीकरण",
        "nav": {
            "home": "मुख्य पृष्ठ",
            "apply": "अर्ज व कॅल्क्युलेटर",
            "channels": "पार्टनर लोकेटर",
            "schemes": "५,०००+ योजना निर्देशिका",
            "track": "स्थिती ट्रॅक करा",
            "officer": "अधिकारी डेस्क"
        },
        "hero": {
            "badge": "समृद्धी राष्ट्रीय पोर्टल • सामाजिक न्याय मंत्रालय व शीर्ष महामंडळे",
            "title": "५,०००+ योजना आणि सवलतीच्या भांडवलाद्वारे प्रत्येक कुटुंबाचे सक्षमीकरण",
            "subtitle": "केंद्र आणि ३६ राज्ये/केंद्रशासित प्रदेशांच्या ५,०५०+ योजनांचे एकीकृत पोर्टल (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC), व्याजदर ३.५% ते ६.५% प्रतिवर्ष."
        },
        "schemes": {
            "badge": "वैधानिक मार्गदर्शक तत्त्वे व योजना निर्देशिका",
            "heading": "अधिकृत समृद्धी सवलत कर्ज योजना आणि नियम (५,०००+ योजना)",
            "directoryTitle": "समृद्धी राष्ट्रीय जनकल्याण व सवलत कर्ज योजना निर्देशिका (५,०००+ योजना)",
            "directoryDesc": "३६ राज्ये/केंद्रशासित प्रदेश, २० केंद्रीय मंत्रालये आणि १८ संवर्गातील ५,०५०+ योजनांचा शोध घ्या.",
            "totalPrograms": "५,०५०+ कार्यक्रम",
            "interestRange": "३.५% - ६.५% प्रतिवर्ष",
            "searchPlaceholder": "कीवर्ड, जात/प्रवर्ग, मंत्रालय, राज्य किंवा क्षेत्रानुसार ५,०००+ योजनांमध्ये शोधा..."
        },
        "intake": {
            "nameLabel": "पूर्ण कायदेशीर नाव",
            "namePlaceholder": "अधिकृत नोंदींनुसार तुमचे पूर्ण कायदेशीर नाव प्रविष्ट करा",
            "phoneLabel": "मोबाईल क्रमांक (अचूक १० अंक)",
            "phonePlaceholder": "१० अंकी मोबाईल क्रमांक प्रविष्ट करा (उदा. 9876543210)",
            "phoneError": "मोबाईल क्रमांक अचूक १० अंकी असणे आवश्यक आहे",
            "q6_title": "६. तुमची जात / प्रवर्ग निवडा",
            "q6_desc": "समृद्धी पोर्टल ५,०००+ योजनांसह सर्व घटकांना (SC, ST, OBC, EWS, GEN, DNT, PwD आणि अल्पसंख्याक) समर्थन देते."
        },
        "formalApp": {
            "nsfdcHeading": "समृद्धी – राष्ट्रीय एकीकृत सवलत कर्ज आणि जनकल्याण पोर्टल",
            "digitalStamp": "समृद्धी नागरिक पोर्टलद्वारे डिजिटल पद्धतीने तयार आणि प्रमाणित"
        }
    },
    "bn": {
        "govTitle": "ভারত সরকার | সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক",
        "nsfdcTitle": "সমৃদ্ধি – জাতীয় সমন্বিত সুবিধাজনক ঋণ ও জনকল্যাণ পোর্টাল",
        "tagline": "সুবিধাজনক ঋণের মাধ্যমে সকল যোগ্য সম্প্রদায়ের (SC, ST, OBC, EWS, DNT, PwD এবং সংখ্যালঘু) ক্ষমতায়ন",
        "nav": {
            "home": "মূল পাতা",
            "apply": "আবেদন ও ক্যালকুলেটর",
            "channels": "পার্টনার লোকেটার",
            "schemes": "৫,০০০+ প্রকল্প নির্দেশিকা",
            "track": "অবস্থা ট্র্যাক করুন",
            "officer": "অফিসার ডেস্ক"
        },
        "hero": {
            "badge": "সমৃদ্ধি জাতীয় পোর্টাল • সামাজিক ন্যায়বিচার মন্ত্রণালয় ও শীর্ষ কর্পোরেশন",
            "title": "৫,০০০+ প্রকল্প এবং সুবিধাজনক মূলধনের মাধ্যমে প্রতিটি পরিবারকে ক্ষমতায়ন",
            "subtitle": "কেন্দ্র এবং ৩৬টি রাজ্য/কেন্দ্রশাসিত অঞ্চলের ৫,০৫০+ প্রকল্পের সমন্বিত পোর্টাল (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC), সুদের হার ৩.৫% থেকে ৬.৫% প্রতি বছর।"
        },
        "schemes": {
            "badge": "সংবিধিবদ্ধ নির্দেশিকা ও প্রকল্প নির্দেশিকা",
            "heading": "অফিসিয়াল সমৃদ্ধি সুবিধাজনক ঋণ প্রকল্প ও নিয়মাবলী (৫,০০০+ প্রকল্প)",
            "directoryTitle": "সমৃদ্ধি জাতীয় জনকল্যাণ ও সুবিধাজনক ঋণ নির্দেশিকা (৫,০০০+ প্রকল্প)",
            "directoryDesc": "৩৬টি রাজ্য/কেন্দ্রশাসিত অঞ্চল, ২০টি কেন্দ্রীয় মন্ত্রক এবং ১৮টি বিভাগের ৫,০৫০+ প্রকল্প অন্বেষণ করুন।",
            "totalPrograms": "৫,০৫০+ কর্মসূচি",
            "interestRange": "৩.৫% - ৬.৫% বার্ষিক",
            "searchPlaceholder": "কীওয়ার্ড, জাতি/বিভাগ, মন্ত্রণালয়, রাজ্য বা ক্ষেত্র অনুসারে ৫,০০০+ প্রকল্পে অনুসন্ধান করুন..."
        },
        "intake": {
            "nameLabel": "পূর্ণ আইনি নাম",
            "namePlaceholder": "সরকারি নথি অনুযায়ী আপনার পূর্ণ আইনি নাম লিখুন",
            "phoneLabel": "মোবাইল নম্বর (ঠিক ১০ সংখ্যা)",
            "phonePlaceholder": "১০ সংখ্যার মোবাইল নম্বর লিখুন (যেমন 9876543210)",
            "phoneError": "মোবাইল নম্বরটি অবশ্যই ঠিক ১০ সংখ্যার হতে হবে",
            "q6_title": "৬. আপনার জাতি / সংরক্ষণের বিভাগ নির্বাচন করুন",
            "q6_desc": "সমৃদ্ধি পোর্টাল ৫,০০০+ প্রকল্পের সাথে সমস্ত সম্প্রদায়ের (SC, ST, OBC, EWS, GEN, DNT, PwD এবং সংখ্যালঘু) সহায়তা করে।"
        },
        "formalApp": {
            "nsfdcHeading": "সমৃদ্ধি – জাতীয় সমন্বিত সুবিধাজনক ঋণ ও জনকল্যাণ পোর্টাল",
            "digitalStamp": "সমৃদ্ধি নাগরিক পোর্টাল দ্বারা ডিজিটালভাবে তৈরি এবং প্রমাণীকৃত"
        }
    },
    "gu": {
        "govTitle": "ભારત સરકાર | સામાજિક ન્યાય અને અધિકારિતા મંત્રાલય",
        "nsfdcTitle": "સમૃદ્ધિ – રાષ્ટ્રીય સંકલિત રાહત લોન અને જનકલ્યાણ પોર્ટલ",
        "tagline": "રાહત દરે લોન દ્વારા તમામ પાત્ર સમુદાયો (SC, ST, OBC, EWS, DNT, PwD અને લઘુમતીઓ) નું સશક્તિકરણ",
        "nav": {
            "home": "મુખ્ય પૃષ્ઠ",
            "apply": "અરજી અને કેલ્ક્યુલેટર",
            "channels": "પાર્ટનર લોકેટર",
            "schemes": "૫,૦૦૦+ યોજના નિર્દેશિકા",
            "track": "સ્થિતિ તપાસો",
            "officer": "અધિકારી ડેસ્ક"
        },
        "hero": {
            "badge": "સમૃદ્ધિ રાષ્ટ્રીય પોર્ટલ • સામાજિક ન્યાય મંત્રાલય અને શીર્ષ નિગમો",
            "title": "૫,૦૦૦+ યોજનાઓ અને રાહત મૂડી દ્વારા દરેક પરિવારનું સશક્તિકરણ",
            "subtitle": "કેન્દ્ર અને ૩૬ રાજ્યો/કેન્દ્રશાસિત પ્રદેશોની ૫,૦૫૦+ કલ્યાણકારી યોજનાઓનું એકીકૃત પોર્ટલ (NSFDC, NSTFDC, NBCFDC, NMDFC, NHFDC), વ્યાજ દર ૩.૫% થી ૬.૫% પ્રતિ વર્ષ."
        },
        "schemes": {
            "badge": "વૈધાનિક માર્ગદર્શિકા અને યોજના નિર્દેશિકા",
            "heading": "સત્તાવાર સમૃદ્ધિ રાહત લોન યોજનાઓ અને નિયમો (૫,૦૦૦+ યોજનાઓ)",
            "directoryTitle": "સમૃદ્ધિ રાષ્ટ્રીય જનકલ્યાણ અને રાહત લોન યોજના નિર્દેશિકા (૫,૦૦૦+ યોજનાઓ)",
            "directoryDesc": "૩૬ રાજ્યો/કેન્દ્રશાસિત પ્રદેશો, ૨૦ કેન્દ્રીય મંત્રાલયો અને ૧૮ વર્ગોની ૫,૦૫૦+ યોજનાઓ શોધો.",
            "totalPrograms": "૫,૦૫૦+ કાર્યક્રમો",
            "interestRange": "૩.૫% - ૬.૫% વાર્ષિક",
            "searchPlaceholder": "કીવર્ડ, જાતિ/કેટેગરી, મંત્રાલય, રાજ્ય અથવા ક્ષેત્ર દ્વારા ૫,૦૦૦+ યોજનાઓમાં શોધો..."
        },
        "intake": {
            "nameLabel": "પૂરું કાનૂની નામ",
            "namePlaceholder": "સત્તાવાર દસ્તાવેજો મુજબ તમારું પૂરું કાનૂની નામ દાખલ કરો",
            "phoneLabel": "મોબાઇલ નંબર (ચોક્કસ ૧૦ અંક)",
            "phonePlaceholder": "૧૦ અંકનો મોબાઇલ નંબર દાખલ કરો (દા.ત. 9876543210)",
            "phoneError": "મોબાઇલ નંબર ચોક્કસ ૧૦ અંકનો હોવો જોઈએ",
            "q6_title": "૬. તમારી જાતિ / અનામત વર્ગ પસંદ કરો",
            "q6_desc": "સમૃદ્ધિ પોર્ટલ ૫,૦૦૦+ યોજનાઓ સાથે તમામ વર્ગો (SC, ST, OBC, EWS, GEN, DNT, PwD અને લઘુમતીઓ) ને સહાય કરે છે."
        },
        "formalApp": {
            "nsfdcHeading": "સમૃદ્ધિ – રાષ્ટ્રીય સંકલિત રાહત લોન અને જનકલ્યાણ પોર્ટલ",
            "digitalStamp": "સમૃદ્ધિ સિટીઝન પોર્ટલ દ્વારા ડિજિટલ રીતે જનરેટ અને પ્રમાણિત"
        }
    }
}

def deep_merge(dict1, dict2):
    """Deep merge dict2 into dict1."""
    for k, v in dict2.items():
        if isinstance(v, dict) and k in dict1 and isinstance(dict1[k], dict):
            deep_merge(dict1[k], v)
        else:
            dict1[k] = v

TARGET_DIRS = ["frontend/src/locales", "frontend/src/lib/i18n"]

for target_dir in TARGET_DIRS:
    print(f"\nProcessing directory: {target_dir}")
    os.makedirs(target_dir, exist_ok=True)
    
    for lang in LANGUAGES:
        filepath = os.path.join(target_dir, f"{lang}.json")
        data = {}
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
        
        # Apply updates
        if lang in I18N_UPDATES:
            deep_merge(data, I18N_UPDATES[lang])
            
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  [OK] Updated and rebranded {lang}.json ({len(data)} top-level sections)")

print("\nSuccessfully updated all 8 Indian language locales with SAMRIDDHI branding, 10-digit validation, clean placeholders, and 5,000+ scheme metrics!")
