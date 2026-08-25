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
    isScheduledCaste: initialData?.isScheduledCaste !== undefined ? initialData.isScheduledCaste : true,
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

  const activeCancelSpeechRef = useRef<(() => void) | null>(null);
  const activeRecognizerRef = useRef<any>(null);

  // Sync state & districts dynamically
  const currentStateObj = PAN_INDIA_STATES.find((s) => s.code === formData.stateCode) || PAN_INDIA_STATES[0];
  const availableDistricts = currentStateObj.districts;

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

  // Real-time GPS Location Detection
  const handleDetectGps = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("GPS Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const { state, district } = findNearestStateAndDistrict(lat, lon);

        setFormData((prev) => ({
          ...prev,
          locationType: "GPS",
          latitude: lat,
          longitude: lon,
          stateCode: state.code,
          stateName: state.name,
          district: district,
        }));
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        // Fallback default coordinates
        setFormData((prev) => ({
          ...prev,
          locationType: "GPS",
          latitude: 16.982,
          longitude: 82.238,
        }));
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
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

      case 6: // SC Caste (Yes/No)
        if (
          lower.includes("yes") ||
          lower.includes("हाँ") ||
          lower.includes("अవును") ||
          lower.includes("ஆம்") ||
          lower.includes("ಹೌದು") ||
          lower.includes("होय") ||
          lower.includes("हो") ||
          lower.includes("হ্যাঁ") ||
          lower.includes("হ্যা") ||
          lower.includes("હા")
        ) {
          setFormData((prev) => ({ ...prev, isScheduledCaste: true }));
        } else if (
          lower.includes("no") ||
          lower.includes("नहीं") ||
          lower.includes("కాదు") ||
          lower.includes("இல்லை") ||
          lower.includes("ಇಲ್ಲ") ||
          lower.includes("नाही") ||
          lower.includes("না") ||
          lower.includes("ના") ||
          lower.includes("નથી")
        ) {
          setFormData((prev) => ({ ...prev, isScheduledCaste: false }));
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

  // Validation and Step 2 Submission
  const handleProceed = () => {
    if (!formData.applicantName.trim()) {
      setValidationError("Please enter applicant full name.");
      return;
    }
    if (!formData.contactNumber.trim()) {
      setValidationError("Please enter contact mobile number.");
      return;
    }
    if (!formData.stateCode || !formData.district) {
      setValidationError("Please select your State and District.");
      return;
    }
    if (formData.annualIncome > 500000) {
      setValidationError("Annual family income exceeds the ₹ 5,00,000 statutory limit for NSFDC schemes.");
      return;
    }
    if (formData.projectCost <= 0) {
      setValidationError("Please enter valid project estimated cost.");
      return;
    }

    setValidationError(null);

    // Save draft in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("nsfdc_draft_application", JSON.stringify(formData));
    }

    onComplete(formData);
  };

  // Estimated Government Share and Beneficiary Margin
  const govtSharePct = formData.gender === "FEMALE" && formData.projectCost <= 140000 ? 95 : 90;
  const estimatedGovtLoan = Math.round((formData.projectCost * govtSharePct) / 100);
  const estimatedMargin = formData.projectCost - estimatedGovtLoan;

  // Formal application data object for preview
  const formalAppData: FormalApplicationData = {
    applicationId: `SC-2026-${formData.stateCode}${Math.floor(1000 + Math.random() * 9000)}`,
    applicantName: formData.applicantName,
    contactNumber: formData.contactNumber,
    gender: formData.gender,
    dateOfBirth: formData.dateOfBirth,
    age: formData.age,
    isScheduledCaste: formData.isScheduledCaste,
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

      {/* Validation Alert */}
      {validationError && (
        <div className="bg-red-50 border-2 border-red-400 text-red-900 p-4 rounded-2xl flex items-center space-x-3 shadow-md animate-shake">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{validationError}</span>
        </div>
      )}

      {/* 11 QUESTIONS CONTAINER */}
      <div className="space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 1: FULL NAME & PHONE NUMBER & GENDER */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("intake.nameLabel") || "Full Legal Name"} *</span>
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder={t("intake.namePlaceholder") || "e.g. Rajesh Kumar SC"}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("intake.phoneLabel") || "Mobile / Contact Number"} *</span>
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder={t("intake.phonePlaceholder") || "e.g. +91 98480 12345"}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5 pt-2">
              <label className="text-xs font-black text-slate-700">
                {t("intake.genderLabel") || "Applicant Gender (Determines Special Women Concessional 5% Interest Rate)"} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 2: AGE & DATE OF BIRTH CALENDAR */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("intake.dobLabel") || "Date of Birth (Calendar Selection)"} *</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleDobChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
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

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 3: STATE */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                3
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q3_title") || "3. State / Union Territory"}
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

          <div>
            <select
              value={formData.stateCode}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
            >
              {PAN_INDIA_STATES.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 4: DISTRICT */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                4
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q4_title") || "4. District"}
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

          <div>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
            >
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 5: LOCATION & PIN CODE */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                5
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q5_title") || "5. Location & Postal PIN Code"}
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

          <div className="space-y-4">
            {/* Real GPS Geolocation Trigger */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002147] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {t("intake.gpsSuccess") || "GPS Satellite Coordinates:"}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    {formData.latitude ? `${formData.latitude.toFixed(4)}° N, ${formData.longitude?.toFixed(4)}° E` : "16.9820° N, 82.2380° E"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow cursor-pointer transition-all shrink-0"
              >
                <LocateFixed className={`w-4 h-4 ${isDetectingGps ? "animate-spin" : ""}`} />
                <span>{isDetectingGps ? t("intake.detectingGps") || "Detecting GPS..." : t("intake.detectGps") || "📍 Detect My Current GPS Location"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-black text-slate-700">
                  {t("intake.manualAddress") || "Village / Town / Street Address"} *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t("intake.addressPlaceholder") || "Enter local street, village or town address"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700">
                  {t("intake.pincodeLabel") || "Postal PIN Code (6-digits)"} *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, "") })}
                  placeholder={t("intake.pincodePlaceholder") || "e.g. 533001"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 6: SC CASTE STATUS (YES / NO) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                6
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q6_title") || "6. Do you belong to Scheduled Caste (SC) Community?"}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("intake.q6_desc") || "NSFDC schemes are statutory concessional loan programs reserved exclusively for Scheduled Caste beneficiaries."}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleSpeakQuestion(
                    6,
                    `${t("intake.q6_title")}. ${t("intake.q6_desc")}`
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
                title="Speak Yes/No"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isScheduledCaste: true })}
                className={`p-4 rounded-xl border text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${formData.isScheduledCaste
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t("intake.yesSc") || "✓ Yes, I belong to Scheduled Caste (SC)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isScheduledCaste: false })}
                className={`p-4 rounded-xl border text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${!formData.isScheduledCaste
                    ? "border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-500"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
              >
                <span>✗ {t("intake.noSc") || "No, Other Community"}</span>
              </button>
            </div>

            {!formData.isScheduledCaste && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs space-y-1 animate-fadeIn">
                <div className="font-black flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Statutory Eligibility Alert</span>
                </div>
                <p>
                  {t("intake.scWarning") ||
                    "NSFDC concessional credit schemes are statutory welfare programs specifically chartered for Scheduled Caste (SC) citizens under the Ministry of Social Justice & Empowerment. A valid SC Community Certificate will be required and verified via PyTesseract OCR in Step 2."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 7: EDUCATIONAL QUALIFICATIONS */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                7
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q7_title") || "7. Educational Qualifications"}
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

          <div className="space-y-3">
            <select
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
            >
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
                  type="text"
                  value={formData.qualificationOther}
                  onChange={(e) => setFormData({ ...formData, qualificationOther: e.target.value })}
                  placeholder={t("intake.otherQualPlaceholder") || "e.g. Diploma in Mechanical Engineering, B.Com"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 8: ANNUAL FAMILY INCOME */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                8
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q8_title") || "8. Annual Family Income (₹)"}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("intake.q8_desc") || "Enter total annual family income from all sources. Statutory ceiling is ₹ 5,00,000 / year."}
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

          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 font-bold text-base">₹</span>
              <input
                type="number"
                min={0}
                max={2000000}
                step={10000}
                value={formData.annualIncome || ""}
                onChange={(e) => setFormData({ ...formData, annualIncome: parseFloat(e.target.value) || 0 })}
                placeholder={t("intake.incomePlaceholder") || "e.g. 180000"}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 text-base sm:text-lg font-black font-mono text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
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
                  className={`px-3 py-1 rounded-lg border font-mono font-bold transition-colors ${formData.annualIncome === amt
                      ? "bg-[#002147] text-white border-[#002147]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  ₹ {(amt / 100000).toFixed(2)} Lakhs
                </button>
              ))}
            </div>

            {/* Statutory Income Check Feedback */}
            {formData.annualIncome > 500000 ? (
              <div className="bg-red-50 border border-red-300 text-red-900 p-3 rounded-xl text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  {t("intake.incomeWarning") ||
                    "⚠️ Alert: Annual income exceeds ₹ 5,00,000 statutory limit. Beneficiary will not be eligible under NSFDC rules."}
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                <span>✓ Statutory Income Check Passed (≤ ₹ 5,00,000 / year)</span>
                <span className="font-mono bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px]">ELIGIBLE</span>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 9: TYPE OF ASSISTANCE & SUB-QUESTION (BUSINESS TYPE) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                9
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q9_title") || "9. What type of assistance are you looking for?"}
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

          <div className="space-y-4">
            <select
              value={formData.assistanceType}
              onChange={(e) => {
                const matched = ASSISTANCE_TYPES.find((a) => a.id === e.target.value);
                setFormData({
                  ...formData,
                  assistanceType: e.target.value,
                  projectCost: matched ? matched.defaultCost : formData.projectCost,
                });
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
            >
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
                  type="text"
                  value={formData.assistanceTypeOther}
                  onChange={(e) => setFormData({ ...formData, assistanceTypeOther: e.target.value })}
                  placeholder={t("intake.otherAssistPlaceholder") || "e.g. Mobile repair and accessories center"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                />
              </div>
            )}

            {/* DYNAMIC SUB-QUESTION: IF BUSINESS / ENTERPRISE LOAN SELECTED */}
            {formData.assistanceType === "BUSINESS" && (
              <div className="bg-blue-50/70 border-2 border-blue-200 rounded-xl p-4 sm:p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                    {t("intake.subBusinessTitle") || "↳ Specify Type of Business / Enterprise"}
                  </span>
                </div>
                <p className="text-xs text-blue-800">
                  {t("intake.subBusinessDesc") || "Select your trade activity to match sector-specific concessional guidelines."}
                </p>

                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
                >
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
                      type="text"
                      value={formData.businessTypeOther}
                      onChange={(e) => setFormData({ ...formData, businessTypeOther: e.target.value })}
                      placeholder={t("intake.otherBizPlaceholder") || "e.g. Organic spices packaging unit"}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 10: EXISTING LOAN & SUB-QUESTIONS */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                10
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q10_title") || "10. Do you already have any existing loan for this project?"}
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasExistingLoan: false, existingLoanAmount: 0, outstandingAmount: 0 })}
                className={`p-4 rounded-xl border text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${!formData.hasExistingLoan
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
              >
                <span>✓ {t("intake.noLoan") || "No, this is a fresh loan application"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasExistingLoan: true, existingLoanAmount: 50000, outstandingAmount: 20000 })}
                className={`p-4 rounded-xl border text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 ${formData.hasExistingLoan
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
                      type="number"
                      min={0}
                      value={formData.existingLoanAmount || ""}
                      onChange={(e) => setFormData({ ...formData, existingLoanAmount: parseFloat(e.target.value) || 0 })}
                      placeholder={t("intake.existingAmountPlaceholder") || "e.g. 50000"}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-amber-300 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
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

        {/* ------------------------------------------------------------- */}
        {/* QUESTION 11: PROJECT ESTIMATED COST */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#002147]/40 transition-all space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002147] border border-blue-200 flex items-center justify-center font-black text-sm">
                11
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#002147]">
                  {t("intake.q11_title") || "11. Project Estimated Cost (₹)"}
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

          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 font-bold text-base">₹</span>
              <input
                type="number"
                min={10000}
                max={5000000}
                step={10000}
                value={formData.projectCost || ""}
                onChange={(e) => setFormData({ ...formData, projectCost: parseFloat(e.target.value) || 0 })}
                placeholder={t("intake.costPlaceholder") || "e.g. 140000"}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 text-base sm:text-xl font-black font-mono text-[#002147] focus:ring-2 focus:ring-[#002147] focus:outline-none"
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
                  className={`px-3 py-1 rounded-lg border font-mono font-bold transition-colors ${formData.projectCost === cost
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

      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsFormalAppOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#002147]" />
          <span>{t("intake.viewFormalApp") || "📄 View Formal Government Application Form"}</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gov-saffron hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer transform active:scale-95"
        >
          <span>{t("intake.proceedStep2") || "Proceed to Step 2: SC Certificate OCR Verification →"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
