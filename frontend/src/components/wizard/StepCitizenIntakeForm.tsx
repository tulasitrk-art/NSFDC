"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  MapPin,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  GraduationCap,
  IndianRupee,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileText,
  LocateFixed,
  HelpCircle,
} from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";
import {
  PAN_INDIA_STATES,
  EDUCATIONAL_QUALIFICATIONS,
  ASSISTANCE_TYPES,
  BUSINESS_TYPES,
  findNearestStateAndDistrict,
} from "@/lib/location_data";
import {
  speakText,
  createSpeechRecognizer,
  extractNumberFromSpeech,
  VOICE_LOCALE_MAP,
} from "@/lib/voice_utils";
import { ALL_CASTE_CATEGORIES, getCasteCategoryById } from "@/lib/caste_categories";
import { FormalApplicationModal, FormalApplicationData } from "@/components/common/FormalApplicationModal";

export interface CitizenIntakeData {
  applicantName: string;
  contactNumber: string;
  gender: "FEMALE" | "MALE" | "OTHER";
  dateOfBirth: string;
  age: number;
  stateCode: string;
  stateName: string;
  district: string;
  locationType: "GPS" | "MANUAL";
  latitude?: number;
  longitude?: number;
  address: string;
  pinCode: string;
  isScheduledCaste: boolean;
  casteCategory: string;
  qualification: string;
  qualificationOther: string;
  annualIncome: number;
  assistanceType: string;
  assistanceTypeOther: string;
  businessType: string;
  businessTypeOther: string;
  hasExistingLoan: boolean;
  existingLoanAmount: number;
  outstandingAmount: number;
  projectCost: number;
}

interface StepCitizenIntakeFormProps {
  initialData?: Partial<CitizenIntakeData>;
  onComplete: (data: CitizenIntakeData) => void;
}

export const StepCitizenIntakeForm: React.FC<StepCitizenIntakeFormProps> = ({
  initialData,
  onComplete,
}) => {
  const { t, currentLang } = useLanguage();

  // Primary Form State
  const [formData, setFormData] = useState<CitizenIntakeData>({
    applicantName: initialData?.applicantName || "",
    contactNumber: initialData?.contactNumber || "",
    gender: (initialData?.gender as any) || "FEMALE",
    dateOfBirth: initialData?.dateOfBirth || "1998-05-15",
    age: initialData?.age || 28,
    stateCode: initialData?.stateCode || "AP",
    stateName: initialData?.stateName || "Andhra Pradesh",
    district: initialData?.district || "Kakinada",
    locationType: initialData?.locationType || "GPS",
    latitude: initialData?.latitude || 16.982,
    longitude: initialData?.longitude || 82.238,
    address: initialData?.address || "",
    pinCode: initialData?.pinCode || "",
    isScheduledCaste: initialData?.casteCategory ? initialData.casteCategory === "SC" : (initialData?.isScheduledCaste !== undefined ? initialData.isScheduledCaste : true),
    casteCategory: initialData?.casteCategory || "SC",
    qualification: initialData?.qualification || "GRADUATE",
    qualificationOther: initialData?.qualificationOther || "",
    annualIncome: initialData?.annualIncome || 180000,
    assistanceType: initialData?.assistanceType || "BUSINESS",
    assistanceTypeOther: initialData?.assistanceTypeOther || "",
    businessType: initialData?.businessType || "RETAIL",
    businessTypeOther: initialData?.businessTypeOther || "",
    hasExistingLoan: initialData?.hasExistingLoan || false,
    existingLoanAmount: initialData?.existingLoanAmount || 0,
    outstandingAmount: initialData?.outstandingAmount || 0,
    projectCost: initialData?.projectCost || 140000,
  });

  // Audio / Speech State
  const [activeSpeakingQ, setActiveSpeakingQ] = useState<number | null>(null);
  const [activeListeningQ, setActiveListeningQ] = useState<number | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [isFormalAppOpen, setIsFormalAppOpen] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Taken Location & Missed Questions State
  const [takenLocationInfo, setTakenLocationInfo] = useState<{
    displayName: string;
    locality?: string;
    district: string;
    state: string;
    stateCode: string;
    pinCode: string;
    lat: number;
    lon: number;
    accuracy: number;
    timestamp: string;
    source: string;
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [missedQuestions, setMissedQuestions] = useState<Array<{
    qNum: number;
    title: string;
    message: string;
    cardId: string;
    fieldId?: string;
  }>>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  const activeCancelSpeechRef = useRef<(() => void) | null>(null);
  const activeRecognizerRef = useRef<any>(null);

  // Sync state & districts dynamically
  const currentStateObj = PAN_INDIA_STATES.find((s) => s.code === formData.stateCode) || PAN_INDIA_STATES[0];
  const availableDistricts = currentStateObj.districts.includes(formData.district)
    ? currentStateObj.districts
    : [formData.district, ...currentStateObj.districts];

  // Auto-calculate age from DOB
  const handleDobChange = (dob: string) => {
    let calculatedAge = formData.age;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = Math.max(18, Math.min(75, age));
    }
    setFormData((prev) => ({ ...prev, dateOfBirth: dob, age: calculatedAge }));
  };

  // State Change handler
  const handleStateChange = (code: string) => {
    const matchedState = PAN_INDIA_STATES.find((s) => s.code === code) || PAN_INDIA_STATES[0];
    setFormData((prev) => ({
      ...prev,
      stateCode: matchedState.code,
      stateName: matchedState.name,
      district: matchedState.districts[0] || "Headquarters",
      latitude: matchedState.lat,
      longitude: matchedState.lon,
    }));
  };

  // Accurate Real-time GPS Location Detection + Reverse Geocoding
  const handleDetectGps = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGpsError("GPS Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = pos.coords.accuracy || 10;

        let detectedStateCode = formData.stateCode;
        let detectedStateName = formData.stateName;
        let detectedDistrict = formData.district;
        let detectedPinCode = formData.pinCode;
        let detectedAddress = formData.address;
        let displayLocation = "";
        let localityName = "";
        let sourceUsed = "GPS + OpenStreetMap Spatial Registry";

        try {
          // Attempt Layer 1: OpenStreetMap Nominatim with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
            {
              headers: { "Accept-Language": "en" },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (nomRes.ok) {
            const nomData = await nomRes.json();
            const addr = nomData.address || {};
            displayLocation = nomData.display_name || "";

            // State matching
            const returnedState = addr.state || "";
            const matchedState = PAN_INDIA_STATES.find(
              (s) =>
                s.name.toLowerCase() === returnedState.toLowerCase() ||
                returnedState.toLowerCase().includes(s.name.toLowerCase()) ||
                s.name.toLowerCase().includes(returnedState.toLowerCase())
            );

            if (matchedState) {
              detectedStateCode = matchedState.code;
              detectedStateName = matchedState.name;
            }

            // District matching
            const rawDistrict =
              addr.state_district ||
              addr.county ||
              addr.district ||
              addr.city ||
              addr.town ||
              "";
            const cleanDistrict = rawDistrict
              .replace(/\s+(district|mandal|division|zone|corporation)/gi, "")
              .trim();

            if (cleanDistrict) {
              detectedDistrict = cleanDistrict;
            }

            // PIN code
            if (addr.postcode && /^\d{6}$/.test(addr.postcode.trim())) {
              detectedPinCode = addr.postcode.trim();
            }

            // Locality / Suburb / Street
            localityName =
              addr.suburb ||
              addr.village ||
              addr.neighbourhood ||
              addr.residential ||
              addr.road ||
              cleanDistrict;

            if (localityName && (!formData.address || formData.address.length < 3)) {
              detectedAddress = `${localityName}, ${detectedDistrict}`;
            }
          } else {
            throw new Error("Nominatim returned non-OK status");
          }
        } catch (e) {
          // Attempt Layer 2: BigDataCloud Reverse Geocoding
          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const bdcData = await bdcRes.json();
              sourceUsed = "GPS + BigDataCloud Spatial Registry";

              const returnedState = bdcData.principalSubdivision || "";
              const matchedState = PAN_INDIA_STATES.find(
                (s) =>
                  s.name.toLowerCase() === returnedState.toLowerCase() ||
                  returnedState.toLowerCase().includes(s.name.toLowerCase())
              );
              if (matchedState) {
                detectedStateCode = matchedState.code;
                detectedStateName = matchedState.name;
              }

              const returnedDistrict =
                bdcData.locality ||
                bdcData.city ||
                bdcData.principalSubdivisionCode ||
                "";
              if (returnedDistrict) {
                detectedDistrict = returnedDistrict;
              }
              if (bdcData.postcode && /^\d{6}$/.test(bdcData.postcode.trim())) {
                detectedPinCode = bdcData.postcode.trim();
              }
              localityName = bdcData.locality || returnedDistrict;
              displayLocation = `${localityName}, ${detectedDistrict}, ${detectedStateName}`;
              if (!formData.address) {
                detectedAddress = `${localityName}, ${detectedDistrict}`;
              }
            } else {
              throw new Error("BigDataCloud failed");
            }
          } catch (e2) {
            // Layer 3 fallback: intelligent geometric matching
            sourceUsed = "GPS Satellite Distance Metric";
            const { state, district } = findNearestStateAndDistrict(lat, lon);
            detectedStateCode = state.code;
            detectedStateName = state.name;
            detectedDistrict = district;
            displayLocation = `${district}, ${state.name}`;
          }
        }

        // Apply to form data
        setFormData((prev) => ({
          ...prev,
          locationType: "GPS",
          latitude: lat,
          longitude: lon,
          stateCode: detectedStateCode,
          stateName: detectedStateName,
          district: detectedDistrict,
          pinCode: detectedPinCode || prev.pinCode,
          address: detectedAddress || prev.address || `${detectedDistrict}, ${detectedStateName}`,
        }));

        setTakenLocationInfo({
          displayName: displayLocation || `${detectedDistrict}, ${detectedStateName} - ${detectedPinCode || "India"}`,
          locality: localityName,
          district: detectedDistrict,
          state: detectedStateName,
          stateCode: detectedStateCode,
          pinCode: detectedPinCode,
          lat,
          lon,
          accuracy,
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          source: sourceUsed,
        });

        setIsDetectingGps(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        let errorMsg = "Unable to retrieve GPS coordinates. ";
        if (err.code === 1) {
          errorMsg = "Location permission was denied by your browser. Please allow location permissions to take your current location, or enter your State and District manually.";
        } else if (err.code === 2) {
          errorMsg = "Location position is currently unavailable from your device.";
        } else if (err.code === 3) {
          errorMsg = "GPS location request timed out. Please try again or select manually.";
        } else {
          errorMsg += err.message;
        }
        setGpsError(errorMsg);
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Text-to-Speech handler for each question
  const handleSpeakQuestion = (qNumber: number, textToSpeak: string) => {
    if (activeSpeakingQ === qNumber) {
      if (activeCancelSpeechRef.current) activeCancelSpeechRef.current();
      setActiveSpeakingQ(null);
      return;
    }

    if (activeCancelSpeechRef.current) activeCancelSpeechRef.current();

    setActiveSpeakingQ(qNumber);
    activeCancelSpeechRef.current = speakText(
      textToSpeak,
      currentLang,
      () => setActiveSpeakingQ(qNumber),
      () => setActiveSpeakingQ(null),
      qNumber
    );
  };

  // Speech-to-Text handler for each individual question
  const handleToggleListen = (qNumber: number) => {
    if (activeListeningQ === qNumber) {
      if (activeRecognizerRef.current) {
        activeRecognizerRef.current.stop();
      }
      setActiveListeningQ(null);
      return;
    }

    if (activeRecognizerRef.current) {
      activeRecognizerRef.current.stop();
    }

    setLiveTranscript("");
    setActiveListeningQ(qNumber);

    const recognizer = createSpeechRecognizer(
      currentLang,
      (transcript, isFinal) => {
        setLiveTranscript(transcript);
        processVoiceAnswerForQuestion(qNumber, transcript);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setActiveListeningQ(null);
      },
      () => {
        setActiveListeningQ(null);
      }
    );

    if (recognizer) {
      activeRecognizerRef.current = recognizer;
      recognizer.start();
    }
  };

  // Process voice answers based on active question index
  const processVoiceAnswerForQuestion = (qNumber: number, transcript: string) => {
    const lower = transcript.toLowerCase();
    const num = extractNumberFromSpeech(transcript);

    switch (qNumber) {
      case 1: // Name & Phone
        if (num && String(num).length >= 8) {
          setFormData((prev) => ({ ...prev, contactNumber: `+91 ${num}` }));
        } else if (transcript.trim().length > 2) {
          setFormData((prev) => ({ ...prev, applicantName: transcript.trim() }));
        }
        break;

      case 2: // Age
        if (num && num >= 18 && num <= 80) {
          const currentYear = new Date().getFullYear();
          const birthYear = currentYear - num;
          setFormData((prev) => ({
            ...prev,
            age: num,
            dateOfBirth: `${birthYear}-01-01`,
          }));
        }
        break;

      case 3: // State
        const foundState = PAN_INDIA_STATES.find(
          (s) =>
            lower.includes(s.name.toLowerCase()) ||
            lower.includes(s.code.toLowerCase())
        );
        if (foundState) {
          handleStateChange(foundState.code);
        }
        break;

      case 4: // District
        const foundDistrict = availableDistricts.find((d) =>
          lower.includes(d.toLowerCase())
        );
        if (foundDistrict) {
          setFormData((prev) => ({ ...prev, district: foundDistrict }));
        }
        break;

      case 5: // Location & Pin code
        if (num && String(num).length === 6) {
          setFormData((prev) => ({ ...prev, pinCode: String(num) }));
        } else if (transcript.trim().length > 3) {
          setFormData((prev) => ({ ...prev, address: transcript.trim() }));
        }
        break;

      case 6: // Caste / Social Category
        if (lower.includes("scheduled tribe") || lower.includes("st") || lower.includes("adivasi") || lower.includes("గిరిజన") || lower.includes("जनजाति")) {
          setFormData((prev) => ({ ...prev, casteCategory: "ST", isScheduledCaste: false }));
        } else if (lower.includes("non creamy") || lower.includes("obc ncl") || lower.includes("ncl")) {
          setFormData((prev) => ({ ...prev, casteCategory: "OBC_NCL", isScheduledCaste: false }));
        } else if (lower.includes("creamy layer") || lower.includes("obc cl")) {
          setFormData((prev) => ({ ...prev, casteCategory: "OBC_CL", isScheduledCaste: false }));
        } else if (lower.includes("obc") || lower.includes("backward class") || lower.includes("వెనుకబడిన") || lower.includes("पिछड़ा")) {
          setFormData((prev) => ({ ...prev, casteCategory: "OBC", isScheduledCaste: false }));
        } else if (lower.includes("ews") || lower.includes("economically weaker")) {
          setFormData((prev) => ({ ...prev, casteCategory: "EWS", isScheduledCaste: false }));
        } else if (lower.includes("ebc")) {
          setFormData((prev) => ({ ...prev, casteCategory: "EBC", isScheduledCaste: false }));
        } else if (lower.includes("general") || lower.includes("open category") || lower.includes("oc") || lower.includes("ur") || lower.includes("unreserved")) {
          setFormData((prev) => ({ ...prev, casteCategory: "GEN", isScheduledCaste: false }));
        } else if (lower.includes("pwd") || lower.includes("disability") || lower.includes("divyang") || lower.includes("దివ్యాంగ") || lower.includes("विकलांग")) {
          setFormData((prev) => ({ ...prev, casteCategory: "PWD", isScheduledCaste: false }));
        } else if (lower.includes("muslim") || lower.includes("mus")) {
          setFormData((prev) => ({ ...prev, casteCategory: "MIN_MUS", isScheduledCaste: false }));
        } else if (lower.includes("christian") || lower.includes("chr")) {
          setFormData((prev) => ({ ...prev, casteCategory: "MIN_CHR", isScheduledCaste: false }));
        } else if (lower.includes("sikh") || lower.includes("sik")) {
          setFormData((prev) => ({ ...prev, casteCategory: "MIN_SIK", isScheduledCaste: false }));
        } else if (lower.includes("buddhist") || lower.includes("bud")) {
          setFormData((prev) => ({ ...prev, casteCategory: "MIN_BUD", isScheduledCaste: false }));
        } else if (lower.includes("jain") || lower.includes("jai")) {
          setFormData((prev) => ({ ...prev, casteCategory: "MIN_JAI", isScheduledCaste: false }));
        } else if (lower.includes("parsi") || lower.includes("par")) {
          setFormData((prev) => ({ ...prev, casteCategory: "MIN_PAR", isScheduledCaste: false }));
        } else if (lower.includes("dnt") || lower.includes("denotified")) {
          setFormData((prev) => ({ ...prev, casteCategory: "DNT", isScheduledCaste: false }));
        } else if (lower.includes("nt") || lower.includes("nomadic")) {
          setFormData((prev) => ({ ...prev, casteCategory: "NT", isScheduledCaste: false }));
        } else if (lower.includes("snt") || lower.includes("semi nomadic")) {
          setFormData((prev) => ({ ...prev, casteCategory: "SNT", isScheduledCaste: false }));
        } else if (lower.includes("sc") || lower.includes("scheduled caste") || lower.includes("హరిజన") || lower.includes("अनुसूचित जाति")) {
          setFormData((prev) => ({ ...prev, casteCategory: "SC", isScheduledCaste: true }));
        }
        break;

      case 7: // Educational Qualification
        const matchedQual = EDUCATIONAL_QUALIFICATIONS.find((q) =>
          lower.includes(q.label.toLowerCase()) || lower.includes(q.id.toLowerCase())
        );
        if (matchedQual) {
          setFormData((prev) => ({ ...prev, qualification: matchedQual.id }));
        }
        break;

      case 8: // Annual Income
        if (num && num > 1000) {
          setFormData((prev) => ({ ...prev, annualIncome: num }));
        }
        break;

      case 9: // Assistance & Business Type
        const matchedAssistance = ASSISTANCE_TYPES.find((a) =>
          lower.includes(a.label.toLowerCase()) || lower.includes(a.id.toLowerCase())
        );
        if (matchedAssistance) {
          setFormData((prev) => ({
            ...prev,
            assistanceType: matchedAssistance.id,
            projectCost: matchedAssistance.defaultCost,
          }));
        }

        const matchedBiz = BUSINESS_TYPES.find((b) =>
          lower.includes(b.label.toLowerCase()) || lower.includes(b.id.toLowerCase())
        );
        if (matchedBiz) {
          setFormData((prev) => ({ ...prev, businessType: matchedBiz.id }));
        }
        break;

      case 10: // Existing Loan (Yes/No & Amount)
        if (
          lower.includes("yes") ||
          lower.includes("हाँ") ||
          lower.includes("అవును") ||
          lower.includes("ஆம்")
        ) {
          setFormData((prev) => ({ ...prev, hasExistingLoan: true }));
        } else if (
          lower.includes("no") ||
          lower.includes("नहीं") ||
          lower.includes("కాదు")
        ) {
          setFormData((prev) => ({
            ...prev,
            hasExistingLoan: false,
            existingLoanAmount: 0,
            outstandingAmount: 0,
          }));
        }
        if (num && num > 500) {
          setFormData((prev) => ({
            ...prev,
            hasExistingLoan: true,
            existingLoanAmount: num,
            outstandingAmount: Math.round(num * 0.4),
          }));
        }
        break;

      case 11: // Project Estimated Cost
        if (num && num >= 10000) {
          setFormData((prev) => ({ ...prev, projectCost: num }));
        }
        break;

      default:
        break;
    }
  };

  // Helper to validate and return list of missed questions
  const getValidationErrors = () => {
    const errors: Array<{
      qNum: number;
      title: string;
      message: string;
      cardId: string;
      fieldId?: string;
    }> = [];

    // Question 1: Name, Phone, Gender
    if (!formData.applicantName || formData.applicantName.trim().length < 2) {
      errors.push({
        qNum: 1,
        title: "Applicant Legal Full Name",
        message: "Please enter applicant full legal name as per official records.",
        cardId: "intake-q1",
        fieldId: "applicant-name-input",
      });
    }
    if (!formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber.trim())) {
      errors.push({
        qNum: 1,
        title: "Contact Mobile Number",
        message: "Please enter a valid 10-digit Aadhaar-linked mobile number.",
        cardId: "intake-q1",
        fieldId: "contact-number-input",
      });
    }
    if (!formData.gender) {
      errors.push({
        qNum: 1,
        title: "Applicant Gender",
        message: "Please select applicant gender (Female / Male / Transgender).",
        cardId: "intake-q1",
      });
    }

    // Question 2: DOB & Age
    if (!formData.dateOfBirth) {
      errors.push({
        qNum: 2,
        title: "Date of Birth",
        message: "Please select your date of birth using the calendar.",
        cardId: "intake-q2",
        fieldId: "dob-input",
      });
    } else if (formData.age < 18 || formData.age > 75) {
      errors.push({
        qNum: 2,
        title: "Applicant Age Limit",
        message: "Applicant must be between 18 and 75 years of age for statutory credit.",
        cardId: "intake-q2",
        fieldId: "age-input",
      });
    }

    // Question 3: State
    if (!formData.stateCode || !formData.stateName) {
      errors.push({
        qNum: 3,
        title: "State Selection",
        message: "Please select your State or Union Territory.",
        cardId: "intake-q3",
        fieldId: "state-select",
      });
    }

    // Question 4: District
    if (!formData.district || formData.district.trim() === "") {
      errors.push({
        qNum: 4,
        title: "District Selection",
        message: "Please select your District for local branch / SCA routing.",
        cardId: "intake-q4",
        fieldId: "district-select",
      });
    }

    // Question 5: Address & PIN Code
    if (!formData.address || formData.address.trim().length < 3) {
      errors.push({
        qNum: 5,
        title: "Local Address",
        message: "Please enter your Village / Town / Street Address (or click 'Take Current Location').",
        cardId: "intake-q5",
        fieldId: "address-input",
      });
    }
    if (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode.trim())) {
      errors.push({
        qNum: 5,
        title: "Postal PIN Code",
        message: "Please enter a valid 6-digit postal PIN code.",
        cardId: "intake-q5",
        fieldId: "pincode-input",
      });
    }

    // Question 6: Caste Category
    if (!formData.casteCategory) {
      errors.push({
        qNum: 6,
        title: "Social / Caste Category",
        message: "Please select your Social / Affirmative Caste Category.",
        cardId: "intake-q6",
      });
    }

    // Question 7: Educational Qualification
    if (!formData.qualification) {
      errors.push({
        qNum: 7,
        title: "Educational Qualification",
        message: "Please select your highest completed educational qualification.",
        cardId: "intake-q7",
        fieldId: "qualification-select",
      });
    } else if (formData.qualification === "OTHER" && !formData.qualificationOther?.trim()) {
      errors.push({
        qNum: 7,
        title: "Other Qualification Specification",
        message: "Please specify your qualification details.",
        cardId: "intake-q7",
        fieldId: "qualification-other-input",
      });
    }

    // Question 8: Annual Income
    const catObj = getCasteCategoryById(formData.casteCategory);
    const ceiling = catObj.incomeCeiling || 500000;
    if (!formData.annualIncome || formData.annualIncome <= 0) {
      errors.push({
        qNum: 8,
        title: "Annual Family Income",
        message: "Please enter your total annual family income (in Rupees).",
        cardId: "intake-q8",
        fieldId: "annual-income-input",
      });
    } else if (formData.annualIncome > ceiling) {
      errors.push({
        qNum: 8,
        title: "Statutory Income Ceiling Exceeded",
        message: `Annual family income (₹ ${formData.annualIncome.toLocaleString("en-IN")}) exceeds the ₹ ${ceiling.toLocaleString("en-IN")} limit for ${catObj.label}.`,
        cardId: "intake-q8",
        fieldId: "annual-income-input",
      });
    }

    // Question 9: Financial Assistance & Business Activity
    if (!formData.assistanceType) {
      errors.push({
        qNum: 9,
        title: "Assistance Loan Purpose",
        message: "Please select the financial assistance loan purpose.",
        cardId: "intake-q9",
        fieldId: "assistance-select",
      });
    } else if (formData.assistanceType === "OTHER" && !formData.assistanceTypeOther?.trim()) {
      errors.push({
        qNum: 9,
        title: "Other Assistance Specification",
        message: "Please specify your loan assistance requirement.",
        cardId: "intake-q9",
      });
    }
    if (formData.assistanceType === "BUSINESS") {
      if (!formData.businessType) {
        errors.push({
          qNum: 9,
          title: "Commercial Business Sector",
          message: "Please select your commercial trade / enterprise sector.",
          cardId: "intake-q9",
        });
      } else if (formData.businessType === "OTHER" && !formData.businessTypeOther?.trim()) {
        errors.push({
          qNum: 9,
          title: "Other Business Specification",
          message: "Please specify your commercial business trade.",
          cardId: "intake-q9",
        });
      }
    }

    // Question 10: Existing Loan
    if (formData.hasExistingLoan && (!formData.existingLoanAmount || formData.existingLoanAmount <= 0)) {
      errors.push({
        qNum: 10,
        title: "Existing Loan Amount",
        message: "Please enter the original sanctioned amount of your existing loan.",
        cardId: "intake-q10",
        fieldId: "existing-loan-amount-input",
      });
    }

    // Question 11: Project Estimated Cost
    if (!formData.projectCost || formData.projectCost < 10000) {
      errors.push({
        qNum: 11,
        title: "Project Estimated Cost",
        message: "Please enter valid project estimated cost (minimum ₹ 10,000).",
        cardId: "intake-q11",
        fieldId: "project-cost-input",
      });
    }

    return errors;
  };

  const scrollToQuestion = (cardId: string, fieldId?: string) => {
    const el = document.getElementById(cardId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if (fieldId) {
        setTimeout(() => {
          document.getElementById(fieldId)?.focus();
        }, 400);
      }
    }
  };

  // Validation and Step 2 Submission
  const handleProceed = () => {
    setHasAttemptedSubmit(true);
    const errors = getValidationErrors();

    if (errors.length > 0) {
      setMissedQuestions(errors);
      setValidationError(`Please answer all ${errors.length} missed question(s) before proceeding.`);

      // Smoothly scroll to the submit validation alert box
      setTimeout(() => {
        const submitAlertEl = document.getElementById("submit-validation-alert");
        if (submitAlertEl) {
          submitAlertEl.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const firstCardEl = document.getElementById(errors[0].cardId);
          if (firstCardEl) {
            firstCardEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 50);
      return; // DO NOT GO TO NEXT STEP!
    }

    setMissedQuestions([]);
    setValidationError(null);

    // Save draft in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("samriddhi_draft_application", JSON.stringify(formData));
    }

    onComplete(formData);
  };

  // Estimated Government Share and Beneficiary Margin
  const selectedCat = getCasteCategoryById(formData.casteCategory);
  const govtSharePct = formData.gender === "FEMALE" && formData.projectCost <= 140000 ? 95 : (selectedCat.maxGovtShare || 90);
  const estimatedGovtLoan = Math.round((formData.projectCost * govtSharePct) / 100);
  const estimatedMargin = formData.projectCost - estimatedGovtLoan;

  // Formal application data object for preview
  const formalAppData: FormalApplicationData = {
    applicationId: `APP-2026-${formData.stateCode}${Math.floor(1000 + Math.random() * 9000)}`,
    applicantName: formData.applicantName,
    contactNumber: formData.contactNumber,
    gender: formData.gender,
    dateOfBirth: formData.dateOfBirth,
    age: formData.age,
    isScheduledCaste: formData.casteCategory === "SC",
    stateCode: formData.stateCode,
    stateName: formData.stateName,
    district: formData.district,
    address: formData.address,
    pinCode: formData.pinCode,
    latitude: formData.latitude,
    longitude: formData.longitude,
    qualification:
      formData.qualification === "OTHER"
        ? formData.qualificationOther || "Other Qualification"
        : EDUCATIONAL_QUALIFICATIONS.find((q) => q.id === formData.qualification)?.label || "Graduate",
    annualIncome: formData.annualIncome,
    assistanceType:
      formData.assistanceType === "OTHER"
        ? formData.assistanceTypeOther || "Other Assistance"
        : ASSISTANCE_TYPES.find((a) => a.id === formData.assistanceType)?.label || "Business / Enterprise Loan",
    businessType:
      formData.businessType === "OTHER"
        ? formData.businessTypeOther || "Other Commercial Activity"
        : BUSINESS_TYPES.find((b) => b.id === formData.businessType)?.label || "Retail / Store",
    hasExistingLoan: formData.hasExistingLoan,
    existingLoanAmount: formData.existingLoanAmount,
    outstandingAmount: formData.outstandingAmount,
    projectCost: formData.projectCost,
    principalLoanAmount: estimatedGovtLoan,
    beneficiaryMarginMoney: estimatedMargin,
    interestRate: formData.gender === "FEMALE" ? 5.0 : 6.5,
    tenureYears: 3,
    moratoriumMonths: 3,
    monthlyEmi: Math.round((estimatedGovtLoan * 0.05 * 1.15) / 36),
    partnerName: `${formData.stateName} State SC Cooperative Finance Corporation`,
    branchName: `District Branch Office ${formData.district}`,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Section Header with Multi-Lingual Instructions */}
      <div className="bg-gradient-to-r from-[#002147] via-[#003366] to-[#002147] text-white p-6 sm:p-8 rounded-3xl border-2 border-gov-gold/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 text-gov-saffron border border-gov-saffron/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("intake.progress") || "Step 1 of 4 • Identity & Project Assessment"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t("intake.title") || "Citizen Concessional Credit Intake (Step 1 of 4)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
              {t("intake.subtitle") ||
                "Please answer all 11 statutory eligibility questions below on this single page. You can click 🔊 to listen to any question in your selected language or click 🎙️ on any answer field to speak your response."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleSpeakQuestion(
                  0,
                  `${t("intake.title")}. ${t("intake.subtitle")}`
                )
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all shadow-md cursor-pointer ${activeSpeakingQ === 0
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-gov-saffron hover:bg-amber-400 text-slate-950"
                }`}
            >
              {activeSpeakingQ === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{activeSpeakingQ === 0 ? "Stop Audio" : t("intake.listenAll") || "🔊 Listen Instructions"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFormalAppOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border border-white/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-gov-gold" />
              <span>{t("intake.viewFormalApp") || "View Formal Form"}</span>
            </button>
          </div>
        </div>

        {/* Live Audio Listening Banner */}
        {activeListeningQ !== null && (
          <div className="bg-red-950/90 border-2 border-red-400 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div>
                <div className="text-xs font-bold text-red-200 uppercase tracking-wider">
                  {t("intake.micListening") || "🎙️ Listening Live in"} <strong>{VOICE_LOCALE_MAP[currentLang]?.name || "English"}</strong>...
                </div>
                <div className="text-sm font-mono text-gov-gold italic">
                  {liveTranscript ? `"${liveTranscript}"` : "Speak your answer clearly..."}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleListen(activeListeningQ)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all"
            >
              {t("intake.clickToStop") || "Stop Recording"}
            </button>
          </div>
        )}
      </div>

      {/* Top Banner Missed Validation Alert */}
      {hasAttemptedSubmit && missedQuestions.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 text-red-950 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-shake">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <strong className="text-sm font-black text-red-950 block">
                Please Answer Missed Questions ({missedQuestions.length} Incomplete)
              </strong>
              <span className="text-xs text-red-800">
                You cannot proceed to Step 2 until all required questions are answered. Look for red marks on the questions below.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("submit-validation-alert");
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3.5 py-2 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            View Missed List ↓
          </button>
        </div>
      )}

      {/* 11 QUESTIONS CONTAINER */}
      <div className="space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 1: FULL NAME & PHONE NUMBER & GENDER */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ1Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 1);
          const q1Errors = missedQuestions.filter((m) => m.qNum === 1);
          return (
            <div
              id="intake-q1"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ1Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ1Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    1
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q1_title") || "1. Enter your Full Name and Mobile Number"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q1_desc") || "Please provide your official legal name and Aadhaar-linked 10-digit mobile number."}
                    </p>
                  </div>
                </div>

                {/* Question Speaker & Mic Tools */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        1,
                        `${t("intake.q1_title")}. ${t("intake.q1_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 1
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 1 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(1)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 1
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak answer for Name/Phone"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Red Missed Error Alert */}
              {isQ1Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 1:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q1Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t("intake.nameLabel") || "Full Legal Name"} *</span>
                  </label>
                  <input
                    id="applicant-name-input"
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder={t("intake.namePlaceholder") || "Enter your full legal name as per official records"}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 focus:outline-none ${
                      hasAttemptedSubmit && (!formData.applicantName || formData.applicantName.trim().length < 2)
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t("intake.phoneLabel") || "Mobile / Contact Number"} *</span>
                    </label>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      formData.contactNumber.length === 10
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {formData.contactNumber.length}/10 {formData.contactNumber.length === 10 ? "✓ Valid" : "Digits"}
                    </span>
                  </div>
                  <input
                    id="contact-number-input"
                    type="tel"
                    maxLength={10}
                    value={formData.contactNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, contactNumber: val });
                    }}
                    placeholder={t("intake.phonePlaceholder") || "Enter 10-digit mobile number"}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none ${
                      hasAttemptedSubmit && (!formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber.trim()))
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                    }`}
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5 pt-2">
                  <label className="text-xs font-black text-slate-700">
                    {t("intake.genderLabel") || "Applicant Gender (Determines Special Women Concessional 5% Interest Rate)"} *
                  </label>
                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-1 rounded-xl ${
                    hasAttemptedSubmit && !formData.gender ? "ring-2 ring-red-400 bg-red-50/50 p-2" : ""
                  }`}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                      className={`p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center space-x-2 ${formData.gender === "FEMALE"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <span>👩 {t("intake.genderFemale") || "Female (Concessional 5% Rate)"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "MALE" })}
                      className={`p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center space-x-2 ${formData.gender === "MALE"
                          ? "border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-400"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <span>👨 {t("intake.genderMale") || "Male (Standard Rate)"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "OTHER" })}
                      className={`p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center space-x-2 ${formData.gender === "OTHER"
                          ? "border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-400"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <span>🧑 {t("intake.genderOther") || "Transgender / Other"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 2: AGE & DATE OF BIRTH CALENDAR */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ2Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 2);
          const q2Errors = missedQuestions.filter((m) => m.qNum === 2);
          return (
            <div
              id="intake-q2"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ2Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ2Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    2
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q2_title") || "2. Enter your Age / Date of Birth"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q2_desc") || "Select your birth date using the calendar or enter your age directly."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        2,
                        `${t("intake.q2_title")}. ${t("intake.q2_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 2
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 2 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(2)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 2
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Age / Date of Birth"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Red Missed Error Alert */}
              {isQ2Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 2:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q2Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t("intake.dobLabel") || "Date of Birth (Calendar Selection)"} *</span>
                  </label>
                  <input
                    id="dob-input"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none ${
                      hasAttemptedSubmit && !formData.dateOfBirth
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">
                      {t("intake.ageLabel") || "Calculated Age:"}
                    </span>
                    <span className="text-2xl font-black text-[#002147]">
                      {formData.age} <span className="text-xs text-slate-600 font-bold">{t("intake.yearsOld") || "Years Old"}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="age-input"
                      type="range"
                      min={18}
                      max={70}
                      value={formData.age}
                      onChange={(e) => {
                        const newAge = parseInt(e.target.value);
                        const birthYear = new Date().getFullYear() - newAge;
                        setFormData({
                          ...formData,
                          age: newAge,
                          dateOfBirth: `${birthYear}-01-01`,
                        });
                      }}
                      className="w-32 accent-[#002147]"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 3: STATE */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ3Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 3);
          const q3Errors = missedQuestions.filter((m) => m.qNum === 3);
          return (
            <div
              id="intake-q3"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ3Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ3Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    3
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q3_title") || "3. State / Union Territory"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q3_desc") || "Select the Indian State or Union Territory where the project/business will operate."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        3,
                        `${t("intake.q3_title")}. ${t("intake.q3_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 3
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 3 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(3)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 3
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak State name"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ3Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 3:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q3Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <select
                  id="state-select"
                  value={formData.stateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none cursor-pointer ${
                    isQ3Missed && (!formData.stateCode || !formData.stateName)
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                  }`}
                >
                  <option value="">-- Select State / Union Territory --</option>
                  {PAN_INDIA_STATES.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 4: DISTRICT */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ4Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 4);
          const q4Errors = missedQuestions.filter((m) => m.qNum === 4);
          return (
            <div
              id="intake-q4"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ4Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ4Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    4
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q4_title") || "4. District"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q4_desc") || "Select the district for local State Channelizing Agency (SCA) or Bank Branch routing."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        4,
                        `${t("intake.q4_title")}. ${t("intake.q4_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 4
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 4 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(4)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 4
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak District name"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ4Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 4:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q4Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <select
                  id="district-select"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none cursor-pointer ${
                    isQ4Missed && (!formData.district || formData.district.trim() === "")
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                  }`}
                >
                  <option value="">-- Select District in {formData.stateName || "State"} --</option>
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 5: LOCATION & PIN CODE */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ5Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 5);
          const q5Errors = missedQuestions.filter((m) => m.qNum === 5);
          return (
            <div
              id="intake-q5"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ5Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ5Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    5
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q5_title") || "5. Location & Postal PIN Code"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q5_desc") || "Detect your exact GPS location or enter your village/town address and 6-digit postal PIN code."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        5,
                        `${t("intake.q5_title")}. ${t("intake.q5_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 5
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 5 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(5)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 5
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Location / Address"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ5Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 5:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q5Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                {/* Real GPS Geolocation Trigger */}
                <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-[#002147] flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">
                        {t("intake.gpsSuccess") || "GPS Satellite Position:"}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-600">
                        {formData.latitude
                          ? `${formData.latitude.toFixed(4)}° N, ${formData.longitude?.toFixed(4)}° E`
                          : "Click 'Take Current Location' to fetch coordinates"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectGps}
                    disabled={isDetectingGps}
                    className="w-full sm:w-auto bg-[#002147] hover:bg-blue-900 active:scale-95 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2.5 shadow-md cursor-pointer transition-all shrink-0"
                  >
                    <LocateFixed className={`w-4 h-4 ${isDetectingGps ? "animate-spin text-gov-gold" : "text-gov-gold"}`} />
                    <span>{isDetectingGps ? "Fetching GPS Location..." : "📍 Take Current Location"}</span>
                  </button>
                </div>

                {/* GPS Error Notification if Denied/Failed */}
                {gpsError && (
                  <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-3.5 rounded-xl text-xs font-bold flex items-start space-x-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="block text-amber-900">Location Access Notice:</strong>
                      <span>{gpsError}</span>
                    </div>
                  </div>
                )}

                {/* TAKEN LOCATION CONFIRMATION CARD (Properly mentions taken location details) */}
                {takenLocationInfo && (
                  <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 sm:p-5 rounded-2xl space-y-3.5 animate-fadeIn shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200 pb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                          ✓
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                            Current Location Taken Successfully
                          </span>
                          <span className="text-xs sm:text-sm font-black text-emerald-950">
                            {takenLocationInfo.displayName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-200/90 text-emerald-900 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          {takenLocationInfo.source}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700">
                          🕒 {takenLocationInfo.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white/85 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">Taken State</span>
                        <strong className="text-slate-900 text-xs sm:text-sm block truncate">{takenLocationInfo.state} ({takenLocationInfo.stateCode})</strong>
                      </div>
                      <div className="bg-white/85 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">Taken District</span>
                        <strong className="text-slate-900 text-xs sm:text-sm block truncate">{takenLocationInfo.district}</strong>
                      </div>
                      <div className="bg-white/85 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">Postal PIN</span>
                        <strong className="text-emerald-800 text-xs sm:text-sm font-mono block">{takenLocationInfo.pinCode || "Auto-assigned"}</strong>
                      </div>
                      <div className="bg-white/85 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">GPS Accuracy</span>
                        <strong className="text-slate-800 text-[11px] font-mono block">
                          {takenLocationInfo.lat.toFixed(4)}°, {takenLocationInfo.lon.toFixed(4)}°
                        </strong>
                        {takenLocationInfo.accuracy ? (
                          <span className="text-[10px] text-emerald-700 font-semibold">±{Math.round(takenLocationInfo.accuracy)}m radius</span>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1.5 pt-0.5">
                      <span>📍</span>
                      <span>
                        Your State ({takenLocationInfo.state}), District ({takenLocationInfo.district}), Postal PIN ({takenLocationInfo.pinCode || "Auto"}), and Street Address were automatically synced into your application!
                      </span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-black text-slate-700">
                      {t("intake.manualAddress") || "Village / Town / Street Address"} *
                    </label>
                    <input
                      id="address-input"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t("intake.addressPlaceholder") || "Enter local street, village or town address"}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 focus:outline-none ${
                        hasAttemptedSubmit && (!formData.address || formData.address.trim().length < 3)
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">
                      {t("intake.pincodeLabel") || "Postal PIN Code (6-digits)"} *
                    </label>
                    <input
                      id="pincode-input"
                      type="text"
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, "") })}
                      placeholder={t("intake.pincodePlaceholder") || "e.g. 533001"}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none ${
                        hasAttemptedSubmit && (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode.trim()))
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 6: SOCIAL / CASTE CATEGORY SELECTION */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ6Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 6);
          const q6Errors = missedQuestions.filter((m) => m.qNum === 6);
          return (
            <div
              id="intake-q6"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-5 ${
                isQ6Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ6Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    6
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q6_title") || "6. Select your Social / Caste Category"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q6_desc") || "In general: across all central ministries and state governments, India has over 5,000 welfare schemes. Select your category to view customized concessional schemes."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        6,
                        `${t("intake.q6_title") || "Select your Social or Caste Category"}. Across all central ministries and state governments, India has over 5,000 welfare schemes.`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 6
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 6 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(6)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 6
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak your Caste / Category"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ6Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 6:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q6Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5,000+ Schemes National Context Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-[#002147] text-white p-3.5 rounded-xl border border-gov-gold/40 flex items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🏛️</span>
                  <span className="font-bold">
                    <strong>Universal Affirmative Inclusivity:</strong> across all central ministries and state governments, India has over <strong>5,000 welfare schemes</strong>.
                  </span>
                </div>
                <span className="bg-gov-gold text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase shrink-0">
                  All Castes Supported
                </span>
              </div>

              {/* Caste / Social Categories Grid */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-700 block">
                  Choose your social / affirmative category: *
                </label>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1 rounded-2xl ${
                  isQ6Missed ? "ring-2 ring-red-400 bg-red-50/40" : ""
                }`}>
                  {ALL_CASTE_CATEGORIES.map((cat) => {
                    const isSelected = formData.casteCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            casteCategory: cat.id,
                            isScheduledCaste: cat.id === "SC",
                          })
                        }
                        className={`p-3.5 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between space-y-2 cursor-pointer ${
                          isSelected
                            ? "border-[#002147] bg-slate-50 ring-2 ring-[#002147]/20 shadow-md"
                            : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{cat.icon}</span>
                            <div>
                              <div className="text-xs font-black text-slate-900">{cat.label}</div>
                              <div className="text-[10px] font-semibold text-slate-500">{cat.groupLabel}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 font-bold">
                          <span className="text-slate-600">Rate: {cat.concessionalRateFemale}% - {cat.concessionalRateMale}%</span>
                          <span className="text-gov-navy truncate max-w-[120px]">{cat.apexCorporation.split(" ")[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Selected Category Detailed Inspection Box */}
                {(() => {
                  const activeCat = getCasteCategoryById(formData.casteCategory);
                  return (
                    <div className="bg-emerald-50/80 border-2 border-emerald-300 p-4 rounded-xl space-y-2 text-xs text-emerald-950 animate-fadeIn">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2 font-black text-emerald-900 text-sm">
                          <span>{activeCat.icon}</span>
                          <span>Selected Category: {activeCat.label}</span>
                        </div>
                        <span className="bg-emerald-200 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          Apex: {activeCat.apexCorporation.split(" ")[0]}
                        </span>
                      </div>

                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        {activeCat.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-[11px] font-semibold">
                        <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                          <span className="text-slate-500 block text-[9px] uppercase">Financing Body</span>
                          <strong className="text-slate-900">{activeCat.apexCorporation}</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                          <span className="text-slate-500 block text-[9px] uppercase">Statutory Income Cap</span>
                          <strong className="text-emerald-800">≤ ₹ {activeCat.incomeCeiling.toLocaleString()} / year</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                          <span className="text-slate-500 block text-[9px] uppercase">Proof Document</span>
                          <strong className="text-slate-900">{activeCat.certificateType}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 7: EDUCATIONAL QUALIFICATIONS */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ7Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 7);
          const q7Errors = missedQuestions.filter((m) => m.qNum === 7);
          return (
            <div
              id="intake-q7"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ7Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ7Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    7
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q7_title") || "7. Educational Qualifications"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q7_desc") || "Select your highest completed educational level. If not listed, select 'Other' and specify."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        7,
                        `${t("intake.q7_title")}. ${t("intake.q7_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 7
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 7 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(7)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 7
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Qualification"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ7Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 7:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q7Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <select
                  id="qualification-select"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none cursor-pointer ${
                    isQ7Missed && !formData.qualification
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                  }`}
                >
                  <option value="">-- Select Highest Educational Qualification --</option>
                  {EDUCATIONAL_QUALIFICATIONS.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.label}
                    </option>
                  ))}
                </select>

                {formData.qualification === "OTHER" && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-black text-slate-700">
                      {t("intake.otherQualLabel") || "Please specify your qualification:"} *
                    </label>
                    <input
                      id="qualification-other-input"
                      type="text"
                      value={formData.qualificationOther}
                      onChange={(e) => setFormData({ ...formData, qualificationOther: e.target.value })}
                      placeholder={t("intake.otherQualPlaceholder") || "e.g. Diploma in Mechanical Engineering, B.Com"}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 focus:outline-none ${
                        hasAttemptedSubmit && !formData.qualificationOther?.trim()
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 8: ANNUAL FAMILY INCOME */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ8Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 8);
          const q8Errors = missedQuestions.filter((m) => m.qNum === 8);
          const activeCategory = getCasteCategoryById(formData.casteCategory);
          const activeCeiling = activeCategory.incomeCeiling || 500000;
          return (
            <div
              id="intake-q8"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ8Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ8Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    8
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q8_title") || "8. Annual Family Income (₹)"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enter total annual family income from all sources. Statutory ceiling for {activeCategory.label} is ₹ {activeCeiling.toLocaleString("en-IN")} / year.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        8,
                        `${t("intake.q8_title")}. ${t("intake.q8_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 8
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 8 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(8)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 8
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Annual Income"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ8Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 8:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q8Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold text-base">₹</span>
                  <input
                    id="annual-income-input"
                    type="number"
                    min={0}
                    max={2000000}
                    step={10000}
                    value={formData.annualIncome || ""}
                    onChange={(e) => setFormData({ ...formData, annualIncome: parseFloat(e.target.value) || 0 })}
                    placeholder={t("intake.incomePlaceholder") || "e.g. 180000"}
                    className={`w-full pl-9 pr-4 py-3 rounded-xl border text-base sm:text-lg font-black font-mono text-slate-900 focus:outline-none ${
                      isQ8Missed
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                    }`}
                  />
                </div>

                {/* Quick Income Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold">{t("intake.incomeQuick") || "Quick Select:"}</span>
                  {[120000, 180000, 240000, 360000, 480000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({ ...formData, annualIncome: amt })}
                      className={`px-3 py-1 rounded-lg border font-mono font-bold transition-colors cursor-pointer ${formData.annualIncome === amt
                          ? "bg-[#002147] text-white border-[#002147]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      ₹ {(amt / 100000).toFixed(2)} Lakhs
                    </button>
                  ))}
                </div>

                {/* Statutory Income Check Feedback */}
                {formData.annualIncome > activeCeiling ? (
                  <div className="bg-red-50 border border-red-300 text-red-900 p-3 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      ⚠️ Alert: Annual income exceeds ₹ {activeCeiling.toLocaleString("en-IN")} statutory limit for {activeCategory.label}. Beneficiary will not be eligible under concessional rules.
                    </span>
                  </div>
                ) : formData.annualIncome > 0 ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                    <span>✓ Statutory Income Check Passed (≤ ₹ {activeCeiling.toLocaleString("en-IN")} / year for {activeCategory.label})</span>
                    <span className="font-mono bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px]">ELIGIBLE</span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 9: TYPE OF ASSISTANCE & SUB-QUESTION (BUSINESS TYPE) */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ9Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 9);
          const q9Errors = missedQuestions.filter((m) => m.qNum === 9);
          return (
            <div
              id="intake-q9"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ9Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ9Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    9
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q9_title") || "9. What type of assistance are you looking for?"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q9_desc") || "Select the primary category of financial assistance or scheme purpose you require."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        9,
                        `${t("intake.q9_title")}. ${t("intake.q9_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 9
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 9 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(9)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 9
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Assistance / Business type"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ9Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 9:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q9Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <select
                  id="assistance-select"
                  value={formData.assistanceType}
                  onChange={(e) => {
                    const matched = ASSISTANCE_TYPES.find((a) => a.id === e.target.value);
                    setFormData({
                      ...formData,
                      assistanceType: e.target.value,
                      projectCost: matched ? matched.defaultCost : formData.projectCost,
                    });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none cursor-pointer ${
                    isQ9Missed && !formData.assistanceType
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                  }`}
                >
                  <option value="">-- Select Purpose of Assistance / Loan --</option>
                  {ASSISTANCE_TYPES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>

                {formData.assistanceType === "OTHER" && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-black text-slate-700">
                      {t("intake.otherAssistLabel") || "Please specify the assistance requirement:"} *
                    </label>
                    <input
                      id="assistance-other-input"
                      type="text"
                      value={formData.assistanceTypeOther}
                      onChange={(e) => setFormData({ ...formData, assistanceTypeOther: e.target.value })}
                      placeholder={t("intake.otherAssistPlaceholder") || "e.g. Mobile repair and accessories center"}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 focus:outline-none ${
                        hasAttemptedSubmit && !formData.assistanceTypeOther?.trim()
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                      }`}
                    />
                  </div>
                )}

                {/* DYNAMIC SUB-QUESTION: IF BUSINESS / ENTERPRISE LOAN SELECTED */}
                {formData.assistanceType === "BUSINESS" && (
                  <div className="bg-blue-50/70 border-2 border-blue-200 rounded-xl p-4 sm:p-5 space-y-3 animate-fadeIn">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-blue-700" />
                      <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                        {t("intake.subBusinessTitle") || "↳ Specify Type of Business / Enterprise"} *
                      </span>
                    </div>
                    <p className="text-xs text-blue-800">
                      {t("intake.subBusinessDesc") || "Select your trade activity to match sector-specific concessional guidelines."}
                    </p>

                    <select
                      id="business-type-select"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none cursor-pointer ${
                        hasAttemptedSubmit && !formData.businessType
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-blue-300 focus:ring-2 focus:ring-[#002147]"
                      }`}
                    >
                      <option value="">-- Select Commercial Business Sector --</option>
                      {BUSINESS_TYPES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label}
                        </option>
                      ))}
                    </select>

                    {formData.businessType === "OTHER" && (
                      <div className="space-y-1.5 pt-1 animate-fadeIn">
                        <label className="text-xs font-black text-slate-700">
                          {t("intake.otherBizLabel") || "Please specify your business activity:"} *
                        </label>
                        <input
                          id="business-other-input"
                          type="text"
                          value={formData.businessTypeOther}
                          onChange={(e) => setFormData({ ...formData, businessTypeOther: e.target.value })}
                          placeholder={t("intake.otherBizPlaceholder") || "e.g. Organic spices packaging unit"}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 focus:outline-none ${
                            hasAttemptedSubmit && !formData.businessTypeOther?.trim()
                              ? "border-red-500 ring-2 ring-red-200"
                              : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 10: EXISTING LOAN & SUB-QUESTIONS */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ10Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 10);
          const q10Errors = missedQuestions.filter((m) => m.qNum === 10);
          return (
            <div
              id="intake-q10"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ10Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ10Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    10
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q10_title") || "10. Do you already have any existing loan for this project?"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q10_desc") || "Disclose any prior or existing institutional credit availed for the current enterprise."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        10,
                        `${t("intake.q10_title")}. ${t("intake.q10_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 10
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 10 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(10)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 10
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Yes/No and Loan Amounts"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ10Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 10:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q10Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExistingLoan: false, existingLoanAmount: 0, outstandingAmount: 0 })}
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${!formData.hasExistingLoan
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                  >
                    <span>✓ {t("intake.noLoan") || "No, this is a fresh loan application"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExistingLoan: true, existingLoanAmount: formData.existingLoanAmount || 50000, outstandingAmount: formData.outstandingAmount || 20000 })}
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${formData.hasExistingLoan
                        ? "border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-500"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                  >
                    <span>{t("intake.yesLoan") || "Yes, I have an existing loan"}</span>
                  </button>
                </div>

                {/* DYNAMIC SUB-QUESTIONS: EXISTING LOAN & OUTSTANDING AMOUNTS */}
                {formData.hasExistingLoan && (
                  <div className="bg-amber-50/70 border-2 border-amber-200 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-800">
                        {t("intake.existingAmountLabel") || "Original Sanctioned Loan Amount (₹)"} *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-slate-500 font-bold text-sm">₹</span>
                        <input
                          id="existing-loan-amount-input"
                          type="number"
                          min={0}
                          value={formData.existingLoanAmount || ""}
                          onChange={(e) => setFormData({ ...formData, existingLoanAmount: parseFloat(e.target.value) || 0 })}
                          placeholder={t("intake.existingAmountPlaceholder") || "e.g. 50000"}
                          className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-mono font-bold text-slate-900 bg-white focus:outline-none ${
                            hasAttemptedSubmit && (!formData.existingLoanAmount || formData.existingLoanAmount <= 0)
                              ? "border-red-500 ring-2 ring-red-200"
                              : "border-amber-300 focus:ring-2 focus:ring-amber-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-800">
                        {t("intake.outstandingAmountLabel") || "Current Outstanding / Balance Amount (₹)"} *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-slate-500 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={formData.outstandingAmount || ""}
                          onChange={(e) => setFormData({ ...formData, outstandingAmount: parseFloat(e.target.value) || 0 })}
                          placeholder={t("intake.outstandingAmountPlaceholder") || "e.g. 20000"}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-amber-300 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 11: PROJECT ESTIMATED COST */}
        {/* ------------------------------------------------------------- */}
        {(() => {
          const isQ11Missed = hasAttemptedSubmit && missedQuestions.some((m) => m.qNum === 11);
          const q11Errors = missedQuestions.filter((m) => m.qNum === 11);
          return (
            <div
              id="intake-q11"
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm transition-all space-y-4 ${
                isQ11Missed
                  ? "border-2 border-red-500 ring-2 ring-red-200 bg-red-50/15"
                  : "border-slate-200 hover:border-[#002147]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm ${
                    isQ11Missed
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-blue-50 text-[#002147] border-blue-200"
                  }`}>
                    11
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#002147]">
                      {t("intake.q11_title") || "11. Project Estimated Cost (₹)"} *
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("intake.q11_desc") || "Enter the total capital cost required. NSFDC finances up to 90% - 95% with 5% - 10% beneficiary margin."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakQuestion(
                        11,
                        `${t("intake.q11_title")}. ${t("intake.q11_desc")}`
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all ${activeSpeakingQ === 11
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                    title="Listen to question"
                  >
                    {activeSpeakingQ === 11 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleListen(11)}
                    className={`p-2.5 rounded-xl border transition-all ${activeListeningQ === 11
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-gov-saffron/20 hover:bg-gov-saffron text-slate-950 border-gov-saffron/40"
                      }`}
                    title="Speak Project Cost"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isQ11Missed && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 text-xs font-bold space-y-1 animate-shake">
                  <div className="flex items-center space-x-1.5 font-black text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Incomplete Question 11:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {q11Errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold text-base">₹</span>
                  <input
                    id="project-cost-input"
                    type="number"
                    min={10000}
                    max={5000000}
                    step={10000}
                    value={formData.projectCost || ""}
                    onChange={(e) => setFormData({ ...formData, projectCost: parseFloat(e.target.value) || 0 })}
                    placeholder={t("intake.costPlaceholder") || "e.g. 140000"}
                    className={`w-full pl-9 pr-4 py-3 rounded-xl border text-base sm:text-xl font-black font-mono text-[#002147] focus:outline-none ${
                      isQ11Missed
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-slate-300 focus:ring-2 focus:ring-[#002147]"
                    }`}
                  />
                </div>

                {/* Quick Cost Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold">{t("intake.costQuick") || "Quick Select:"}</span>
                  {[100000, 140000, 500000, 1500000, 3000000, 5000000].map((cost) => (
                    <button
                      key={cost}
                      type="button"
                      onClick={() => setFormData({ ...formData, projectCost: cost })}
                      className={`px-3 py-1 rounded-lg border font-mono font-bold transition-colors cursor-pointer ${formData.projectCost === cost
                          ? "bg-[#002147] text-white border-[#002147]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      ₹ {(cost / 100000).toFixed(cost < 100000 ? 2 : 1)} Lakhs
                    </button>
                  ))}
                </div>

                {/* Live Financial Breakdown Preview Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500">
                      {t("intake.govtSharePreview") || "Estimated Government Loan (90-95%):"}
                    </span>
                    <span className="text-lg font-black text-emerald-800 font-mono block">
                      ₹ {estimatedGovtLoan.toLocaleString("en-IN")} ({govtSharePct}%)
                    </span>
                    <p className="text-[11px] text-slate-500">Disbursed directly via SCA / PSB Bank Channel.</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500">
                      {t("intake.marginPreview") || "Estimated Beneficiary Margin (5-10%):"}
                    </span>
                    <span className="text-lg font-black text-slate-800 font-mono block">
                      ₹ {estimatedMargin.toLocaleString("en-IN")} ({100 - govtSharePct}%)
                    </span>
                    <p className="text-[11px] text-slate-500">Self contribution / State subsidy margin money.</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUBMIT VALIDATION ALERT CONTAINER (Directly Around Submit Button) */}
      {/* ------------------------------------------------------------- */}
      {hasAttemptedSubmit && missedQuestions.length > 0 && (
        <div
          id="submit-validation-alert"
          className="bg-red-50 border-3 border-red-600 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 animate-shake"
        >
          <div className="flex items-start justify-between gap-3 border-b-2 border-red-200 pb-3.5">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base sm:text-xl font-black text-red-950">
                  Submission Blocked: Missing Required Questions!
                </h4>
                <p className="text-xs sm:text-sm text-red-800 font-medium">
                  You missed <strong>{missedQuestions.length} required question(s)</strong>. Please complete the highlighted questions with red borders before proceeding to Step 2.
                </p>
              </div>
            </div>
            <span className="bg-red-600 text-white px-3.5 py-1 rounded-full text-xs font-black shrink-0 animate-pulse shadow-sm">
              {missedQuestions.length} Incomplete
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-red-950 uppercase tracking-wider block">
              Click any question below to jump directly to it:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {missedQuestions.map((err, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-red-300 hover:border-red-600 rounded-xl p-3 flex items-center justify-between gap-3 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {err.qNum}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">{err.title}</div>
                      <div className="text-[11px] text-red-700 truncate">{err.message}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToQuestion(err.cardId, err.fieldId)}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-black px-3.5 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer shadow-sm"
                  >
                    Fix Q{err.qNum} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      <div className={`bg-white p-6 rounded-3xl border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        hasAttemptedSubmit && missedQuestions.length > 0
          ? "border-2 border-red-400 bg-red-50/20"
          : "border-slate-200"
      }`}>
        <button
          type="button"
          onClick={() => setIsFormalAppOpen(true)}
          className="w-full sm:w-auto px-6 py-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#002147]" />
          <span>{t("intake.viewFormalApp") || "📄 View Formal Government Application Form"}</span>
        </button>

        {/* SUBMIT BUTTON WITH DYNAMIC RED WARNING MARKING AROUND IT ON VALIDATION FAILURE */}
        <div className={`relative p-1 rounded-2xl transition-all w-full sm:w-auto ${
          hasAttemptedSubmit && missedQuestions.length > 0
            ? "border-4 border-red-500 ring-4 ring-red-200 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse"
            : ""
        }`}>
          {hasAttemptedSubmit && missedQuestions.length > 0 && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md whitespace-nowrap z-10 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>⛔ {missedQuestions.length} Questions Missed</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleProceed}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
              hasAttemptedSubmit && missedQuestions.length > 0
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gov-saffron hover:bg-amber-400 text-slate-950"
            }`}
          >
            <span>
              {hasAttemptedSubmit && missedQuestions.length > 0
                ? `Submission Blocked: Answer ${missedQuestions.length} Missed Question(s) →`
                : (t("intake.proceedStep2") || "Proceed to Step 2: Community Certificate OCR Verification (All Castes) →")}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formal Application Form Modal */}
      <FormalApplicationModal
        isOpen={isFormalAppOpen}
        onClose={() => setIsFormalAppOpen(false)}
        data={formalAppData}
      />
    </div>
  );
};
