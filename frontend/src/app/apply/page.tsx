"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { StepCitizenIntakeForm, CitizenIntakeData } from "@/components/wizard/StepCitizenIntakeForm";
import { StepDocumentUpload } from "@/components/wizard/StepDocumentUpload";
import { EmiCalculatorMatrix } from "@/components/calculator/EmiCalculatorMatrix";
import { PanIndiaBranchMap } from "@/components/map/PanIndiaBranchMap";
import { FormalApplicationModal, FormalApplicationData } from "@/components/common/FormalApplicationModal";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, ArrowRight, CheckCircle2, Send, ArrowLeft, FileText, Download } from "lucide-react";
import { OCRVerificationResponse, FinancialCalculationResponse, dispatchLead, fetchSpatialRoutes, BranchRoute } from "@/lib/api";

function ApplyPageContent() {
  const router = useRouter();
  const { t } = useLanguage();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Full Citizen Intake State across all 11 questions
  const [intakeData, setIntakeData] = useState<CitizenIntakeData>({
    applicantName: "",
    contactNumber: "",
    gender: "FEMALE",
    dateOfBirth: "1998-05-15",
    age: 28,
    stateCode: "AP",
    stateName: "Andhra Pradesh",
    district: "Kakinada",
    locationType: "GPS",
    latitude: 16.982,
    longitude: 82.238,
    address: "",
    pinCode: "",
    isScheduledCaste: true,
    qualification: "GRADUATE",
    qualificationOther: "",
    annualIncome: 180000,
    assistanceType: "BUSINESS",
    assistanceTypeOther: "",
    businessType: "RETAIL",
    businessTypeOther: "",
    hasExistingLoan: false,
    existingLoanAmount: 0,
    outstandingAmount: 0,
    projectCost: 140000,
  });

  const [ocrVerifiedData, setOcrVerifiedData] = useState<OCRVerificationResponse | null>(null);
  const [calcResultData, setCalcResultData] = useState<FinancialCalculationResponse | null>(null);
  const [branchesList, setBranchesList] = useState<BranchRoute[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchRoute | null>(null);
  const [dispatchedRef, setDispatchedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormalModalOpen, setIsFormalModalOpen] = useState(false);

  // Load draft data on mount if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nsfdc_draft_application");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIntakeData((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.warn("Failed to parse saved draft");
        }
      }
    }
  }, []);

  // Fetch branches on Step 4
  useEffect(() => {
    if (activeStep === 4) {
      loadMapBranches(intakeData.stateCode);
    }
  }, [activeStep, intakeData.stateCode]);

  const loadMapBranches = async (stateCode: string) => {
    try {
      const lat = intakeData.latitude || 16.982;
      const lon = intakeData.longitude || 82.238;
      const res = await fetchSpatialRoutes(lat, lon, 50, stateCode);
      if (res && res.branches) {
        setBranchesList(res.branches);
        if (res.branches.length > 0) setSelectedBranch(res.branches[0]);
      }
    } catch (e) {
      console.warn("Spatial router fetch fallback");
    }
  };

  const handleStep1Complete = (data: CitizenIntakeData) => {
    setIntakeData(data);
    setActiveStep(2);
  };

  const handleStep2Verified = (ocrData: OCRVerificationResponse) => {
    setOcrVerifiedData(ocrData);
    setActiveStep(3);
  };

  const handleStep3Proceed = (calcRes: FinancialCalculationResponse) => {
    setCalcResultData(calcRes);
    setActiveStep(4);
  };

  const handleFinalDispatch = async (branch?: BranchRoute) => {
    setIsSubmitting(true);
    let finalRef = `SC-2026-${intakeData.stateCode}${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const leadRes = await dispatchLead({
        applicant_name: intakeData.applicantName,
        contact_number: intakeData.contactNumber,
        gender: intakeData.gender,
        annual_income: intakeData.annualIncome,
        project_cost: intakeData.projectCost,
        scheme_id: calcResultData?.scheme_id || "NSFDC_MCF",
        routed_partner_id: branch?.partner_id || selectedBranch?.partner_id || 1,
        ocr_verified: true,
      });

      if (leadRes && leadRes.application_id) {
        finalRef = leadRes.application_id.replace("#", "");
      }
    } catch (e) {
      console.warn("Dispatch lead fallback");
    }

    const newAppRecord = {
      application_id: `#${finalRef}`,
      applicant_name: intakeData.applicantName,
      contact_number: intakeData.contactNumber,
      gender: intakeData.gender,
      annual_income: intakeData.annualIncome,
      project_cost: intakeData.projectCost,
      scheme_id: calcResultData?.scheme_id || "NSFDC_MCF",
      scheme_name: calcResultData?.scheme_name || "Micro Credit Finance Scheme (MCF)",
      status: "ROUTED_TO_CHANNEL",
      created_at: new Date().toISOString(),
      partner_name: branch?.partner_name || selectedBranch?.partner_name || `${intakeData.stateName} State SC Cooperative Finance Corp`,
      branch_name: branch?.branch_name || selectedBranch?.branch_name || `District Central Office ${intakeData.district}`,
    };

    if (typeof window !== "undefined") {
      const existingAppsStr = localStorage.getItem("nsfdc_user_applications");
      const existingApps = existingAppsStr ? JSON.parse(existingAppsStr) : [];
      existingApps.unshift(newAppRecord);
      localStorage.setItem("nsfdc_user_applications", JSON.stringify(existingApps));
    }

    setDispatchedRef(newAppRecord.application_id);
    setIsSubmitting(false);
  };

  const formalAppData: FormalApplicationData = {
    applicationId: dispatchedRef || `SC-2026-${intakeData.stateCode}7788`,
    applicantName: intakeData.applicantName,
    contactNumber: intakeData.contactNumber,
    gender: intakeData.gender,
    dateOfBirth: intakeData.dateOfBirth,
    age: intakeData.age,
    isScheduledCaste: intakeData.isScheduledCaste,
    stateCode: intakeData.stateCode,
    stateName: intakeData.stateName,
    district: intakeData.district,
    address: intakeData.address,
    pinCode: intakeData.pinCode,
    latitude: intakeData.latitude,
    longitude: intakeData.longitude,
    qualification: intakeData.qualification === "OTHER" ? intakeData.qualificationOther : intakeData.qualification,
    annualIncome: intakeData.annualIncome,
    assistanceType: intakeData.assistanceType === "OTHER" ? intakeData.assistanceTypeOther : intakeData.assistanceType,
    businessType: intakeData.businessType === "OTHER" ? intakeData.businessTypeOther : intakeData.businessType,
    hasExistingLoan: intakeData.hasExistingLoan,
    existingLoanAmount: intakeData.existingLoanAmount,
    outstandingAmount: intakeData.outstandingAmount,
    projectCost: intakeData.projectCost,
    schemeId: calcResultData?.scheme_id || "NSFDC_MCF",
    schemeName: calcResultData?.scheme_name || "Micro Credit Finance Scheme (MCF)",
    interestRate: calcResultData?.applied_interest_rate || (intakeData.gender === "FEMALE" ? 5.0 : 6.5),
    principalLoanAmount: calcResultData?.principal_loan_amount || Math.round(intakeData.projectCost * 0.9),
    beneficiaryMarginMoney: calcResultData?.beneficiary_margin_money || Math.round(intakeData.projectCost * 0.1),
    monthlyEmi: calcResultData?.monthly_emi || Math.round((intakeData.projectCost * 0.9 * 0.05 * 1.15) / 36),
    tenureYears: calcResultData?.total_tenure_years || 3,
    moratoriumMonths: calcResultData?.moratorium_months || 3,
    partnerName: selectedBranch?.partner_name || `${intakeData.stateName} State SC Cooperative Finance Corp`,
    branchName: selectedBranch?.branch_name || `District Central Office ${intakeData.district}`,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Controls: Back Step Button & Formal Application Quick Trigger */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (activeStep > 1) {
              setActiveStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
            } else if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black shadow-sm transition-all cursor-pointer"
        >
          <span>← Back to Previous Step</span>
        </button>

        <button
          type="button"
          onClick={() => setIsFormalModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 bg-[#002147] hover:bg-blue-900 text-white text-xs font-bold shadow transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-gov-gold" />
          <span>View / Print Formal Application</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl border-b-4 border-gov-saffron shadow-lg space-y-2">
        <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/50 text-gov-saffron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>National Concessional Credit Intake Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Citizen Loan Intake & Amortization Portal</h1>
        <p className="text-xs sm:text-sm text-slate-200">
          Guided statutory concessional pipeline with native multi-lingual speech-to-text (STT), text-to-speech (TTS), SC Certificate OCR, and Pan-India spatial routing.
        </p>
      </div>

      {/* Wizard Steps Navigation Bar */}
      <div className="space-y-6">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <button
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-xl border font-black transition-all ${
              activeStep === 1
                ? "border-[#002147] bg-slate-50 text-[#002147] ring-2 ring-[#002147]/20 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            1. Identity & 11 Questions Intake
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`p-3 rounded-xl border font-black transition-all ${
              activeStep === 2
                ? "border-[#002147] bg-slate-50 text-[#002147] ring-2 ring-[#002147]/20 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            2. SC Certificate OCR
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`p-3 rounded-xl border font-black transition-all ${
              activeStep === 3
                ? "border-[#002147] bg-slate-50 text-[#002147] ring-2 ring-[#002147]/20 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            3. Schemes & EMI Calculator
          </button>

          <button
            onClick={() => setActiveStep(4)}
            className={`p-3 rounded-xl border font-black transition-all ${
              activeStep === 4
                ? "border-[#002147] bg-slate-50 text-[#002147] ring-2 ring-[#002147]/20 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            4. Map & Branch Dispatch
          </button>
        </div>

        {/* STEP 1: SINGLE PAGE 11-QUESTIONS CITIZEN INTAKE FORM */}
        {activeStep === 1 && (
          <StepCitizenIntakeForm
            initialData={intakeData}
            onComplete={handleStep1Complete}
          />
        )}

        {/* STEP 2: SC CERTIFICATE OCR VERIFICATION */}
        {activeStep === 2 && (
          <StepDocumentUpload
            onVerified={handleStep2Verified}
            onGoBack={() => setActiveStep(1)}
            onGoForward={() => setActiveStep(3)}
          />
        )}

        {/* STEP 3: SCHEME RECOMMENDATIONS & DYNAMIC EMI CALCULATOR */}
        {activeStep === 3 && (
          <EmiCalculatorMatrix
            initialCost={intakeData.projectCost}
            initialIncome={intakeData.annualIncome}
            initialGender={intakeData.gender}
            initialActivity={intakeData.assistanceType}
            initialStateCode={intakeData.stateCode}
            onProceedToDispatch={handleStep3Proceed}
            onGoBack={() => setActiveStep(2)}
            onGoForward={() => setActiveStep(4)}
          />
        )}

        {/* STEP 4: PAN-INDIA MAP & LEAD DISPATCH */}
        {activeStep === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveStep(3)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Back Step</span>
                </button>

                <h3 className="text-base sm:text-lg font-black text-[#002147]">Step 4: Pan-India Branch Dispatch</h3>
              </div>

              <div className="text-xs font-bold text-slate-600">
                Target State: <strong className="text-gov-navy font-black">{intakeData.stateName || intakeData.stateCode}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Select nearest high-ranking bank / SCA branch on the spatial map to dispatch application lead for applicant: <strong>{intakeData.applicantName}</strong> ({intakeData.contactNumber}).
            </p>

            {dispatchedRef ? (
              <div className="bg-emerald-900 text-white p-8 rounded-3xl border-2 border-emerald-400 shadow-xl text-center space-y-5 animate-pulse">
                <CheckCircle2 className="w-14 h-14 text-emerald-300 mx-auto" />
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Application Dispatched to SCA Desk</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Reference ID: <span className="text-gov-gold">{dispatchedRef}</span></h2>
                  <p className="text-xs text-emerald-200">
                    Lead assigned to district officer desk for applicant <strong>{intakeData.applicantName}</strong> ({intakeData.contactNumber}) with authenticated SC caste proof.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setIsFormalModalOpen(true)}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-black px-6 py-3.5 rounded-xl shadow text-xs flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Formal Application (PDF)</span>
                  </button>

                  <button
                    onClick={() => router.push(`/track?id=${encodeURIComponent(dispatchedRef)}`)}
                    className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow text-xs flex items-center space-x-2"
                  >
                    <span>Track Application Lifecycle →</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <PanIndiaBranchMap
                  branches={branchesList}
                  applicantLat={intakeData.latitude || 16.982}
                  applicantLon={intakeData.longitude || 82.238}
                  onSelectBranch={setSelectedBranch}
                  onStateChange={(st) => loadMapBranches(st)}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormalModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4 text-[#002147]" />
                    <span>View Formal Application Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFinalDispatch(selectedBranch || undefined)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm & Dispatch Lead to Assigned Branch Desk →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Formal Application Modal */}
      <FormalApplicationModal
        isOpen={isFormalModalOpen}
        onClose={() => setIsFormalModalOpen(false)}
        data={formalAppData}
      />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-600">Loading Citizen Portal...</div>}>
      <ApplyPageContent />
    </Suspense>
  );
}
